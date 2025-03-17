import React from "react";
import {
  FaBackward,
  FaForward,
  FaArrowDownUpAcrossLine,
  FaRecycle,
} from "react-icons/fa6";

import GameButton from "./gameButton/GameButton";

import "./gameButtonsStyles.css";

const GameButtons = () => {
  return (
    <div className="game-buttons">
      <GameButton title="Reset" Icon={FaRecycle} />
      <GameButton title="Flip Board" Icon={FaArrowDownUpAcrossLine} />
      <GameButton title="Last Move" Icon={FaBackward} />
      <GameButton title="Next Move" Icon={FaForward} />
    </div>
  );
};

export default GameButtons;
