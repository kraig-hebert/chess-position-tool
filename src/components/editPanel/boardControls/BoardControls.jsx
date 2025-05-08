import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTrashCan,
  FaRotateLeft,
  FaArrowDownUpAcrossLine,
  FaReply,
} from "react-icons/fa6";
import { togglePov } from "../../../store/slices/uiSlice";
import {
  setBoard,
  selectOriginalPosition,
} from "../../../store/slices/gameSlice";
import "./boardControlsStyles.css";

const BoardControls = (props) => {
  const { onClearBoard, onResetBoard } = props;
  const dispatch = useDispatch();
  const originalPosition = useSelector(selectOriginalPosition);

  return (
    <div className="board-controls">
      <button className="board-control-button" onClick={onResetBoard}>
        <FaRotateLeft />
        <span>Reset</span>
      </button>
      <button
        className="board-control-button"
        onClick={() => dispatch(setBoard(originalPosition))}
      >
        <FaReply />
        <span>Return</span>
      </button>
      <button
        className="board-control-button"
        onClick={() => dispatch(togglePov())}
      >
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
