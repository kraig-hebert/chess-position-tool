import {
  setAllFiltersToOff,
  setAllFiltersToOn,
  setIsEditMode,
  selectIsEditMode,
  enterEditMode,
  toggleFiltersByColor,
  toggleActiveFilterType,
  togglePov,
} from "../store/slices/uiSlice";
import {
  selectBoard,
  resetGame,
  selectActiveMove,
  selectGroupedMovesList,
} from "../store/slices/gameSlice";
import { moveForward, moveBackward } from "./moveNavigation";

// Keyboard shortcut mapping
export const SHORTCUTS = {
  1: {
    description: "Toggle white filters",
    action: (dispatch) => {
      dispatch(toggleFiltersByColor("white"));
    },
  },
  2: {
    description: "Toggle black filters",
    action: (dispatch) => {
      dispatch(toggleFiltersByColor("black"));
    },
  },
  3: {
    description: "Toggle between pressure and control view",
    action: (dispatch) => {
      dispatch(toggleActiveFilterType());
    },
  },
  4: {
    description: "Toggle all filters on/off",
    action: (dispatch, state) => {
      const { activeFilters } = state.ui;
      const hasActiveFilters =
        activeFilters.colors.white || activeFilters.colors.black;
      if (hasActiveFilters) {
        dispatch(setAllFiltersToOff());
      } else {
        dispatch(setAllFiltersToOn());
      }
    },
  },
  e: {
    description: "Enter/exit edit mode",
    action: (dispatch, state) => {
      const isEditMode = selectIsEditMode(state);
      if (!isEditMode) {
        // Enter edit mode using the centralized action
        dispatch(enterEditMode(selectBoard(state)));
      } else {
        // Exit edit mode
        dispatch(setIsEditMode(false));
      }
    },
  },
  f: {
    description: "Flip board",
    action: (dispatch) => {
      dispatch(togglePov());
    },
  },
  r: {
    description: "Reset game",
    action: (dispatch) => {
      dispatch(resetGame());
    },
  },
  ArrowLeft: {
    description: "Go to previous move",
    action: (dispatch, state) => {
      const activeMove = selectActiveMove(state);
      const groupedMovesList = selectGroupedMovesList(state);
      moveBackward(dispatch, activeMove, groupedMovesList);
    },
  },
  ArrowRight: {
    description: "Go to next move",
    action: (dispatch, state) => {
      const activeMove = selectActiveMove(state);
      const groupedMovesList = selectGroupedMovesList(state);
      moveForward(dispatch, activeMove, groupedMovesList);
    },
  },
};

// Helper to check if a keyboard event matches a shortcut
export const matchesShortcut = (event, shortcut) => {
  const parts = shortcut.toLowerCase().split("+");
  const key = parts.pop();
  const modifiers = new Set(parts);

  return (
    event.key.toLowerCase() === key &&
    modifiers.has("control") === event.ctrlKey &&
    modifiers.has("shift") === event.shiftKey &&
    modifiers.has("alt") === event.altKey
  );
};

// Main keyboard event handler
export const handleKeyboardShortcut = (event, dispatch, state) => {
  // Don't trigger shortcuts when typing in input fields
  if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
    return;
  }

  // Check if any of our shortcuts match before the browser handles the event
  for (const [shortcut, { action }] of Object.entries(SHORTCUTS)) {
    if (matchesShortcut(event, shortcut)) {
      // Prevent browser's default handling of the shortcut
      event.preventDefault();
      event.stopPropagation();
      action(dispatch, state);
      break;
    }
  }
};
