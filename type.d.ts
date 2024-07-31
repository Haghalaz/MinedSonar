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

type Difficulty = "easy" | "medium" | "hard";
