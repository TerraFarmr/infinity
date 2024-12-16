

const initiateGrid = (rows, columns) =>
    Array.from({ length: rows }, () => Array(columns).fill(0));


const populateGrid = (grid, population = 15) =>
    grid.map((row) =>
        row.map(() => Math.random() < population / 100 ? 1 : 0)
    );

const createGrid = (rows, columns, population = 50) => {
    const initialGrid = initiateGrid(rows, columns);
    return  populateGrid(initialGrid, population);
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


export {
    createGrid,
    calculateNextGeneration,
}