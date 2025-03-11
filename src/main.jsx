import React from "react";
import ReactDOM from "react-dom/client";
import { GameStateProvider } from "./context/GameStateProvider";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GameStateProvider>
    <App />
  </GameStateProvider>
);
