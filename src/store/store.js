import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./slices/gameSlice";
import uiReducer from "./slices/uiSlice";
import userReducer from "./slices/userSlice";
import studyReducer from "./slices/studySlice";
import analysisReducer from "./slices/analysisSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    ui: uiReducer,
    user: userReducer,
    study: studyReducer,
    analysis: analysisReducer,
  },
});
