import React from "react";

import { useGameState } from "../../../context/GameStateProvider";
import { letterNotation } from "../../../logic/chessUtils";

import "./squareStyles.css";
import PieceIcon from "../pieceIcon/PieceIcon";

const Square = (props) => {
  const { isDark, isLegal, isIllegal, isSelected, onClick, piece, row, col } =
    props;

  const { pov } = useGameState();
  const leftNotation = col === 0 ? true : false;
  const bottomNotation = row === 7 ? true : false;

  const renderLegalMove = () => <div className="possible-move legal"></div>;
  const renderIllegalMove = () => <div className="possible-move illegal"></div>;

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
      {isLegal && renderLegalMove()}
      {isIllegal && renderIllegalMove()}
      {leftNotation && renderLeftNotation()}
      {bottomNotation && renderBottomNotation()}
    </div>
  );
};

export default Square;
