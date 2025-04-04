import React from "react";
import { useGameState } from "../../../context/GameStateProvider";

import "./movesListStyles.css";

const MovesList = () => {
  const { getGroupedMovesList, setBoard, setCapturedPieces } = useGameState();
  const groupedMovesList = getGroupedMovesList();

  const handleClick = (groupIndex, index) => {
    const move = groupedMovesList[groupIndex][index];
    setBoard(move.board);
    setCapturedPieces({ ...move.capturedPieces });
  };

  const renderedMovesList = groupedMovesList.map((group, groupIndex) => {
    return (
      <div key={groupIndex} className="move-group">
        {group.map((move, index) => {
          return (
            <div
              key={index}
              className="move"
              onClick={() => handleClick(groupIndex, index)}
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
