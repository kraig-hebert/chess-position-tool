import React from "react";
import { useGameState } from "../../../context/GameStateProvider";

import "./movesListStyles.css";

const MovesList = (props) => {
  const { movesList } = useGameState();
  console.log(movesList);
  return <div className="moves-list">moves</div>;
};

export default MovesList;
