import { useEffect, useState } from "react";
import { Bomb, Goal, Timer } from "lucide-react";

function App() {
  const CreateGrid = (rows: number, cols: number) => {
    const grid = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) => ({
        id: rowIndex * cols + colIndex + 1,
        position: { row: rowIndex, col: colIndex },
        playAnimation: false,
        reveled: false,
        hasFlag: false,
        hasBomb: Math.random() < 0.2,
        bombsNearby: 0,
        siblings: [],
      })),
    );

    grid.flatMap((row, idxRow) =>
      row.map((col, idxCol) => {
        const siblings = CheckSiblings({ row: idxRow, col: idxCol }, grid);
        col.bombsNearby = siblings.filter((r) => r.hasBomb).length;
        return col;
      }),
    );

    return grid;
  };

  const CheckSiblings = (current: { row: number; col: number }, arr) => {
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

    return directions
      .map(([dr, dc]) => arr?.[current.row + dr]?.[current.col + dc])
      .filter((value) => value !== undefined);
  };

  const CheckSquare = (current: { row: number; col: number }) => {
    setGrid((prevGrid) => {
      return prevGrid.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          if (rowIndex === current.row && colIndex === current.col) {
            const newCell = { ...square, reveled: true, playAnimation: true };

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
    const selected = grid[current.row][current.col];
    const squares = grid.flat();

    if (selected.hasFlag) return;

    if (selected.hasBomb) {
      const bombedSquares = squares
        .filter((s) => s.hasBomb)
        .filter((s) => !s.hasFlag);

      bombedSquares.map((sibling) => CheckSquare(sibling.position));

      setIsGameOver(true);
      return;
    }

    CheckSquare(current);

    if (selected.bombsNearby === 0) {
      const legalSpots = CheckSiblings(selected.position, grid)
        .filter((s) => !s.hasBomb)
        .filter((s) => !s.hasFlag);

      legalSpots.map((sibling) => {
        CheckSquare(sibling.position);
      });
    }
  };

  const FlagArea = (current: { row: number; col: number }) => {
    setGrid((prevGrid) => {
      return prevGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (
            rowIndex === current.row &&
            colIndex === current.col &&
            !cell.reveled
          ) {
            return { ...cell, hasFlag: !cell.hasFlag };
          }
          return { ...cell };
        }),
      );
    });
  };

  const [grid, setGrid] = useState(CreateGrid(3, 3));
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  const TryAgain = () => setIsGameOver(false);

  useEffect(() => {
    const timerHandler = setInterval(() => {
      setTimer((prevState) => prevState + 1);
    }, 1000);

    if (isGameWon || isGameOver) clearInterval(timerHandler);

    return () => clearInterval(timerHandler);
  }, [isGameOver, isGameWon]);

  useEffect(() => {
    const squares = grid.flat();

    const remainingSquares = squares
      .filter((s) => !s.hasBomb)
      .filter((s) => !s.reveled);

    setIsGameWon(remainingSquares.length === 0);
  }, [grid]);

  function formatTime(seconds: number): string {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  return (
    <main className="bg-stone-800 w-full h-svh grid place-content-center text-amber-50">
      {isGameOver && (
        <div className="absolute z-50 animate-fadeIn bg-stone-900/90 w-svw h-svh grid place-content-center">
          <h1 className="text-center font-extrabold font-mono my-12 text-4xl">
            GAME OVER
          </h1>

          <button
            className="group relative inline-flex h-12 items-center border justify-center overflow-hidden rounded-md bg-transparent px-6 font-medium text-neutral-200 transition hover:scale-110"
            onClick={TryAgain}
          >
            <span className="uppercase">Try again</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div className="relative h-full w-8 bg-white/20"></div>
            </div>
          </button>
        </div>
      )}

      {isGameWon && (
        <div className="absolute z-50 animate-fadeIn bg-stone-900/90 w-svw space-y-12 h-svh grid place-content-center">
          <h1 className="text-center font-extrabold font-mono text-4xl">
            VOCÊ GANHOU
          </h1>

          <button
            className="group relative inline-flex h-12 items-center border justify-center overflow-hidden rounded-md bg-transparent px-6 font-medium text-neutral-200 transition hover:scale-110"
            onClick={TryAgain}
          >
            <span className="uppercase">Jogar novamente</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div className="relative h-full w-8 bg-white/20"></div>
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

      <h1 className="text-center font-extrabold font-mono my-12 text-4xl">
        Mined Sonar
      </h1>

      <div className="flex w-max mx-auto h-max rounded-lg  border border-stone-200">
        {grid.map((row, idxRow) => (
          <div key={idxRow}>
            {row.map(
              (
                { id, bombsNearby, reveled, playAnimation, hasBomb, hasFlag },
                idxCell,
              ) => {
                return (
                  <div
                    key={id}
                    className={`border relative size-16 md:size-24 cursor-pointer transition-colors select-none aspect-square grid place-content-center border-stone-200 ${reveled ? "bg-green-500/10" : "bg-stone-700/10"}`}
                    onClick={() => {
                      if (!playAnimation)
                        ClickHandler({ row: idxRow, col: idxCell });
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      FlagArea({ row: idxRow, col: idxCell });
                    }}
                  >
                    <div
                      className={`absolute size-full transition-colors duration-300 ${playAnimation ? "bg-stone-800/50" : "bg-transparent"}`}
                    />

                    {hasFlag && <Goal />}

                    {reveled && (
                      <div className={`${"block "}`}>
                        {hasBomb ? (
                          <Bomb />
                        ) : (
                          <div className="relative">
                            <div
                              className={`size-4 rounded-full border opacity-0 border-stone-200/50 ${playAnimation ? "animate-sonar" : "animate-none"}`}
                              style={{ animationIterationCount: bombsNearby }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              },
            )}
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
      </div>
    </main>
  );
}

export default App;
