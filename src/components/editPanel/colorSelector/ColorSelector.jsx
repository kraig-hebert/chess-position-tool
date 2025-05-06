import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNextMoveColor,
  setNextMoveColor,
} from "../../../store/slices/uiSlice";
import "./colorSelectorStyles.css";

const ColorSelector = () => {
  const dispatch = useDispatch();
  const nextMoveColor = useSelector(selectNextMoveColor);

  return (
    <div className="color-selector">
      <div className="color-label">Next move:</div>
      <div className="color-options">
        <div
          className={`color-option white ${
            nextMoveColor === "white" ? "color-selected" : ""
          }`}
          onClick={() => dispatch(setNextMoveColor("white"))}
        >
          White
        </div>
        <div
          className={`color-option black ${
            nextMoveColor === "black" ? "color-selected" : ""
          }`}
          onClick={() => dispatch(setNextMoveColor("black"))}
        >
          Black
        </div>
      </div>
    </div>
  );
};

export default ColorSelector;
