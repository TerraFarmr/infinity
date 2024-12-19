import logo from "../assets/logo.js";
import * as organisms from "../assets/organisms.js";

const  chooseOrganisms = (numOrganisms) => {
  const organismKeys = Object.keys(organisms);
  const randomOrganisms = [];
  for (let i = 0; i < numOrganisms; i++) {
    const randomIndex = Math.floor(Math.random() * organismKeys.length);
    randomOrganisms.push(organisms[organismKeys[randomIndex]]);
  }
  return randomOrganisms;
}

function populateGrid(grid, organisms, banner) {
    function placeLogoInGrid(grid, banner) {
        const gridRows = grid.length;
        const gridCols = grid[0].length;
        const bannerRows = banner.length;
        const bannerCols = banner[0].length;

        // Ensure the grid is large enough to fit the logo
        if (bannerRows > gridRows || bannerCols > gridCols) {
          console.error('Logo is larger than the grid. Cannot place logo.');
          return grid;
        }

        const startRow = Math.floor((gridRows - bannerRows) / 2);
        const startCol = Math.floor((gridCols - bannerCols) / 2);

        for (let i = 0; i < bannerRows; i++) {
          for (let j = 0; j < bannerCols; j++) {
            if (grid[startRow + i] && grid[startRow + i][startCol + j] !== undefined) {
              grid[startRow + i][startCol + j] = banner[i][j];
            }
          }
        }

        return grid;
      }
      
    const rows = grid.length;
    const cols = grid[0].length;
    organisms.forEach(organism => {
        const orgRows = organism.length;
        const orgCols = organism[0].length;
        const startX = Math.floor(Math.random() * (rows - orgRows));
        const startY = Math.floor(Math.random() * (cols - orgCols));

        for (let i = 0; i < orgRows; i++) {
            for (let j = 0; j < orgCols; j++) {
                grid[startX + i][startY + j] = organism[i][j];
            }
        }
    });
    return placeLogoInGrid(grid,banner)
}

const createGrid = (rows, columns, population) => {
    const initialGrid = Array.from({ length: rows }, () => Array(columns).fill(0));
    return populateGrid(initialGrid, chooseOrganisms(population), logo);
};


const calculateNextGeneration = (grid)=> {

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