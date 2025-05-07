import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import {
  FaChessPawn,
  FaChessRook,
  FaChessKnight,
  FaChessBishop,
  FaChessQueen,
  FaChessKing,
} from "react-icons/fa6";

const initialState = {
  activeFilters: {
    colors: { white: true, black: true },
    activeFilterType: "pressure", // pressure or control
  },
  pieceIcons: {
    p: { iconName: "pawn", className: "piece black" },
    r: { iconName: "rook", className: "piece black" },
    n: { iconName: "knight", className: "piece black" },
    b: { iconName: "bishop", className: "piece black" },
    q: { iconName: "queen", className: "piece black" },
    k: { iconName: "king", className: "piece black" },
    P: { iconName: "pawn", className: "piece white" },
    R: { iconName: "rook", className: "piece white" },
    N: { iconName: "knight", className: "piece white" },
    B: { iconName: "bishop", className: "piece white" },
    Q: { iconName: "queen", className: "piece white" },
    K: { iconName: "king", className: "piece white" },
  },
  pov: "white",
  selectedPieceTypeForEdit: null,
  activeEditAction: "add", // "add", "move", "trash"
  nextMoveColorAfterEdit: "white",
  enPassantEnabled: false,
  possibleEnPassantTargets: [],
  selectedEnPassantTarget: 0, // Index of selected target
  selectedEditMoveSquare: null, // { row, col, piece }
};

const iconMap = {
  pawn: FaChessPawn,
  rook: FaChessRook,
  knight: FaChessKnight,
  bishop: FaChessBishop,
  queen: FaChessQueen,
  king: FaChessKing,
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
    setSelectedPieceTypeForEdit: (state, action) => {
      state.selectedPieceTypeForEdit = action.payload;
    },
    setActiveEditAction: (state, action) => {
      state.activeEditAction = action.payload;
      // Clear selected piece when switching to move or trash actions
      if (action.payload !== "add") {
        state.selectedPieceTypeForEdit = null;
      }
    },
    setNextMoveColorAfterEdit: (state, action) => {
      state.nextMoveColorAfterEdit = action.payload;
    },
    toggleEnPassant: (state) => {
      state.enPassantEnabled = !state.enPassantEnabled;
    },
    setPossibleEnPassantTargets: (state, action) => {
      state.possibleEnPassantTargets = action.payload;
    },
    setSelectedEnPassantTarget: (state, action) => {
      state.selectedEnPassantTarget = action.payload;
    },
    setSelectedEditMoveSquare: (state, action) => {
      state.selectedEditMoveSquare = action.payload;
    },
    resetEditMode: (state) => {
      return initialState;
    },
    setPov: (state, action) => {
      state.pov = action.payload;
    },
    togglePov: (state) => {
      state.pov = state.pov === "white" ? "black" : "white";
    },
  },
});

// Base selectors
export const selectActiveFilters = (state) => state.ui.activeFilters;
export const selectActiveFilterType = (state) =>
  state.ui.activeFilters.activeFilterType;
export const selectFilterColors = (state) => state.ui.activeFilters.colors;
const selectPieceIconsData = (state) => state.ui.pieceIcons;

// Memoized selector that combines the icon data with actual components
export const selectPieceIcons = createSelector(
  [selectPieceIconsData],
  (pieceIconsData) => {
    const result = {};
    Object.entries(pieceIconsData).forEach(
      ([piece, { iconName, className }]) => {
        result[piece] = {
          icon: iconMap[iconName.toLowerCase()],
          className,
        };
      }
    );
    return result;
  }
);

// Format the filter type for display (capitalize first letter)
export const selectuppercaseFormattedFIlterType = (state) => {
  const filterType = selectActiveFilterType(state);
  return filterType.charAt(0).toUpperCase() + filterType.slice(1);
};

// Edit mode selectors
export const selectSelectedPieceTypeForEdit = (state) =>
  state.ui.selectedPieceTypeForEdit;
export const selectActiveEditAction = (state) => state.ui.activeEditAction;
export const selectNextMoveColorAfterEdit = (state) =>
  state.ui.nextMoveColorAfterEdit;
export const selectEnPassantEnabled = (state) => state.ui.enPassantEnabled;
export const selectPossibleEnPassantTargets = (state) =>
  state.ui.possibleEnPassantTargets;
export const selectSelectedEnPassantTarget = (state) =>
  state.ui.selectedEnPassantTarget;
export const selectSelectedEditMoveSquare = (state) =>
  state.ui.selectedEditMoveSquare;

// Add pov selector
export const selectPov = (state) => state.ui.pov;

export const {
  toggleFiltersByColor,
  toggleActiveFilterType,
  setSelectedPieceTypeForEdit,
  setActiveEditAction,
  setNextMoveColorAfterEdit,
  toggleEnPassant,
  setPossibleEnPassantTargets,
  setSelectedEnPassantTarget,
  setSelectedEditMoveSquare,
  resetEditMode,
  setPov,
  togglePov,
} = uiSlice.actions;

export default uiSlice.reducer;
