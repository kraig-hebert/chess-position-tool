import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // UI state will go here
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // UI reducers will go here
  },
});

export const {} = uiSlice.actions;

export default uiSlice.reducer;
