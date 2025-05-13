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
import "./filterTypeToggleStyles.css";

const FilterTypeToggle = () => {
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
    <div className="filter-type">
      <div className="filter-type__header">
        <div
          className={`filter-type__checkbox ${
            allFiltersActive ? "filter-type__checkbox--active" : ""
          }`}
          onClick={handleAllFiltersToggle}
        >
          {allFiltersActive && <FaCheck className="filter-type__check-icon" />}
        </div>
        <div className="filter-type__title">Filter Type</div>
      </div>
      <div className="filter-type__toggle">
        <div
          className={`filter-type__label ${
            activeFilterType === "pressure" ? "filter-type__label--active" : ""
          }`}
        >
          Pressure
        </div>
        <div className="filter-type__switch" onClick={handleToggle}>
          <div
            className={`filter-type__slider ${
              activeFilterType === "control"
                ? "filter-type__slider--active"
                : ""
            }`}
          ></div>
        </div>
        <div
          className={`filter-type__label ${
            activeFilterType === "control" ? "filter-type__label--active" : ""
          }`}
        >
          Control
        </div>
      </div>
    </div>
  );
};

export default FilterTypeToggle;
