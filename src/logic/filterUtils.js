import { makePieceMove } from "./moveValidation";
import { copyBoard, getPieceColor, getPossibleMoves } from "./chessUtils";

export const getSquarePressures = (board, color) => {
  const boardWithPressures = copyBoard(board).map((row) => row.map((col) => 0));
  board.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const piece = board[rowIndex][colIndex];
      let possibleMovesList = [];
      if (piece !== null && color === getPieceColor(piece)) {
        // handle pawns separately to only check diagonal pressures
        if (piece.toLowerCase() === "p") {
        } else {
          const moves = getPossibleMoves(board, rowIndex, colIndex, color);
          moves.forEach((move) => possibleMovesList.push(move));
        }
        console.log(possibleMovesList);
      }
    });
  });
};
