import React, { createContext, useContext, useState, useEffect } from "react";

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

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [activeColor, setActiveColor] = useState(initialActiveColor);
  const [activeMove, setActiveMove] = useState(null);
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [enPassantTarget, setEnPassantTarget] = useState(null);
  const [pov, setPov] = useState(initialPov);
  const [movesList, setMovesList] = useState(initialMovesList);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeAction, setActiveAction] = useState("add"); // "add", "move", "trash"
  const [selectedMoveSquare, setSelectedMoveSquare] = useState(null); // { row, col, piece }
  const [selectedPieceType, setSelectedPieceType] = useState(null);
  const [nextMoveColor, setNextMoveColor] = useState("white");

  // New state variables for en passant in edit mode
  const [enPassantEnabled, setEnPassantEnabled] = useState(false);
  const [possibleEnPassantTargets, setPossibleEnPassantTargets] = useState([]);
  const [selectedEnPassantTarget, setSelectedEnPassantTarget] = useState(0); // Index of selected target

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

  const getGroupedMovesList = () => {
    const groupedMoves = [];
    let moveGroup = [];
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

  const getNextGroupedMovesListIndex = () => {
    const groupedMovesList = getGroupedMovesList();
    if (groupedMovesList.length === 0) return { groupIndex: 0, moveIndex: 0 };
    const groupIndex = groupedMovesList.length - 1;
    const moveIndex = groupedMovesList[groupIndex].length - 1;
    if (moveIndex === 1) return { groupIndex: groupIndex + 1, moveIndex: 0 };
    return { groupIndex, moveIndex: moveIndex + 1 };
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
        movesList,
        setMovesList,
        getGroupedMovesList,
        activeMove,
        setActiveMove,
        getNextGroupedMovesListIndex,
        isEditMode,
        setIsEditMode,
        setInitialBoard,
        activeAction,
        setActiveAction,
        selectedMoveSquare,
        setSelectedMoveSquare,
        selectedPieceType,
        setSelectedPieceType,
        initialBoard,
        nextMoveColor,
        setNextMoveColor,
        enPassantEnabled,
        setEnPassantEnabled,
        possibleEnPassantTargets,
        setPossibleEnPassantTargets,
        selectedEnPassantTarget,
        setSelectedEnPassantTarget,
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
