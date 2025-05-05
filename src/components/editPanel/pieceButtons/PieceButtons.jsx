import React from "react";
import { useSelector } from "react-redux";
import { selectPieceIcons } from "../../../store/slices/uiSlice";
import "./pieceButtonsStyles.css";

const PieceButtons = (props) => {
  const { onPieceSelect, selectedPieceType } = props;
  const pieceIcons = useSelector(selectPieceIcons);

  const whitePieces = ["K", "Q", "R", "B", "N", "P"];
  const blackPieces = ["k", "q", "r", "b", "n", "p"];

  const renderPieceButtons = (pieces) => {
    return pieces.map((piece, index) => {
      const { icon: Icon, className } = pieceIcons[piece];
      return (
        <button
          key={index}
          className={`piece-button ${
            selectedPieceType === piece ? "active" : ""
          }`}
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
