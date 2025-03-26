import { canPieceMove } from "./moveValidation";

export const letterNotation = {
  1: "a",
  2: "b",
  3: "c",
  4: "d",
  5: "e",
  6: "f",
  7: "g",
  8: "h",
};

export const pieceValues = {
  p: 1,
  r: 5,
  n: 3,
  b: 3,
  q: 9,
  k: 0,
};

export const isWhite = (piece) => piece && piece === piece.toUpperCase();
export const isBlack = (piece) => piece && piece === piece.toLowerCase();
export const getPieceColor = (piece) =>
  piece.toUpperCase() === piece ? "white" : "black";
export const isSameColor = (firstPiece, secondPiece) => {
  if (!firstPiece || !secondPiece) return false;
  return getPieceColor(firstPiece) === getPieceColor(secondPiece);
};

export const createNotation = (row, col, selectedPiece, capturedPiece) => {
  const letter = letterNotation[col + 1];
  const number = Math.abs(row - 8);
  if (selectedPiece.piece.toUpperCase() !== "P") {
    if (!capturedPiece)
      return `${selectedPiece.piece.toUpperCase()}${letter}${number}`;
    else return `${selectedPiece.piece.toUpperCase()}x${letter}${number}`;
  } else if (selectedPiece.piece.toUpperCase() === "P") {
    if (!capturedPiece) return `${letter}${number}`;
    else return `${letterNotation[selectedPiece.col + 1]}x${letter}${number}`;
  }
};

// find position of king based on color
export const getKingPostion = (board, color) => {
  const king = color === "white" ? "K" : "k";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === king) {
        return { row, col };
      }
    }
  }
};

// find all positions of piece type
export const getAllPiecePositions = (piece, board) => {
  const piecePositions = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === piece) {
        piecePositions.push({ row, col });
      }
    }
  }
  return piecePositions;
};

// check if last move put king in check
export const checkIfLastMovePutKingInCheck = (row, col, board, color) => {
  const kingPosition = getKingPostion(board, color);
  return (
    canPieceMove(
      row,
      col,
      kingPosition.row,
      kingPosition.col,
      board,
      "placeholder",
      {}
    ) || isKingInCheck(board, color, {})
  );
};

// check if current king is in check
export const isKingInCheck = (board, color, hasMoved) => {
  const kingPosition = getKingPostion(board, color);

  if (!kingPosition) return false; // King not found (should never happen)

  // Check if any opponent's piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (
        piece &&
        isSameColor(piece, board[kingPosition.row][kingPosition.col]) === false
      ) {
        if (
          canPieceMove(
            row,
            col,
            kingPosition.row,
            kingPosition.col,
            board,
            "placeholder",
            hasMoved
          )
        ) {
          console.log("King Is Attacked");
          // every once in awhile the king will be in check
          // when it should not be. Use these values to troubleshoot
          // tough to recreate on command
          console.log(
            "is it bugged?",
            row,
            col,
            kingPosition.row,
            kingPosition.col,
            board,
            "placeholder",
            hasMoved
          );
          return true; // King is under attack
        }
      }
    }
  }

  return false; // King is safe
};

export const isCheckmate = (board, color, hasMoved) => {
  // If not in check, not checkmate
  if (!isKingInCheck(board, color, hasMoved)) return false;
  const kingPosition = getKingPostion(board, color);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (
        piece &&
        isSameColor(piece, board[kingPosition.row][kingPosition.col])
      ) {
        for (let targetRow = 0; targetRow < 8; targetRow++) {
          for (let targetCol = 0; targetCol < 8; targetCol++) {
            if (
              canPieceMove(
                row,
                col,
                targetRow,
                targetCol,
                board,
                "placeholder",
                hasMoved
              )
            ) {
              // Simulate the move
              const newBoard = board.map((row) => [...row]);
              newBoard[targetRow][targetCol] = piece;
              newBoard[row][col] = null;
              if (!isKingInCheck(newBoard, color)) {
                return false; // The king can escape, so not checkmate
              }
            }
          }
        }
      }
    }
  }

  return true; // No legal moves = Checkmate
};

export const getPossibleMoves = (
  board,
  selectedPieceRow,
  selectedPieceCol,
  color,
  enPassantTarget
) => {
  const moves = [];
  const piece = board[selectedPieceRow][selectedPieceCol];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (
        canPieceMove(
          selectedPieceRow,
          selectedPieceCol,
          row,
          col,
          board,
          enPassantTarget,
          {}
        )
      ) {
        const newBoard = board.map((row) => [...row]);
        newBoard[row][col] = piece;
        newBoard[selectedPieceRow][selectedPieceCol] = null;
        if (!isKingInCheck(newBoard, color)) moves.push({ row, col });
      }
    }
  }
  return moves;
};

// Simulates a move to check if the king would be in check
export const simulateMove = (board, startRow, startCol, endRow, endCol) => {
  const newBoard = board.map((row) => [...row]); // Deep copy of board
  newBoard[endRow][endCol] = newBoard[startRow][startCol]; // Move piece
  newBoard[startRow][startCol] = null; // Clear old position
  return newBoard;
};
