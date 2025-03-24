import React, { createContext, useContext, useState, useEffect } from "react";
import {
  FaChessPawn,
  FaChessRook,
  FaChessKnight,
  FaChessBishop,
  FaChessQueen,
  FaChessKing,
} from "react-icons/fa6";

const initialActiveColor = "white";
const initialPov = "white";
const initialCapturedPieces = { white: [], black: [] };
const initialMovesList = [];

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
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [enPassantTarget, setEnPassantTarget] = useState(null);
  const [gameIsActive, setGameIsActive] = useState(true);
  const [pov, setPov] = useState(initialPov);
  const [capturedPieces, setCapturedPieces] = useState(initialCapturedPieces);
  const [movesList, setMovesList] = useState(initialMovesList);

  // Track whether the king and rooks have moved
  const [hasMoved, setHasMoved] = useState(initialHasMoved);

  const letterNotation = {
    1: "a",
    2: "b",
    3: "c",
    4: "d",
    5: "e",
    6: "f",
    7: "g",
    8: "h",
  };

  const pieceValues = {
    p: 1,
    r: 5,
    n: 3,
    b: 3,
    q: 9,
    k: 0,
  };

  const pieceIcons = {
    p: { icon: FaChessPawn, className: "piece black" },
    r: { icon: FaChessRook, className: "piece black" },
    n: { icon: FaChessKnight, className: "piece black" },
    b: { icon: FaChessBishop, className: "piece black" },
    q: { icon: FaChessQueen, className: "piece black" },
    k: { icon: FaChessKing, className: "piece black" },
    P: { icon: FaChessPawn, className: "piece white" },
    R: { icon: FaChessRook, className: "piece white" },
    N: { icon: FaChessKnight, className: "piece white" },
    B: { icon: FaChessBishop, className: "piece white" },
    Q: { icon: FaChessQueen, className: "piece white" },
    K: { icon: FaChessKing, className: "piece white" },
  };

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

  const addCapturedPiece = (piece, color) =>
    setCapturedPieces((prev) => ({
      ...prev,
      [color]: [...prev[color], piece],
    }));

  const resetGame = () => {
    setCapturedPieces(initialCapturedPieces);
    setSelectedPiece(null);
    setEnPassantTarget(null);
    setActiveColor(initialActiveColor);
    setPov(initialPov);
    setBoard(initialBoard);
    setHasMoved(initialHasMoved);
    setMovesList(initialMovesList);
    setGameIsActive(true);
  };

  const getGroupedMovesList = () => {
    const groupedMoves = [];
    let moveGroup = [];
    console.log(movesList);
    movesList.forEach((move, index) => {
      if (index % 2 === 0) moveGroup.push(move);
      else {
        moveGroup.push(move);
        groupedMoves.push(moveGroup);
        moveGroup = [];
      }
      if (index === movesList.length - 1) groupedMoves.push(moveGroup);
    });
    return groupedMoves;
  };

  useEffect(() => {
    console.log("hasMoved", hasMoved);
  }, [hasMoved]);
  useEffect(() => {
    console.log("gameIsActive", gameIsActive);
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
        letterNotation,
        capturedPieces,
        setCapturedPieces,
        pieceValues,
        addCapturedPiece,
        pieceIcons,
        movesList,
        setMovesList,
        getGroupedMovesList,
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
