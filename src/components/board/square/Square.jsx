import React from "react";
import { useSelector } from "react-redux";
import { useGameState } from "../../../context/GameStateProvider";
import { letterNotation } from "../../../logic/chessUtils";
import { getSquareControl } from "../../../logic/filterUtils";
import { selectActiveFilters, selectPov } from "../../../store/slices/uiSlice";

import "./squareStyles.css";
import PieceIcon from "../pieceIcon/PieceIcon";

const Square = (props) => {
  const {
    isDark,
    isLegal,
    isSelected,
    isEnPassantTarget,
    onClick,
    piece,
    whitePressure,
    blackPressure,
    row,
    col,
  } = props;

  const pov = useSelector(selectPov);
  const activeFilters = useSelector(selectActiveFilters);

  const leftNotation = col === 0;
  const bottomNotation = row === 7;
  const squareControl = getSquareControl(
    row,
    col,
    whitePressure,
    blackPressure
  );

  const renderLegalMove = () => <div className="possible-move"></div>;

  const renderedWhiteFilter =
    activeFilters.activeFilterType === "pressure" &&
    whitePressure[row][col] > 0 ? (
      <div className={`white-filter level-6`}>{whitePressure[row][col]}</div>
    ) : null;

  const renderedBlackFilter =
    activeFilters.activeFilterType === "pressure" &&
    blackPressure[row][col] > 0 ? (
      <div className={`black-filter level-6`}>{blackPressure[row][col]}</div>
    ) : null;

  const renderSquareControl = () => {
    if (squareControl.control > 0 && activeFilters.colors[squareControl.color])
      return (
        <div className={`${squareControl.color}-filter level-6`}>
          {squareControl.control}
        </div>
      );
  };

  const renderSquareNotations = () => {
    if (activeFilters.activeFilterType === "pressure") {
      return (
        <>
          {activeFilters.colors.white && renderedWhiteFilter}
          {activeFilters.colors.black && renderedBlackFilter}
        </>
      );
    }
    if (activeFilters.activeFilterType === "control") {
      return renderSquareControl();
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
      } ${isEnPassantTarget ? "en-passant-target" : ""}`}
      onClick={onClick}
    >
      {piece && <PieceIcon Icon={piece.icon} className={piece.className} />}
      {isLegal && renderLegalMove()}
      {leftNotation && renderLeftNotation()}
      {bottomNotation && renderBottomNotation()}
      {renderSquareNotations()}
    </div>
  );
};

export default Square;
