import Credits from "@molecules/credits";
import GameDetails from "@molecules/game-details";
import GridContent from "@molecules/grid-content";

import GameOver from "@organisms/game-over";
import GameWon from "@organisms/game-won";

function App() {
  return (
    <main className="relative bg-stone-800 w-full h-max min-h-dvh grid place-content-center px-6 text-amber-50">
      <h1 className="text-center font-extrabold font-mono my-12 text-4xl">Mined Sonar</h1>

      <GridContent />
      <GameDetails />

      <GameOver />
      <GameWon />

      <Credits />
    </main>
  );
}

export default App;
