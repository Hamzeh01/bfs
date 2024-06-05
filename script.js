document
  .getElementById("fileInput")
  .addEventListener("change", handleFileUpload);
document
  .getElementById("startTraversal")
  .addEventListener("click", startTraversal);
document
  .getElementById("randomSelect")
  .addEventListener("click", randomSelectNodes);

let graph = {};
let nodes = [];

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
  // Sort adjacency lists in ascending order
  for (const node in graph) {
    graph[node].sort((a, b) => a - b);
  }
  return graph;
}

function printGraph(graph) {
  console.log("Sorted graph adjacency list:");
  for (const node in graph) {
    console.log(`${node}: ${graph[node].join(", ")}`);
  }
}

function startTraversal() {
  const startNode = parseInt(document.getElementById("startNode").value);
  const endNode = parseInt(document.getElementById("endNode").value) || null;
  const algorithm = document.getElementById("algorithmChoice").value;

  if (!startNode || !graph[startNode]) {
    console.log("Please enter a valid start node.");
    return;
  }

  let result;
  if (algorithm === "BFS") {
    result = bfs(graph, startNode, endNode);
  } else if (algorithm === "DFS") {
    result = dfs(graph, startNode, endNode);
  }

  displayResult(result);
}

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

      // Push neighbors in reverse order to visit the smallest neighbor first
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

function displayResult(result) {
  const resultContainer = document.getElementById("traversalResult");
  resultContainer.textContent = `Traversal result: ${result.join(" -> ")}`;
}

function randomSelectNodes() {
  const startNode = nodes[Math.floor(Math.random() * nodes.length)];
  const endNode = nodes[Math.floor(Math.random() * nodes.length)];
  document.getElementById("startNode").value = startNode;
  document.getElementById("endNode").value = endNode;
}
