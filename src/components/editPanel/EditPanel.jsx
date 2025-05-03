import React, { useState } from "react";
import { useGameState } from "../../context/GameStateProvider";
import ActionButtons from "./actionButtons/ActionButtons";
import "./editPanelStyles.css";

const EditPanel = () => {
  const { pieceIcons } = useGameState();
  const [activeAction, setActiveAction] = useState("add"); // "add", "move", "trash"

  const handleActionClick = (action) => {
    setActiveAction(action);
  };

  return (
    <div className="edit-panel-container">
      <div className="edit-panel-content">
        <ActionButtons
          activeAction={activeAction}
          onActionClick={handleActionClick}
        />
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
