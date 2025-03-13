import { canPieceMove } from "./moveValidation";

// Check if a piece is white...uppercase = white
export const isWhite = (piece) => piece && piece === piece.toUpperCase();

// Check if two pieces are the same color
export const isSameColor = (firstPiece, secondPiece) => {
  if (!firstPiece || !secondPiece) return false;
  return isWhite(firstPiece) === isWhite(secondPiece);
};

export const isKingInCheck = (board, color, hasMoved) => {
  let kingPosition = null;

  // Find the king's position
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === (color === "white" ? "K" : "k")) {
        kingPosition = { row, col };
        break;
      }
    }
  }

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
          return true; // King is under attack
        }
      }
    }
  }

  return false; // King is safe
};

// Simulates a move to check if the king would be in check
export const simulateMove = (board, startRow, startCol, endRow, endCol) => {
  const newBoard = board.map((row) => [...row]); // Deep copy of board
  newBoard[endRow][endCol] = newBoard[startRow][startCol]; // Move piece
  newBoard[startRow][startCol] = null; // Clear old position
  return newBoard;
};
