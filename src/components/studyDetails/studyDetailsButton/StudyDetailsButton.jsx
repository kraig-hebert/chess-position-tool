import React from "react";
import "./studyDetailsButtonStyles.css";

const StudyDetailsButton = ({
  onClick,
  icon: Icon,
  label,
  active = false,
  disabled = false,
}) => {
  const buttonClass = `study-variation-btn ${
    active ? "study-variation-btn--active" : ""
  } ${disabled ? "study-variation-btn--disabled" : ""}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      <Icon className="study-variation-btn__icon" />
      <span className="study-variation-btn__label">{label}</span>
    </button>
  );
};

export default StudyDetailsButton;
