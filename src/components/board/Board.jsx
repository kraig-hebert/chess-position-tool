import React, { useState } from "react";
import { useGameState } from "../../context/GameStateProvider";

import { makePieceMove } from "../../logic/moveValidation";
import {
  getPieceColor,
  isSameColor,
  isKingInCheck,
  isCheckmate,
  createNotation,
  getPossibleMoves,
  copyBoard,
} from "../../logic/chessUtils";
import { getSquarePressures } from "../../logic/filterUtils";
import "./boardStyles.css";

import Square from "./square/Square";
import StudyDetails from "../studyDetails/StudyDetails";
import GameButtons from "../gameButtons/GameButtons";
import PromotionModal from "../promotionModal/PromotionModal";
import GameFilters from "../gameFilters/GameFilters";
import EditPanel from "../editPanel/EditPanel";

const Board = () => {
  const {
    activeColor,
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
    capturedPieces,
    setCapturedPieces,
    pieceIcons,
    movesList,
    setMovesList,
    toggleActiveColor,
    setActiveMove,
    getNextGroupedMovesListIndex,
    activeFilters,
    isEditMode,
    activeAction,
    selectedMoveSquare,
    setSelectedMoveSquare,
    selectedPieceType,
  } = useGameState();

  // { row, col, piece }
  const [promotionSquare, setPromotionSquare] = useState(null);
  const tempCapturedPieces = { ...capturedPieces };

  const handleSquareClick = (row, col) => {
    // ignore clicks when promotion modal is active
    if (promotionSquare) return;

    /*
      - flip click values when board is rendered from black pov
      - values will come in from onClick with board upsidedown
    */
    if (pov === "black") {
      row = Math.abs(row - 7);
      col = Math.abs(col - 7);
    }

    // if in edit mode, don't validate moves
    if (isEditMode) {
      const clickedPiece = board[row][col];

      if (activeAction === "trash" && clickedPiece) {
        const newBoard = copyBoard(board);
        newBoard[row][col] = null;
        setBoard(newBoard);
        return;
      }

      if (activeAction === "move") {
        if (selectedMoveSquare) {
          // Second click - only move to empty square
          if (!clickedPiece) {
            const newBoard = copyBoard(board);
            newBoard[row][col] = selectedMoveSquare.piece;
            newBoard[selectedMoveSquare.row][selectedMoveSquare.col] = null;
            setBoard(newBoard);
            setSelectedMoveSquare(null);
          } else if (clickedPiece) {
            // First click - select the piece
            setSelectedMoveSquare({ row, col, piece: clickedPiece });
          }
        } else setSelectedMoveSquare({ row, col, piece: clickedPiece });
        return;
      }

      if (activeAction === "add" && selectedPieceType && !clickedPiece) {
        const newBoard = copyBoard(board);
        newBoard[row][col] = selectedPieceType;
        setBoard(newBoard);
        return;
      }
      return;
    }

    // ignore clicks when game isn't active
    if (!gameIsActive) return;

    const nextMove = board[row][col];

    /* 
      - if there is a selectedPiece perform moveValidation
      - else setSelectedPiece
    */
    if (selectedPiece) {
      // check for same square/color blocking moves
      if (
        (selectedPiece.row === row && selectedPiece.col === col) ||
        isSameColor(selectedPiece.piece, nextMove)
      ) {
        setSelectedPiece(null);
        return; // return and block move
      }

      const move = makePieceMove(
        selectedPiece.row,
        selectedPiece.col,
        row,
        col,
        board,
        { enPassantTarget, hasMoved, validateCheckAndCastle: true }
      );

      if (!move || isKingInCheck(move.newBoard, activeColor)) {
        setSelectedPiece(null);
        return;
      }

      // handle setting enPassantTarget
      if (move.enPassantTarget) setEnPassantTarget(move.enPassantTarget);
      // store captured pieces temporarily for immediate use
      if (move.capturedPiece) {
        tempCapturedPieces[activeColor] = [
          ...tempCapturedPieces[activeColor],
          move.capturedPiece,
        ];
      }
      setCapturedPieces({ ...tempCapturedPieces });

      // handle castling
      if (move.castlingSide) updateHasMovedForCastling(activeColor);

      let moveNotation = createNotation(
        row,
        col,
        selectedPiece,
        move.capturedPiece,
        board,
        move.castlingSide
      );

      // Update hasMoved state for castling if rook or king moves by itself
      if (selectedPiece.piece === "R") {
        if (selectedPiece.row === 7 && selectedPiece.col === 0) {
          setHasMoved({ ...hasMoved, whiteRookQueenside: true });
        } else if (selectedPiece.row === 7 && selectedPiece.col === 7) {
          setHasMoved({ ...hasMoved, whiteRookKingside: true });
        }
      } else if (selectedPiece.piece === "r") {
        if (selectedPiece.row === 0 && selectedPiece.col === 0) {
          setHasMoved({ ...hasMoved, blackRookQueenside: true });
        } else if (selectedPiece.row === 0 && selectedPiece.col === 7) {
          setHasMoved({ ...hasMoved, blackRookKingside: true });
        }
      } else if (selectedPiece.piece === "K" && !move.castlingSide) {
        setHasMoved({ ...hasMoved, whiteKing: true });
      } else if (selectedPiece.piece === "k" && !move.castlingSide) {
        setHasMoved({ ...hasMoved, blackKing: true });
      }

      // Check for Pawn Promotion
      const isWhitePromotion = selectedPiece.piece === "P" && row === 0;
      const isBlackPromotion = selectedPiece.piece === "p" && row === 7;
      if (isWhitePromotion || isBlackPromotion) {
        setPromotionSquare({
          row,
          col,
          piece: selectedPiece.piece,
          moveNotation,
        });
        setGameIsActive(false);
        return; // Stop the move until promotion is chosen
      }

      setBoard(move.newBoard);
      setSelectedPiece(null);
      // Check for Checkmate
      const opponentColor = activeColor === "white" ? "black" : "white";
      if (isKingInCheck(move.newBoard, opponentColor)) moveNotation += "+";
      if (isCheckmate(move.newBoard, opponentColor, hasMoved)) {
        console.log("Checkmate!");
        setGameIsActive(false);
        moveNotation = moveNotation.slice(0, -1); // remove + from initial check
        moveNotation += "#";
      }
      const { groupIndex, moveIndex } = getNextGroupedMovesListIndex();
      setActiveMove({ groupIndex, moveIndex });
      setMovesList([
        ...movesList,
        {
          moveNotation,
          board: move.newBoard,
          capturedPieces: tempCapturedPieces,
        },
      ]);

      toggleActiveColor();
    } else if (nextMove && getPieceColor(nextMove) === activeColor) {
      setSelectedPiece({ row, col, piece: nextMove });
    }
  };

  const renderBoard = () => {
    let tempSelectedPiece = { ...selectedPiece };
    let boardForRender = structuredClone(board);
    // Make a copy of the selectedMoveSquare for rendering
    let tempSelectedMoveSquare = selectedMoveSquare
      ? { ...selectedMoveSquare }
      : null;
    let possibleMoves = [];
    // Initialize as 8x8 arrays filled with zeros
    let whitePressure = board.map((row) => row.map((col) => 0));
    let blackPressure = board.map((row) => row.map((col) => 0));

    if (!isEditMode) {
      if (selectedPiece) {
        possibleMoves = getPossibleMoves(
          board,
          tempSelectedPiece.row,
          tempSelectedPiece.col,
          activeColor,
          { enPassantTarget, hasMoved, validateCheckAndCastle: true }
        );
      }
      // Only calculate pressures when not in edit mode
      whitePressure = getSquarePressures(board, "white");
      blackPressure = getSquarePressures(board, "black");
    }

    if (pov === "black") {
      boardForRender = boardForRender.reverse().map((inner) => inner.reverse());

      // Adjust coordinates for both game mode and edit mode
      if (!isEditMode) {
        whitePressure = whitePressure.reverse().map((inner) => inner.reverse());
        blackPressure = blackPressure.reverse().map((inner) => inner.reverse());
        tempSelectedPiece.row = Math.abs(tempSelectedPiece.row - 7);
        tempSelectedPiece.col = Math.abs(tempSelectedPiece.col - 7);
        possibleMoves = possibleMoves.map((move) => {
          return { row: Math.abs(move.row - 7), col: Math.abs(move.col - 7) };
        });
      }

      // Also adjust the selectedMoveSquare coordinates when in edit mode
      if (isEditMode && tempSelectedMoveSquare) {
        tempSelectedMoveSquare.row = Math.abs(tempSelectedMoveSquare.row - 7);
        tempSelectedMoveSquare.col = Math.abs(tempSelectedMoveSquare.col - 7);
      }
    }

    return boardForRender.map((row, rowIndex) =>
      row.map((piece, colIndex) => {
        const isDark = (rowIndex + colIndex) % 2 !== 0;
        const isSelected =
          (!isEditMode &&
            tempSelectedPiece &&
            tempSelectedPiece.row === rowIndex &&
            tempSelectedPiece.col === colIndex) ||
          (isEditMode &&
            activeAction === "move" &&
            tempSelectedMoveSquare &&
            tempSelectedMoveSquare.row === rowIndex &&
            tempSelectedMoveSquare.col === colIndex);

        return (
          <Square
            key={`${rowIndex}-${colIndex}`}
            isDark={isDark}
            isLegal={
              !isEditMode &&
              possibleMoves.some(
                (position) =>
                  position.row === rowIndex && position.col === colIndex
              )
            }
            isSelected={isSelected}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
            piece={piece && pieceIcons[piece]}
            whitePressure={whitePressure}
            blackPressure={blackPressure}
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

    const { groupIndex, moveIndex } = getNextGroupedMovesListIndex();
    setActiveMove({ groupIndex, moveIndex });
    setMovesList([
      ...movesList,
      {
        moveNotation: `${promotionSquare.moveNotation}=${piece.toUpperCase()}`,
        board: newBoard,
        capturedPieces: tempCapturedPieces,
      },
    ]);
    setBoard(newBoard);
    setPromotionSquare(null);
    setSelectedPiece(null);
    setGameIsActive(true);
    toggleActiveColor();
  };

  return (
    <div className="board-container">
      {promotionSquare && <div className="board-overlay"></div>}
      <div className="board">
        {renderBoard()}
        {isEditMode ? <EditPanel /> : <GameFilters />}
        <StudyDetails />
        <GameButtons />
      </div>
      {promotionSquare && <PromotionModal onSelect={promotionPieceSelect} />}
    </div>
  );
};

export default Board;
