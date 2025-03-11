import React from "react";
import { useGameState } from "./context/GameStateProvider";

const App = () => {
  const { board } = useGameState();

  return (
    <div>
      <h1>Chess Position Tool</h1>
      <pre>{JSON.stringify(board, null, 2)}</pre>{" "}
      {/* Temporary: Displays the board as JSON */}
    </div>
  );
};

export default App;
