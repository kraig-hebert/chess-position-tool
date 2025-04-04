import React from "react";
import { useGameState } from "../../../context/GameStateProvider";

import "./movesListStyles.css";

const MovesList = () => {
  const { getGroupedMovesList } = useGameState();
  const groupedMovesList = getGroupedMovesList();

  const handleClick = (e) => {
    console.log(e);
  };

  const renderedMovesList = groupedMovesList.map((group, groupIndex) => {
    return (
      <div key={groupIndex} className="move-group">
        {group.map((move, index) => {
          return (
            <div
              key={index}
              className="move"
              onClick={(e) => handleClick(e, index)}
            >
              {index % 2 === 0 ? groupIndex + 1 : ""}
              {move.moveNotation}
            </div>
          );
        })}
      </div>
    );
  });
  return <div className="moves-list">{renderedMovesList}</div>;
};

export default MovesList;
