import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import {
  getGroupedMovesList,
  getNextGroupedMovesListIndex,
} from "../../utils/moveUtils";

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
  gameIsActive: true,
  hasMoved: initialHasMoved,
  tempHasMoved: initialHasMoved,
  capturedPieces: initialCapturedPieces,
  movesList: [],
  activeMove: null,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
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
    resetGame: (state) => {
      state.gameIsActive = initialState.gameIsActive;
      state.hasMoved = initialState.hasMoved;
      state.tempHasMoved = initialState.tempHasMoved;
      state.capturedPieces = initialState.capturedPieces;
      state.movesList = initialState.movesList;
      state.activeMove = initialState.activeMove;
    },
  },
});

// Base selectors
export const selectGameIsActive = (state) => state.game.gameIsActive;
export const selectHasMoved = (state) => state.game.hasMoved;
export const selectTempHasMoved = (state) => state.game.tempHasMoved;
export const selectCapturedPieces = (state) => state.game.capturedPieces;
export const selectMovesList = (state) => state.game.movesList;
export const selectActiveMove = (state) => state.game.activeMove;

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
  setGameIsActive,
  setHasMoved,
  setTempHasMoved,
  resetTempHasMoved,
  setCapturedPieces,
  resetCapturedPieces,
  setMovesList,
  setActiveMove,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
