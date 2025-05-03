import React from "react";
import { useGameState } from "../../context/GameStateProvider";
import "./editPanelStyles.css";

const EditPanel = () => {
  const { pieceIcons } = useGameState();

  return (
    <div className="edit-panel-container">
      <div className="edit-panel-content">
        <div className="action-buttons">
          {/* Action buttons will go here */}
        </div>
        <div className="pieces-container">
          <div className="white-pieces">{/* White pieces will go here */}</div>
          <div className="black-pieces">{/* Black pieces will go here */}</div>
        </div>
        <div className="clear-button">
          {/* Clear board button will go here */}
        </div>
      </div>
    </div>
  );
};

export default EditPanel;
