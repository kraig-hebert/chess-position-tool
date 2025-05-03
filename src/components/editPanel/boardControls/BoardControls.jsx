import React from "react";
import { FaTrashCan, FaRotateLeft } from "react-icons/fa6";
import "./boardControlsStyles.css";

const BoardControls = (props) => {
  const { onClearBoard, onResetBoard } = props;

  return (
    <div className="board-controls">
      <button className="board-control-button" onClick={onClearBoard}>
        <FaTrashCan />
        <span>Clear Board</span>
      </button>
      <button className="board-control-button" onClick={onResetBoard}>
        <FaRotateLeft />
        <span>Reset Board</span>
      </button>
    </div>
  );
};

export default BoardControls;
