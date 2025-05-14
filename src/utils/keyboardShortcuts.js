import { setAllFiltersToOff, setAllFiltersToOn } from "../store/slices/uiSlice";

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

  for (const [shortcut, { action }] of Object.entries(SHORTCUTS)) {
    if (matchesShortcut(event, shortcut)) {
      event.preventDefault();
      action(dispatch, state);
      break;
    }
  }
};
