import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectGameIsActive,
  setGameIsActive,
  selectHasMoved,
  setHasMoved,
  selectCapturedPieces,
  setCapturedPieces,
  setMovesList,
  setActiveMove,
  selectMovesList,
  selectNextGroupedMovesListIndex,
  selectActiveColor,
  toggleActiveColor,
  selectEnPassantTarget,
  setEnPassantTarget,
  selectBoard,
  setBoard,
  selectSelectedPiece,
  setSelectedPiece,
  resetSelectedPiece,
} from "../../store/slices/gameSlice";
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
} from "../../store/slices/uiSlice";
import "./boardStyles.css";

import Square from "./square/Square";
import StudyDetails from "../studyDetails/StudyDetails";
import GameButtons from "../gameButtons/GameButtons";
import PromotionModal from "../promotionModal/PromotionModal";
import GameFilters from "../gameFilters/GameFilters";
import EditPanel from "../editPanel/EditPanel";

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
  const selectedPieceTypeForEdit = useSelector(selectSelectedPieceTypeForEdit);
  const enPassantEnabled = useSelector(selectEnPassantEnabled);
  const possibleEnPassantTargets = useSelector(selectPossibleEnPassantTargets);
  const selectedEnPassantTarget = useSelector(selectSelectedEnPassantTarget);
  const movesList = useSelector(selectMovesList);
  const nextIndex = useSelector(selectNextGroupedMovesListIndex);
  const selectedEditMoveSquare = useSelector(selectSelectedEditMoveSquare);
  const activeColor = useSelector(selectActiveColor);
  const enPassantTarget = useSelector(selectEnPassantTarget);
  const selectedPiece = useSelector(selectSelectedPiece);
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

      if (activeEditAction === "trash" && clickedPiece) {
        const newBoard = copyBoard(board);
        newBoard[row][col] = null;
        dispatch(setBoard(newBoard));
        return;
      }

      if (activeEditAction === "move") {
        if (selectedEditMoveSquare) {
          // Second click - only move to empty square
          if (!clickedPiece) {
            const newBoard = copyBoard(board);
            newBoard[row][col] = selectedEditMoveSquare.piece;
            newBoard[selectedEditMoveSquare.row][selectedEditMoveSquare.col] =
              null;
            dispatch(setBoard(newBoard));
            dispatch(setSelectedEditMoveSquare(null));
          } else if (clickedPiece) {
            // First click - select the piece
            dispatch(
              setSelectedEditMoveSquare({ row, col, piece: clickedPiece })
            );
          }
        } else
          dispatch(
            setSelectedEditMoveSquare({ row, col, piece: clickedPiece })
          );
        return;
      }

      if (
        activeEditAction === "add" &&
        selectedPieceTypeForEdit &&
        !clickedPiece
      ) {
        const newBoard = copyBoard(board);
        newBoard[row][col] = selectedPieceTypeForEdit;
        dispatch(setBoard(newBoard));
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
        dispatch(resetSelectedPiece());
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
        dispatch(resetSelectedPiece());
        return;
      }

      // handle setting enPassantTarget
      if (move.enPassantTarget)
        dispatch(setEnPassantTarget(move.enPassantTarget));
      // store captured pieces temporarily for immediate use
      if (move.capturedPiece) {
        tempCapturedPieces[activeColor] = [
          ...tempCapturedPieces[activeColor],
          move.capturedPiece,
        ];
      }
      dispatch(setCapturedPieces({ ...tempCapturedPieces }));

      // handle castling
      if (move.castlingSide) {
        if (activeColor === "white")
          dispatch(setHasMoved({ ...hasMoved, whiteKing: true }));
        else dispatch(setHasMoved({ ...hasMoved, blackKing: true }));
      }

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
          dispatch(setHasMoved({ ...hasMoved, whiteRookQueenside: true }));
        } else if (selectedPiece.row === 7 && selectedPiece.col === 7) {
          dispatch(setHasMoved({ ...hasMoved, whiteRookKingside: true }));
        }
      } else if (selectedPiece.piece === "r") {
        if (selectedPiece.row === 0 && selectedPiece.col === 0) {
          dispatch(setHasMoved({ ...hasMoved, blackRookQueenside: true }));
        } else if (selectedPiece.row === 0 && selectedPiece.col === 7) {
          dispatch(setHasMoved({ ...hasMoved, blackRookKingside: true }));
        }
      } else if (selectedPiece.piece === "K" && !move.castlingSide) {
        dispatch(setHasMoved({ ...hasMoved, whiteKing: true }));
      } else if (selectedPiece.piece === "k" && !move.castlingSide) {
        dispatch(setHasMoved({ ...hasMoved, blackKing: true }));
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
        dispatch(setGameIsActive(false));
        return; // Stop the move until promotion is chosen
      }

      dispatch(setBoard(move.newBoard));
      dispatch(resetSelectedPiece());
      // Check for Checkmate
      const opponentColor = activeColor === "white" ? "black" : "white";
      if (isKingInCheck(move.newBoard, opponentColor)) moveNotation += "+";
      if (isCheckmate(move.newBoard, opponentColor, hasMoved)) {
        console.log("Checkmate!");
        moveNotation = moveNotation.slice(0, -1); // remove + from initial check
        moveNotation += "#";
      }
      dispatch(setActiveMove(nextIndex));
      dispatch(
        setMovesList([
          ...movesList,
          {
            moveNotation,
            board: move.newBoard,
            capturedPieces: tempCapturedPieces,
          },
        ])
      );

      dispatch(toggleActiveColor());
    } else if (nextMove && getPieceColor(nextMove) === activeColor) {
      dispatch(setSelectedPiece({ row, col, piece: nextMove }));
    }
  };

  const renderBoard = () => {
    let tempSelectedPiece = { ...selectedPiece };
    let boardForRender = structuredClone(board);
    let possibleMoves = [];
    // Initialize as 8x8 arrays filled with zeros
    let whitePressure = board.map((row) => row.map((col) => 0));
    let blackPressure = board.map((row) => row.map((col) => 0));

    // For en passant target highlighting
    let enPassantTargetSquare = null;
    if (isEditMode && enPassantEnabled && possibleEnPassantTargets.length > 0) {
      const target = possibleEnPassantTargets.find(
        (target) => target.notation === selectedEnPassantTarget
      );
      if (target) {
        enPassantTargetSquare = { row: target.row, col: target.col };
      }
    }

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
    dispatch(
      setMovesList([
        ...movesList,
        {
          moveNotation: `${
            promotionSquare.moveNotation
          }=${piece.toUpperCase()}`,
          board: newBoard,
          capturedPieces: tempCapturedPieces,
        },
      ])
    );
    dispatch(setBoard(newBoard));
    setPromotionSquare(null);
    dispatch(resetSelectedPiece());
    dispatch(setGameIsActive(true));
    dispatch(toggleActiveColor());
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
