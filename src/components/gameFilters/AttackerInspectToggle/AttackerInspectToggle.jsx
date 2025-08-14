import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAttackerInspectEnabled,
  selectShowDefenders,
  selectInspectedSquare,
  toggleAttackerInspect,
  toggleShowDefenders,
  setInspectedSquare,
} from "../../../store/slices/uiSlice";
import { resetSelectedPiece } from "../../../store/slices/gameSlice";
import "./attackerInspectToggleStyles.css";

const AttackerInspectToggle = () => {
  const dispatch = useDispatch();
  const enabled = useSelector(selectAttackerInspectEnabled);
  const showDefenders = useSelector(selectShowDefenders);
  const inspectedSquare = useSelector(selectInspectedSquare);

  const handleToggle = () => {
    dispatch(toggleAttackerInspect());
    if (enabled) {
      // Toggling OFF: clear inspected red square
      dispatch(setInspectedSquare(null));
    } else {
      // Toggling ON: clear selected yellow square and any legal move dots
      dispatch(resetSelectedPiece());
    }
  };

  const handleDefenderToggle = () => {
    dispatch(toggleShowDefenders());
    // Refresh the view by clearing and re-setting the inspected square
    if (enabled && inspectedSquare) {
      const tempSquare = { ...inspectedSquare };
      dispatch(setInspectedSquare(null));
      setTimeout(() => {
        dispatch(setInspectedSquare(tempSquare));
      }, 0);
    }
  };

  return (
    <div className="attacker-toggle">
      <div className="attacker-toggle__header">
        <div className="attacker-toggle__title">Attacker Inspect</div>
      </div>
      <div className="attacker-toggle__toggle">
        <div
          className={`attacker-toggle__label ${
            !enabled ? "attacker-toggle__label--active" : ""
          }`}
        >
          Off
        </div>
        <div className="attacker-toggle__switch" onClick={handleToggle}>
          <div
            className={`attacker-toggle__slider ${
              enabled ? "attacker-toggle__slider--active" : ""
            }`}
          ></div>
        </div>
        <div
          className={`attacker-toggle__label ${
            enabled ? "attacker-toggle__label--active" : ""
          }`}
        >
          On
        </div>
      </div>
      <div className="attacker-toggle__defenders">
        <label className="attacker-toggle__checkbox-label">
          <input
            type="checkbox"
            checked={showDefenders}
            onChange={handleDefenderToggle}
            className="attacker-toggle__checkbox"
            disabled={!enabled}
          />
          <span>Show Defenders</span>
        </label>
      </div>
    </div>
  );
};

export default AttackerInspectToggle;
