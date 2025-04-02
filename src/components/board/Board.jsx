import React, { useState } from "react";
import { useGameState } from "../../context/GameStateProvider";

import {
  makeRookMove,
  canKingMove,
  makeKnightMove,
  canBishopMove,
  makeQueenMove,
  makePawnMove,
  canPieceMove,
  canCastle,
} from "../../logic/moveValidation";
import {
  getPieceColor,
  isSameColor,
  isKingInCheck,
  isCheckmate,
  createNotation,
  checkIfLastMovePutKingInCheck,
  getAllPiecePositions,
  getPossibleMoves,
  letterNotation,
} from "../../logic/chessUtils";
import "./boardStyles.css";

import Square from "./square/Square";
import StudyDetails from "../studyDetails/StudyDetails";
import GameButtons from "../gameButtons/GameButtons";
import PromotionModal from "../promotionModal/PromotionModal";
import GameFilters from "../gameFilters/GameFilters";

const Board = () => {
  const {
    activeColor,
    board,
    setBoard,
    selectedPiece,
    setSelectedPiece,
    hasMoved,
    setHasMoved,
    enPassantTarget,
    setEnPassantTarget,
    updateHasMovedForCastling,
    gameIsActive,
    setGameIsActive,
    pov,
    addCapturedPiece,
    pieceIcons,
    movesList,
    setMovesList,
    toggleActiveColor,
  } = useGameState();

  // { row, col, piece }
  const [promotionSquare, setPromotionSquare] = useState(null);

  const handleSquareClick = (row, col) => {
    // ignore clicks when game isn't active or promotion modal is active
    if (!gameIsActive || promotionSquare) return;

    /*
      - flip click values when board is rendered from black pov
      - values will come in from onClick with board upsidedown
    */
    if (pov === "black") {
      row = Math.abs(row - 7);
      col = Math.abs(col - 7);
    }
    const nextMove = board[row][col];

    /* 
      - if there is a selectedPiece perform moveValidation
      - else setSelectedPiece
    */
    if (selectedPiece) {
      let move = {};
      // check for same square/color blocking moves
      if (
        (selectedPiece.row === row && selectedPiece.col === col) ||
        isSameColor(selectedPiece.piece, nextMove)
      ) {
        setSelectedPiece(null);
        return; // return and block move
      }

      // handle move logic
      switch (selectedPiece.piece.toLowerCase()) {
        case "p":
          move = makePawnMove(
            selectedPiece.row,
            selectedPiece.col,
            row,
            col,
            board,
            enPassantTarget
          );
          if (move.enPassantTarget) setEnPassantTarget(move.enPassantTarget);
          break;
        case "r":
          move = makeRookMove(
            selectedPiece.row,
            selectedPiece.col,
            row,
            col,
            board
          );
          break;
        case "b":
          move = canBishopMove(
            selectedPiece.row,
            selectedPiece.col,
            row,
            col,
            board
          );
          break;
        case "n":
          move = makeKnightMove(
            selectedPiece.row,
            selectedPiece.col,
            row,
            col,
            board
          );
          break;
        case "q":
          move = makeQueenMove(
            selectedPiece.row,
            selectedPiece.col,
            row,
            col,
            board
          );
          break;
        case "k":
          move = canKingMove(
            selectedPiece.row,
            selectedPiece.col,
            row,
            col,
            board
          );
          break;
      }
      if (!move) {
        setSelectedPiece(null);
        return;
      }
      // handle piece capture
      if (move.capturedPiece) addCapturedPiece(move.capturedPiece);

      let moveNotation = createNotation(
        row,
        col,
        selectedPiece,
        move.capturedPiece
      );

      // edit move notation if multiple pieces can move to the same square
      // if (["R", "N", "B", "Q"].includes(selectedPiece.piece.toUpperCase())) {
      //   const otherPiecePositions = getAllPiecePositions(
      //     selectedPiece.piece,
      //     board
      //   );
      //   if (otherPiecePositions.length > 1) {
      //     const checkList = otherPiecePositions
      //       .map((position) => {
      //         if (
      //           canPieceMove(
      //             position.row,
      //             position.col,
      //             row,
      //             col,
      //             board,
      //             "placeholder",
      //             {}
      //           )
      //         )
      //           return position;
      //         else return false;
      //       })
      //       .filter((position) => position !== false);
      //     if (checkList.length > 1) {
      //       const firstPosition = checkList[0];
      //       const secondPosition = checkList[1];
      //       if (firstPosition.col !== secondPosition.col) {
      //         moveNotation =
      //           moveNotation.slice(0, 1) +
      //           letterNotation[selectedPiece.col + 1] +
      //           moveNotation.slice(1);
      //       } else if (firstPosition.row !== secondPosition.row) {
      //         moveNotation =
      //           moveNotation.slice(0, 1) +
      //           Math.abs(selectedPiece.row - 8) +
      //           moveNotation.slice(1);
      //       }
      //     }
      //   }
      // }
      if (isKingInCheck(move.newBoard, activeColor, hasMoved)) {
        console.log("Move rejected: King would be in check");
        setSelectedPiece(null);
        setEnPassantTarget(null);
        return; // Block the move
      }

      // Check for Pawn Promotion
      const isWhitePromotion = selectedPiece.piece === "P" && row === 0;
      const isBlackPromotion = selectedPiece.piece === "p" && row === 7;
      if (isWhitePromotion || isBlackPromotion) {
        setPromotionSquare({
          row,
          col,
          piece: selectedPiece.piece,
          moveNotation,
        });
        setGameIsActive(false);
        return; // Stop the move until promotion is chosen
      }

      // Handle Castling
      if (
        selectedPiece.piece.toLowerCase() === "k" &&
        Math.abs(selectedPiece.col - col) === 2
      ) {
        const color = selectedPiece.piece === "K" ? "white" : "black";
        const castlingSide =
          col === 6 ? "kingside" : col === 2 ? "queenside" : null;
        const castlingMove = canCastle(color, castlingSide, board, hasMoved);

        if (castlingMove) {
          const { kingTo, rookTo } = castlingMove;
          newBoard[kingTo[0]][kingTo[1]] = selectedPiece.piece; // Move the king
          newBoard[rookTo[0]][rookTo[1]] =
            board[selectedPiece.row][castlingSide === "kingside" ? 7 : 0]; // Move the rook
          newBoard[selectedPiece.row][castlingSide === "kingside" ? 7 : 0] =
            null; // Remove old rook position
          updateHasMovedForCastling(color);
          if (castlingSide === "kingside") moveNotation = "0-0";
          else if (castlingSide === "queenside") moveNotation = "0-0-0";
        }
      }

      // Update hasMoved state for castling if rook or king moves by itself
      if (selectedPiece.piece === "R") {
        if (selectedPiece.row === 7 && selectedPiece.col === 0) {
          setHasMoved({ ...hasMoved, whiteRookQueenside: true });
        } else if (selectedPiece.row === 7 && selectedPiece.col === 7) {
          setHasMoved({ ...hasMoved, whiteRookKingside: true });
        }
      } else if (selectedPiece.piece === "r") {
        if (selectedPiece.row === 0 && selectedPiece.col === 0) {
          setHasMoved({ ...hasMoved, blackRookQueenside: true });
        } else if (selectedPiece.row === 0 && selectedPiece.col === 7) {
          setHasMoved({ ...hasMoved, blackRookKingside: true });
        }
      } else if (selectedPiece.piece === "K") {
        setHasMoved({ ...hasMoved, whiteKing: true });
      } else if (selectedPiece.piece === "k") {
        setHasMoved({ ...hasMoved, blackKing: true });
      }
      setBoard(move.newBoard);
      setSelectedPiece(null);
      // Check for Checkmate
      const opponentColor = activeColor === "white" ? "black" : "white";
      if (isCheckmate(move.newBoard, opponentColor, hasMoved)) {
        console.log("Checkmate!");
        setGameIsActive(false);
        moveNotation += "#";
      }
      if (checkIfLastMovePutKingInCheck(row, col, move.newBoard, opponentColor))
        moveNotation += "+";
      setMovesList([...movesList, moveNotation]);
      toggleActiveColor();
    } else if (nextMove && getPieceColor(nextMove) === activeColor) {
      setSelectedPiece({ row, col, piece: nextMove });
    }
  };

  const renderBoard = () => {
    let tempSelectedPiece = { ...selectedPiece };
    let boardForRender = structuredClone(board);
    let possibleMoves = [];
    if (selectedPiece) {
      possibleMoves = getPossibleMoves(
        board,
        tempSelectedPiece.row,
        tempSelectedPiece.col,
        activeColor,
        enPassantTarget
      );
    }

    if (pov === "black") {
      boardForRender = boardForRender.reverse().map((inner) => inner.reverse());
      tempSelectedPiece.row = Math.abs(tempSelectedPiece.row - 7);
      tempSelectedPiece.col = Math.abs(tempSelectedPiece.col - 7);
      possibleMoves = possibleMoves.map((move) => {
        return { row: Math.abs(move.row - 7), col: Math.abs(move.col - 7) };
      });
    }
    return boardForRender.map((row, rowIndex) =>
      row.map((piece, colIndex) => {
        const isDark = (rowIndex + colIndex) % 2 !== 0;
        const isSelected =
          tempSelectedPiece &&
          tempSelectedPiece.row === rowIndex &&
          tempSelectedPiece.col === colIndex;

        return (
          <Square
            key={`${rowIndex}-${colIndex}`}
            isDark={isDark}
            isLegal={possibleMoves.some(
              (position) =>
                position.row === rowIndex && position.col === colIndex
            )}
            isSelected={isSelected}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
            piece={piece && pieceIcons[piece]}
            row={rowIndex}
            col={colIndex}
          />
        );
      })
    );
  };

  const promotionPieceSelect = (piece) => {
    const newBoard = board.map((row) => [...row]);
    newBoard[promotionSquare.row][promotionSquare.col] =
      promotionSquare.piece === "P" ? piece.toUpperCase() : piece.toLowerCase();
    newBoard[selectedPiece.row][selectedPiece.col] = null;
    setMovesList([
      ...movesList,
      `${promotionSquare.moveNotation}=${piece.toUpperCase()}`,
    ]);
    setBoard(newBoard);
    setPromotionSquare(null);
    setSelectedPiece(null);
    setGameIsActive(true);
    toggleActiveColor();
  };

  return (
    <div className="board-container">
      {promotionSquare && <div className="board-overlay"></div>}
      <div className="board">
        {renderBoard()}
        <GameFilters />
        <StudyDetails />
        <GameButtons />
      </div>
      {promotionSquare && <PromotionModal onSelect={promotionPieceSelect} />}
    </div>
  );
};

export default Board;
