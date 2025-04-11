import React from "react";

import { useGameState } from "../../../context/GameStateProvider";
import { letterNotation } from "../../../logic/chessUtils";

import "./squareStyles.css";
import PieceIcon from "../pieceIcon/PieceIcon";

const Square = (props) => {
  const {
    isDark,
    isLegal,
    isSelected,
    onClick,
    piece,
    whitePressure,
    blackPressure,
    row,
    col,
  } = props;
  const { activeFilters, pov } = useGameState();
  const leftNotation = col === 0 ? true : false;
  const bottomNotation = row === 7 ? true : false;

  const renderLegalMove = () => <div className="possible-move"></div>;

  const convertPressure = (pressure) => {
    return pressure === 1
      ? "level-1"
      : pressure === 2
      ? "level-2"
      : pressure === 3
      ? "level-3"
      : pressure === 4
      ? "level-4"
      : pressure === 5
      ? "level-5"
      : pressure === 6
      ? "level-6"
      : pressure === 7
      ? "level-7"
      : pressure === 8
      ? "level-8"
      : pressure === 9
      ? "level-9"
      : pressure === 10
      ? "level-10"
      : null;
  };
  const renderWhitePressure = (pressureLevel) =>
    activeFilters.white.squarePressure ? (
      <div className={`white-pressure ${convertPressure(pressureLevel)}`}></div>
    ) : null;
  const renderBlackPressure = (pressureLevel) =>
    activeFilters.black.squarePressure ? (
      <div className={`black-pressure ${convertPressure(pressureLevel)}`}></div>
    ) : null;

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
      {leftNotation && renderLeftNotation()}
      {bottomNotation && renderBottomNotation()}
      {whitePressure && renderWhitePressure(whitePressure[row][col])}
      {blackPressure && renderBlackPressure(blackPressure[row][col])}
    </div>
  );
};

export default Square;
