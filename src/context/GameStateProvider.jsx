import React, { createContext, useContext, useState, useEffect } from "react";

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

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [board, setBoard] = useState(initialBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [enPassantTarget, setEnPassantTarget] = useState(null);
  const [gameIsActive, setGameIsActive] = useState(true);

  // Track whether the king and rooks have moved
  const [hasMoved, setHasMoved] = useState({
    whiteKing: false,
    whiteRookQueenside: false,
    whiteRookKingside: false,
    blackKing: false,
    blackRookKingside: false,
    blackRookQueenside: false,
  });

  const updateHasMoved = (color) => {
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

  useEffect(() => {
    console.log(gameIsActive);
    console.log(hasMoved);
  }, [hasMoved]);

  return (
    <GameStateContext.Provider
      value={{
        board,
        setBoard,
        selectedPiece,
        setSelectedPiece,
        hasMoved,
        setHasMoved,
        enPassantTarget,
        setEnPassantTarget,
        updateHasMoved,
        gameIsActive,
        setGameIsActive,
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
