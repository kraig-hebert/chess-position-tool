import React, { useEffect } from "react";
import { useGameState } from "../../../context/GameStateProvider";
import { findPossibleEnPassantTargets } from "../../../logic/chessUtils";
import "./enPassantSelectorStyles.css";

const EnPassantSelector = () => {
  const {
    board,
    nextMoveColor,
    enPassantEnabled,
    setEnPassantEnabled,
    possibleEnPassantTargets,
    setPossibleEnPassantTargets,
    selectedEnPassantTarget,
    setSelectedEnPassantTarget,
  } = useGameState();

  // Calculate possible en passant targets when board or next move color changes
  useEffect(() => {
    const targets = findPossibleEnPassantTargets(board, nextMoveColor);
    setPossibleEnPassantTargets(targets);

    // Reset the selected target if there are targets available
    if (targets.length > 0) {
      setSelectedEnPassantTarget(0);
    }
  }, [
    board,
    nextMoveColor,
    setPossibleEnPassantTargets,
    setSelectedEnPassantTarget,
  ]);

  const handleEnPassantToggle = () => {
    setEnPassantEnabled(!enPassantEnabled);
  };

  const handleTargetSelect = (index) => {
    setSelectedEnPassantTarget(index);
  };

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
