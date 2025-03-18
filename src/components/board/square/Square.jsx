import React from "react";

import "./squareStyles.css";
import PieceIcon from "../pieceIcon/PieceIcon";

const Square = (props) => {
  const { isDark, isSelected, onClick, piece, row, col } = props;
  const leftNotation = col === 0 ? true : false;
  const bottomNotation = row === 7 ? true : false;

  const renderLeftNotation = () => (
    <div className="left-notation">{Math.abs(row - 7) + 1}</div>
  );
  const renderBottomNotation = () => (
    <div className="bottom-notation">{col + 1}</div>
  );

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
