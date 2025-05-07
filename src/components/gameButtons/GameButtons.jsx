import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initialBoard,
  resetGame as resetGameAction,
  setGameIsActive,
  setHasMoved,
  resetTempHasMoved,
  selectTempHasMoved,
  setCapturedPieces,
  setMovesList,
  setActiveMove,
  selectActiveMove,
  selectGroupedMovesList,
  setActiveColor,
  setEnPassantTarget,
  selectBoard,
  setBoard,
} from "../../store/slices/gameSlice";
import {
  FaBackward,
  FaForward,
  FaArrowDownUpAcrossLine,
  FaRecycle,
  FaPencil,
} from "react-icons/fa6";
import { FaSave } from "react-icons/fa";

import { useGameState } from "../../context/GameStateProvider";
import { calculateCapturedPieces, copyBoard } from "../../logic/chessUtils";
import {
  selectNextMoveColorAfterEdit,
  selectEnPassantEnabled,
  selectPossibleEnPassantTargets,
  selectSelectedEnPassantTarget,
  resetEditMode,
  togglePov,
} from "../../store/slices/uiSlice";

import GameButton from "./gameButton/GameButton";

import "./gameButtonsStyles.css";

const GameButtons = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const tempHasMoved = useSelector(selectTempHasMoved);
  const nextMoveColorAfterEdit = useSelector(selectNextMoveColorAfterEdit);
  const enPassantEnabled = useSelector(selectEnPassantEnabled);
  const possibleEnPassantTargets = useSelector(selectPossibleEnPassantTargets);
  const selectedEnPassantTarget = useSelector(selectSelectedEnPassantTarget);
  const activeMove = useSelector(selectActiveMove);
  const groupedMovesList = useSelector(selectGroupedMovesList);

  const {
    isEditMode,
    setIsEditMode,
    positionIsValid,
    setOriginalPosition,
    resetGame,
  } = useGameState();

  const handleReset = () => {
    // Reset Redux state
    dispatch(resetGameAction());
    // Reset context state
    resetGame();
  };

  const handleMoveBackwards = () => {
    if (activeMove.groupIndex === 0 && activeMove.moveIndex === 0) return;
    if (activeMove.moveIndex === 1) {
      dispatch(
        setActiveMove({
          groupIndex: activeMove.groupIndex,
          moveIndex: 0,
        })
      );
      dispatch(
        setCapturedPieces(
          groupedMovesList[activeMove.groupIndex][0].capturedPieces
        )
      );
      dispatch(setBoard(groupedMovesList[activeMove.groupIndex][0].board));
    } else {
      dispatch(
        setActiveMove({ groupIndex: activeMove.groupIndex - 1, moveIndex: 1 })
      );
      dispatch(
        setCapturedPieces(
          groupedMovesList[activeMove.groupIndex - 1][1].capturedPieces
        )
      );
      dispatch(setBoard(groupedMovesList[activeMove.groupIndex - 1][1].board));
    }
  };

  const handleMoveForwards = () => {
    const groupIndex = groupedMovesList.length - 1;
    const moveIndex = groupedMovesList[groupIndex].length - 1;
    if (
      activeMove.groupIndex === groupIndex &&
      activeMove.moveIndex === moveIndex
    )
      return;
    if (activeMove.moveIndex === 1) {
      dispatch(
        setActiveMove({
          groupIndex: activeMove.groupIndex + 1,
          moveIndex: 0,
        })
      );
      dispatch(
        setCapturedPieces(
          groupedMovesList[activeMove.groupIndex + 1][0].capturedPieces
        )
      );
      dispatch(setBoard(groupedMovesList[activeMove.groupIndex + 1][0].board));
    } else {
      dispatch(
        setActiveMove({ groupIndex: activeMove.groupIndex, moveIndex: 1 })
      );
      dispatch(
        setCapturedPieces(
          groupedMovesList[activeMove.groupIndex][1].capturedPieces
        )
      );
      dispatch(setBoard(groupedMovesList[activeMove.groupIndex][1].board));
    }
  };

  const validateCastlingPositions = () => {
    const validatedHasMoved = { ...tempHasMoved };

    if (board[7][4] !== "K") validatedHasMoved.whiteKing = true;
    else if (board[7][7] !== "R") validatedHasMoved.whiteRookKingside = true;
    else if (board[7][0] !== "R") validatedHasMoved.whiteRookQueenside = true;
    else if (board[0][4] !== "k") validatedHasMoved.blackKing = true;
    else if (board[0][7] !== "r") validatedHasMoved.blackRookKingside = true;
    else if (board[0][0] !== "r") validatedHasMoved.blackRookQueenside = true;

    return validatedHasMoved;
  };

  const handleEditSaveClick = () => {
    if (isEditMode) {
      // Calculate and set captured pieces
      const captured = calculateCapturedPieces(board, initialBoard);
      dispatch(setCapturedPieces(captured));

      // Validate and update hasMoved based on piece positions
      const validatedHasMoved = validateCastlingPositions();
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
      setIsEditMode(false);
    } else {
      // Enter edit mode
      // Save the current position before entering edit mode
      setOriginalPosition(copyBoard(board));
      dispatch(resetTempHasMoved());
      setIsEditMode(true);
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
        onClick={handleReset}
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
