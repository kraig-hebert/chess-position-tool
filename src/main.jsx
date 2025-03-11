import React from "react";
import ReactDOM from "react-dom/client";
import { GameStateProvider } from "./context/GameStateProvider";

import App from "./App";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GameStateProvider>
    <App />
  </GameStateProvider>
);
