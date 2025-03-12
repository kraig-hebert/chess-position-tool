import React from "react";

import "./promotionModalStyles.css";

const PromotionModal = ({ onSelect }) => {
  return (
    <div className="promotion-modal">
      <p>Choose a promotion piece:</p>
      <button onClick={() => onSelect("q")}>♛ Queen</button>
      <button onClick={() => onSelect("r")}>♜ Rook</button>
      <button onClick={() => onSelect("b")}>♝ Bishop</button>
      <button onClick={() => onSelect("n")}>♞ Knight</button>
    </div>
  );
};

export default PromotionModal;
