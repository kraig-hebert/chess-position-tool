import React from "react";

import { useGameState } from "../../../context/GameStateProvider";

import "./gameButtonStyles.css";

const GameButton = (props) => {
  const { title, Icon, onClick } = props;

  const { gameIsActive } = useGameState();

  return (
    <div
      className={`game-button ${!gameIsActive ? "disabled" : ""}`}
      onClick={onClick}
    >
      <Icon />
      {title}
    </div>
  );
};

export default GameButton;
