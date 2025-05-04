import React from "react";

import {
  FaBackward,
  FaForward,
  FaArrowDownUpAcrossLine,
  FaRecycle,
  FaPencil,
} from "react-icons/fa6";
import { FaSave } from "react-icons/fa";

import { useGameState } from "../../context/GameStateProvider";
import {
  calculateCapturedPieces,
  calculateCastlingRights,
} from "../../logic/chessUtils";

import GameButton from "./gameButton/GameButton";

import "./gameButtonsStyles.css";

const GameButtons = () => {
  const {
    resetGame,
    togglePov,
    activeMove,
    setBoard,
    setActiveMove,
    getGroupedMovesList,
    setCapturedPieces,
    isEditMode,
    setIsEditMode,
    setMovesList,
    board,
    initialBoard,
    setHasMoved,
    setActiveColor,
    setGameIsActive,
    nextMoveColor,
    enPassantEnabled,
    possibleEnPassantTargets,
    selectedEnPassantTarget,
    setEnPassantTarget,
  } = useGameState();

  const groupedMovesList = getGroupedMovesList();

  const handleMoveBackwards = () => {
    if (activeMove.groupIndex === 0 && activeMove.moveIndex === 0) return;
    if (activeMove.moveIndex === 1) {
      setActiveMove({
        groupIndex: activeMove.groupIndex,
        moveIndex: 0,
      });
      setCapturedPieces(
        groupedMovesList[activeMove.groupIndex][0].capturedPieces
      );
      setBoard(groupedMovesList[activeMove.groupIndex][0].board);
    } else {
      setActiveMove({ groupIndex: activeMove.groupIndex - 1, moveIndex: 1 });
      setCapturedPieces(
        groupedMovesList[activeMove.groupIndex - 1][1].capturedPieces
      );
      setBoard(groupedMovesList[activeMove.groupIndex - 1][1].board);
    }
  };
  const handleMoveForwards = () => {
    const groupIndex = groupedMovesList.length - 1;
    const moveIndex = groupedMovesList[groupIndex].length - 1;
    if (
      activeMove.groupIndex === groupIndex &&
      activeMove.moveIndex === moveIndex
    )
      return;
    if (activeMove.moveIndex === 1) {
      setActiveMove({
        groupIndex: activeMove.groupIndex + 1,
        moveIndex: 0,
      });
      setCapturedPieces(
        groupedMovesList[activeMove.groupIndex + 1][0].capturedPieces
      );
      setBoard(groupedMovesList[activeMove.groupIndex + 1][0].board);
    } else {
      setActiveMove({ groupIndex: activeMove.groupIndex, moveIndex: 1 });
      setCapturedPieces(
        groupedMovesList[activeMove.groupIndex][1].capturedPieces
      );
      setBoard(groupedMovesList[activeMove.groupIndex][1].board);
    }
  };

  const handleEditSaveClick = () => {
    if (isEditMode) {
      // Reset moves list when saving from edit mode
      setMovesList([]);

      // Calculate and set captured pieces
      const captured = calculateCapturedPieces(board, initialBoard);
      setCapturedPieces(captured);

      // Set castling rights based on piece positions
      const castlingRights = calculateCastlingRights(board);
      setHasMoved({
        whiteKing: !castlingRights.whiteKing,
        whiteRookKingside: !castlingRights.whiteRookKingside,
        whiteRookQueenside: !castlingRights.whiteRookQueenside,
        blackKing: !castlingRights.blackKing,
        blackRookKingside: !castlingRights.blackRookKingside,
        blackRookQueenside: !castlingRights.blackRookQueenside,
      });

      // Set the active color based on the nextMoveColor from context
      setActiveColor(nextMoveColor);

      // Set en passant target if enabled and a valid target is selected
      if (enPassantEnabled && possibleEnPassantTargets.length > 0) {
        const target = possibleEnPassantTargets[selectedEnPassantTarget];
        setEnPassantTarget({
          row: target.row,
          col: target.col,
          color: nextMoveColor, // The color that can make the en passant capture
        });
      } else {
        // Clear any existing en passant target
        setEnPassantTarget(null);
      }

      // Set game to active
      setGameIsActive(true);
    }
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="game-buttons">
      <GameButton
        title={isEditMode ? "Save" : "Edit"}
        Icon={isEditMode ? FaSave : FaPencil}
        onClick={handleEditSaveClick}
      />
      <GameButton
        title="Reset"
        Icon={FaRecycle}
        onClick={resetGame}
        disabled={isEditMode}
      />
      <GameButton
        title="Flip Board"
        Icon={FaArrowDownUpAcrossLine}
        onClick={togglePov}
        disabled={isEditMode}
      />
      <GameButton
        title="Last Move"
        Icon={FaBackward}
        onClick={handleMoveBackwards}
        disabled={isEditMode}
      />
      <GameButton
        title="Next Move"
        Icon={FaForward}
        onClick={handleMoveForwards}
        disabled={isEditMode}
      />
    </div>
  );
};

export default GameButtons;
