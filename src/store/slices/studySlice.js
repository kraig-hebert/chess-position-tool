import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Study state will go here
};

export const studySlice = createSlice({
  name: "study",
  initialState,
  reducers: {
    // Study reducers will go here
  },
});

export const {} = studySlice.actions;

export default studySlice.reducer;
