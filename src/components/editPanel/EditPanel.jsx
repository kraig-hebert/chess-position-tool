import React from "react";
import { useGameState } from "../../context/GameStateProvider";
import ActionButtons from "./actionButtons/ActionButtons";
import PieceButtons from "./pieceButtons/PieceButtons";
import BoardControls from "./boardControls/BoardControls";
import ColorSelector from "./colorSelector/ColorSelector";
import EnPassantSelector from "./enPassantSelector/EnPassantSelector";
import CastlingSelector from "./castlingSelector/CastlingSelector";
import PositionValidator from "./positionValidator/PositionValidator";
import "./editPanelStyles.css";

const EditPanel = () => {
  const {
    setBoard,
    board,
    setInitialBoard,
    activeAction,
    setActiveAction,
    selectedPieceType,
    setSelectedPieceType,
  } = useGameState();

  const handleActionClick = (action) => {
    setActiveAction(action);
    // Clear selected piece when switching to move or trash actions
    if (action !== "add") {
      setSelectedPieceType(null);
    }
  };

  const handlePieceSelect = (piece) => {
    // Only allow piece selection in add mode
    if (activeAction === "add") {
      setSelectedPieceType(selectedPieceType === piece ? null : piece);
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
          selectedPieceType={selectedPieceType}
          onPieceSelect={handlePieceSelect}
        />
        <ColorSelector />
        <EnPassantSelector />
        <CastlingSelector />
        <PositionValidator />
        <BoardControls
          onClearBoard={handleClearBoard}
          onResetBoard={setInitialBoard}
        />
      </div>
    </div>
  );
};

export default EditPanel;
