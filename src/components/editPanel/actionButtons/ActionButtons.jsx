import React from "react";
import { FaPlus, FaArrowsUpDownLeftRight, FaTrash } from "react-icons/fa6";
import "./actionButtonsStyles.css";

const ActionButtons = ({ activeAction, onActionClick }) => {
  return (
    <div className="action-buttons">
      <button
        className={`action-button ${activeAction === "add" ? "active" : ""}`}
        onClick={() => onActionClick("add")}
        title="Add Piece"
      >
        <FaPlus />
      </button>
      <button
        className={`action-button ${activeAction === "move" ? "active" : ""}`}
        onClick={() => onActionClick("move")}
        title="Move Piece"
      >
        <FaArrowsUpDownLeftRight />
      </button>
      <button
        className={`action-button ${activeAction === "trash" ? "active" : ""}`}
        onClick={() => onActionClick("trash")}
        title="Remove Piece"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default ActionButtons;
