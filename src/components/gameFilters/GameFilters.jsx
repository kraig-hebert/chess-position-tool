import React from "react";
import "./gameFiltersStyles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleFiltersByColor,
  selectFilterColors,
  selectuppercaseFormattedFIlterType,
} from "../../store/slices/uiSlice";
import FilterToggle from "./filterToggle/FilterToggle";

const GameFilters = () => {
  const dispatch = useDispatch();
  const filterColors = useSelector(selectFilterColors);
  const activeFilterType = useSelector(selectuppercaseFormattedFIlterType);

  const handleCheckboxClick = (color) => dispatch(toggleFiltersByColor(color));

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
                filterColors.white ? "checkbox-active" : ""
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
                filterColors.black ? "checkbox-active" : ""
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
