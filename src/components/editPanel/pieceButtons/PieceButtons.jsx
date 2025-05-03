import React from "react";
import { useGameState } from "../../../context/GameStateProvider";
import "./pieceButtonsStyles.css";

const PieceButtons = (props) => {
  const { onPieceSelect, selectedPiece } = props;
  const { pieceIcons } = useGameState();

  const whitePieces = ["K", "Q", "R", "B", "N", "P"];
  const blackPieces = ["k", "q", "r", "b", "n", "p"];

  const renderPieceButtons = (pieces) => {
    return pieces.map((piece, index) => {
      const { icon: Icon, className } = pieceIcons[piece];
      return (
        <button
          key={index}
          className={`piece-button ${selectedPiece === piece ? "active" : ""}`}
          onClick={() => onPieceSelect(piece)}
        >
          <Icon className={className} />
        </button>
      );
    });
  };

  return (
    <div className="pieces-container">
      <div className="white-pieces">{renderPieceButtons(whitePieces)}</div>
      <div className="black-pieces">{renderPieceButtons(blackPieces)}</div>
    </div>
  );
};

export default PieceButtons;
