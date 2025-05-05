import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gameIsActive: true,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameIsActive: (state, action) => {
      const isActive = action.payload;
      state.gameIsActive = action.payload;
    },
    resetGame: (state) => {
      state.gameIsActive = true;
    },
  },
});

// Selectors
export const selectGameIsActive = (state) => state.game.gameIsActive;

// Actions
export const { setGameIsActive, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
