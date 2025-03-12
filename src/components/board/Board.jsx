import React, { useState } from "react";
import { useGameState } from "../../context/GameStateProvider";
import {
  FaChessPawn,
  FaChessRook,
  FaChessKnight,
  FaChessBishop,
  FaChessQueen,
  FaChessKing,
} from "react-icons/fa6";

import {
  canBishopMove,
  canCastle,
  canKingMove,
  canKnightMove,
  canPawnMove,
  canRookMove,
  canQueenMove,
} from "../../logic/moveValidation";
import { isSameColor } from "../../logic/chessUtils";
import "./boardStyles.css";

import PromotionModal from "../promotionModal/PromotionModal";

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
  const {
    board,
    setBoard,
    selectedPiece,
    setSelectedPiece,
    hasMoved,
    setHasMoved,
    enPassantTarget,
    setEnPassantTarget,
  } = useGameState();

  const [promotionSquare, setPromotionSquare] = useState(null);

  const handleSquareClick = (row, col) => {
    // ignore clicks when modal is active
    if (promotionSquare) return;

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
        setSelectedPiece(null);
        return;
      }

      // check is move is valid according to piece
      switch (selectedPieceType.toLowerCase()) {
        case "p":
          if (
            !canPawnMove(
              selectedPieceRow,
              selectedPieceCol,
              row,
              col,
              board,
              enPassantTarget
            )
          ) {
            setSelectedPiece(null);
            return; // Invalid move, exit function
          }
          const newBoard = board.map((row) => [...row]);
          // Handle en passant capture
          if (
            enPassantTarget &&
            enPassantTarget.row === row &&
            enPassantTarget.col === col
          ) {
            const capturedPawnRow =
              selectedPieceType === "P" ? row + 1 : row - 1;
            newBoard[capturedPawnRow][col] = null; // Remove captured pawn
          }

          // ✅ Check for Pawn Promotion
          const isWhitePromotion = selectedPieceType === "P" && row === 0;
          const isBlackPromotion = selectedPieceType === "p" && row === 7;
          if (isWhitePromotion || isBlackPromotion) {
            // Replace pawn with a queen for now (later allow choice)
            setPromotionSquare({ row, col, piece: selectedPieceType });
            return; // Stop the move until promotion is chosen
          }

          newBoard[selectedPieceRow][selectedPieceCol] = null;
          newBoard[row][col] = selectedPieceType;

          // Check if this move creates an en passant opportunity
          if (Math.abs(selectedPieceRow - row) === 2) {
            setEnPassantTarget({ row: (selectedPieceRow + row) / 2, col }); // Middle square is where en passant can happen
          } else {
            setEnPassantTarget(null); // Reset en passant if it's not a two-square move
          }

          setBoard(newBoard);
          setSelectedPiece(null);
          return;

        case "r":
          if (
            !canRookMove(selectedPieceRow, selectedPieceCol, row, col, board)
          ) {
            setSelectedPiece(null);
            return; // Invalid move, exit function
          }
          break;

        case "b":
          if (
            !canBishopMove(selectedPieceRow, selectedPieceCol, row, col, board)
          ) {
            setSelectedPiece(null);
            return; // Invalid move, exit function
          }
          break;

        case "n":
          if (
            !canKnightMove(selectedPieceRow, selectedPieceCol, row, col, board)
          ) {
            setSelectedPiece(null);
            return; // Invalid move, exit function
          }
          break;

        case "q":
          if (
            !canQueenMove(selectedPieceRow, selectedPieceCol, row, col, board)
          ) {
            setSelectedPiece(null);
            return; // Invalid move, exit function
          }
          break;

        case "k":
          if (
            !canKingMove(selectedPieceRow, selectedPieceCol, row, col, board)
          ) {
            // Check for Castling
            const color = selectedPieceType === "K" ? "white" : "black";
            let castlingSide =
              col === 6 ? "kingside" : col === 2 ? "queenside" : null;

            if (castlingSide) {
              const castlingMove = canCastle(
                color,
                castlingSide,
                board,
                hasMoved
              );
              if (castlingMove) {
                const { kingTo, rookTo } = castlingMove;

                const newBoard = board.map((r) => [...r]); // Create deep copy
                newBoard[selectedPieceRow][selectedPieceCol] = null;
                newBoard[kingTo[0]][kingTo[1]] = selectedPieceType;
                newBoard[rookTo[0]][rookTo[1]] =
                  board[selectedPieceRow][castlingSide === "kingside" ? 7 : 0]; // Move the rook
                newBoard[selectedPieceRow][
                  castlingSide === "kingside" ? 7 : 0
                ] = null;

                setBoard(newBoard);
                setSelectedPiece(null);
                return;
              }
            }

            setSelectedPiece(null);
            return;
          }
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
    <div className="board-container">
      // overlay will block clicks
      {promotionSquare && <div className="board-overlay"></div>}
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
      {promotionSquare && (
        <PromotionModal
          onSelect={(piece) => {
            const newBoard = board.map((row) => [...row]);
            newBoard[promotionSquare.row][promotionSquare.col] =
              promotionSquare.piece === "P"
                ? piece.toUpperCase()
                : piece.toLowerCase();
            newBoard[selectedPiece.row][selectedPiece.col] = null;
            setBoard(newBoard);
            setPromotionSquare(null);
            setSelectedPiece(null);
          }}
        />
      )}
    </div>
  );
};

export default Board;
