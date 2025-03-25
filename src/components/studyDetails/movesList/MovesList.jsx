import React from "react";
import { useGameState } from "../../../context/GameStateProvider";

import "./movesListStyles.css";

const MovesList = () => {
  const { getGroupedMovesList } = useGameState();
  const groupedMovesList = getGroupedMovesList();
  const renderedMovesList = groupedMovesList.map((group, groupIndex) => {
    return (
      <div key={groupIndex} className="move-group">
        {group.map((move, index) => {
          return (
            <div key={index} className="move">
              {index % 2 === 0 ? groupIndex + 1 : ""}
              {move}
            </div>
          );
        })}
      </div>
    );
  });
  return <div className="moves-list">{renderedMovesList}</div>;
};

export default MovesList;
