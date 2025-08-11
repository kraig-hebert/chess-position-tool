import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEditMode } from "../../hooks/useEditMode";
import { useStudyMode } from "../../hooks/useStudyMode";
import {
  selectGameIsActive,
  setGameIsActive,
  selectHasMoved,
  selectCapturedPieces,
  setMovesList,
  setActiveMove,
  selectMovesList,
  selectNextGroupedMovesListIndex,
  selectActiveColor,
  toggleActiveColor,
  selectEnPassantTarget,
  selectBoard,
  setBoard,
  selectSelectedPiece,
  resetSelectedPiece,
} from "../../store/slices/gameSlice";
import {
  getPossibleMoves,
  copyBoard,
  updateSanSuffix,
} from "../../logic/chessUtils";
import { getSquarePressures } from "../../logic/filterUtils";
import {
  selectPieceIcons,
  selectActiveEditAction,
  selectSelectedPieceTypeForEdit,
  selectEnPassantEnabled,
  selectPossibleEnPassantTargets,
  selectSelectedEnPassantTarget,
  selectSelectedEditMoveSquare,
  setSelectedEditMoveSquare,
  selectPov,
  selectIsEditMode,
  setArrowDrawing,
  updateArrowEndSquare,
  addArrow,
  resetArrowDrawing,
  selectArrowDrawing,
  clearArrows,
  selectArrows,
} from "../../store/slices/uiSlice";
import "./boardStyles.css";

import Square from "./square/Square";
import ArrowLayer from "./arrowLayer/ArrowLayer";
import StudyDetails from "../studyDetails/StudyDetails";
import GameButtons from "../gameButtons/GameButtons";
import PromotionModal from "../promotionModal/PromotionModal";
import GameFilters from "../gameFilters/GameFilters";
import EditPanel from "../editPanel/EditPanel";

const SQUARE_SIZE = 85; // Match the grid size in boardStyles.css

const Board = () => {
  const dispatch = useDispatch();
  const isEditMode = useSelector(selectIsEditMode);
  const pov = useSelector(selectPov);
  const board = useSelector(selectBoard);
  const gameIsActive = useSelector(selectGameIsActive);
  const pieceIcons = useSelector(selectPieceIcons);
  const hasMoved = useSelector(selectHasMoved);
  const capturedPieces = useSelector(selectCapturedPieces);
  const activeEditAction = useSelector(selectActiveEditAction);
  const movesList = useSelector(selectMovesList);
  const nextIndex = useSelector(selectNextGroupedMovesListIndex);
  const selectedEditMoveSquare = useSelector(selectSelectedEditMoveSquare);
  const activeColor = useSelector(selectActiveColor);
  const enPassantTarget = useSelector(selectEnPassantTarget);
  const selectedPiece = useSelector(selectSelectedPiece);
  const arrowDrawing = useSelector(selectArrowDrawing);
  const arrows = useSelector(selectArrows);
  // { row, col, piece }
  const [promotionSquare, setPromotionSquare] = useState(null);
  const tempCapturedPieces = { ...capturedPieces };

  const { handleEditModeClick, getEnPassantTargetSquare } = useEditMode();
  const { handleStudyModeClick } = useStudyMode();

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

    // If currently drawing an arrow, cancel drawing on left click
    if (arrowDrawing.isDrawing) {
      dispatch(resetArrowDrawing());
      return;
    }

    // if in edit mode, don't validate moves
    if (isEditMode) {
      handleEditModeClick(row, col);
      return;
    }

    handleStudyModeClick(row, col, promotionSquare, setPromotionSquare);
  };

  const renderBoard = () => {
    let tempSelectedPiece = { ...selectedPiece };
    let boardForRender = structuredClone(board);
    let possibleMoves = [];
    // Initialize as 8x8 arrays filled with zeros
    let whitePressure = board.map((row) => row.map((col) => 0));
    let blackPressure = board.map((row) => row.map((col) => 0));

    // For en passant target highlighting
    let enPassantTargetSquare = isEditMode ? getEnPassantTargetSquare() : null;

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
        if (selectedPiece) {
          tempSelectedPiece.row = Math.abs(tempSelectedPiece.row - 7);
          tempSelectedPiece.col = Math.abs(tempSelectedPiece.col - 7);
        }
        possibleMoves = possibleMoves.map((move) => {
          return { row: Math.abs(move.row - 7), col: Math.abs(move.col - 7) };
        });
      }

      // Adjust en passant target coordinates if board is flipped
      if (enPassantTargetSquare) {
        enPassantTargetSquare.row = Math.abs(enPassantTargetSquare.row - 7);
        enPassantTargetSquare.col = Math.abs(enPassantTargetSquare.col - 7);
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
            activeEditAction === "move" &&
            selectedEditMoveSquare &&
            (pov === "black"
              ? Math.abs(selectedEditMoveSquare.row - 7) === rowIndex &&
                Math.abs(selectedEditMoveSquare.col - 7) === colIndex
              : selectedEditMoveSquare.row === rowIndex &&
                selectedEditMoveSquare.col === colIndex));

        // Check if this square is the selected en passant target
        const isEnPassantTarget =
          isEditMode &&
          enPassantTargetSquare &&
          enPassantTargetSquare.row === rowIndex &&
          enPassantTargetSquare.col === colIndex;

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
            isEnPassantTarget={isEnPassantTarget}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
            onContextMenu={(e) => handleRightMouseDown(e, rowIndex, colIndex)}
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
    const newBoard = copyBoard(board);
    newBoard[promotionSquare.row][promotionSquare.col] =
      promotionSquare.piece === "P" ? piece.toUpperCase() : piece.toLowerCase();
    newBoard[selectedPiece.row][selectedPiece.col] = null;

    dispatch(setActiveMove(nextIndex));
    const opponentColor = activeColor === "white" ? "black" : "white";
    const moveNotation = updateSanSuffix({
      baseSan: promotionSquare.moveNotation,
      boardAfter: newBoard,
      opponentColor,
      hasMoved,
      promotionPiece: piece,
    });
    dispatch(
      setMovesList([
        ...movesList,
        { moveNotation, board: newBoard, capturedPieces: tempCapturedPieces },
      ])
    );
    dispatch(setBoard(newBoard));
    setPromotionSquare(null);
    dispatch(resetSelectedPiece());
    dispatch(setGameIsActive(true));
    dispatch(toggleActiveColor());
  };

  // Function to get board coordinates from mouse event
  const getSquareFromEvent = (e) => {
    // Get the board element
    const boardElement = document.querySelector(".board");
    if (!boardElement) return null;

    const boardRect = boardElement.getBoundingClientRect();
    const x = e.clientX - boardRect.left;
    const y = e.clientY - boardRect.top;

    const col = Math.floor(x / SQUARE_SIZE);
    const row = Math.floor(y / SQUARE_SIZE);

    // Validate the coordinates are within bounds
    if (row < 0 || row >= 8 || col < 0 || col >= 8) return null;

    // Only transform coordinates if we're not drawing an arrow
    if (!arrowDrawing.isDrawing && pov === "black") {
      return {
        row: Math.abs(row - 7),
        col: Math.abs(col - 7),
      };
    }

    return { row, col };
  };

  useEffect(() => {
    if (!arrowDrawing.isDrawing) return;

    const boardElement = document.querySelector(".board");
    if (!boardElement) return;

    const handleMouseMove = (e) => {
      const square = getSquareFromEvent(e);
      if (square) {
        dispatch(updateArrowEndSquare(square));
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 2) {
        const endSquare = getSquareFromEvent(e);

        if (
          endSquare &&
          !(
            endSquare.row === arrowDrawing.startSquare.row &&
            endSquare.col === arrowDrawing.startSquare.col
          )
        ) {
          dispatch(
            addArrow({
              start: arrowDrawing.startSquare,
              end: endSquare,
            })
          );
        }
        dispatch(resetArrowDrawing());
      }
    };

    boardElement.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      boardElement.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [arrowDrawing.isDrawing, arrowDrawing.startSquare, dispatch, pov]);

  const handleRightMouseDown = (e, row, col) => {
    if (e.button !== 2) return;

    e.preventDefault();
    e.stopPropagation();

    const piece = board[row][col];
    if (!piece) return;

    // For arrow drawing start, use the raw coordinates from the Square component
    dispatch(
      setArrowDrawing({
        isDrawing: true,
        startSquare: { row, col },
        currentEndSquare: { row, col },
      })
    );
  };

  return (
    <div className="board-container">
      {promotionSquare && <div className="board-overlay"></div>}
      <div
        className="board"
        data-pov={pov}
        onMouseDown={(e) => {
          if (e.button === 2) {
            e.preventDefault();
            e.stopPropagation();
          } else if (e.button === 0) {
            // Left click anywhere: cancel drawing and clear arrows if present
            if (arrowDrawing.isDrawing) dispatch(resetArrowDrawing());
            if (arrows && arrows.length > 0) dispatch(clearArrows());
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
      >
        {renderBoard()}
        <ArrowLayer />
        {isEditMode ? <EditPanel /> : <GameFilters />}
        <StudyDetails />
        <GameButtons />
      </div>
      {promotionSquare && <PromotionModal onSelect={promotionPieceSelect} />}
    </div>
  );
};

export default Board;
