import React, { createContext, useContext, useState, useEffect } from "react";

const initialPov = "white";

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [pov, setPov] = useState(initialPov);
  const [isEditMode, setIsEditMode] = useState(false);

  // Add position validation state
  const [positionIsValid, setPositionIsValid] = useState(true);

  // Add state for storing the original position before entering edit mode
  const [originalPosition, setOriginalPosition] = useState(null);

  const togglePov = () => {
    if (pov === "white") setPov("black");
    else setPov("white");
  };

  const resetGame = () => {
    setSelectedPiece(null);
    setPov(initialPov);
    setIsEditMode(false);
  };

  return (
    <GameStateContext.Provider
      value={{
        selectedPiece,
        setSelectedPiece,
        resetGame,
        pov,
        setPov,
        togglePov,
        isEditMode,
        setIsEditMode,
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
