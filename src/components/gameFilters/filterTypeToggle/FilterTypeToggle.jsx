import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveFilterType,
  toggleActiveFilterType,
} from "../../../store/slices/uiSlice";
import "./filterTypeToggleStyles.css";

const FilterTypeToggle = () => {
  const dispatch = useDispatch();
  const activeFilterType = useSelector(selectActiveFilterType);

  const handleToggle = () => {
    dispatch(toggleActiveFilterType());
  };

  return (
    <div className="filter-type-section">
      <div className="filter-type-header">
        <span>Filter Type</span>
      </div>
      <div className="filter-type-toggle">
        <span className={activeFilterType === "pressure" ? "active" : ""}>
          Pressure
        </span>
        <div className="toggle-switch" onClick={handleToggle}>
          <div
            className={`toggle-slider ${
              activeFilterType === "control" ? "active" : ""
            }`}
          ></div>
        </div>
        <span className={activeFilterType === "control" ? "active" : ""}>
          Control
        </span>
      </div>
    </div>
  );
};

export default FilterTypeToggle;
