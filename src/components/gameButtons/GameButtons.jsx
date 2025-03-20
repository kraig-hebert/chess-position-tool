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
  const { resetGame, updatePov } = useGameState();

  return (
    <div className="game-buttons">
      <GameButton title="Reset" Icon={FaRecycle} onClick={resetGame} />
      <GameButton
        title="Flip Board"
        Icon={FaArrowDownUpAcrossLine}
        onClick={updatePov}
      />
      <GameButton title="Last Move" Icon={FaBackward} />
      <GameButton title="Next Move" Icon={FaForward} />
    </div>
  );
};

export default GameButtons;
