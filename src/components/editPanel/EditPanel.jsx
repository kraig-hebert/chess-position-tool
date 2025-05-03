import React, { useState } from "react";
import { useGameState } from "../../context/GameStateProvider";
import ActionButtons from "./actionButtons/ActionButtons";
import PieceButtons from "./pieceButtons/PieceButtons";
import "./editPanelStyles.css";

const EditPanel = () => {
  const { pieceIcons } = useGameState();
  const [activeAction, setActiveAction] = useState("add"); // "add", "move", "trash"
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handleActionClick = (action) => {
    setActiveAction(action);
    // Clear selected piece when switching to move or trash actions
    if (action !== "add") {
      setSelectedPiece(null);
    }
  };

  const handlePieceSelect = (piece) => {
    // Only allow piece selection in add mode
    if (activeAction === "add") {
      setSelectedPiece(selectedPiece === piece ? null : piece);
    }
  };

  return (
    <div className="edit-panel-container">
      <div className="edit-panel-content">
        <ActionButtons
          activeAction={activeAction}
          onActionClick={handleActionClick}
        />
        <PieceButtons
          selectedPiece={selectedPiece}
          onPieceSelect={handlePieceSelect}
        />
        <div className="clear-button">
          {/* Clear board button will go here */}
        </div>
      </div>
    </div>
  );
};

export default EditPanel;
