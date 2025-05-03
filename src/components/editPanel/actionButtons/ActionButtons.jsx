import React from "react";
import { FaPlus, FaArrowsUpDownLeftRight, FaTrash } from "react-icons/fa6";
import "./actionButtonsStyles.css";

const ActionButtons = (props) => {
  const { activeAction, onActionClick } = props;

  return (
    <div className="action-buttons">
      <button
        className={`action-button ${activeAction === "add" ? "active" : ""}`}
        onClick={() => onActionClick("add")}
      >
        <FaPlus />
      </button>
      <button
        className={`action-button ${activeAction === "move" ? "active" : ""}`}
        onClick={() => onActionClick("move")}
      >
        <FaArrowsUpDownLeftRight />
      </button>
      <button
        className={`action-button ${activeAction === "trash" ? "active" : ""}`}
        onClick={() => onActionClick("trash")}
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default ActionButtons;
