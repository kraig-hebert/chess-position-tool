import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectTempHasMoved,
  setTempHasMoved,
  initialHasMoved,
  selectBoard,
} from "../../../store/slices/gameSlice";
import {
  getCastlingRights,
  setCastlingAllowed,
} from "../../../logic/chessUtils";
import "./castlingSelectorStyles.css";

const CastlingSelector = () => {
  const dispatch = useDispatch();
  const tempHasMoved = useSelector(selectTempHasMoved) || initialHasMoved;
  const board = useSelector(selectBoard);
  const rights = getCastlingRights(board, tempHasMoved);

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
                checked={rights.white.kingside}
                disabled={!(board[7][4] === "K" && board[7][7] === "R")}
                onChange={(e) =>
                  dispatch(
                    setTempHasMoved(
                      setCastlingAllowed(
                        tempHasMoved,
                        "white",
                        "kingside",
                        e.target.checked
                      )
                    )
                  )
                }
              />
              <span>O-O</span>
            </label>
            <label className="castling-option">
              <input
                type="checkbox"
                checked={rights.white.queenside}
                disabled={!(board[7][4] === "K" && board[7][0] === "R")}
                onChange={(e) =>
                  dispatch(
                    setTempHasMoved(
                      setCastlingAllowed(
                        tempHasMoved,
                        "white",
                        "queenside",
                        e.target.checked
                      )
                    )
                  )
                }
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
                checked={rights.black.kingside}
                disabled={!(board[0][4] === "k" && board[0][7] === "r")}
                onChange={(e) =>
                  dispatch(
                    setTempHasMoved(
                      setCastlingAllowed(
                        tempHasMoved,
                        "black",
                        "kingside",
                        e.target.checked
                      )
                    )
                  )
                }
              />
              <span>O-O</span>
            </label>
            <label className="castling-option">
              <input
                type="checkbox"
                checked={rights.black.queenside}
                disabled={!(board[0][4] === "k" && board[0][0] === "r")}
                onChange={(e) =>
                  dispatch(
                    setTempHasMoved(
                      setCastlingAllowed(
                        tempHasMoved,
                        "black",
                        "queenside",
                        e.target.checked
                      )
                    )
                  )
                }
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
