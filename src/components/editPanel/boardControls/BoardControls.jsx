import React from "react";
import {
  FaTrashCan,
  FaRotateLeft,
  FaArrowDownUpAcrossLine,
  FaReply,
} from "react-icons/fa6";
import { useGameState } from "../../../context/GameStateProvider";
import "./boardControlsStyles.css";

const BoardControls = (props) => {
  const { onClearBoard, onResetBoard } = props;
  const { togglePov, originalPosition, setBoard } = useGameState();

  const handleReturnToPosition = () => {
    if (originalPosition) {
      setBoard(originalPosition);
    }
  };

  return (
    <div className="board-controls">
      <button className="board-control-button" onClick={onResetBoard}>
        <FaRotateLeft />
        <span>Reset</span>
      </button>
      <button className="board-control-button" onClick={handleReturnToPosition}>
        <FaReply />
        <span>Return</span>
      </button>
      <button className="board-control-button" onClick={togglePov}>
        <FaArrowDownUpAcrossLine />
        <span>Flip</span>
      </button>
      <button className="board-control-button" onClick={onClearBoard}>
        <FaTrashCan />
        <span>Clear</span>
      </button>
    </div>
  );
};

export default BoardControls;
