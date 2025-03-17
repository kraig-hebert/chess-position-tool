import React from "react";

import "./pieceIconStyles.css";

const PieceIcon = (props) => {
  const { Icon, className } = props;
  return <Icon className={className} />;
};

export default PieceIcon;
