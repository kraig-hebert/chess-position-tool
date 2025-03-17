import React from "react";

import "./gameButtonStyles.css";

const GameButton = (props) => {
  const { title, Icon, onClick } = props;

  return (
    <div className="game-button" onClick={onClick}>
      <Icon />
      {title}
    </div>
  );
};

export default GameButton;
