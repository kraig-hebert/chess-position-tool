import { useDispatch, useSelector } from "react-redux";
import {
  selectGameIsActive,
  setGameIsActive,
  selectHasMoved,
  setHasMoved,
  selectCapturedPieces,
  setCapturedPieces,
  setMovesList,
  setActiveMove,
  selectMovesList,
  selectNextGroupedMovesListIndex,
  selectActiveColor,
  toggleActiveColor,
  selectEnPassantTarget,
  setEnPassantTarget,
  selectBoard,
  setBoard,
  selectSelectedPiece,
  setSelectedPiece,
  resetSelectedPiece,
} from "../store/slices/gameSlice";
import { makePieceMove } from "../logic/moveValidation";
import {
  getPieceColor,
  isSameColor,
  isKingInCheck,
  updateSanSuffix,
  createBaseSan,
  applyMoveToHasMoved,
} from "../logic/chessUtils";

export const useStudyMode = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const gameIsActive = useSelector(selectGameIsActive);
  const hasMoved = useSelector(selectHasMoved);
  const capturedPieces = useSelector(selectCapturedPieces);
  const movesList = useSelector(selectMovesList);
  const nextIndex = useSelector(selectNextGroupedMovesListIndex);
  const activeColor = useSelector(selectActiveColor);
  const enPassantTarget = useSelector(selectEnPassantTarget);
  const selectedPiece = useSelector(selectSelectedPiece);

  const handleStudyModeClick = (
    row,
    col,
    promotionSquare,
    setPromotionSquare
  ) => {
    // ignore clicks when game isn't active
    if (!gameIsActive) return;

    const nextMove = board[row][col];
    const tempCapturedPieces = { ...capturedPieces };

    /* 
      - if there is a selectedPiece perform moveValidation
      - else setSelectedPiece
    */
    if (selectedPiece) {
      // check for same square/color blocking moves
      if (
        (selectedPiece.row === row && selectedPiece.col === col) ||
        isSameColor(selectedPiece.piece, nextMove)
      ) {
        dispatch(resetSelectedPiece());
        return; // return and block move
      }

      const move = makePieceMove(
        selectedPiece.row,
        selectedPiece.col,
        row,
        col,
        board,
        { enPassantTarget, hasMoved, validateCheckAndCastle: true }
      );

      if (!move || isKingInCheck(move.newBoard, activeColor)) {
        dispatch(resetSelectedPiece());
        return;
      }

      // handle setting/clearing enPassantTarget
      if (move.enPassantTarget) {
        dispatch(setEnPassantTarget(move.enPassantTarget));
      } else {
        dispatch(setEnPassantTarget(null));
      }
      // store captured pieces temporarily for immediate use
      if (move.capturedPiece) {
        tempCapturedPieces[activeColor] = [
          ...tempCapturedPieces[activeColor],
          move.capturedPiece,
        ];
      }
      dispatch(setCapturedPieces({ ...tempCapturedPieces }));

      // handle castling/hasMoved updates centrally
      const updatedHasMoved = applyMoveToHasMoved(hasMoved, {
        piece: selectedPiece.piece,
        from: { row: selectedPiece.row, col: selectedPiece.col },
        castlingSide: move.castlingSide || null,
      });
      if (updatedHasMoved !== hasMoved) dispatch(setHasMoved(updatedHasMoved));

      let baseSan = createBaseSan(
        row,
        col,
        selectedPiece,
        move.capturedPiece,
        board,
        move.castlingSide
      );

      // (per-move rook/king updates are handled by applyMoveToHasMoved)

      // Check for Pawn Promotion
      const isWhitePromotion = selectedPiece.piece === "P" && row === 0;
      const isBlackPromotion = selectedPiece.piece === "p" && row === 7;
      if (isWhitePromotion || isBlackPromotion) {
        setPromotionSquare({
          row,
          col,
          piece: selectedPiece.piece,
          moveNotation: baseSan,
        });
        dispatch(setGameIsActive(false));
        return; // Stop the move until promotion is chosen
      }

      dispatch(setBoard(move.newBoard));
      dispatch(resetSelectedPiece());
      const opponentColor = activeColor === "white" ? "black" : "white";
      const moveNotation = updateSanSuffix({
        baseSan,
        boardAfter: move.newBoard,
        opponentColor,
        hasMoved,
      });
      dispatch(setActiveMove(nextIndex));
      dispatch(
        setMovesList([
          ...movesList,
          {
            moveNotation,
            board: move.newBoard,
            capturedPieces: tempCapturedPieces,
          },
        ])
      );

      dispatch(toggleActiveColor());
    } else if (nextMove && getPieceColor(nextMove) === activeColor) {
      dispatch(setSelectedPiece({ row, col, piece: nextMove }));
    }
  };

  return {
    handleStudyModeClick,
  };
};
