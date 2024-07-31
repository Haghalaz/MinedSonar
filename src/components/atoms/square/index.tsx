import { Bomb, Goal } from "lucide-react";

type SquareProps = {
  data: Square;
  flagArea: ({ col, row }: { col: number; row: number }) => void;
  checkArea: ({ col, row }: { col: number; row: number }) => void;
};

export default function Square({ data, flagArea, checkArea }: SquareProps) {
  const { playAnimation, position, hasFlag, revealed, hasBomb, bombsNearby } = data;

  return (
    <div
      className={`border relative size-8 md:size-12 overflow-hidden cursor-pointer transition-colors select-none aspect-square grid place-content-center border-stone-200 ${revealed ? (hasBomb ? "bg-red-700/30" : "bg-green-800/50") : "bg-stone-700/10"}`}
      onClick={() => {
        if (!playAnimation) checkArea(position);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") checkArea(position);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        flagArea(position);
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
}
