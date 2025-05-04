import React from "react";
import { useGameState } from "../../../context/GameStateProvider";
import "./colorSelectorStyles.css";

const ColorSelector = () => {
  const { nextMoveColor, setNextMoveColor } = useGameState();

  return (
    <div className="color-selector">
      <div className="color-label">Next move:</div>
      <div className="color-options">
        <div
          className={`color-option white ${
            nextMoveColor === "white" ? "color-selected" : ""
          }`}
          onClick={() => setNextMoveColor("white")}
        >
          White
        </div>
        <div
          className={`color-option black ${
            nextMoveColor === "black" ? "color-selected" : ""
          }`}
          onClick={() => setNextMoveColor("black")}
        >
          Black
        </div>
      </div>
    </div>
  );
};

export default ColorSelector;
