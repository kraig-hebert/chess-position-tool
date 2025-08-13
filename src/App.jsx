import React, { useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import Board from "./components/board/Board";
import {
  handleKeyboardKeyDown,
  handleKeyboardKeyUp,
} from "./utils/keyboardShortcuts";
import "./appStyles.css";

function App() {
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      handleKeyboardKeyDown(event, dispatch, store.getState());
    };

    const handleKeyUp = (event) => {
      handleKeyboardKeyUp(event, dispatch, store.getState());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch, store]);

  return (
    <div id="app">
      <h1>Chess Position Tool</h1>
      <Board />
    </div>
  );
}

export default App;
