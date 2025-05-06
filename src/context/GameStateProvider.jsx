import React, { createContext, useContext, useState, useEffect } from "react";

const initialActiveColor = "white";
const initialPov = "white";

const initialBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [activeColor, setActiveColor] = useState(initialActiveColor);
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [enPassantTarget, setEnPassantTarget] = useState(null);
  const [pov, setPov] = useState(initialPov);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMoveSquare, setSelectedMoveSquare] = useState(null); // { row, col, piece }

  // Add position validation state
  const [positionIsValid, setPositionIsValid] = useState(true);

  // Add state for storing the original position before entering edit mode
  const [originalPosition, setOriginalPosition] = useState(null);

  const togglePov = () => {
    if (pov === "white") setPov("black");
    else setPov("white");
  };

  const toggleActiveColor = () => {
    if (enPassantTarget && enPassantTarget.color !== activeColor)
      setEnPassantTarget(null);
    if (activeColor === "white") setActiveColor("black");
    else setActiveColor("white");
  };

  const setInitialBoard = () => {
    setBoard(initialBoard);
  };

  const resetGame = () => {
    setSelectedPiece(null);
    setEnPassantTarget(null);
    setActiveColor(initialActiveColor);
    setPov(initialPov);
    setBoard(initialBoard);
    setMovesList(initialMovesList);
    setIsEditMode(false);
  };

  return (
    <GameStateContext.Provider
      value={{
        activeColor,
        setActiveColor,
        toggleActiveColor,
        board,
        setBoard,
        selectedPiece,
        setSelectedPiece,
        enPassantTarget,
        setEnPassantTarget,
        resetGame,
        pov,
        setPov,
        togglePov,
        isEditMode,
        setIsEditMode,
        setInitialBoard,
        selectedMoveSquare,
        setSelectedMoveSquare,
        initialBoard,
        positionIsValid,
        setPositionIsValid,
        originalPosition,
        setOriginalPosition,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context)
    throw new Error("useGameState must be used within GameStateProvider");
  return context;
};
