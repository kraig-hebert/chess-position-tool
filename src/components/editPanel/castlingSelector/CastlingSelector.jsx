import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectTempHasMoved,
  setTempHasMoved,
  initialHasMoved,
} from "../../../store/slices/gameSlice";
import "./castlingSelectorStyles.css";

const CastlingSelector = () => {
  const dispatch = useDispatch();
  const tempHasMoved = useSelector(selectTempHasMoved) || initialHasMoved;

  const handleCastlingChange = (key) => {
    dispatch(
      setTempHasMoved({
        ...tempHasMoved,
        [key]: !tempHasMoved[key],
      })
    );
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
                checked={
                  !tempHasMoved.whiteRookKingside && !tempHasMoved.whiteKing
                }
                onChange={() => handleCastlingChange("whiteRookKingside")}
              />
              <span>O-O</span>
            </label>
            <label className="castling-option">
              <input
                type="checkbox"
                checked={
                  !tempHasMoved.whiteRookQueenside && !tempHasMoved.whiteKing
                }
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
                checked={
                  !tempHasMoved.blackRookKingside && !tempHasMoved.blackKing
                }
                onChange={() => handleCastlingChange("blackRookKingside")}
              />
              <span>O-O</span>
            </label>
            <label className="castling-option">
              <input
                type="checkbox"
                checked={
                  !tempHasMoved.blackRookQueenside && !tempHasMoved.blackKing
                }
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
