import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initialBoard,
  resetGame,
  selectTempHasMoved,
  selectHasMoved,
  selectActiveMove,
  selectGroupedMovesList,
  selectBoard,
  selectPositionIsValid,
  selectActiveColor,
  selectOriginalPosition,
} from "../../store/slices/gameSlice";
import {
  FaBackward,
  FaForward,
  FaArrowDownUpAcrossLine,
  FaRecycle,
  FaPencil,
} from "react-icons/fa6";
import { FaSave } from "react-icons/fa";

import {
  selectNextMoveColorAfterEdit,
  selectEnPassantEnabled,
  selectPossibleEnPassantTargets,
  selectSelectedEnPassantTarget,
  resetEditMode,
  togglePov,
  selectIsEditMode,
  enterEditMode,
  setInspectedSquare,
} from "../../store/slices/uiSlice";
import { moveForward, moveBackward } from "../../utils/moveNavigation";
import { saveAndExitEditMode } from "../../utils/editModeUtils.js";
import { useStore } from "react-redux";
import GameButton from "./gameButton/GameButton";

import "./gameButtonsStyles.css";

const GameButtons = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const board = useSelector(selectBoard);
  const tempHasMoved = useSelector(selectTempHasMoved);
  const hasMoved = useSelector(selectHasMoved);
  const nextMoveColorAfterEdit = useSelector(selectNextMoveColorAfterEdit);
  const enPassantEnabled = useSelector(selectEnPassantEnabled);
  const possibleEnPassantTargets = useSelector(selectPossibleEnPassantTargets);
  const selectedEnPassantTarget = useSelector(selectSelectedEnPassantTarget);
  const activeMove = useSelector(selectActiveMove);
  const groupedMovesList = useSelector(selectGroupedMovesList);
  const isEditMode = useSelector(selectIsEditMode);
  const positionIsValid = useSelector(selectPositionIsValid);
  const activeColor = useSelector(selectActiveColor);
  const originalPosition = useSelector(selectOriginalPosition);

  const handleFullGameReset = () => {
    dispatch(resetGame());
    dispatch(resetEditMode());
    // Clear any inspected target square (red outline)
    dispatch(setInspectedSquare(null));
  };

  const handleMoveBackwards = () => {
    moveBackward(dispatch, activeMove, groupedMovesList);
  };

  const handleMoveForwards = () => {
    moveForward(dispatch, activeMove, groupedMovesList);
  };

  const handleEditSaveClick = () => {
    if (isEditMode) {
      saveAndExitEditMode(
        dispatch,
        () => store.getState(),
        board,
        tempHasMoved,
        nextMoveColorAfterEdit,
        enPassantEnabled,
        possibleEnPassantTargets,
        selectedEnPassantTarget,
        initialBoard,
        originalPosition
      );
    } else {
      // Enter edit mode using the centralized action
      dispatch(enterEditMode(board, activeColor, hasMoved));
    }
  };

  return (
    <div className="game-buttons">
      <GameButton
        title={isEditMode ? "Save" : "Edit"}
        Icon={isEditMode ? FaSave : FaPencil}
        onClick={handleEditSaveClick}
        disabled={isEditMode && !positionIsValid}
      />
      <GameButton
        title="Reset"
        Icon={FaRecycle}
        onClick={handleFullGameReset}
        disabled={isEditMode}
      />
      <GameButton
        title="Flip Board"
        Icon={FaArrowDownUpAcrossLine}
        onClick={() => dispatch(togglePov())}
        disabled={isEditMode}
      />
      <GameButton
        title="Last Move"
        Icon={FaBackward}
        onClick={handleMoveBackwards}
        disabled={isEditMode}
      />
      <GameButton
        title="Next Move"
        Icon={FaForward}
        onClick={handleMoveForwards}
        disabled={isEditMode}
      />
    </div>
  );
};

export default GameButtons;
