import React from "react";
import ReactDOM from "react-dom/client";
import { GameStateProvider } from "./context/GameStateProvider";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

import App from "./App";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <GameStateProvider>
        <App />
      </GameStateProvider>
    </Provider>
  </React.StrictMode>
);
