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
import { calculateCapturedPieces } from "../../logic/chessUtils";

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
