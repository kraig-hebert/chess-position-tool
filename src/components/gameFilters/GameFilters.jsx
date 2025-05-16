import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleFiltersByColor,
  selectFilterColors,
  selectActiveFilterType,
} from "../../store/slices/uiSlice";
import {
  FaEyeSlash,
  FaChessBoard,
  FaArrowRightLong,
  FaTriangleExclamation,
  FaPaintbrush,
  FaCrown,
} from "react-icons/fa6";
import FilterTypeToggle from "./filterTypeToggle/FilterTypeToggle";
import GameFiltersButton from "./gameFiltersButton/GameFiltersButton";
import "./gameFiltersStyles.css";

const GameFilters = () => {
  const dispatch = useDispatch();
  const filterColors = useSelector(selectFilterColors);
  const activeFilterType = useSelector(selectActiveFilterType);

  const handleColorToggle = (color) => {
    dispatch(toggleFiltersByColor(color));
  };

  return (
    <div className="game-filters-container">
      <div className="game-filters-content">
        <FilterTypeToggle />

        {/* Color Filters Section */}
        <div className="color-filters-section">
          {/* White Filters */}
          <div className="color-filter-group">
            <div className="color-filter-header">
              <span>White</span>
            </div>
            <div className="color-filter-options">
              <GameFiltersButton
                variant="checkbox"
                icon={FaEyeSlash}
                label={activeFilterType}
                active={filterColors.white}
                onClick={() => handleColorToggle("white")}
              />
              <GameFiltersButton
                variant="checkbox"
                icon={FaTriangleExclamation}
                label="Threats"
                disabled={true}
              />
              <GameFiltersButton
                variant="checkbox"
                icon={FaArrowRightLong}
                label="Captures"
                disabled={true}
              />
              <GameFiltersButton
                variant="checkbox"
                icon={FaCrown}
                label="Checks"
                disabled={true}
              />
            </div>
          </div>

          {/* Black Filters */}
          <div className="color-filter-group">
            <div className="color-filter-header">
              <span>Black</span>
            </div>
            <div className="color-filter-options">
              <GameFiltersButton
                variant="checkbox"
                icon={FaEyeSlash}
                label={activeFilterType}
                active={filterColors.black}
                onClick={() => handleColorToggle("black")}
              />
              <GameFiltersButton
                variant="checkbox"
                icon={FaTriangleExclamation}
                label="Threats"
                disabled={true}
              />
              <GameFiltersButton
                variant="checkbox"
                icon={FaArrowRightLong}
                label="Captures"
                disabled={true}
              />
              <GameFiltersButton
                variant="checkbox"
                icon={FaCrown}
                label="Checks"
                disabled={true}
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="filter-actions">
          <GameFiltersButton
            variant="action"
            icon={FaChessBoard}
            label="Square Colors"
            disabled={true}
          />
          <GameFiltersButton
            variant="action"
            icon={FaPaintbrush}
            label="Custom Colors"
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default GameFilters;
