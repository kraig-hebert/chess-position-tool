import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // User state will go here
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // User reducers will go here
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
