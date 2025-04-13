import React from "react";

import "./gameFiltersStyles.css";
import { useGameState } from "../../context/GameStateProvider";

import FilterToggle from "./filterToggle/FilterToggle";

const GameFilters = () => {
  const { activeFilters, toggleFiltersByColor } = useGameState();
  const handleCheckboxClick = (color) => toggleFiltersByColor(color);
  const activeFilterType =
    String(activeFilters.activeFilterType).charAt(0).toUpperCase() +
    activeFilters.activeFilterType.slice(1);
  return (
    <div className="game-filters-container">
      <div className="game-filters-content">
        <FilterToggle />
        <div className="player-filters">
          <div className="player-filters-title">White</div>
          <div className="player-filters-item">
            {activeFilterType}
            <span
              className={`checkbox ${
                activeFilters.colors.white ? "checkbox-active" : ""
              }`}
              onClick={() => handleCheckboxClick("white")}
            ></span>
          </div>
        </div>
        <div className="player-filters">
          <div className="player-filters-title">Black</div>
          <div className="player-filters-item">
            {activeFilterType}
            <span
              className={`checkbox ${
                activeFilters.colors.black ? "checkbox-active" : ""
              }`}
              onClick={() => handleCheckboxClick("black")}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameFilters;
