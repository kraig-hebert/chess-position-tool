export const getGroupedMovesList = (movesList) => {
  const groupedMoves = [];
  let moveGroup = [];
  movesList.forEach((move, index) => {
    if (index % 2 === 0) moveGroup.push(move);
    else {
      moveGroup.push(move);
      groupedMoves.push(moveGroup);
      moveGroup = [];
    }
    if (index === movesList.length - 1) groupedMoves.push(moveGroup);
  });
  return groupedMoves;
};

export const getNextGroupedMovesListIndex = (movesList) => {
  const groupedMovesList = getGroupedMovesList(movesList);
  if (groupedMovesList.length === 0) return { groupIndex: 0, moveIndex: 0 };
  const groupIndex = groupedMovesList.length - 1;
  const moveIndex = groupedMovesList[groupIndex].length - 1;
  if (moveIndex === 1) return { groupIndex: groupIndex + 1, moveIndex: 0 };
  return { groupIndex, moveIndex: moveIndex + 1 };
};
