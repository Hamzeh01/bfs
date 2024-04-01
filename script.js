document
  .getElementById("startTraversal")
  .addEventListener("click", function () {
    const fileInput = document.getElementById("fileInput");
    const startNodeInput = document.getElementById("startNode");
    const endNodeInput = document.getElementById("endNode");
    const algorithmChoice = document.getElementById("algorithmChoice").value;
    const file = fileInput.files[0];
    const startNode = parseInt(startNodeInput.value, 10);
    const endNode = endNodeInput.value
      ? parseInt(endNodeInput.value, 10)
      : null;

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
        alert(
          "Start node not found in graph. Please enter a valid start node."
        );
        return;
      }
      let result;
      if (algorithmChoice === "BFS") {
        result = bfs(
          graph,
          startNode.toString(),
          endNode && endNode.toString()
        );
      } else if (algorithmChoice === "DFS") {
        result = dfs(
          graph,
          startNode.toString(),
          endNode && endNode.toString()
        );
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

function bfs(graph, start, end = null) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  visited.add(+start);

  while (queue.length > 0) {
    const vertex = queue.shift();
    result.push(vertex);
    if (+vertex === +end) break; // Stop the traversal if the end node is found

    graph[vertex]
      .slice()
      .sort((a, b) => a - b)
      .forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          if (+neighbor === +end) {
            // Check if the neighbor is the end node before enqueueing
            queue.push(neighbor);
            return result.concat(neighbor); // Immediately return the result including the end node
          }
          queue.push(neighbor);
        }
      });
  }
  return result;
}

function dfs(graph, start, end = null) {
  const visited = new Set();
  const stack = [start];
  const result = [];

  while (stack.length > 0) {
    const vertex = stack.pop();
    if (!visited.has(vertex)) {
      visited.add(vertex);
      result.push(vertex);
      if (vertex === end) break; // Stop the traversal if the end node is found

      graph[vertex]
        .slice()
        .sort((a, b) => b - a)
        .forEach((neighbor) => {
          if (!visited.has(neighbor)) {
            if (neighbor === end) {
              // Check if the neighbor is the end node before pushing to the stack
              stack.push(neighbor);
              return result.concat(neighbor); // Immediately return the result including the end node
            }
            stack.push(neighbor);
          }
        });
    }
  }
  return result;
}

function displayResult(result) {
  const container = document.getElementById("traversalResult");
  container.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
}
