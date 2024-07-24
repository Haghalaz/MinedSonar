import { useEffect, useState } from "react";
import useSound from "use-sound";

import { Bomb, Goal, Timer } from "lucide-react";

import clap from "./assets/sounds/clap.mp3";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select.tsx";

type Square = {
  id: number;
  position: { row: number; col: number };
  playAnimation: boolean;
  revealed: boolean;
  hasFlag: boolean;
  hasBomb: boolean;
  bombsNearby: number;
};

type Grid = Square[][];

type GridOptions = { rows: number; cols: number; bombs: number };

type Difficulty = "easy" | "medium" | "hard";

const gridDifficulty = {
  easy: { rows: 10, cols: 8, bombs: 10 },
  medium: { rows: 10, cols: 12, bombs: 25 },
  hard: { rows: 10, cols: 16, bombs: 40 },
};

function App() {
  const [play] = useSound(clap as string);

  const CreateGrid = ({ rows, cols, bombs }: GridOptions): Grid => {
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

    const placeBombs = (grid: Grid, bombs: number) => {
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

    placeBombs(grid, bombs);

    grid.flatMap((row, idxRow) =>
      row.map((col, idxCol) => {
        const siblings = CheckSiblings({ row: idxRow, col: idxCol }, grid);
        col.bombsNearby = siblings.filter((r) => r?.hasBomb).length;
        return col;
      }),
    );

    return grid;
  };

  const CheckSiblings = (current: { row: number; col: number }, grid: Grid) => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    return directions.map(([dr, dc]) => grid?.[current.row + dr]?.[current.col + dc]).filter((value) => value !== undefined);
  };

  const CheckSquare = (current: { row: number; col: number }) => {
    setGrid((prevGrid) => {
      return prevGrid.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          if (rowIndex === current.row && colIndex === current.col) {
            const newCell = { ...square, revealed: true, playAnimation: true };

            setTimeout(() => {
              setGrid((prevGrid) => {
                return prevGrid.map((r, ri) =>
                  r.map((c, ci) => {
                    if (ri === rowIndex && ci === colIndex) {
                      return { ...c, playAnimation: false };
                    }
                    return c;
                  }),
                );
              });
            }, 3000);

            return newCell;
          }
          return { ...square };
        }),
      );
    });
  };

  const ClickHandler = (current: { row: number; col: number }) => {
    play();

    const selected = grid[current.row][current.col];
    const squares = grid.flat();

    if (selected.hasFlag) return;

    if (selected.hasBomb) {
      const bombedSquares = squares.filter((s) => s.hasBomb).filter((s) => !s.hasFlag);

      bombedSquares.map((sibling) => CheckSquare(sibling.position));

      setIsGameOver(true);
      return;
    }

    CheckSquare(current);

    if (selected.bombsNearby === 0) {
      const legalSpots = CheckSiblings(selected.position, grid)
        .filter((s: Square) => !s.hasBomb)
        .filter((s: Square) => !s.hasFlag);

      legalSpots.map((sibling: Square) => {
        CheckSquare(sibling.position);
      });
    }
  };

  const FlagArea = (current: { row: number; col: number }) => {
    setGrid((prevGrid) => {
      return prevGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (rowIndex === current.row && colIndex === current.col && !cell.revealed) {
            return { ...cell, hasFlag: !cell.hasFlag };
          }
          return { ...cell };
        }),
      );
    });
  };

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [grid, setGrid] = useState<Grid>(CreateGrid(gridDifficulty[difficulty]));

  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  const ResetGame = () => {
    setGrid(CreateGrid(gridDifficulty[difficulty]));
    setTimer(0);
    setIsGameOver(false);
    setIsGameWon(false);
  };

  const handleValueChange = (v: string | null) => {
    const newDifficulty: Difficulty = (v as Difficulty) || "easy";
    setDifficulty(newDifficulty);
  };

  useEffect(() => {
    const timerHandler = setInterval(() => {
      setTimer((prevState) => prevState + 1);
    }, 1000);

    if (isGameWon || isGameOver) clearInterval(timerHandler);

    return () => clearInterval(timerHandler);
  }, [isGameOver, isGameWon]);

  useEffect(() => {
    const squares = grid.flat();

    const remainingSquares = squares.filter((s) => !s.hasBomb).filter((s) => !s.revealed);

    setIsGameWon(remainingSquares.length === 0);
  }, [grid]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    ResetGame();
  }, [difficulty]);

  function formatTime(seconds: number): string {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  return (
    <main className="relative bg-stone-800 w-full h-max min-h-dvh grid place-content-center px-6 text-amber-50">
      {isGameOver && (
        <div className="absolute z-50 animate-fadeIn bg-stone-900/90 size-full grid place-content-center">
          <h1 className="text-center font-extrabold font-mono my-12 text-4xl">GAME OVER</h1>

          <button className="group relative inline-flex h-12 items-center border justify-center overflow-hidden rounded-md bg-transparent px-6 font-medium text-neutral-200 transition hover:scale-110" onClick={ResetGame} type="button">
            <span className="uppercase">Try again</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div className="relative h-full w-8 bg-white/20" />
            </div>
          </button>
        </div>
      )}

      {isGameWon && (
        <div className="absolute z-50 animate-fadeIn bg-stone-900/90 size-full space-y-12 h-svh grid place-content-center">
          <h1 className="text-center font-extrabold font-mono text-4xl">VOCÊ GANHOU</h1>

          <button className="group relative inline-flex h-12 items-center border justify-center overflow-hidden rounded-md bg-transparent px-6 font-medium text-neutral-200 transition hover:scale-110" onClick={ResetGame} type="button">
            <span className="uppercase">Jogar novamente</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div className="relative h-full w-8 bg-white/20" />
            </div>
          </button>

          <div className="space-y-2 grid place-content-center">
            <div className="items-center flex gap-2 font-bold">
              <p>Seu tempo:</p>
              <Timer className="size-4" />
              <p>{formatTime(timer)}</p>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-center font-extrabold font-mono my-12 text-4xl">Mined Sonar</h1>

      <div className="flex w-max mx-auto h-max rounded-lg overflow-hidden border border-stone-200">
        {grid.map((row, idxRow) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: No data to avoid use index
          <div key={`col-${idxRow}`}>
            {row.map(({ id, bombsNearby, revealed, playAnimation, hasBomb, hasFlag }, idxCell) => {
              return (
                <div
                  key={id}
                  className={`border relative size-8 md:size-12 overflow-hidden cursor-pointer transition-colors select-none aspect-square grid place-content-center border-stone-200 ${revealed ? (hasBomb ? "bg-red-700/30" : "bg-green-800/50") : "bg-stone-700/10"}`}
                  onClick={() => {
                    if (!playAnimation) ClickHandler({ row: idxRow, col: idxCell });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") ClickHandler({ row: idxRow, col: idxCell });
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    FlagArea({ row: idxRow, col: idxCell });
                  }}
                >
                  <div className={`absolute size-full transition-colors duration-300 ${playAnimation ? "bg-stone-900/70" : "bg-transparent"}`} />

                  {hasFlag && <Goal className="size-4 md:size-6" />}

                  {revealed && (
                    <>
                      {hasBomb ? (
                        <Bomb className="size-4 md:size-6" />
                      ) : (
                        <div className="relative">
                          <div className={`size-2 rounded-full border opacity-0 border-stone-200/50 md:size-4 ${playAnimation ? "animate-sonar" : "animate-none"}`} style={{ animationIterationCount: bombsNearby }} />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mx-auto my-8 flex gap-12">
        <div className="items-center flex gap-2 font-bold">
          <Bomb className="size-4" />
          <p>{grid.flat().filter((r) => r.hasBomb).length}</p>
        </div>

        <div className="items-center flex gap-2 font-bold">
          <Timer className="size-4" />
          <p>{formatTime(timer)}</p>
        </div>

        <Select defaultValue={difficulty} value={difficulty} onValueChange={handleValueChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Dificuldade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Fácil</SelectItem>
            <SelectItem value="medium">Médio</SelectItem>
            <SelectItem value="hard">Difícil</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </main>
  );
}

export default App;
