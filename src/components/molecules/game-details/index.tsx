import { useShallow } from "zustand/react/shallow";

import { Bomb, Timer, Volume2, VolumeX } from "lucide-react";

import { secondsToTime } from "@utils/formatter.ts";

import { useSoundStore } from "@store/gameSoundsStore.ts";
import { useMinedSonarStore } from "@store/gridStore.ts";
import { useTimerStore } from "@store/timerStore.ts";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@atoms/select";

export default function GameDetails() {
  const timer = useTimerStore((state) => state.timer);
  const { muted, toggleMute } = useSoundStore(useShallow((state) => ({ muted: state.muted, toggleMute: state.toggleMute })));
  const { difficulty, bombs, changeDifficulty } = useMinedSonarStore(useShallow((state) => ({ difficulty: state.difficulty, bombs: state.bombs, changeDifficulty: state.changeDifficulty })));

  return (
    <div className="w-full justify-center my-8 flex flex-wrap items-center gap-12">
      <button onClick={toggleMute} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleMute()} type="button">
        {muted ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />}
      </button>

      <div className="items-center flex gap-2 font-bold">
        <Bomb className="size-4" />
        <p>{bombs}</p>
      </div>

      <div className="items-center flex gap-2 font-bold">
        <Timer className="size-4" />
        <p>{secondsToTime(timer)}</p>
      </div>

      <Select defaultValue={difficulty} value={difficulty} onValueChange={(v: Difficulty) => changeDifficulty(v)}>
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
  );
}
