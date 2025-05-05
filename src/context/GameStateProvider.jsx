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

const initialActiveFilters = {
  colors: { white: true, black: true },
  activeFilterType: "pressure", // pressure or control
};

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
  const [activeMove, setActiveMove] = useState(null);
  const [board, setBoard] = useState(initialBoard);
  const [activeFilters, setActiveFilters] = useState(initialActiveFilters);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [enPassantTarget, setEnPassantTarget] = useState(null);
  const [gameIsActive, setGameIsActive] = useState(true);
  const [pov, setPov] = useState(initialPov);
  const [capturedPieces, setCapturedPieces] = useState(initialCapturedPieces);
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

  // Track whether the king and rooks have moved
  const [hasMoved, setHasMoved] = useState(initialHasMoved);

  // Add position validation state
  const [positionIsValid, setPositionIsValid] = useState(true);

  // Rename to tempHasMoved for clarity
  const [tempHasMoved, setTempHasMoved] = useState(initialHasMoved);

  // Add state for storing the original position before entering edit mode
  const [originalPosition, setOriginalPosition] = useState(null);

  const updateHasMovedForCastling = () => {
    if (activeColor === "white") {
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

  const toggleFiltersByColor = (color) => {
    setActiveFilters((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [color]: !prev.colors[color],
      },
    }));
  };

  const toggleActiveFilterType = () => {
    setActiveFilters((prev) => ({
      ...prev,
      activeFilterType:
        prev.activeFilterType === "pressure" ? "control" : "pressure",
    }));
  };

  const setInitialBoard = () => {
    setBoard(initialBoard);
  };

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

  useEffect(() => {
    console.log("hasMoved", hasMoved);
  }, [hasMoved]);
  useEffect(() => {
    console.log("gameIsActive", gameIsActive);
  }, [gameIsActive]);
  useEffect(() => {
    console.log("activeFilters", activeFilters);
  }, [activeFilters]);

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
        togglePov,
        capturedPieces,
        setCapturedPieces,
        movesList,
        setMovesList,
        getGroupedMovesList,
        activeMove,
        setActiveMove,
        getNextGroupedMovesListIndex,
        activeFilters,
        setActiveFilters,
        toggleFiltersByColor,
        toggleActiveFilterType,
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
        tempHasMoved,
        setTempHasMoved,
        originalPosition,
        setOriginalPosition,
        initialHasMoved,
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
