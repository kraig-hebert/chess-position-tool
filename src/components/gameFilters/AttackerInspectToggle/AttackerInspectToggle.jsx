import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAttackerInspectEnabled,
  toggleAttackerInspect,
} from "../../../store/slices/uiSlice";
import "./attackerInspectToggleStyles.css";

const AttackerInspectToggle = () => {
  const dispatch = useDispatch();
  const enabled = useSelector(selectAttackerInspectEnabled);

  const handleToggle = () => dispatch(toggleAttackerInspect());

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
    </div>
  );
};

export default AttackerInspectToggle;
