import {
  copyBoard,
  getPieceColor,
  getPossibleMoves,
  getPossiblePawnDiagonalPressures,
} from "./chessUtils";

export const getSquarePressures = (board, color) => {
  const boardWithPressures = copyBoard(board).map((row) => row.map((col) => 0));
  let possibleMovesList = [];

  board.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const piece = board[rowIndex][colIndex];
      if (piece !== null && color === getPieceColor(piece)) {
        // handle pawns separately to only check diagonal pressures
        if (piece.toLowerCase() === "p") {
          const moves = getPossiblePawnDiagonalPressures(
            rowIndex,
            colIndex,
            color
          );
          moves.forEach((move) => possibleMovesList.push(move));
        } else {
          const moves = getPossibleMoves(board, rowIndex, colIndex, color, {
            coverageValidation: true,
          });
          moves.forEach((move) => possibleMovesList.push(move));
        }
      }
    });
  });
  possibleMovesList.forEach(
    (move) => (boardWithPressures[move.row][move.col] += 1)
  );
  return boardWithPressures;
};
