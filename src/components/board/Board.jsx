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

import { canPieceMove, canCastle } from "../../logic/moveValidation";
import {
  isSameColor,
  isKingInCheck,
  isCheckmate,
} from "../../logic/chessUtils";
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
    updateHasMoved,
    gameIsActive,
    setGameIsActive,
  } = useGameState();

  const [promotionSquare, setPromotionSquare] = useState(null);

  const handleSquareClick = (row, col) => {
    // ignore clicks when game isn't active
    if (!gameIsActive) return;
    // ignore clicks when modal is active
    if (promotionSquare) return;

    const piece = board[row][col];

    if (selectedPiece) {
      const {
        row: selectedPieceRow,
        col: selectedPieceCol,
        piece: selectedPieceType,
      } = selectedPiece;

      // if move is same square as selected piece block move
      if (selectedPieceRow === row && selectedPieceCol === col) {
        setSelectedPiece(null);
        return;
      }

      if (isSameColor(selectedPieceType, piece)) {
        setSelectedPiece(null);
        return;
      }

      if (
        !canPieceMove(
          selectedPieceRow,
          selectedPieceCol,
          row,
          col,
          board,
          enPassantTarget,
          hasMoved
        )
      ) {
        setSelectedPiece(null);
        return; // Invalid move, exit function
      }

      const newBoard = board.map((row) => [...row]);
      newBoard[selectedPieceRow][selectedPieceCol] = null;
      newBoard[row][col] = selectedPieceType;

      const currentPlayer =
        selectedPieceType === selectedPieceType.toUpperCase()
          ? "white"
          : "black";
      if (isKingInCheck(newBoard, currentPlayer, hasMoved)) {
        console.log("Move rejected: King would be in check");
        setSelectedPiece(null);
        return; // Block the move
      }

      // handle En Passant Capture
      if (
        selectedPieceType.toLowerCase() == "p" &&
        enPassantTarget &&
        enPassantTarget.row === row &&
        enPassantTarget.col === col
      ) {
        const capturedPawnRow = selectedPieceType === "P" ? row + 1 : row - 1;
        newBoard[capturedPawnRow][col] = null; // Remove captured pawn
      }

      //  Check for Pawn Promotion
      const isWhitePromotion = selectedPieceType === "P" && row === 0;
      const isBlackPromotion = selectedPieceType === "p" && row === 7;
      if (isWhitePromotion || isBlackPromotion) {
        // Replace pawn with a queen for now (later allow choice)
        setPromotionSquare({ row, col, piece: selectedPieceType });
        return; // Stop the move until promotion is chosen
      }

      // Handle Castling
      if (
        selectedPieceType.toLowerCase() === "k" &&
        Math.abs(selectedPieceCol - col) === 2
      ) {
        const color = selectedPieceType === "K" ? "white" : "black";
        const castlingSide =
          col === 6 ? "kingside" : col === 2 ? "queenside" : null;
        const castlingMove = canCastle(color, castlingSide, board, hasMoved);

        if (castlingMove) {
          const { kingTo, rookTo } = castlingMove;
          newBoard[kingTo[0]][kingTo[1]] = selectedPieceType; // Move the king
          newBoard[rookTo[0]][rookTo[1]] =
            board[selectedPieceRow][castlingSide === "kingside" ? 7 : 0]; // Move the rook
          newBoard[selectedPieceRow][castlingSide === "kingside" ? 7 : 0] =
            null; // Remove old rook position
          updateHasMoved(color);
        }
      }

      // Check if this move creates an en passant opportunity
      if (
        selectedPieceType.toLowerCase() === "p" &&
        Math.abs(selectedPieceRow - row) === 2
      ) {
        setEnPassantTarget({ row: (selectedPieceRow + row) / 2, col }); // Middle square is where en passant can happen
      } else {
        setEnPassantTarget(null); // Reset en passant if it's not a two-square move
      }

      // Update hasMoved state for castling
      if (selectedPieceType === "R") {
        if (selectedPieceRow === 7 && selectedPieceCol === 0) {
          setHasMoved({ ...hasMoved, whiteRookQueenside: true });
        } else if (selectedPieceRow === 7 && selectedPieceCol === 7) {
          setHasMoved({ ...hasMoved, whiteRookKingside: true });
        }
      } else if (selectedPieceType === "r") {
        if (selectedPieceRow === 0 && selectedPieceCol === 0) {
          setHasMoved({ ...hasMoved, blackRookQueenside: true });
        } else if (selectedPieceRow === 0 && selectedPieceCol === 7) {
          setHasMoved({ ...hasMoved, blackRookKingside: true });
        }
      }
      setBoard(newBoard);
      setSelectedPiece(null);
      // Check for Checkmate
      const opponent = currentPlayer === "white" ? "black" : "white";
      if (isCheckmate(newBoard, opponent, hasMoved)) {
        console.log("Checkmate!");
        setGameIsActive(false);
      }
    } else if (piece) {
      setSelectedPiece({ row, col, piece });
    }
  };

  return (
    <div className="board-container">
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
