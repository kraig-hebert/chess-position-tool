import { useDispatch, useSelector } from "react-redux";
import { selectBoard, setBoard } from "../store/slices/gameSlice";
import {
  selectActiveEditAction,
  selectSelectedPieceTypeForEdit,
  selectEnPassantEnabled,
  selectPossibleEnPassantTargets,
  selectSelectedEnPassantTarget,
  selectSelectedEditMoveSquare,
  setSelectedEditMoveSquare,
} from "../store/slices/uiSlice";
import { copyBoard } from "../logic/chessUtils";

export const useEditMode = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const activeEditAction = useSelector(selectActiveEditAction);
  const selectedPieceTypeForEdit = useSelector(selectSelectedPieceTypeForEdit);
  const enPassantEnabled = useSelector(selectEnPassantEnabled);
  const possibleEnPassantTargets = useSelector(selectPossibleEnPassantTargets);
  const selectedEnPassantTarget = useSelector(selectSelectedEnPassantTarget);
  const selectedEditMoveSquare = useSelector(selectSelectedEditMoveSquare);

  const handleEditModeClick = (row, col) => {
    const clickedPiece = board[row][col];

    if (activeEditAction === "trash" && clickedPiece) {
      const newBoard = copyBoard(board);
      newBoard[row][col] = null;
      dispatch(setBoard(newBoard));
      return;
    }

    if (activeEditAction === "move") {
      if (selectedEditMoveSquare) {
        // Second click - only move to empty square
        if (!clickedPiece) {
          const newBoard = copyBoard(board);
          newBoard[row][col] = selectedEditMoveSquare.piece;
          newBoard[selectedEditMoveSquare.row][selectedEditMoveSquare.col] =
            null;
          dispatch(setBoard(newBoard));
          dispatch(setSelectedEditMoveSquare(null));
        } else if (clickedPiece) {
          // First click - select the piece
          dispatch(
            setSelectedEditMoveSquare({ row, col, piece: clickedPiece })
          );
        }
      } else {
        dispatch(setSelectedEditMoveSquare({ row, col, piece: clickedPiece }));
      }
      return;
    }

    if (
      activeEditAction === "add" &&
      selectedPieceTypeForEdit &&
      !clickedPiece
    ) {
      const newBoard = copyBoard(board);
      newBoard[row][col] = selectedPieceTypeForEdit;
      dispatch(setBoard(newBoard));
      return;
    }
  };

  const getEnPassantTargetSquare = () => {
    if (enPassantEnabled && possibleEnPassantTargets.length > 0) {
      const target = possibleEnPassantTargets.find(
        (target) => target.notation === selectedEnPassantTarget
      );
      if (target) {
        return { row: target.row, col: target.col };
      }
    }
    return null;
  };

  return {
    handleEditModeClick,
    getEnPassantTargetSquare,
  };
};
