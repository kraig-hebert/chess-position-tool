import React from "react";

import { useGameState } from "../../../context/GameStateProvider";

import "./squareStyles.css";
import PieceIcon from "../pieceIcon/PieceIcon";

const Square = (props) => {
  const { isDark, isSelected, onClick, piece, row, col } = props;

  const { pov, letterNotation } = useGameState();
  const leftNotation = col === 0 ? true : false;
  const bottomNotation = row === 7 ? true : false;

  const renderLeftNotation = () => {
    if (pov === "white")
      return <div className="left-notation">{Math.abs(row - 7) + 1}</div>;
    else return <div className="left-notation">{row + 1}</div>;
  };
  const renderBottomNotation = () => {
    if (pov === "white")
      return <div className="bottom-notation">{letterNotation[col + 1]}</div>;
    else
      return (
        <div className="bottom-notation">
          {letterNotation[Math.abs(col - 8)]}
        </div>
      );
  };

  return (
    <div
      className={`square ${isDark ? "dark" : "light"} ${
        isSelected ? "selected" : ""
      }`}
      onClick={onClick}
    >
      {piece && <PieceIcon Icon={piece.icon} className={piece.className} />}
      {leftNotation && renderLeftNotation()}
      {bottomNotation && renderBottomNotation()}
    </div>
  );
};

export default Square;
