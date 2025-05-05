import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Analysis state will go here
};

export const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    // Analysis reducers will go here
  },
});

export const {} = analysisSlice.actions;

export default analysisSlice.reducer;
