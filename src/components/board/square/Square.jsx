import React from "react";

import { useGameState } from "../../../context/GameStateProvider";
import { letterNotation } from "../../../logic/chessUtils";
import { getSquareControl } from "../../../logic/filterUtils";

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
  const squareControl = getSquareControl(
    row,
    col,
    whitePressure,
    blackPressure
  );
  console.log(squareControl);

  const renderLegalMove = () => <div className="possible-move"></div>;

  const renderWhiteFilter = () => {
    if (
      activeFilters.activeFilterType === "pressure" &&
      whitePressure[row][col] > 0
    ) {
      return (
        <div className={`white-filter level-6`}>{whitePressure[row][col]}</div>
      );
    }
  };
  const renderBlackFilter = () => {
    if (
      activeFilters.activeFilterType === "pressure" &&
      blackPressure[row][col] > 0
    ) {
      return (
        <div className={`white-filter level-6`}>{blackPressure[row][col]}</div>
      );
    }
  };

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
      {activeFilters.colors.white && renderWhiteFilter()}
      {activeFilters.colors.black && renderBlackFilter()}
    </div>
  );
};

export default Square;
