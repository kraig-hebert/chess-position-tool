import React from "react";

import { useGameState } from "../../../context/GameStateProvider";

import "./gameButtonStyles.css";

const GameButton = (props) => {
  const { title, Icon, onClick, disabled } = props;

  const { gameIsActive } = useGameState();

  return (
    <div
      className={`game-button ${!gameIsActive || disabled ? "disabled" : ""}`}
      onClick={gameIsActive && !disabled ? onClick : undefined}
    >
      <Icon />
      {title}
    </div>
  );
};

export default GameButton;
