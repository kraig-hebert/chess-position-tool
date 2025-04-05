import React from "react";
import { useGameState } from "../../../context/GameStateProvider";

import "./movesListStyles.css";

const MovesList = () => {
  const {
    getGroupedMovesList,
    setBoard,
    setCapturedPieces,
    activeMove,
    setActiveMove,
  } = useGameState();
  const groupedMovesList = getGroupedMovesList();

  const handleClick = (groupIndex, moveIndex) => {
    const move = groupedMovesList[groupIndex][moveIndex];
    setActiveMove({ groupIndex, moveIndex });
    setBoard(move.board);
    setCapturedPieces({ ...move.capturedPieces });
  };

  const checkIfActiveMove = (groupIndex, moveIndex) => {
    if (
      activeMove.groupIndex === groupIndex &&
      activeMove.moveIndex === moveIndex
    )
      return "active-move";
    else return "";
  };

  const renderedMovesList = groupedMovesList.map((group, groupIndex) => {
    return (
      <div key={groupIndex} className="move-group">
        {group.map((move, moveIndex) => {
          return (
            <div
              key={moveIndex}
              className={`move ${checkIfActiveMove(groupIndex, moveIndex)}`}
              onClick={() => handleClick(groupIndex, moveIndex)}
            >
              {moveIndex % 2 === 0 ? groupIndex + 1 : ""}
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
