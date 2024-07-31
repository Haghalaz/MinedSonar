import { create } from "zustand";

import { gridDifficulty } from "@constants/gridConstants";

import { checkSiblings, createGrid } from "@utils/gridUtils";

import { useSoundStore } from "@store/gameSoundsStore.ts";
import { useTimerStore } from "@store/timerStore.ts";

type GridState = {
  difficulty: Difficulty;
  grid: Grid;
  isGameOver: boolean;
  isGameWon: boolean;
  bombs: number;
  checkSquare: (current: { row: number; col: number }) => void;
  clickHandler: (current: { row: number; col: number }) => void;
  flagArea: (current: { row: number; col: number }) => void;
  changeDifficulty: (v: Difficulty) => void;
  resetGame: () => void;
};

export const useMinedSonarStore = create<GridState>((set, get) => {
  const { startTimer, resetTimer, stopTimer } = useTimerStore.getState();
  const { sonar, explosion, win } = useSoundStore.getState();

  return {
    difficulty: "easy",

    grid: createGrid(gridDifficulty["easy"]),
    isGameOver: false,
    isGameWon: false,
    bombs: gridDifficulty["easy"].bombs,

    checkSquare: (current) => {
      set((state) => {
        const newGrid = state.grid.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            if (rowIndex === current.row && colIndex === current.col) {
              const newCell = { ...square, revealed: true, playAnimation: true };

              setTimeout(() => {
                set((innerState) => ({
                  grid: innerState.grid.map((r, ri) =>
                    r.map((c, ci) => {
                      if (ri === rowIndex && ci === colIndex) {
                        return { ...c, playAnimation: false };
                      }
                      return c;
                    }),
                  ),
                }));
              }, 3000);

              return newCell;
            }
            return square;
          }),
        );
        return { grid: newGrid };
      });
    },

    flagArea: (current) => {
      set((state) => ({
        grid: state.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (rowIndex === current.row && colIndex === current.col && !cell.revealed) {
              return { ...cell, hasFlag: !cell.hasFlag };
            }
            return cell;
          }),
        ),
      }));
    },

    clickHandler: (current) => {
      startTimer();

      const { grid, isGameWon, isGameOver } = get();
      if (isGameWon || isGameOver) return;

      const selected = grid[current.row][current.col];
      const squares = grid.flat();

      if (selected.hasFlag) return;

      if (selected.hasBomb) {
        const bombedSquares = squares.filter((s) => s.hasBomb && !s.hasFlag);
        bombedSquares.forEach((sibling) => get().checkSquare(sibling.position));
        set({ isGameOver: true });

        explosion.play();
        stopTimer();

        return;
      }

      if (selected.bombsNearby === 0) {
        const legalSpots = checkSiblings(selected.position, grid).filter((s) => !s.hasBomb && !s.hasFlag);
        legalSpots.forEach((sibling) => get().checkSquare(sibling.position));
      }

      sonar.play();
      get().checkSquare(current);
      get().checkWinCondition();
    },

    checkWinCondition: () => {
      const { grid } = get();
      const remainingSquares = grid.flat().filter((s) => !s.hasBomb && !s.revealed).length;

      if (remainingSquares === 0) {
        set({ isGameWon: true });
        win.play();
        stopTimer();
      }
    },

    changeDifficulty: (value: Difficulty) => {
      set({ difficulty: value });
      get().resetGame();
    },

    resetGame: () => {
      set({
        grid: createGrid(gridDifficulty[get().difficulty]),
        bombs: gridDifficulty[get().difficulty].bombs,
        isGameOver: false,
        isGameWon: false,
      });
      resetTimer();
    },
  };
});
