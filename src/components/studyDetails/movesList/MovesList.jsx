import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCapturedPieces,
  setActiveMove,
  selectActiveMove,
  selectGroupedMovesList,
  setBoard,
} from "../../../store/slices/gameSlice";

import "./movesListStyles.css";

const MovesList = () => {
  const dispatch = useDispatch();
  const activeMove = useSelector(selectActiveMove);
  const groupedMovesList = useSelector(selectGroupedMovesList);

  const handleClick = (groupIndex, moveIndex) => {
    const move = groupedMovesList[groupIndex][moveIndex];
    dispatch(setActiveMove({ groupIndex, moveIndex }));
    dispatch(setBoard(move.board));
    dispatch(setCapturedPieces(move.capturedPieces));
  };

  const checkIfActiveMove = (groupIndex, moveIndex) => {
    if (
      activeMove &&
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
