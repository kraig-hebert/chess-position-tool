import React from "react";
import {
  FaBackward,
  FaForward,
  FaArrowDownUpAcrossLine,
  FaRecycle,
} from "react-icons/fa6";

import { useGameState } from "../../context/GameStateProvider";

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

  return (
    <div className="game-buttons">
      <GameButton title="Reset" Icon={FaRecycle} onClick={resetGame} />
      <GameButton
        title="Flip Board"
        Icon={FaArrowDownUpAcrossLine}
        onClick={togglePov}
      />
      <GameButton
        title="Last Move"
        Icon={FaBackward}
        onClick={handleMoveBackwards}
      />
      <GameButton
        title="Next Move"
        Icon={FaForward}
        onClick={handleMoveForwards}
      />
    </div>
  );
};

export default GameButtons;
