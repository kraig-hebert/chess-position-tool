import React, { useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import Board from "./components/board/Board";
import { handleKeyboardShortcut } from "./utils/keyboardShortcuts";
import "./appStyles.css";

function App() {
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyboardShortcut(event, dispatch, store.getState());
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  return (
    <div id="app">
      <h1>Chess Position Tool</h1>
      <Board />
    </div>
  );
}

export default App;
