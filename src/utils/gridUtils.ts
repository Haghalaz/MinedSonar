type GridOptions = { rows: number; cols: number; bombs: number };

export const createGrid = ({ rows, cols, bombs }: GridOptions): Grid => {
  const grid: Grid = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => ({
      id: rowIndex * cols + colIndex + 1,
      position: { row: rowIndex, col: colIndex },
      playAnimation: false,
      revealed: false,
      hasFlag: false,
      hasBomb: false,
      bombsNearby: 0,
    })),
  );

  placeBombs(grid, bombs, rows, cols);
  calculateBombsNearby(grid);

  return grid;
};

const placeBombs = (grid: Grid, bombs: number, rows: number, cols: number) => {
  let placedBombs = 0;
  const totalCells = rows * cols;

  while (placedBombs < bombs) {
    const randomIndex = Math.floor(Math.random() * totalCells);
    const row = Math.floor(randomIndex / cols);
    const col = randomIndex % cols;

    if (!grid[row][col].hasBomb) {
      grid[row][col].hasBomb = true;
      placedBombs++;
    }
  }
};

const calculateBombsNearby = (grid: Grid) => {
  grid.flatMap((row, idxRow) =>
    row.map((col, idxCol) => {
      const siblings = checkSiblings({ row: idxRow, col: idxCol }, grid);
      col.bombsNearby = siblings.filter((r) => r?.hasBomb).length;
      return col;
    }),
  );
};

export const checkSiblings = (current: { row: number; col: number }, grid: Grid): Square[] => {
  // biome-ignore format: the array should not be formatted
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  return directions.map(([dr, dc]) => grid?.[current.row + dr]?.[current.col + dc]).filter((value): value is Square => value !== undefined);
};
