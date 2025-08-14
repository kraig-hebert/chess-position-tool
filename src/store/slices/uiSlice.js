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
import {
  setTempHasMoved,
  resetTempHasMoved,
  setOriginalPosition,
} from "../slices/gameSlice";
import { copyBoard, ensureHasMovedConsistency } from "../../logic/chessUtils";
import {
  selectBoard,
  selectHasMoved,
  selectActiveColor as selectGameActiveColor,
  selectEnPassantTarget as selectGameEnPassantTarget,
  setOriginalHasMoved,
  setOriginalActiveColor,
  setOriginalEnPassantTarget,
  setOriginalMovesList,
  selectMovesList,
} from "../slices/gameSlice";

const initialState = {
  activeFilters: {
    colors: { white: true, black: true },
    activeFilterType: "control", // pressure or control
  },
  attackerInspect: {
    enabled: false,
    inspectedSquare: null, // { row, col } | null
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
  isEditMode: false,
  selectedPieceTypeForEdit: null,
  activeEditAction: "add", // "add", "move", "trash"
  nextMoveColorAfterEdit: "white",
  enPassantEnabled: true,
  possibleEnPassantTargets: [],
  selectedEnPassantTarget: 0, // Index of selected target
  selectedEditMoveSquare: null, // { row, col, piece }
  arrowDrawing: {
    isDrawing: false,
    startSquare: null, // {row, col}
    currentEndSquare: null, // {row, col}
  },
  arrows: [], // [{start: {row, col}, end: {row, col}, color: string, type: string}]
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
    setAllFiltersToOff: (state) => {
      state.activeFilters.colors.black = false;
      state.activeFilters.colors.white = false;
    },
    setAllFiltersToOn: (state) => {
      state.activeFilters.colors.black = true;
      state.activeFilters.colors.white = true;
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
    setEnPassantEnabled: (state, action) => {
      state.enPassantEnabled = action.payload;
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
    setIsEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },
    setPov: (state, action) => {
      state.pov = action.payload;
    },
    togglePov: (state) => {
      state.pov = state.pov === "white" ? "black" : "white";
    },
    setArrowDrawing: (state, action) => {
      state.arrowDrawing = action.payload;
    },
    updateArrowEndSquare: (state, action) => {
      if (state.arrowDrawing.isDrawing) {
        state.arrowDrawing.currentEndSquare = action.payload;
      }
    },
    addArrow: (state, action) => {
      state.arrows.push(action.payload);
    },
    resetArrowDrawing: (state) => {
      state.arrowDrawing = {
        isDrawing: false,
        startSquare: null,
        currentEndSquare: null,
      };
    },
    clearArrows: (state) => {
      state.arrows = [];
    },
    setAttackerInspectEnabled: (state, action) => {
      state.attackerInspect.enabled = action.payload;
    },
    toggleAttackerInspect: (state) => {
      state.attackerInspect.enabled = !state.attackerInspect.enabled;
    },
    setInspectedSquare: (state, action) => {
      state.attackerInspect.inspectedSquare = action.payload;
      // Clear arrows when inspected square changes
      state.arrows = [];
    },
  },
});

// Base selectors
export const selectActiveFilters = (state) => state.ui.activeFilters;
export const selectActiveFilterType = (state) =>
  state.ui.activeFilters.activeFilterType;
export const selectFilterColors = (state) => state.ui.activeFilters.colors;
export const selectAttackerInspectEnabled = (state) =>
  state.ui.attackerInspect.enabled;
export const selectInspectedSquare = (state) =>
  state.ui.attackerInspect.inspectedSquare;
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
export const selectIsEditMode = (state) => state.ui.isEditMode;
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

export const selectArrowDrawing = (state) => state.ui.arrowDrawing;
export const selectArrows = (state) => state.ui.arrows;

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
  setPov,
  togglePov,
  setIsEditMode,
  setArrowDrawing,
  updateArrowEndSquare,
  addArrow,
  resetArrowDrawing,
  clearArrows,
  setAllFiltersToOff,
  setAllFiltersToOn,
  setEnPassantEnabled,
  setAttackerInspectEnabled,
  toggleAttackerInspect,
  setInspectedSquare,
} = uiSlice.actions;

// Thunk action creator that coordinates multiple actions for entering edit mode
export const enterEditMode =
  (board, activeColor, hasMoved) => (dispatch, getState) => {
    const state = getState();
    const currentBoard = selectBoard(state);
    const currentHasMoved = selectHasMoved(state);
    const currentActiveColor = selectGameActiveColor(state);
    const currentEnPassantTarget = selectGameEnPassantTarget(state);
    const currentMovesList = selectMovesList(state);

    dispatch(setOriginalPosition(copyBoard(currentBoard)));
    const normalizedHasMoved = ensureHasMovedConsistency(
      currentBoard,
      currentHasMoved
    );
    dispatch(setOriginalHasMoved(normalizedHasMoved));
    dispatch(setOriginalActiveColor(currentActiveColor));
    dispatch(setOriginalEnPassantTarget(currentEnPassantTarget));
    dispatch(setOriginalMovesList(currentMovesList));

    dispatch(setTempHasMoved(normalizedHasMoved));
    dispatch(setIsEditMode(true));
    dispatch(clearArrows());
    dispatch(setNextMoveColorAfterEdit(activeColor));
  };

export const resetEditMode = () => (dispatch) => {
  dispatch(setSelectedPieceTypeForEdit(null));
  dispatch(setActiveEditAction("add"));
  dispatch(setEnPassantEnabled(true));
  dispatch(setNextMoveColorAfterEdit("white"));
  dispatch(setPossibleEnPassantTargets([]));
  dispatch(setSelectedEnPassantTarget(0));
  dispatch(setSelectedEditMoveSquare(null));
  dispatch(resetTempHasMoved());
};

export default uiSlice.reducer;
