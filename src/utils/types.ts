export interface BoardProps {
  gameState: State;
  handlePlay: (cell: Cell) => void;
  restartGame: () => void;
}

export interface Cell {
  bigRowIndex: number;
  bigCellIndex: number;
  smallRowIndex: number;
  smallCellIndex: number;
}

export interface Player {
  id?: string;
  name: string;
  symbol: string;
}

export interface Players {
  player1: Player;
  player2: Player;
}

export type State = {
  board: string[][][][];
  activeCells: string[];
  finishedCells: string[];
  winnersBoard: string[][];
  currentPlayer: Player;
  winner: Player | null;
  players: { player1: Player; player2: Player };
};
