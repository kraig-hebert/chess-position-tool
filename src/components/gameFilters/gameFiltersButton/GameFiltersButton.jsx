import React from "react";
import "./gameFiltersButtonStyles.css";

const GameFiltersButton = ({
  onClick,
  icon: Icon,
  label,
  active = false,
  variant = "default", // "default", "checkbox", "action"
  disabled = false,
}) => {
  const buttonClass = `game-filters-button ${variant} ${
    active ? "active" : ""
  } ${disabled ? "disabled" : ""}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {Icon && <Icon className="button-icon" />}
      {label && <span className="button-label">{label}</span>}
    </button>
  );
};

export default GameFiltersButton;
