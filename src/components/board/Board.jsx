import React, { useState } from "react";
import { useGameState } from "../../context/GameStateProvider";

import { canPieceMove, canCastle } from "../../logic/moveValidation";
import {
  isSameColor,
  isKingInCheck,
  isCheckmate,
  createNotation,
} from "../../logic/chessUtils";
import "./boardStyles.css";

import Square from "./square/Square";
import StudyDetails from "../studyDetails/StudyDetails";
import GameButtons from "../gameButtons/GameButtons";
import PromotionModal from "../promotionModal/PromotionModal";
import GameFilters from "../gameFilters/GameFilters";

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
    updateHasMovedForCastling,
    gameIsActive,
    setGameIsActive,
    pov,
    addCapturedPiece,
    pieceIcons,
    movesList,
    setMovesList,
    letterNotation,
  } = useGameState();

  // { row, col, piece }
  const [promotionSquare, setPromotionSquare] = useState(null);

  const handleSquareClick = (row, col) => {
    // track captured piece
    let capturedPiece = null;
    let moveNotation = "";
    // ignore clicks when game isn't active or promotion modal is active
    if (!gameIsActive || promotionSquare) return;

    if (pov === "black") {
      row = Math.abs(row - 7);
      col = Math.abs(col - 7);
    }
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
      capturedPiece = board[row][col];
      if (capturedPiece !== null) {
        addCapturedPiece(
          capturedPiece,
          selectedPieceType === selectedPieceType.toUpperCase()
            ? "white"
            : "black"
        );
      }
      newBoard[row][col] = selectedPieceType;
      moveNotation = createNotation(
        row,
        col,
        selectedPiece,
        capturedPiece,
        letterNotation
      );

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
        capturedPiece = newBoard[(capturedPawnRow, col)];
        newBoard[capturedPawnRow][col] = null; // Remove captured pawn
        moveNotation = createNotation(
          row,
          col,
          selectedPiece,
          capturedPiece,
          letterNotation
        );
      }

      // Check for Pawn Promotion
      const isWhitePromotion = selectedPieceType === "P" && row === 0;
      const isBlackPromotion = selectedPieceType === "p" && row === 7;
      if (isWhitePromotion || isBlackPromotion) {
        setPromotionSquare({ row, col, piece: selectedPieceType });
        setGameIsActive(false);
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
          updateHasMovedForCastling(color);
          if (castlingSide === "kingside") moveNotation = "0-0";
          else if (castlingSide === "queenside") moveNotation = "0-0-0";
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

      // Update hasMoved state for castling if rook or king moves by itself
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
      } else if (selectedPieceType === "K") {
        setHasMoved({ ...hasMoved, whiteKing: true });
      } else if (selectedPieceType === "k") {
        setHasMoved({ ...hasMoved, blackKing: true });
      }
      setBoard(newBoard);
      setSelectedPiece(null);
      // Check for Checkmate
      const opponent = currentPlayer === "white" ? "black" : "white";
      if (isCheckmate(newBoard, opponent, hasMoved)) {
        console.log("Checkmate!");
        setGameIsActive(false);
      }
      setMovesList([...movesList, moveNotation]);
    } else if (piece) {
      setSelectedPiece({ row, col, piece });
    }
  };

  const renderBoard = () => {
    let tempSelectedPiece = { ...selectedPiece };
    let boardForRender = structuredClone(board);
    if (pov === "black") {
      boardForRender = boardForRender.reverse().map((inner) => inner.reverse());
      tempSelectedPiece.row = Math.abs(tempSelectedPiece.row - 7);
      tempSelectedPiece.col = Math.abs(tempSelectedPiece.col - 7);
    }
    return boardForRender.map((row, rowIndex) =>
      row.map((piece, colIndex) => {
        const isDark = (rowIndex + colIndex) % 2 !== 0;
        const isSelected =
          tempSelectedPiece &&
          tempSelectedPiece.row === rowIndex &&
          tempSelectedPiece.col === colIndex;

        return (
          <Square
            key={`${rowIndex}-${colIndex}`}
            isDark={isDark}
            isSelected={isSelected}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
            piece={piece && pieceIcons[piece]}
            row={rowIndex}
            col={colIndex}
          />
        );
      })
    );
  };

  const promotionPieceSelect = (piece) => {
    const newBoard = board.map((row) => [...row]);
    newBoard[promotionSquare.row][promotionSquare.col] =
      promotionSquare.piece === "P" ? piece.toUpperCase() : piece.toLowerCase();
    newBoard[selectedPiece.row][selectedPiece.col] = null;
    setBoard(newBoard);
    setPromotionSquare(null);
    setSelectedPiece(null);
    setGameIsActive(true);
  };

  return (
    <div className="board-container">
      {promotionSquare && <div className="board-overlay"></div>}
      <div className="board">
        {renderBoard()}
        <GameFilters />
        <StudyDetails />
        <GameButtons />
      </div>
      {promotionSquare && <PromotionModal onSelect={promotionPieceSelect} />}
    </div>
  );
};

export default Board;
