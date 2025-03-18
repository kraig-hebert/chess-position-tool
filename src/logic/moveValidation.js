import { isKingInCheck, isSameColor, simulateMove } from "./chessUtils";

export const canPawnMove = (
  startRow,
  startCol,
  endRow,
  endCol,
  board,
  enPassantTarget
) => {
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
    // normal diagonal capture
    if (
      board[endRow][endCol] !== null &&
      !isSameColor(piece, board[endRow][endCol])
    ) {
      return true;
    }
    // En Passant capture
    if (
      enPassantTarget &&
      enPassantTarget.row === endRow &&
      enPassantTarget.col === endCol
    ) {
      return true;
    }
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

// Check if castling is valid
export const canCastle = (color, side, board, hasMoved) => {
  const row = color === "white" ? 7 : 0; // White on row 7, black on row 0

  // Determine which rook and king are involved
  const kingCol = 4;

  const rookCol = side === "kingside" ? 7 : 0;
  const newKingCol = side === "kingside" ? 6 : 2;
  const newRookCol = side === "kingside" ? 5 : 3;

  // Check if the king or rook have moved
  if (
    side === "kingside" &&
    (hasMoved[color + "King"] || hasMoved[color + "RookKingside"])
  ) {
    return false;
  }
  if (
    side === "queenside" &&
    (hasMoved[color + "King"] || hasMoved[color + "RookQueenside"])
  ) {
    return false;
  }

  // Ensure path between king and rook is clear
  if (isPathBlocked(row, kingCol, row, rookCol, board)) {
    return false;
  }

  // set middle square validate isKingInCheck
  let middleCol = null;
  if (side === "kingside") middleCol = 5;
  else middleCol = 3;

  //  Ensure the king does not pass through or end in check
  if (
    isKingInCheck(board, color, hasMoved) || // King cannot castle while in check
    isKingInCheck(
      simulateMove(board, row, kingCol, row, middleCol),
      color,
      hasMoved
    ) || // King cannot pass through check
    isKingInCheck(
      simulateMove(board, row, kingCol, row, newKingCol),
      color,
      hasMoved
    ) // King cannot land in check
  ) {
    return false;
  }

  return { kingTo: [row, newKingCol], rookTo: [row, newRookCol] };
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

// function to check is move is valid dynamically for checks and checkmate
export const canPieceMove = (
  startRow,
  startCol,
  endRow,
  endCol,
  board,
  enPassantTarget,
  hasMoved
) => {
  const piece = board[startRow][startCol];
  if (!piece) return false; // No piece to move

  switch (piece.toLowerCase()) {
    case "p":
      return canPawnMove(
        startRow,
        startCol,
        endRow,
        endCol,
        board,
        enPassantTarget
      );
    case "r":
      return canRookMove(startRow, startCol, endRow, endCol, board);
    case "b":
      return canBishopMove(startRow, startCol, endRow, endCol, board);
    case "n":
      return canKnightMove(startRow, startCol, endRow, endCol, board);
    case "q":
      return canQueenMove(startRow, startCol, endRow, endCol, board);
    case "k":
      // If the move is a normal king move, check regular king movement
      if (
        Math.abs(startCol - endCol) === 1 ||
        Math.abs(startRow - endRow) === 1
      ) {
        return canKingMove(startRow, startCol, endRow, endCol, board);
      }
      // If attempting to castle, check castling logic
      if (Math.abs(startCol - endCol) === 2) {
        const color = piece === "K" ? "white" : "black";
        const castlingSide =
          endCol === 6 ? "kingside" : endCol === 2 ? "queenside" : null;
        return canCastle(color, castlingSide, board, hasMoved);
      }
      return false;
    default:
      return false;
  }
};
