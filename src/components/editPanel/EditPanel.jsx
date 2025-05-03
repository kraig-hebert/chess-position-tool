import React, { useState } from "react";
import { useGameState } from "../../context/GameStateProvider";
import ActionButtons from "./actionButtons/ActionButtons";
import PieceButtons from "./pieceButtons/PieceButtons";
import BoardControls from "./boardControls/BoardControls";
import "./editPanelStyles.css";

const EditPanel = () => {
  const { pieceIcons, resetGame, setBoard, board } = useGameState();
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

  const handleClearBoard = () => {
    const emptyBoard = board.map((row) => row.map((col) => null));
    setBoard(emptyBoard);
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
        <BoardControls
          onClearBoard={handleClearBoard}
          onResetBoard={resetGame}
        />
      </div>
    </div>
  );
};

export default EditPanel;
