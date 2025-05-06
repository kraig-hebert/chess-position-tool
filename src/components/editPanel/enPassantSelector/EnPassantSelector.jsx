import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEnPassantEnabled,
  selectPossibleEnPassantTargets,
  selectSelectedEnPassantTarget,
  selectNextMoveColor,
  toggleEnPassant,
  setPossibleEnPassantTargets,
  setSelectedEnPassantTarget,
} from "../../../store/slices/uiSlice";
import { useGameState } from "../../../context/GameStateProvider";
import { findPossibleEnPassantTargets } from "../../../logic/chessUtils";
import "./enPassantSelectorStyles.css";

const EnPassantSelector = () => {
  const { board } = useGameState();
  const dispatch = useDispatch();
  const nextMoveColor = useSelector(selectNextMoveColor);
  const enPassantEnabled = useSelector(selectEnPassantEnabled);
  const possibleEnPassantTargets = useSelector(selectPossibleEnPassantTargets);
  const selectedEnPassantTarget = useSelector(selectSelectedEnPassantTarget);

  // Calculate possible en passant targets when board or next move color changes
  useEffect(() => {
    const targets = findPossibleEnPassantTargets(board, nextMoveColor);
    dispatch(setPossibleEnPassantTargets(targets));

    // Reset the selected target if there are targets available
    if (targets.length > 0) {
      dispatch(
        setSelectedEnPassantTarget(
          selectedEnPassantTarget ? selectedEnPassantTarget : 0
        )
      );
    }
  }, [board, nextMoveColor, dispatch, selectedEnPassantTarget]);

  const handleEnPassantToggle = () => dispatch(toggleEnPassant());

  const handleTargetSelect = (index) =>
    dispatch(setSelectedEnPassantTarget(index));

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
            {possibleEnPassantTargets.map((target, index) => (
              <div
                key={`${target.row}-${target.col}`}
                className={`target-option ${
                  selectedEnPassantTarget === index ? "target-selected" : ""
                }`}
                onClick={() => handleTargetSelect(index)}
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
