document.getElementById("startBFS").addEventListener("click", function () {
  const fileInput = document.getElementById("fileInput");
  const startNodeInput = document.getElementById("startNode");
  const file = fileInput.files[0];
  const startNode = parseInt(startNodeInput.value, 10);

  if (!file) {
    alert("Please upload a file.");
    return;
  }
  if (isNaN(startNode) || startNode < 1) {
    alert("Please enter a valid start node (integer > 0).");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    const graph = parseGraph(e.target.result);
    if (!graph[startNode]) {
      alert("Start node not found in graph. Please enter a valid start node.");
      return;
    }
    const bfsResult = bfs(graph, startNode.toString()); 
    displayBfsResult(bfsResult);
  };
  reader.readAsText(file);
});

function parseGraph(text) {
  const edges = text.trim().split("\n");
  const graph = {};
  edges.forEach((edge) => {
    const [from, to] = edge.split("\t").map(Number);
    if (!graph[from]) graph[from] = [];
    graph[from].push(to);
    if (!graph[to]) graph[to] = []; // Ensure all nodes are in the graph, even if they have no outgoing edges
  });
  return graph;
}

function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  visited.add(start);
  while (queue.length > 0) {
    const vertex = queue.shift();
    result.push(vertex);
    const neighbors = graph[vertex];
    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    });
  }
  return result;
}

function displayBfsResult(bfsResult) {
  const container = document.getElementById("bfsTree");
  container.innerHTML = `<pre>${JSON.stringify(bfsResult, null, 2)}</pre>`;
}
