import {
  setGameIsActive,
  setHasMoved,
  setCapturedPieces,
  setMovesList,
  setActiveMove,
  setActiveColor,
  setEnPassantTarget,
} from "../store/slices/gameSlice";
import { resetEditMode } from "../store/slices/uiSlice";
import { calculateCapturedPieces, copyBoard } from "../logic/chessUtils";
import { isEqual } from "lodash";

const validateCastlingPositions = (board, tempHasMoved) => {
  const validatedHasMoved = { ...tempHasMoved };

  if (board[7][4] !== "K") validatedHasMoved.whiteKing = true;
  else if (board[7][7] !== "R") validatedHasMoved.whiteRookKingside = true;
  else if (board[7][0] !== "R") validatedHasMoved.whiteRookQueenside = true;
  else if (board[0][4] !== "k") validatedHasMoved.blackKing = true;
  else if (board[0][7] !== "r") validatedHasMoved.blackRookKingside = true;
  else if (board[0][0] !== "r") validatedHasMoved.blackRookQueenside = true;

  return validatedHasMoved;
};

export const saveAndExitEditMode = (
  dispatch,
  board,
  tempHasMoved,
  nextMoveColorAfterEdit,
  enPassantEnabled,
  possibleEnPassantTargets,
  selectedEnPassantTarget,
  initialBoard,
  originalPosition
) => {
  if (isEqual(originalPosition, board)) {
    dispatch(setGameIsActive(true));
    dispatch(resetEditMode());
    return;
  }

  // Calculate and set captured pieces
  const captured = calculateCapturedPieces(board, initialBoard);
  dispatch(setCapturedPieces(captured));

  // Validate and update hasMoved based on piece positions
  const validatedHasMoved = validateCastlingPositions(board, tempHasMoved);
  dispatch(setHasMoved(validatedHasMoved));

  // Set the active color based on the nextMoveColorAfterEdit from Redux
  dispatch(setActiveColor(nextMoveColorAfterEdit));

  // Set en passant target if enabled and a valid target is selected
  if (
    enPassantEnabled &&
    possibleEnPassantTargets.length > 0 &&
    selectedEnPassantTarget
  ) {
    const target = possibleEnPassantTargets.find(
      (target) => target.notation === selectedEnPassantTarget
    );
    if (target) {
      dispatch(
        setEnPassantTarget({
          row: target.row,
          col: target.col,
          color: nextMoveColorAfterEdit,
        })
      );
    }
  } else {
    dispatch(setEnPassantTarget(null));
  }

  // Handle moves list
  if (nextMoveColorAfterEdit === "black") {
    const placeholderMove = {
      moveNotation: "XXX",
      board: copyBoard(board),
      capturedPieces: captured,
    };
    dispatch(setMovesList([placeholderMove]));
    dispatch(setActiveMove({ groupIndex: 0, moveIndex: 1 }));
  } else {
    dispatch(setMovesList([]));
    dispatch(setActiveMove(null));
  }

  dispatch(setGameIsActive(true));
  dispatch(resetEditMode());
};
