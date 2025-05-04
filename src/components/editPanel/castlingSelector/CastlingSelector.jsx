import React from "react";
import { useGameState } from "../../../context/GameStateProvider";
import "./castlingSelectorStyles.css";

const CastlingSelector = () => {
  const { tempHasMoved, setTempHasMoved } = useGameState();

  const handleCastlingChange = (key) => {
    setTempHasMoved({
      ...tempHasMoved,
      [key]: !tempHasMoved[key],
    });
  };

  return (
    <div className="castling-selector">
      <div className="castling-header">Castling Rights:</div>
      <div className="castling-options">
        <div className="castling-side">
          <div className="side-label">White:</div>
          <div className="castling-checkboxes">
            <label className="castling-option">
              <input
                type="checkbox"
                checked={!tempHasMoved.whiteRookKingside}
                onChange={() => handleCastlingChange("whiteRookKingside")}
              />
              <span>O-O</span>
            </label>
            <label className="castling-option">
              <input
                type="checkbox"
                checked={!tempHasMoved.whiteRookQueenside}
                onChange={() => handleCastlingChange("whiteRookQueenside")}
              />
              <span>O-O-O</span>
            </label>
          </div>
        </div>
        <div className="castling-side">
          <div className="side-label">Black:</div>
          <div className="castling-checkboxes">
            <label className="castling-option">
              <input
                type="checkbox"
                checked={!tempHasMoved.blackRookKingside}
                onChange={() => handleCastlingChange("blackRookKingside")}
              />
              <span>O-O</span>
            </label>
            <label className="castling-option">
              <input
                type="checkbox"
                checked={!tempHasMoved.blackRookQueenside}
                onChange={() => handleCastlingChange("blackRookQueenside")}
              />
              <span>O-O-O</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastlingSelector;
