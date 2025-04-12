import React from "react";
import "./filterToggleStyles.css";
import { useGameState } from "../../../context/GameStateProvider";

const FilterToggle = () => {
  const { activeFilters, toggleActiveFilterType } = useGameState();
  return (
    <div className="filter-toggle-container">
      <div className="filter-toggle">
        <span>Pressure</span>
        <span>Control</span>
        <div
          className={`selector-thumb ${
            activeFilters.activeFilterType === "pressure" ? "bottom" : "top"
          }`}
          onClick={toggleActiveFilterType}
        ></div>
      </div>
    </div>
  );
};

export default FilterToggle;
