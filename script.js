const numRows = 20;
const numCols = 20;

const grid = [];

let startRow = null;
let startCol = null;
let endRow = null;
let endCol = null;

// Call the function to create the grid when the page loads

let obstacleState = true;

function createGrid() {
  const gridElement = document.getElementById("grid");

  for (let i = 0; i < numRows; i++) {
    const newRow = [];
    const row = document.createElement("tr");
    for (let j = 0; j < numCols; j++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${i}-${j}`);
      newRow.push(0);
      row.appendChild(cell);
      cell.addEventListener("click", onGridCellClick);
      cell.addEventListener("mouseenter", onGridCellMouseenter);
      cell.addEventListener("dblclick", onGridCelldoubleClick);
    }
    grid.push(newRow);
    gridElement.appendChild(row);
  }
  // Handling performance issue
  gridElement.addEventListener("mouseleave", onGridMouseLeave);
}

window.onload = createGrid;

let startButton = document.getElementById("start-point-button");
let endButton = document.getElementById("end-point-button");
let obstaclesButton = document.getElementById("obstacle-button");
let RemoveObstacleButton = document.getElementById("remove-obstacle-button");
let Clear = document.getElementById("clear-button");

// events
startButton.addEventListener("click", function () {
  onButtonClick("start-point-button");
});
endButton.addEventListener("click", function () {
  onButtonClick("end-point-button");
});
obstaclesButton.addEventListener("click", function () {
  onButtonClick("obstacle-button");
  onObstacleButtonClick();
});
RemoveObstacleButton.addEventListener("click", function () {
  onButtonClick("remove-obstacle-button");
});
Clear.addEventListener("click", function () {
  onButtonClick("clear-button");
  onDeleteButtonClick();
});

function onButtonClick(id) {
  const buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function onDeleteButtonClick() {
  const allCells = document.querySelectorAll("td");
  allCells.forEach((cell) => {
    cell.classList.remove(
      "start",
      "end",
      "obstacle",
      "active",
      "visited",
      "path"
    );
    const [row, col] = cell.id.split("-").map(Number);
    grid[(row, col)] = 0;
  });
  startRow = null;
  startCol = null;
  endRow = null;
  endCol = null;
}

function onGridCellClick(event) {
  const cell = event.target;
  if (
    document.getElementById("start-point-button").classList.contains("active")
  ) {
    const allCells = document.querySelectorAll("td");
    allCells.forEach((cell) => {
      cell.classList.remove("start");
    });
    cell.classList.add("start");
    const [row, col] = cell.id.split("-").map(Number);
    startRow = row;
    startCol = col;
  } else if (
    document.getElementById("end-point-button").classList.contains("active")
  ) {
    const allCells = document.querySelectorAll("td");
    allCells.forEach((cell) => {
      cell.classList.remove("end");
    });
    cell.classList.add("end");
    const [row, col] = cell.id.split("-").map(Number);
    endRow = row;
    endCol = col;
  } else if (
    document
      .getElementById("remove-obstacle-button")
      .classList.contains("active")
  ) {
    const [row, col] = cell.id.split("-").map(Number);
    if (
      !(
        (row === startRow && col === startCol) ||
        (row === endRow && col === endCol)
      )
    ) {
      grid[row][col] = 0;
      cell.classList.remove("obstacle");
    }
  }
}

/****Handling Adding Obstacle****/

function onGridCellMouseenter(event) {
  const cell = event.target;
  if (
    document.getElementById("obstacle-button").classList.contains("active") &&
    obstacleState == true
  ) {
    const [row, col] = cell.id.split("-").map(Number);
    if (
      !(
        (row === startRow && col === startCol) ||
        (row === endRow && col === endCol)
      )
    ) {
      grid[row][col] = 1;
      cell.classList.add("obstacle");
    }
  }
}
function onGridCelldoubleClick() {
  if (document.getElementById("obstacle-button").classList.contains("active"))
    obstacleState = false;
}
function onGridMouseLeave() {
  document.getElementById("obstacle-button").classList.remove("active");
}
function onObstacleButtonClick() {
  obstacleState = true;
}

/************* Algo Buttons **********/

document.getElementById("bfs-button").addEventListener("click", function () {
  onButtonClick("bfs-button");
  runBFS();
});

document.getElementById("dfs-button").addEventListener("click", function () {
  onButtonClick("dfs-button");
  runDFS();
});

document
  .getElementById("dijkstra-button")
  .addEventListener("click", function () {
    onButtonClick("dijkstra-button");
    runDijkstra();
  });

/***********BFS*********/
function runBFS() {
  const visited = new Set();
  const queue = [[startRow, startCol]];

  function processQueue() {
    if (queue.length === 0) {
      return;
    }
    const [row, col] = queue.shift();
    if (row === endRow && col === endCol) {
      let currentRow = row;
      let currentCol = col;
      while (currentRow !== startRow || currentCol !== startCol) {
        const cell = document.getElementById(`${currentRow}-${currentCol}`);
        cell.classList.add("path");
        const [prevRow, prevCol] = JSON.parse(cell.dataset.prev);
        currentRow = prevRow;
        currentCol = prevCol;
      }
      return;
    }

    visited.add(`${row}-${col}`);
    const neighbors = getNeighbors(row, col);
    for (const [r, c] of neighbors) {
      const key = `${r}-${c}`;
      if (!visited.has(key) && grid[r][c] !== 1) {
        visited.add(key);
        queue.push([r, c]);
        const cell = document.getElementById(`${r}-${c}`);
        cell.classList.add("visited");
        cell.dataset.prev = JSON.stringify([row, col]);
      }
    }
    setTimeout(processQueue, 10);
  }
  processQueue();
}
/***********DFS*********/
function runDFS() {
  const visited = new Set();
  const stack = [[startRow, startCol]];

  function processStack() {
    const [row, col] = stack.pop();
    if (row === endRow && col === endCol) {
      let currentRow = row;
      let currentCol = col;
      while (currentRow !== startRow || currentCol !== startCol) {
        const cell = document.getElementById(`${currentRow}-${currentCol}`);
        cell.classList.add("path");
        const [prevRow, prevCol] = JSON.parse(cell.dataset.prev);
        currentRow = prevRow;
        currentCol = prevCol;
      }
      return;
    }

    visited.add(`${row}-${col}`);
    const neighbors = getNeighbors(row, col);
    for (const [r, c] of neighbors) {
      const key = `${r}-${c}`;
      if (!visited.has(key) && grid[r][c] !== 1) {
        visited.add(key);
        stack.push([r, c]);
        const cell = document.getElementById(`${r}-${c}`);
        cell.classList.add("visited");
        cell.dataset.prev = JSON.stringify([row, col]);
      }
      // No need to continue exploring neighbor cells if you have reached the End Cell
      if (r == endRow && c == endCol) {
        while (stack.isEmpty === false) stack.pop();
        stack.push([r, c]);
        break;
      }
    }

    setTimeout(processStack, 10);
  }

  processStack();
}

/***********Dijkstra************/

function runDijkstra() {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const pq = new PriorityQueue();

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      distances[`${i}-${j}`] = Infinity;
    }
  }
  distances[`${startRow}-${startCol}`] = 0;

  pq.enqueue(`${startRow}-${startCol}`, 0);

  function processStep() {
    if (pq.isEmpty() || visited.size === numRows * numCols) {
      clearInterval(intervalId);
      return;
    }

    const current = pq.dequeue().element;
    const [row, col] = current.split("-").map(Number);

    if (visited.has(current)) return;
    visited.add(current);

    if (row === endRow && col === endCol) {
      let currentRow = row;
      let currentCol = col;
      while (currentRow !== startRow || currentCol !== startCol) {
        const cell = document.getElementById(`${currentRow}-${currentCol}`);
        cell.classList.add("path");
        const [prevRow, prevCol] = JSON.parse(cell.dataset.prev);
        currentRow = prevRow;
        currentCol = prevCol;
      }
      clearInterval(intervalId);
      return;
    }

    const neighbors = getNeighbors(row, col);
    for (const [r, c] of neighbors) {
      if (!visited.has(`${r}-${c}`) && grid[r][c] !== 1) {
        const distance = distances[`${row}-${col}`] + 1;
        if (distance < distances[`${r}-${c}`]) {
          distances[`${r}-${c}`] = distance;
          previous[`${r}-${c}`] = current;
          pq.enqueue(`${r}-${c}`, distance);
          const cell = document.getElementById(`${r}-${c}`);
          cell.classList.add("visited");
          cell.dataset.prev = JSON.stringify([row, col]);
        }
      }
    }
  }

  const intervalId = setInterval(processStep, 20);
}
function getNeighbors(row, col) {
  const neighbors = [];
  if (row > 0) neighbors.push([row - 1, col]);
  if (row < numRows - 1) neighbors.push([row + 1, col]);
  if (col > 0) neighbors.push([row, col - 1]);
  if (col < numCols - 1) neighbors.push([row, col + 1]);
  return neighbors;
}

/**PriorityQueue Implmentation**/
class PriorityQueue {
  constructor() {
    this.elements = {};
    this.priorities = {};
  }

  enqueue(element, priority) {
    this.elements[element] = true;
    this.priorities[element] = priority;
  }

  dequeue() {
    let minPriority = Infinity;
    let minElement = null;
    for (const element in this.elements) {
      if (this.priorities[element] < minPriority) {
        minPriority = this.priorities[element];
        minElement = element;
      }
    }
    if (minElement !== null) {
      delete this.elements[minElement];
      delete this.priorities[minElement];
      return { element: minElement, priority: minPriority };
    }
    return null;
  }

  isEmpty() {
    return Object.keys(this.elements).length === 0;
  }
}
