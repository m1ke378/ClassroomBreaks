export interface BoardProps {
  board: string[][][][]; // 4-dimensional array for the ultimate Tic-Tac-Toe board
  handlePlay: (cell: Cell) => void; // Function to handle a play
  players: Players; // Object containing player details
  winnersBoard: string[][]; // 2D array for big cell winners
  activeCells: string[]; // List of currently active big cells
  finishedCells: string[]; // List of completed big cells
  winner: { name: string; symbol: string } | null; // Winner object or null if no winner
  restartGame: () => void; // Function to restart the game
  currentPlayer: Player; // Current player object
}

export interface Cell {
  bigRowIndex: number;
  bigCellIndex: number;
  smallRowIndex: number;
  smallCellIndex: number;
}

export interface Player {
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
  comboArray: string[];
};
