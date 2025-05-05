import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // We'll add state properties one by one
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    // We'll add reducers as we need them
  },
});

export const {} = gameSlice.actions; // We'll add action exports as we create them

export default gameSlice.reducer;
