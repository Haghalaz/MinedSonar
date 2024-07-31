import { useShallow } from "zustand/react/shallow";

import { Timer, Trophy } from "lucide-react";

import Button from "@atoms/button";
import PopUp from "@molecules/popup";

import { secondsToTime } from "@utils/formatter.ts";
import getRecord from "@utils/getRecord.ts";

import { useMinedSonarStore } from "@store/gridStore.ts";
import { useTimerStore } from "@store/timerStore.ts";

export default function GameWon() {
  const timer = useTimerStore((state) => state.timer);
  const { isGameWon, resetGame } = useMinedSonarStore(useShallow((state) => ({ isGameWon: state.isGameWon, resetGame: state.resetGame })));

  if (!isGameWon) return;

  const record = getRecord(secondsToTime(timer));

  return (
    <PopUp title="Você Ganhou">
      <Button handler={resetGame}>Jogar novamente</Button>

      <div className="space-y-2 grid place-content-center">
        <div className="items-center flex gap-2 font-bold">
          <p>Seu tempo:</p>
          <Timer className="size-4" />
          <p>{secondsToTime(timer)}</p>
        </div>

        <div className="items-center flex gap-2 font-bold">
          <p>Seu Recorde:</p>
          <Trophy className="size-4" />
          <p>{record}</p>
        </div>
      </div>
    </PopUp>
  );
}
