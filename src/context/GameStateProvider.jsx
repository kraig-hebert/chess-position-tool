import React, { createContext, useContext, useState, useEffect } from "react";

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // Add position validation state
  const [positionIsValid, setPositionIsValid] = useState(true);

  // Add state for storing the original position before entering edit mode
  const [originalPosition, setOriginalPosition] = useState(null);

  const resetGame = () => {
    setIsEditMode(false);
  };

  return (
    <GameStateContext.Provider
      value={{
        resetGame,
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
