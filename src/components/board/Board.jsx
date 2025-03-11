import React from "react";
import { useGameState } from "../../context/GameStateProvider";
import {
  FaChessPawn,
  FaChessRook,
  FaChessKnight,
  FaChessBishop,
  FaChessQueen,
  FaChessKing,
} from "react-icons/fa6";
import { isWhite, isSameColor } from "../../logic/chessUtils"; // Import helper functions
import "./boardStyles.css";

const pieceIcons = {
  p: <FaChessPawn className="piece black" />,
  r: <FaChessRook className="piece black" />,
  n: <FaChessKnight className="piece black" />,
  b: <FaChessBishop className="piece black" />,
  q: <FaChessQueen className="piece black" />,
  k: <FaChessKing className="piece black" />,
  P: <FaChessPawn className="piece white" />,
  R: <FaChessRook className="piece white" />,
  N: <FaChessKnight className="piece white" />,
  B: <FaChessBishop className="piece white" />,
  Q: <FaChessQueen className="piece white" />,
  K: <FaChessKing className="piece white" />,
};

const Board = () => {
  const { board, setBoard, selectedPiece, setSelectedPiece } = useGameState();

  const handleSquareClick = (row, col) => {
    const piece = board[row][col];

    if (selectedPiece) {
      const {
        row: selectedPieceRow,
        col: selectedPieceCol,
        piece: selectedPieceType,
      } = selectedPiece;

      if (selectedPieceRow === row && selectedPieceCol === col) {
        setSelectedPiece(null);
        return;
      }

      if (isSameColor(selectedPieceType, piece)) {
        return;
      }

      const newBoard = board.map((row) => [...row]);
      newBoard[selectedPieceRow][selectedPieceCol] = null;
      newBoard[row][col] = selectedPieceType;

      setBoard(newBoard);
      setSelectedPiece(null);
    } else if (piece) {
      setSelectedPiece({ row, col, piece });
    }
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isDark = (rowIndex + colIndex) % 2 !== 0;
          const isSelected =
            selectedPiece &&
            selectedPiece.row === rowIndex &&
            selectedPiece.col === colIndex;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`square ${isDark ? "dark" : "light"} ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {piece && pieceIcons[piece]}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Board;
