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
    alert("Graph loaded successfully!");
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
  return graph;
}

function startTraversal() {
  const startNode = parseInt(document.getElementById("startNode").value);
  const endNode = parseInt(document.getElementById("endNode").value) || null;
  const algorithm = document.getElementById("algorithmChoice").value;

  if (!startNode || !graph[startNode]) {
    alert("Please enter a valid start node.");
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
  const visited = new Set();
  const queue = [[start]];
  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];
    if (!visited.has(node)) {
      if (node === end) {
        return path;
      }
      visited.add(node);
      for (const neighbor of graph[node]) {
        const newPath = [...path, neighbor];
        queue.push(newPath);
      }
    }
  }
  return Array.from(visited);
}

function dfs(graph, start, end = null) {
  const visited = new Set();
  const stack = [[start]];
  while (stack.length > 0) {
    const path = stack.pop();
    const node = path[path.length - 1];
    if (!visited.has(node)) {
      if (node === end) {
        return path;
      }
      visited.add(node);
      for (const neighbor of graph[node]) {
        const newPath = [...path, neighbor];
        stack.push(newPath);
      }
    }
  }
  return Array.from(visited);
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
