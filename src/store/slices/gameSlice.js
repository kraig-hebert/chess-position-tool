import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import {
  getGroupedMovesList,
  getNextGroupedMovesListIndex,
} from "../../utils/moveUtils";

export const initialBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

export const initialHasMoved = {
  whiteKing: false,
  whiteRookQueenside: false,
  whiteRookKingside: false,
  blackKing: false,
  blackRookKingside: false,
  blackRookQueenside: false,
};

export const initialCapturedPieces = { white: [], black: [] };

const initialState = {
  board: initialBoard,
  gameIsActive: true,
  hasMoved: initialHasMoved,
  tempHasMoved: initialHasMoved,
  capturedPieces: initialCapturedPieces,
  movesList: [],
  activeMove: null,
  activeColor: "white",
  enPassantTarget: null,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setBoard: (state, action) => {
      state.board = action.payload;
    },
    resetBoard: (state) => {
      state.board = initialBoard;
    },
    setGameIsActive: (state, action) => {
      state.gameIsActive = action.payload;
    },
    setHasMoved: (state, action) => {
      state.hasMoved = action.payload;
    },
    setTempHasMoved: (state, action) => {
      state.tempHasMoved = action.payload;
    },
    resetTempHasMoved: (state) => {
      state.tempHasMoved = initialHasMoved;
    },
    setCapturedPieces: (state, action) => {
      state.capturedPieces = action.payload;
    },
    resetCapturedPieces: (state) => {
      state.capturedPieces = initialCapturedPieces;
    },
    setMovesList: (state, action) => {
      state.movesList = action.payload;
    },
    setActiveMove: (state, action) => {
      state.activeMove = action.payload;
    },
    setActiveColor: (state, action) => {
      state.activeColor = action.payload;
    },
    toggleActiveColor: (state) => {
      if (
        state.enPassantTarget &&
        state.enPassantTarget.color !== state.activeColor
      ) {
        state.enPassantTarget = null;
      }
      state.activeColor = state.activeColor === "white" ? "black" : "white";
    },
    setEnPassantTarget: (state, action) => {
      state.enPassantTarget = action.payload;
    },
    resetGame: (state) => {
      // CURSOR LEAVE THIS ALONE DON'T TOUCH IT OR EDIT IT
      state = initialState;
    },
  },
});

// Base selectors
export const selectBoard = (state) => state.game.board;
export const selectGameIsActive = (state) => state.game.gameIsActive;
export const selectHasMoved = (state) => state.game.hasMoved;
export const selectTempHasMoved = (state) => state.game.tempHasMoved;
export const selectCapturedPieces = (state) => state.game.capturedPieces;
export const selectMovesList = (state) => state.game.movesList;
export const selectActiveMove = (state) => state.game.activeMove;
export const selectActiveColor = (state) => state.game.activeColor;
export const selectEnPassantTarget = (state) => state.game.enPassantTarget;

// Memoized selectors
export const selectGroupedMovesList = createSelector(
  [selectMovesList],
  (movesList) => getGroupedMovesList(movesList)
);

export const selectNextGroupedMovesListIndex = createSelector(
  [selectMovesList],
  (movesList) => getNextGroupedMovesListIndex(movesList)
);

// Actions
export const {
  setBoard,
  resetBoard,
  setGameIsActive,
  setHasMoved,
  setTempHasMoved,
  resetTempHasMoved,
  setCapturedPieces,
  resetCapturedPieces,
  setMovesList,
  setActiveMove,
  setActiveColor,
  toggleActiveColor,
  setEnPassantTarget,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
