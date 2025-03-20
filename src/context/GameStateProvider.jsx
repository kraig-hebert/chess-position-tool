import React, { createContext, useContext, useState, useEffect } from "react";

const initialActiveColor = "white";
const initialPov = "white";

const initialBoard = () => [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const initialHasMoved = {
  whiteKing: false,
  whiteRookQueenside: false,
  whiteRookKingside: false,
  blackKing: false,
  blackRookKingside: false,
  blackRookQueenside: false,
};

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [activeColor, setActiveColor] = useState(initialActiveColor);
  const [board, setBoard] = useState(initialBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [enPassantTarget, setEnPassantTarget] = useState(null);
  const [gameIsActive, setGameIsActive] = useState(true);
  const [pov, setPov] = useState(initialPov);

  // Track whether the king and rooks have moved
  const [hasMoved, setHasMoved] = useState(initialHasMoved);

  const updateHasMovedForCastling = (color) => {
    if (color === "white") {
      setHasMoved({
        ...hasMoved,
        whiteKing: true,
        whiteRookQueenside: true,
        whiteRookKingside: true,
      });
    } else {
      setHasMoved({
        ...hasMoved,
        blackKing: true,
        blackRookKingside: true,
        blackRookQueenside: true,
      });
    }
  };

  const updatePov = () => {
    if (pov === "white") setPov("black");
    else setPov("white");
  };

  const resetBoard = () => setBoard(initialBoard());
  const resetHasMoved = () => setHasMoved(initialHasMoved);
  const resetGame = () => {
    resetBoard();
    resetHasMoved();
    setGameIsActive(true);
  };

  useEffect(() => {
    console.log("hasMoved", hasMoved);
  }, [hasMoved]);
  useEffect(() => {
    console.log("gameIsActice", gameIsActive);
  }, [gameIsActive]);

  return (
    <GameStateContext.Provider
      value={{
        activeColor,
        setActiveColor,
        board,
        setBoard,
        selectedPiece,
        setSelectedPiece,
        hasMoved,
        setHasMoved,
        enPassantTarget,
        setEnPassantTarget,
        updateHasMovedForCastling,
        gameIsActive,
        setGameIsActive,
        resetGame,
        pov,
        setPov,
        updatePov,
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
