import {
  setAllFiltersToOff,
  setAllFiltersToOn,
  setIsEditMode,
  selectIsEditMode,
  enterEditMode,
  toggleFiltersByColor,
} from "../store/slices/uiSlice";
import { selectBoard } from "../store/slices/gameSlice";

// Keyboard shortcut mapping
export const SHORTCUTS = {
  "Control+a": {
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
  "Control+e": {
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
};

// Helper to check if a keyboard event matches a shortcut
export const matchesShortcut = (event, shortcut) => {
  const parts = shortcut.toLowerCase().split("+");
  const key = parts.pop();
  const modifiers = new Set(parts);
  console.log(event, key);

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
