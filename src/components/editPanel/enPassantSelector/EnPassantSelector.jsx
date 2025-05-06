import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEnPassantEnabled,
  selectPossibleEnPassantTargets,
  selectSelectedEnPassantTarget,
  selectNextMoveColorAfterEdit,
  toggleEnPassant,
  setPossibleEnPassantTargets,
  setSelectedEnPassantTarget,
} from "../../../store/slices/uiSlice";
import { selectBoard } from "../../../store/slices/gameSlice";
import { findPossibleEnPassantTargets } from "../../../logic/chessUtils";
import "./enPassantSelectorStyles.css";

const EnPassantSelector = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const nextMoveColorAfterEdit = useSelector(selectNextMoveColorAfterEdit);
  const enPassantEnabled = useSelector(selectEnPassantEnabled);
  const possibleEnPassantTargets = useSelector(selectPossibleEnPassantTargets);
  const selectedEnPassantTarget = useSelector(selectSelectedEnPassantTarget);

  // Calculate possible en passant targets when board or next move color changes
  useEffect(() => {
    const targets = findPossibleEnPassantTargets(board, nextMoveColorAfterEdit);
    dispatch(setPossibleEnPassantTargets(targets));

    // If there are no targets, clear the selection
    if (targets.length === 0) {
      dispatch(setSelectedEnPassantTarget(null));
      return;
    }

    // If there are targets but no selection, select the first one
    if (selectedEnPassantTarget === null) {
      dispatch(setSelectedEnPassantTarget(targets[0].notation));
      return;
    }

    // Check if the currently selected target still exists in the new list
    const targetExists = targets.some(
      (target) => target.notation === selectedEnPassantTarget
    );
    if (!targetExists) {
      // If the selected target no longer exists, select the first available target
      dispatch(setSelectedEnPassantTarget(targets[0].notation));
    }
  }, [board, nextMoveColorAfterEdit, dispatch, selectedEnPassantTarget]);

  const handleEnPassantToggle = () => dispatch(toggleEnPassant());

  const handleTargetSelect = (notation) =>
    dispatch(setSelectedEnPassantTarget(notation));

  return (
    <div className="en-passant-selector">
      <div className="en-passant-toggle">
        <input
          type="checkbox"
          id="enable-en-passant"
          checked={enPassantEnabled}
          onChange={handleEnPassantToggle}
        />
        <label htmlFor="enable-en-passant">Allow En Passant Captures</label>
      </div>

      {enPassantEnabled && possibleEnPassantTargets.length > 0 && (
        <div className="en-passant-targets">
          <div className="targets-label">Capture at:</div>
          <div className="targets-list">
            {possibleEnPassantTargets.map((target) => (
              <div
                key={target.notation}
                className={`target-option ${
                  selectedEnPassantTarget === target.notation
                    ? "target-selected"
                    : ""
                }`}
                onClick={() => handleTargetSelect(target.notation)}
              >
                {target.notation}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnPassantSelector;
