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
  createBaseSan,
} from "../logic/chessUtils";
import { updateSanSuffix, createBaseSan } from "../logic/chessUtils";

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

      // handle castling
      if (move.castlingSide) {
        if (activeColor === "white")
          dispatch(setHasMoved({ ...hasMoved, whiteKing: true }));
        else dispatch(setHasMoved({ ...hasMoved, blackKing: true }));
      }

      let baseSan = createBaseSan(
        row,
        col,
        selectedPiece,
        move.capturedPiece,
        board,
        move.castlingSide
      );

      // Update hasMoved state for castling if rook or king moves by itself
      if (selectedPiece.piece === "R") {
        if (selectedPiece.row === 7 && selectedPiece.col === 0) {
          dispatch(setHasMoved({ ...hasMoved, whiteRookQueenside: true }));
        } else if (selectedPiece.row === 7 && selectedPiece.col === 7) {
          dispatch(setHasMoved({ ...hasMoved, whiteRookKingside: true }));
        }
      } else if (selectedPiece.piece === "r") {
        if (selectedPiece.row === 0 && selectedPiece.col === 0) {
          dispatch(setHasMoved({ ...hasMoved, blackRookQueenside: true }));
        } else if (selectedPiece.row === 0 && selectedPiece.col === 7) {
          dispatch(setHasMoved({ ...hasMoved, blackRookKingside: true }));
        }
      } else if (selectedPiece.piece === "K" && !move.castlingSide) {
        dispatch(setHasMoved({ ...hasMoved, whiteKing: true }));
      } else if (selectedPiece.piece === "k" && !move.castlingSide) {
        dispatch(setHasMoved({ ...hasMoved, blackKing: true }));
      }

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
