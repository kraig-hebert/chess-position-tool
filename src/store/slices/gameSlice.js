import { createSlice } from "@reduxjs/toolkit";

export const initialHasMoved = {
  whiteKing: false,
  whiteRookQueenside: false,
  whiteRookKingside: false,
  blackKing: false,
  blackRookKingside: false,
  blackRookQueenside: false,
};

const initialState = {
  gameIsActive: true,
  hasMoved: initialHasMoved,
  tempHasMoved: initialHasMoved,
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
    resetGame: (state) => {
      state.gameIsActive = true;
      state.hasMoved = initialHasMoved;
      state.tempHasMoved = initialHasMoved;
    },
  },
});

// Selectors
export const selectGameIsActive = (state) => state.game.gameIsActive;
export const selectHasMoved = (state) => state.game.hasMoved;
export const selectTempHasMoved = (state) => state.game.tempHasMoved;

// Actions
export const {
  setGameIsActive,
  setHasMoved,
  setTempHasMoved,
  resetTempHasMoved,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
