import { isSameColor } from "./chessUtils";

// Check if a pawn's move is valid
export const canPawnMove = (startRow, startCol, endRow, endCol, board) => {
  const piece = board[startRow][startCol];
  const direction = piece === piece.toUpperCase() ? -1 : 1; // White moves up (-1), Black moves down (+1)

  // **Moving Forward (1 Square)**
  if (endCol === startCol && endRow === startRow + direction) {
    return board[endRow][endCol] === null;
  }

  // **Moving Forward (2 Squares) - Only if on starting row**
  const startingRow = piece === "P" ? 6 : 1;
  if (
    startRow === startingRow &&
    endCol === startCol &&
    endRow === startRow + 2 * direction
  ) {
    return (
      board[endRow][endCol] === null &&
      board[startRow + direction][endCol] === null
    ); // both squares must be empty so no piece can be jumped
  }

  // **Capturing Diagonally**
  if (Math.abs(endCol - startCol) === 1 && endRow === startRow + direction) {
    return (
      board[endRow][endCol] !== null &&
      !isSameColor(piece, board[endRow][endCol])
    );
  }

  return false;
};
