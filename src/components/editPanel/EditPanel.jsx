import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGameState } from "../../context/GameStateProvider";
import {
  selectActiveEditAction,
  selectSelectedPieceTypeForEdit,
  setActiveEditAction,
  setSelectedPieceTypeForEdit,
} from "../../store/slices/uiSlice";
import ActionButtons from "./actionButtons/ActionButtons";
import PieceButtons from "./pieceButtons/PieceButtons";
import BoardControls from "./boardControls/BoardControls";
import ColorSelector from "./colorSelector/ColorSelector";
import EnPassantSelector from "./enPassantSelector/EnPassantSelector";
import CastlingSelector from "./castlingSelector/CastlingSelector";
import PositionValidator from "./positionValidator/PositionValidator";
import "./editPanelStyles.css";

const EditPanel = () => {
  const { setBoard, board, setInitialBoard } = useGameState();
  const dispatch = useDispatch();
  const activeEditAction = useSelector(selectActiveEditAction);
  const selectedPieceTypeForEdit = useSelector(selectSelectedPieceTypeForEdit);

  const handleActionClick = (action) => dispatch(setActiveEditAction(action));

  const handlePieceSelect = (piece) => {
    // Only allow piece selection in add mode
    if (activeEditAction === "add") {
      dispatch(
        setSelectedPieceTypeForEdit(
          selectedPieceTypeForEdit === piece ? null : piece
        )
      );
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
          activeEditAction={activeEditAction}
          onActionClick={handleActionClick}
        />
        <PieceButtons
          selectedPieceTypeForEdit={selectedPieceTypeForEdit}
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
