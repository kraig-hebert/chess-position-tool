import React from "react";
import "./filterToggleStyles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleActiveFilterType,
  selectActiveFilterType,
} from "../../../store/slices/uiSlice";

const FilterToggle = () => {
  const dispatch = useDispatch();
  const activeFilterType = useSelector(selectActiveFilterType);

  const handleToggle = () => dispatch(toggleActiveFilterType());

  return (
    <div className="filter-toggle-container">
      <div className="filter-toggle">
        <span>Pressure</span>
        <span>Control</span>
        <div
          className={`selector-thumb ${
            activeFilterType === "pressure" ? "bottom" : "top"
          }`}
          onClick={handleToggle}
        ></div>
      </div>
    </div>
  );
};

export default FilterToggle;
