import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeFilters: {
    colors: { white: true, black: true },
    activeFilterType: "pressure", // pressure or control
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleFiltersByColor: (state, action) => {
      const color = action.payload;
      state.activeFilters.colors[color] = !state.activeFilters.colors[color];
    },
    toggleActiveFilterType: (state) => {
      state.activeFilters.activeFilterType =
        state.activeFilters.activeFilterType === "pressure"
          ? "control"
          : "pressure";
    },
  },
});

// Selectors
export const selectActiveFilters = (state) => state.ui.activeFilters;
export const selectActiveFilterType = (state) =>
  state.ui.activeFilters.activeFilterType;
export const selectFilterColors = (state) => state.ui.activeFilters.colors;

// Format the filter type for display (capitalize first letter)
export const selectFormattedFilterType = (state) => {
  const filterType = selectActiveFilterType(state);
  return filterType.charAt(0).toUpperCase() + filterType.slice(1);
};

export const { toggleFiltersByColor, toggleActiveFilterType } = uiSlice.actions;

export default uiSlice.reducer;
