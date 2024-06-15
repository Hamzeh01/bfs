/**
 * Toggles between light and dark mode.
 */
function toggleMode() {
  const body = document.body;
  const modeIcon = document.getElementById("modeIcon");
  const modeText = document.getElementById("modeSwitch");

  body.classList.toggle("light-mode");
  body.classList.toggle("dark-mode");

  if (body.classList.contains("light-mode")) {
    modeIcon.textContent = "🌞";
    modeText.innerHTML = '<span id="modeIcon">🌞</span> Light Mode';
  } else {
    modeIcon.textContent = "🌜";
    modeText.innerHTML = '<span id="modeIcon">🌜</span> Dark Mode';
  }
}

/**
 * Handles the file upload event, parses the file, and initializes the graph.
 * @param {Event} event - The file upload event.
 */
function handleFileUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const content = e.target.result;
    graph = parseAdjacencyList(content);
    nodes = Object.keys(graph).map(Number);
    printGraph(graph);
  };

  reader.readAsText(file);
}

/**
 * Parses the adjacency list from the given content.
 * @param {string} content - The content of the file.
 * @returns {Object} The parsed graph as an adjacency list.
 */
function parseAdjacencyList(content) {
  const lines = content.trim().split("\n");
  const graph = {};

  lines.forEach((line) => {
    const [node1, node2] = line.split("\t").map(Number);
    if (!graph[node1]) graph[node1] = [];
    if (!graph[node2]) graph[node2] = [];
    graph[node1].push(node2);
    graph[node2].push(node1);
  });

  for (const node in graph) {
    graph[node].sort((a, b) => a - b);
  }

  return graph;
}

/**
 * Prints the graph adjacency list to the console.
 * @param {Object} graph - The graph to be printed.
 */
function printGraph(graph) {
  console.log("Sorted graph adjacency list:");
  for (const node in graph) {
    console.log(`${node}: ${graph[node].join(", ")}`);
  }
}

/**
 * Starts the graph traversal based on user input.
 */
function startTraversal() {
  const startNode = parseInt(document.getElementById("startNode").value);
  const endNode = parseInt(document.getElementById("endNode").value) || null;
  const algorithm = document.getElementById("algorithmChoice").value;

  if (!startNode || !graph[startNode]) {
    console.log("Please enter a valid start node.");
    return;
  }

  const startTime = performance.now();
  let result;
  let visitedCount = 0;

  if (algorithm === "BFS") {
    result = bfs(graph, startNode, endNode);
    visitedCount = result.length;
  } else if (algorithm === "DFS") {
    result = dfs(graph, startNode, endNode);
    visitedCount = result.length;
  }

  const endTime = performance.now();
  const executionTime = (endTime - startTime).toFixed(10);

  displayResult(result, executionTime, visitedCount);
}

/**
 * Performs Breadth-First Search (BFS) on the graph.
 * @param {Object} graph - The graph to be traversed.
 * @param {number} start - The starting node.
 * @param {number} [end=null] - The optional end node.
 * @returns {number[]} The list of visited nodes.
 */
function bfs(graph, start, end = null) {
  console.log(`Starting BFS from node ${start}`);
  const visited = [];
  const queue = [start];
  const parent = { [start]: null };

  while (queue.length > 0) {
    const node = queue.shift();
    console.log(`Dequeued node ${node}`);

    if (!visited.includes(node)) {
      visited.push(node);
      console.log(`Visited nodes: ${visited.join(", ")}`);
      if (node === end) {
        console.log(`Found end node ${end}`);
        return visited;
      }

      for (const neighbor of graph[node]) {
        if (!visited.includes(neighbor) && !queue.includes(neighbor)) {
          parent[neighbor] = node;
          queue.push(neighbor);
          console.log(`Enqueued node ${neighbor}`);
        }
      }
    }
  }

  return visited;
}

/**
 * Performs Depth-First Search (DFS) on the graph.
 * @param {Object} graph - The graph to be traversed.
 * @param {number} start - The starting node.
 * @param {number} [end=null] - The optional end node.
 * @returns {number[]} The list of visited nodes.
 */
function dfs(graph, start, end = null) {
  console.log(`Starting DFS from node ${start}`);
  const visited = [];
  const stack = [start];

  while (stack.length > 0) {
    const node = stack.pop();
    console.log(`Popped node ${node}`);

    if (!visited.includes(node)) {
      visited.push(node);
      console.log(`Visited nodes: ${visited.join(", ")}`);
      if (node === end) {
        console.log(`Found end node ${end}`);
        return visited;
      }

      const neighbors = graph[node].slice().reverse();
      for (const neighbor of neighbors) {
        if (!visited.includes(neighbor) && !stack.includes(neighbor)) {
          stack.push(neighbor);
          console.log(`Pushed node ${neighbor}`);
        }
      }
    }
  }

  return visited;
}

/**
 * Displays the result of the traversal.
 * @param {number[]} result - The list of visited nodes.
 * @param {string} executionTime - The execution time of the traversal.
 * @param {number} visitedCount - The number of visited nodes.
 */
function displayResult(result, executionTime, visitedCount) {
  const resultContainer = document.getElementById("traversalResult");
  resultContainer.innerHTML = `Traversal result: ${result.join(
    " -> "
  )}<br>Execution time: ${executionTime} ms<br>Visited nodes: ${visitedCount}`;
}

/**
 * Randomly selects start and end nodes for traversal.
 */
function randomSelectNodes() {
  const startNode = nodes[Math.floor(Math.random() * nodes.length)];
  const endNode = nodes[Math.floor(Math.random() * nodes.length)];
  document.getElementById("startNode").value = startNode;
  document.getElementById("endNode").value = endNode;
}

// Event listeners
document
  .getElementById("fileInput")
  .addEventListener("change", handleFileUpload);
document
  .getElementById("startTraversal")
  .addEventListener("click", startTraversal);
document
  .getElementById("randomSelect")
  .addEventListener("click", randomSelectNodes);
document.getElementById("modeSwitch").addEventListener("click", toggleMode);

// Global variables
let graph = {};
let nodes = [];
