import React from "react";

import "./gameButtonStyles.css";

const GameButton = (props) => {
  const { title, Icon } = props;
  return (
    <div className="game-button">
      <Icon />
      {title}
    </div>
  );
};

export default GameButton;
