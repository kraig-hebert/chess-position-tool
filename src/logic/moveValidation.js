import {
  copyBoard,
  isKingInCheck,
  isSameColor,
  isPathBlocked,
  simulateMove,
} from "./chessUtils";

export const makePawnMove = (
  startRow,
  startCol,
  endRow,
  endCol,
  board,
  enPassantTarget
) => {
  const newBoard = copyBoard(board);
  const piece = newBoard[startRow][startCol];
  const nextMove = newBoard[endRow][endCol];
  const direction = piece === piece.toUpperCase() ? -1 : 1; // White moves up (-1), Black moves down (+1)
  newBoard[startRow][startCol] = null;

  // Moving Forward (1 Square)
  if (endCol === startCol && endRow === startRow + direction) {
    if (nextMove === null) {
      newBoard[endRow][endCol] = piece;
      return { newBoard };
    } else false;
  }

  // Moving Forward (2 Squares) - Only if on starting row
  const startingRow = piece === "P" ? 6 : 1;
  if (
    startRow === startingRow &&
    endCol === startCol &&
    endRow === startRow + 2 * direction
  ) {
    // both squares must be empty...no piece can be jumped
    if (nextMove === null && board[startRow + direction][endCol] === null) {
      newBoard[endRow][endCol] = piece;
      return {
        newBoard,
        // set middle square as enPassantTarget
        enPassantTarget: { row: (startRow + endRow) / 2, col: startCol },
      };
    } else false;
  }

  // Capturing Diagonally
  if (Math.abs(endCol - startCol) === 1 && endRow === startRow + direction) {
    // normal diagonal capture
    if (nextMove !== null && !isSameColor(piece, nextMove)) {
      newBoard[endRow][endCol] = piece;
      return { newBoard, capturedPiece: nextMove };
    }
    // En Passant capture
    if (
      enPassantTarget &&
      enPassantTarget.row === endRow &&
      enPassantTarget.col === endCol
    ) {
      const capturedPawnRow = piece === "P" ? endRow + 1 : endRow - 1;
      const capturedPiece = newBoard[capturedPawnRow][endCol];
      newBoard[capturedPawnRow][endCol] = null;
      newBoard[endRow][endCol] = piece;
      return { newBoard, capturedPiece };
    }
  } else false;

  return false; // no valid move
};

export const makeRookMove = (startRow, startCol, endRow, endCol, board) => {
  const newBoard = copyBoard(board);
  const piece = newBoard[startRow][startCol];
  const nextMove = newBoard[endRow][endCol];
  newBoard[startRow][startCol] = null;

  // make sure is either in the same row or column
  if (startRow !== endRow && startCol !== endCol) return false;
  // check if that is blocked
  if (isPathBlocked(startRow, startCol, endRow, endCol, board)) return false;

  newBoard[endRow][endCol] = piece;
  return { newBoard, capturedPiece: nextMove };
};

export const canBishopMove = (startRow, startCol, endRow, endCol, board) => {
  const newBoard = copyBoard(board);
  const piece = newBoard[startRow][startCol];
  const nextMove = newBoard[endRow][endCol];
  newBoard[startRow][startCol] = null;

  // check if bishop moved diagonally → row difference = column difference
  if (Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)) return false;
  // Check if the path is blocked
  if (isPathBlocked(startRow, startCol, endRow, endCol, board)) return false;

  newBoard[endRow][endCol] = piece;
  return { newBoard, capturedPiece: nextMove };
};

// Check if a knight's move is valid
export const makeKnightMove = (startRow, startCol, endRow, endCol, board) => {
  const newBoard = copyBoard(board);
  const piece = newBoard[startRow][startCol];
  const nextMove = newBoard[endRow][endCol];
  newBoard[startRow][startCol] = null;

  const rowDiff = Math.abs(startRow - endRow);
  const colDiff = Math.abs(startCol - endCol);

  // Knights move in an "L" shape → (2,1) or (1,2)
  if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)))
    return false;

  newBoard[endRow][endCol] = piece;
  return { newBoard, capturedPiece: nextMove };
};

export const makeQueenMove = (startRow, startCol, endRow, endCol, board) => {
  const newBoard = copyBoard(board);
  const piece = newBoard[startRow][startCol];
  const nextMove = newBoard[endRow][endCol];
  newBoard[startRow][startCol] = null;

  // check if bishop or rook move
  const isRookMove = startRow === endRow || startCol === endCol;
  const isBishopMove =
    Math.abs(startRow - endRow) === Math.abs(startCol - endCol);

  if (!isRookMove && !isBishopMove) return false; // Must be a valid rook or bishop move
  // Check if the path is blocked
  if (isPathBlocked(startRow, startCol, endRow, endCol, board)) return false;

  newBoard[endRow][endCol] = piece;
  return { newBoard, capturedPiece: nextMove };
};

// Check if a king's move is valid
export const makeKingMove = (
  startRow,
  startCol,
  endRow,
  endCol,
  board,
  hasMoved
) => {
  const newBoard = copyBoard(board);
  const piece = newBoard[startRow][startCol];
  const nextMove = newBoard[endRow][endCol];
  newBoard[startRow][startCol] = null;

  const rowDiff = Math.abs(startRow - endRow);
  const colDiff = Math.abs(startCol - endCol);

  // must be legal move
  if (rowDiff > 1 || colDiff > 2) return false;

  // King can only move one square in any direction
  if (rowDiff < 2 && colDiff < 2) {
    newBoard[endRow][endCol] = piece;
    return { newBoard, capturedPiece: nextMove };
  }
  const color = piece === "K" ? "white" : "black";
  // handle castling
  if (Math.abs(startCol - endCol) === 2 && startRow === endRow) {
    const castlingSide =
      endCol === 6 ? "kingside" : endCol === 2 ? "queenside" : null;
    const castlingMove = canCastle(color, castlingSide, board, hasMoved);
    if (castlingMove) {
      const { kingTo, rookTo } = castlingMove;
      newBoard[kingTo[0]][kingTo[1]] = piece; // Move the king
      newBoard[rookTo[0]][rookTo[1]] =
        board[startRow][castlingSide === "kingside" ? 7 : 0]; // Move the rook
      newBoard[startRow][castlingSide === "kingside" ? 7 : 0] = null; // Remove old rook position
      return { newBoard, castlingSide };
    }
  }
  return false;
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

// function to check is move is valid dynamically for checks and checkmate
export const makePieceMove = (
  startRow,
  startCol,
  endRow,
  endCol,
  board,
  options
) => {
  const piece = board[startRow][startCol];
  const nextMove = board[endRow][endCol];
  if (
    !piece ||
    isSameColor(piece, nextMove) ||
    (startRow === endRow && startCol === endCol)
  )
    return false; // No piece to move

  switch (piece.toLowerCase()) {
    case "p":
      return makePawnMove(
        startRow,
        startCol,
        endRow,
        endCol,
        board,
        options.enPassantTarget ? options.enPassantTarget : null
      );
    case "r":
      return makeRookMove(startRow, startCol, endRow, endCol, board);
    case "b":
      return canBishopMove(startRow, startCol, endRow, endCol, board);
    case "n":
      return makeKnightMove(startRow, startCol, endRow, endCol, board);
    case "q":
      return makeQueenMove(startRow, startCol, endRow, endCol, board);
    case "k":
      return makeKingMove(
        startRow,
        startCol,
        endRow,
        endCol,
        board,
        options.hasMoved ? options.hasMoved : null
      );
    default:
      return false;
  }
};
