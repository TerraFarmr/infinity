import logo from "../assets/logo.js";


const insertCustomOrganism = (grid, organism) => {
    const gridRows = grid.length;
    const gridCols = grid[0].length;
    const orgRows = organism.length;
    const orgCols = organism[0].length;

    const startRow = Math.floor((gridRows - orgRows) / 2);
    const startCol = Math.floor((gridCols - orgCols) / 2);

    for (let i = 0; i < orgRows; i++) {
        for (let j = 0; j < orgCols; j++) {
            grid[startRow + i][startCol + j] = organism[i][j];
        }
    }

    return grid;
};


const createGrid = (rows, columns, population) => {
    const initialGrid = Array.from({ length: rows }, () => Array(columns).fill(0));
    const populateGrid = (grid, population) =>
        grid.map((row) =>
            row.map(() => Math.random() < population / 100 ? 1 : 0)
        );
    return  insertCustomOrganism(populateGrid(initialGrid, population), logo);
};

const countNeighbours = (grid, col, row) => {
    let count = 0;
    for (let i = col - 1; i <= col + 1; i++) {
        for (let j = row - 1; j <= row + 1; j++) {
            if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
                if (grid[i][j] === 1 && !(i === col && j === row)) count++;
            }
        }
    }
    return count;
};

const calculateNextGeneration = (grid)=> {
    return grid?.map((row, x) =>
        row.map((cell, y) => {
            if (x === 0 || y === 0 || x === grid.length - 1 || y === row.length - 1) {
                return cell;
            }

            const liveNeighbours = countNeighbours(grid, x, y);

            // Game of Life rules
            if (cell === 1 && (liveNeighbours < 2 || liveNeighbours > 3)) {
                return 0;
            } else if (cell === 0 && liveNeighbours === 3) {
                return 1;
            }
            return cell;
        })
    );
};

function addCellsToGrid(grid, x, y) {
    // Ensure the coordinates are within the grid bounds
    if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
        // Toggle the cell state (assuming 0 is dead and 1 is alive)
        grid[x][y] = grid[x][y] === 0 ? 1 : 0;
    }
    return grid;
}

export {
    createGrid,
    calculateNextGeneration,
    addCellsToGrid,
}