import React from "react";
import { useSelector } from "react-redux";
import { selectGameIsActive } from "../../../store/slices/gameSlice";
import "./gameButtonStyles.css";

const GameButton = (props) => {
  const { title, Icon, onClick, disabled } = props;
  const gameIsActive = useSelector(selectGameIsActive);

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
