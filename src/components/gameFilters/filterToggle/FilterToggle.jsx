import React from "react";
import "./filterToggleStyles.css";
import { useGameState } from "../../../context/GameStateProvider";

const FilterToggle = () => {
  const handleThumbClick = () => {};
  return (
    <div className="filter-toggle-container">
      <div className="filter-toggle">
        <span>Pressure</span>
        <span>Control</span>
        <div className="selector-thumb" onClick={handleThumbClick}></div>
      </div>
    </div>
  );
};

export default FilterToggle;
