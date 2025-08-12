import {
  setGameIsActive,
  setHasMoved,
  setCapturedPieces,
  setMovesList,
  setActiveMove,
  setActiveColor,
  setEnPassantTarget,
} from "../store/slices/gameSlice";
import { resetEditMode, setIsEditMode } from "../store/slices/uiSlice";
import {
  calculateCapturedPieces,
  copyBoard,
  ensureHasMovedConsistency,
} from "../logic/chessUtils";
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
  getState,
  board,
  tempHasMoved,
  nextMoveColorAfterEdit,
  enPassantEnabled,
  possibleEnPassantTargets,
  selectedEnPassantTarget,
  initialBoard,
  originalPosition
) => {
  // if (isEqual(originalPosition, board)) {
  //   dispatch(setGameIsActive(true));
  //   dispatch(resetEditMode());
  //   return;
  // }

  // Calculate and set captured pieces
  const captured = calculateCapturedPieces(board, initialBoard);
  dispatch(setCapturedPieces(captured));

  // Validate and update hasMoved based on piece positions
  const normalizedHasMoved = ensureHasMovedConsistency(board, tempHasMoved);
  dispatch(setHasMoved(normalizedHasMoved));

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

  // Handle moves list with snapshots
  const state = getState();
  const originalHasMoved = state.game.originalHasMoved;
  const originalActiveColor = state.game.originalActiveColor;
  const originalEnPassantTarget = state.game.originalEnPassantTarget;
  const originalMovesList = state.game.originalMovesList;

  const boardUnchanged = isEqual(originalPosition, board);
  const hasMovedUnchanged = isEqual(originalHasMoved, normalizedHasMoved);
  const activeColorUnchanged = originalActiveColor === nextMoveColorAfterEdit;
  const enPassantUnchanged = isEqual(
    originalEnPassantTarget,
    (() => {
      if (
        enPassantEnabled &&
        possibleEnPassantTargets.length > 0 &&
        selectedEnPassantTarget
      ) {
        const target = possibleEnPassantTargets.find(
          (t) => t.notation === selectedEnPassantTarget
        );
        return target
          ? { row: target.row, col: target.col, color: nextMoveColorAfterEdit }
          : null;
      }
      return null;
    })()
  );

  const nothingChanged =
    boardUnchanged &&
    hasMovedUnchanged &&
    activeColorUnchanged &&
    enPassantUnchanged;

  if (nothingChanged) {
    dispatch(setMovesList(originalMovesList || []));
  } else {
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
  }

  dispatch(setGameIsActive(true));
  dispatch(resetEditMode());
  dispatch(setIsEditMode(false));
};
