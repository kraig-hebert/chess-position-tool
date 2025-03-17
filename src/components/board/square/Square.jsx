import React from "react";

import { useGameState } from "../../../context/GameStateProvider";

import "./squareStyles.css";
import PieceIcon from "../pieceIcon/PieceIcon";

const Square = (props) => {
  const { isDark, isSelected, onClick, piece } = props;
  return (
    <div
      className={`square ${isDark ? "dark" : "light"} ${
        isSelected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      {piece && <PieceIcon Icon={piece.icon} className={piece.className} />}
    </div>
  );
};

export default Square;
