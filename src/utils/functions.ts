import { State, Player } from "./types";

type HandlePlayArgs = {
  bigRowIndex: number;
  bigCellIndex: number;
  smallRowIndex: number;
  smallCellIndex: number;
};

export const comboArray: string[] = [];
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    comboArray.push(`${i}${j}`);
  }
}

export function handlePlay(
  state: State,
  { bigRowIndex, bigCellIndex, smallRowIndex, smallCellIndex }: HandlePlayArgs
): State {
  const {
    board,
    activeCells,
    finishedCells,
    winnersBoard,
    currentPlayer,
    players,
  } = state;

  const cellId = `${bigRowIndex}${bigCellIndex}`;
  const smallCellId = `${smallRowIndex}${smallCellIndex}`;

  // Validate if the move is allowed
  if (!activeCells.includes(cellId) || finishedCells.includes(cellId)) {
    return state;
  }

  // Update the board with the current player's symbol
  const newBoard = board.map((bigRow, rowIdx) =>
    bigRow.map((bigCell, colIdx) =>
      rowIdx === bigRowIndex && colIdx === bigCellIndex
        ? bigCell.map((smallRow, smallRowIdx) =>
            smallRow.map((smallCell, smallColIdx) =>
              smallRowIdx === smallRowIndex && smallColIdx === smallCellIndex
                ? currentPlayer.symbol
                : smallCell
            )
          )
        : bigCell
    )
  );

  // Check if the cell is finished
  const cellWinner = checkForWinner(newBoard[bigRowIndex][bigCellIndex]);
  const newFinishedCells = cellWinner
    ? [...finishedCells, cellId]
    : finishedCells;

  // Update the winnersBoard if a winner is found for the cell
  const newWinnersBoard =
    cellWinner?.status === "win"
      ? winnersBoard.map((row, rowIdx) =>
          row.map((cell, colIdx) =>
            rowIdx === bigRowIndex && colIdx === bigCellIndex
              ? currentPlayer.symbol
              : cell
          )
        )
      : winnersBoard;

  // Check if the game is finished
  const gameWinner = checkForWinner(newWinnersBoard);
  if (gameWinner) {
    return {
      ...state,
      board: newBoard,
      finishedCells: newFinishedCells,
      winnersBoard: newWinnersBoard,
      activeCells: [],
      currentPlayer,
      winner:
        gameWinner.player === players.player1.symbol
          ? players.player1
          : players.player2,
    };
  }

  // Determine the new active cells
  const newActiveCells =
    finishedCells.includes(smallCellId) ||
    newWinnersBoard[smallRowIndex][smallCellIndex] !== ""
      ? comboArray.filter(
          (cell) => !newFinishedCells.includes(cell) && cell !== smallCellId
        )
      : [smallCellId];

  // Switch the current player
  const nextPlayer =
    currentPlayer.symbol === players.player1.symbol
      ? players.player2
      : players.player1;

  return {
    ...state,
    board: newBoard,
    finishedCells: newFinishedCells,
    winnersBoard: newWinnersBoard,
    activeCells: newActiveCells,
    currentPlayer: nextPlayer,
  };
}

function checkForWinner(grid: string[][]) {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      grid[i][0] !== "" &&
      grid[i][0] === grid[i][1] &&
      grid[i][1] === grid[i][2]
    ) {
      return {
        status: "win",
        direction: "row",
        line: i + 1,
        player: grid[i][0],
      };
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (
      grid[0][j] !== "" &&
      grid[0][j] === grid[1][j] &&
      grid[1][j] === grid[2][j]
    ) {
      // We have a winner
      return {
        status: "win",
        direction: "column",
        line: j + 1,
        player: grid[0][j],
      };
    }
  }

  // Check diagonals
  if (
    grid[0][0] !== "" &&
    grid[0][0] === grid[1][1] &&
    grid[1][1] === grid[2][2]
  ) {
    // We have a winner
    return {
      status: "win",
      direction: "diagonal",
      line: 1,
      player: grid[0][0],
    };
  }
  if (
    grid[0][2] !== "" &&
    grid[0][2] === grid[1][1] &&
    grid[1][1] === grid[2][0]
  ) {
    // We have a winner
    return {
      status: "win",
      direction: "diagonal",
      line: 2,
      player: grid[0][2],
    };
  }

  let count = 0;
  for (let a = 0; a < 3; a++) {
    for (let b = 0; b < 3; b++) {
      if (grid[a][b] != "") {
        count++;
      }
    }
  }

  if (count == 9) {
    return { status: "tie" };
  }

  return null; // No winner yet
}
