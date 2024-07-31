import { useShallow } from "zustand/react/shallow";

import { useMinedSonarStore } from "@store/gridStore.ts";

import Button from "@atoms/button";
import PopUp from "@molecules/popup";

export default function GameOver() {
  const { isGameOver, resetGame } = useMinedSonarStore(useShallow((state) => ({ isGameOver: state.isGameOver, resetGame: state.resetGame })));

  if (!isGameOver) return;

  return (
    <PopUp title="Game Over">
      <Button handler={resetGame}>Jogar novamente</Button>
    </PopUp>
  );
}
