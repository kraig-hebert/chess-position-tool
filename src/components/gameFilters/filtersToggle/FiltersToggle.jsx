import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveFilterType,
  toggleActiveFilterType,
  selectFilterColors,
  setAllFiltersToOn,
  setAllFiltersToOff,
} from "../../../store/slices/uiSlice";
import { FaCheck } from "react-icons/fa6";
import "./filtersToggleStyles.css";

const FiltersToggle = () => {
  const dispatch = useDispatch();
  const activeFilterType = useSelector(selectActiveFilterType);
  const filterColors = useSelector(selectFilterColors);

  const handleToggle = () => {
    dispatch(toggleActiveFilterType());
  };

  const handleAllFiltersToggle = () => {
    if (filterColors.white || filterColors.black) {
      dispatch(setAllFiltersToOff());
    } else {
      dispatch(setAllFiltersToOn());
    }
  };

  const allFiltersActive = filterColors.white || filterColors.black;

  return (
    <div className="filters-toggle">
      <div className="filters-toggle__header">
        <div
          className={`filters-toggle__checkbox ${
            allFiltersActive ? "filters-toggle__checkbox--active" : ""
          }`}
          onClick={handleAllFiltersToggle}
        >
          {allFiltersActive && (
            <FaCheck className="filters-toggle__check-icon" />
          )}
        </div>
        <div className="filters-toggle__title">Filters</div>
      </div>
      <div className="filters-toggle__toggle">
        <div
          className={`filters-toggle__label ${
            activeFilterType === "pressure"
              ? "filters-toggle__label--active"
              : ""
          }`}
        >
          Pressure
        </div>
        <div className="filters-toggle__switch" onClick={handleToggle}>
          <div
            className={`filters-toggle__slider ${
              activeFilterType === "control"
                ? "filters-toggle__slider--active"
                : ""
            }`}
          ></div>
        </div>
        <div
          className={`filters-toggle__label ${
            activeFilterType === "control"
              ? "filters-toggle__label--active"
              : ""
          }`}
        >
          Control
        </div>
      </div>
    </div>
  );
};

export default FiltersToggle;
