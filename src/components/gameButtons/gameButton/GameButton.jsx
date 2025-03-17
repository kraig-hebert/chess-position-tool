import React from "react";

import { useGameState } from "../../../context/GameStateProvider";

import "./gameButtonStyles.css";

const GameButton = (props) => {
  const { title, Icon } = props;

  const { resetBoard } = useGameState();
  return (
    <div className="game-button" onClick={() => resetBoard()}>
      <Icon />
      {title}
    </div>
  );
};

export default GameButton;
