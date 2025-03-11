import React from "react";

import Board from "./components/board/Board";
import "./appStyles.css";

const App = () => {
  return (
    <div id="app">
      <h1>Chess Position Tool</h1>
      <Board />
    </div>
  );
};

export default App;
