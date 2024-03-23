document.getElementById('startTraversal').addEventListener('click', function() {
  const fileInput = document.getElementById('fileInput');
  const startNodeInput = document.getElementById('startNode');
  const algorithmChoice = document.getElementById('algorithmChoice').value;
  const file = fileInput.files[0];
  const startNode = parseInt(startNodeInput.value, 10);
  
  if (!file) {
      alert('Please upload a file.');
      return;
  }
  if (isNaN(startNode) || startNode < 1) {
      alert('Please enter a valid start node (integer > 0).');
      return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
      const graph = parseGraph(e.target.result);
      if (!graph[startNode]) {
          alert('Start node not found in graph. Please enter a valid start node.');
          return;
      }
      let result;
      if (algorithmChoice === 'BFS') {
          result = bfs(graph, startNode.toString());
      } else if (algorithmChoice === 'DFS') {
          result = dfs(graph, startNode.toString());
      }
      displayResult(result);
  };
  reader.readAsText(file);
});

function parseGraph(text) {
  const edges = text.trim().split("\n");
  const graph = {};
  edges.forEach((edge) => {
    const [from, to] = edge.split("\t").map(Number);
    if (!graph[from]) graph[from] = [];
    if (!graph[to]) graph[to] = [];
    graph[from].push(to);
    graph[to].push(from); // Add the reverse direction for undirected graph
  });
  return graph;
}

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
    const neighbors = graph[vertex].slice().sort((a, b) => a - b); // Sort neighbors in increasing order
    neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    });
  }
  return result;
}

function dfs(graph, start) {
  const visited = new Set();
  const stack = [start];
  const result = [];
  while (stack.length > 0) {
    const vertex = stack.pop();
    if (!visited.has(vertex)) {
      visited.add(vertex);
      result.push(vertex);
      const neighbors = graph[vertex].slice().sort((a, b) => b - a); // Sort in decreasing order for stack
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      });
    }
  }
  return result;
}

function displayResult(result) {
  const container = document.getElementById('traversalResult');
  container.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
}
