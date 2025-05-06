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
  selectedPieceType: null,
  activeAction: "add", // "add", "move", "trash"
  nextMoveColor: "white",
  enPassantEnabled: false,
  possibleEnPassantTargets: [],
  selectedEnPassantTarget: 0, // Index of selected target
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
    setSelectedPieceType: (state, action) => {
      state.selectedPieceType = action.payload;
    },
    setActiveAction: (state, action) => {
      state.activeAction = action.payload;
      // Clear selected piece when switching to move or trash actions
      if (action.payload !== "add") {
        state.selectedPieceType = null;
      }
    },
    setNextMoveColor: (state, action) => {
      state.nextMoveColor = action.payload;
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
    resetEditMode: (state) => {
      state = initialState;
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
export const selectSelectedPieceType = (state) => state.ui.selectedPieceType;
export const selectActiveAction = (state) => state.ui.activeAction;
export const selectNextMoveColor = (state) => state.ui.nextMoveColor;
export const selectEnPassantEnabled = (state) => state.ui.enPassantEnabled;
export const selectPossibleEnPassantTargets = (state) =>
  state.ui.possibleEnPassantTargets;
export const selectSelectedEnPassantTarget = (state) =>
  state.ui.selectedEnPassantTarget;

export const {
  toggleFiltersByColor,
  toggleActiveFilterType,
  setSelectedPieceType,
  setActiveAction,
  setNextMoveColor,
  toggleEnPassant,
  setPossibleEnPassantTargets,
  setSelectedEnPassantTarget,
  resetEditMode,
} = uiSlice.actions;

export default uiSlice.reducer;
