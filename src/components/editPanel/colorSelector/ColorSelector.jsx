import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNextMoveColorAfterEdit,
  setNextMoveColorAfterEdit,
} from "../../../store/slices/uiSlice";
import "./colorSelectorStyles.css";

const ColorSelector = () => {
  const dispatch = useDispatch();
  const nextMoveColorAfterEdit = useSelector(selectNextMoveColorAfterEdit);

  return (
    <div className="color-selector">
      <div className="color-label">Next move:</div>
      <div className="color-options">
        <div
          className={`color-option white ${
            nextMoveColorAfterEdit === "white" ? "color-selected" : ""
          }`}
          onClick={() => dispatch(setNextMoveColorAfterEdit("white"))}
        >
          White
        </div>
        <div
          className={`color-option black ${
            nextMoveColorAfterEdit === "black" ? "color-selected" : ""
          }`}
          onClick={() => dispatch(setNextMoveColorAfterEdit("black"))}
        >
          Black
        </div>
      </div>
    </div>
  );
};

export default ColorSelector;
