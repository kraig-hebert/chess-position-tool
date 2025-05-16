import {
  setActiveMove,
  setBoard,
  setCapturedPieces,
} from "../store/slices/gameSlice";

export const moveForward = (dispatch, activeMove, groupedMovesList) => {
  // If no moves or at the end, do nothing
  if (!activeMove || !groupedMovesList.length) return;

  const lastGroupIndex = groupedMovesList.length - 1;
  const lastMoveIndex = groupedMovesList[lastGroupIndex].length - 1;

  if (
    activeMove.groupIndex === lastGroupIndex &&
    activeMove.moveIndex === lastMoveIndex
  )
    return;

  let newMove;
  if (activeMove.moveIndex === 0) {
    newMove = {
      groupIndex: activeMove.groupIndex,
      moveIndex: 1,
    };
  } else {
    newMove = {
      groupIndex: activeMove.groupIndex + 1,
      moveIndex: 0,
    };
  }

  const move = groupedMovesList[newMove.groupIndex][newMove.moveIndex];
  dispatch(setActiveMove(newMove));
  dispatch(setBoard(move.board));
  dispatch(setCapturedPieces(move.capturedPieces));
};

export const moveBackward = (dispatch, activeMove, groupedMovesList) => {
  // If no active move or at the start, do nothing
  if (
    !activeMove ||
    (activeMove.groupIndex === 0 && activeMove.moveIndex === 0)
  )
    return;

  let newMove;
  if (activeMove.moveIndex === 1) {
    newMove = {
      groupIndex: activeMove.groupIndex,
      moveIndex: 0,
    };
  } else {
    newMove = {
      groupIndex: activeMove.groupIndex - 1,
      moveIndex: 1,
    };
  }

  const move = groupedMovesList[newMove.groupIndex][newMove.moveIndex];
  dispatch(setActiveMove(newMove));
  dispatch(setBoard(move.board));
  dispatch(setCapturedPieces(move.capturedPieces));
};
