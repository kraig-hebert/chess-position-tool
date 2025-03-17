import { canPieceMove } from "./moveValidation";

// uppercase = white
export const isWhite = (piece) => piece && piece === piece.toUpperCase();

// Check if two pieces are the same color
export const isSameColor = (firstPiece, secondPiece) => {
  if (!firstPiece || !secondPiece) return false;
  return isWhite(firstPiece) === isWhite(secondPiece);
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
  if (!isKingInCheck(board, color)) return false; // If not in check, not checkmate
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

// Simulates a move to check if the king would be in check
export const simulateMove = (board, startRow, startCol, endRow, endCol) => {
  const newBoard = board.map((row) => [...row]); // Deep copy of board
  newBoard[endRow][endCol] = newBoard[startRow][startCol]; // Move piece
  newBoard[startRow][startCol] = null; // Clear old position
  return newBoard;
};
