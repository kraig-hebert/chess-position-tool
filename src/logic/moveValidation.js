import { isSameColor } from "./chessUtils";

// Check if a pawn's move is valid
export const canPawnMove = (startRow, startCol, endRow, endCol, board) => {
  const piece = board[startRow][startCol];
  const direction = piece === piece.toUpperCase() ? -1 : 1; // White moves up (-1), Black moves down (+1)

  // Moving Forward (1 Square)
  if (endCol === startCol && endRow === startRow + direction) {
    return board[endRow][endCol] === null;
  }

  // Moving Forward (2 Squares) - Only if on starting row
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

  // Capturing Diagonally
  if (Math.abs(endCol - startCol) === 1 && endRow === startRow + direction) {
    return (
      board[endRow][endCol] !== null &&
      !isSameColor(piece, board[endRow][endCol])
    );
  }

  return false;
};

// Check if a rook's move is valid
export const canRookMove = (startRow, startCol, endRow, endCol, board) => {
  // check if rook move is either in the same row or column
  if (startRow !== endRow && startCol !== endCol) return false;

  // check if that is blocked
  if (isPathBlocked(startRow, startCol, endRow, endCol, board)) return false;

  // Ensure the destination is either empty or occupied by an opponent
  return (
    board[endRow][endCol] === null ||
    !isSameColor(board[startRow][startCol], board[endRow][endCol])
  );
};

// Check if a bishop's move is valid
export const canBishopMove = (startRow, startCol, endRow, endCol, board) => {
  // check if bishop moved diagonally → row difference = column difference
  if (Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)) return false;

  // Check if the path is blocked
  if (isPathBlocked(startRow, startCol, endRow, endCol, board)) return false;

  // Ensure destination is either empty or occupied by an opponent
  return (
    board[endRow][endCol] === null ||
    !isSameColor(board[startRow][startCol], board[endRow][endCol])
  );
};

// Check if a knight's move is valid
export const canKnightMove = (startRow, startCol, endRow, endCol, board) => {
  const rowDiff = Math.abs(startRow - endRow);
  const colDiff = Math.abs(startCol - endCol);

  // Knights move in an "L" shape → (2,1) or (1,2)
  if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
    return false;
  }

  // Ensure the destination is either empty or occupied by an opponent
  return (
    board[endRow][endCol] === null ||
    !isSameColor(board[startRow][startCol], board[endRow][endCol])
  );
};

// Check if a queen's move is valid
export const canQueenMove = (startRow, startCol, endRow, endCol, board) => {
  // check if bishop or rook move
  const isRookMove = startRow === endRow || startCol === endCol;
  const isBishopMove =
    Math.abs(startRow - endRow) === Math.abs(startCol - endCol);

  if (!isRookMove && !isBishopMove) return false; // Must be a valid rook or bishop move

  // Check if the path is blocked
  if (isPathBlocked(startRow, startCol, endRow, endCol, board)) return false;

  // Ensure destination is either empty or occupied by an opponent
  return (
    board[endRow][endCol] === null ||
    !isSameColor(board[startRow][startCol], board[endRow][endCol])
  );
};

// Check if a king's move is valid
export const canKingMove = (startRow, startCol, endRow, endCol, board) => {
  const rowDiff = Math.abs(startRow - endRow);
  const colDiff = Math.abs(startCol - endCol);

  // King can only move one square in any direction
  if (rowDiff > 1 || colDiff > 1) return false;

  // Ensure destination is either empty or occupied by an opponent
  return (
    board[endRow][endCol] === null ||
    !isSameColor(board[startRow][startCol], board[endRow][endCol])
  );
};

// Function to check if a path is blocked (used for rooks, bishops, and queens)
export const isPathBlocked = (startRow, startCol, endRow, endCol, board) => {
  // set step direction based on start and end position
  const rowStep = startRow === endRow ? 0 : endRow > startRow ? 1 : -1;
  const colStep = startCol === endCol ? 0 : endCol > startCol ? 1 : -1;

  let currentRow = startRow + rowStep;
  let currentCol = startCol + colStep;

  // check each square in path until destination or path is blocked
  while (currentRow !== endRow || currentCol !== endCol) {
    if (board[currentRow][currentCol] !== null) return true; // A piece is blocking the path
    currentRow += rowStep;
    currentCol += colStep;
  }

  return false; // No pieces in the way
};
