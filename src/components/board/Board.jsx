import React, { useState } from "react";
import { useGameState } from "../../context/GameStateProvider";

import { canPieceMove, canCastle } from "../../logic/moveValidation";
import {
  getPieceColor,
  isSameColor,
  isKingInCheck,
  isCheckmate,
  createNotation,
  checkIfLastMovePutKingInCheck,
  getAllPiecePositions,
  getPossibleMoves,
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
    letterNotation,
    toggleActiveColor,
  } = useGameState();

  // { row, col, piece }
  const [promotionSquare, setPromotionSquare] = useState(null);

  const handleSquareClick = (row, col) => {
    let capturedPiece = null;
    let moveNotation = "";
    // ignore clicks when game isn't active or promotion modal is active
    if (!gameIsActive || promotionSquare) return;

    // track move from reverse perspective
    if (pov === "black") {
      row = Math.abs(row - 7);
      col = Math.abs(col - 7);
    }

    const nextMove = board[row][col];
    if (selectedPiece) {
      // if move is same square as selected piece block move
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        return;
      }

      if (isSameColor(selectedPiece.piece, nextMove)) {
        setSelectedPiece(null);
        return;
      }

      if (
        !canPieceMove(
          selectedPiece.row,
          selectedPiece.col,
          row,
          col,
          board,
          enPassantTarget,
          hasMoved
        )
      ) {
        setSelectedPiece(null);
        return; // Invalid move, exit function
      }

      const newBoard = board.map((row) => [...row]);
      newBoard[selectedPiece.row][selectedPiece.col] = null;
      capturedPiece = board[row][col];
      if (capturedPiece !== null) {
        addCapturedPiece(
          capturedPiece,
          selectedPiece.piece === selectedPiece.piece.toUpperCase()
            ? "white"
            : "black"
        );
      }
      /*** use chessUtil getPieceColor ***/
      newBoard[row][col] = selectedPiece.piece;
      moveNotation = createNotation(
        row,
        col,
        selectedPiece,
        capturedPiece,
        letterNotation
      );
      /*** move letterNotation to chessUtils....and move below as well to chessUtils ***/

      // edit move notation if multiple pieces can move to the same square
      if (["R", "N", "B", "Q"].includes(selectedPiece.piece.toUpperCase())) {
        const otherPiecePositions = getAllPiecePositions(
          selectedPiece.piece,
          board
        );
        if (otherPiecePositions.length > 1) {
          const checkList = otherPiecePositions
            .map((position) => {
              if (
                canPieceMove(
                  position.row,
                  position.col,
                  row,
                  col,
                  board,
                  "placeholder",
                  {}
                )
              )
                return position;
              else return false;
            })
            .filter((position) => position !== false);
          if (checkList.length > 1) {
            const firstPosition = checkList[0];
            const secondPosition = checkList[1];
            if (firstPosition.col !== secondPosition.col) {
              moveNotation =
                moveNotation.slice(0, 1) +
                letterNotation[selectedPiece.col + 1] +
                moveNotation.slice(1);
            } else if (firstPosition.row !== secondPosition.row) {
              moveNotation =
                moveNotation.slice(0, 1) +
                Math.abs(selectedPiece.row - 8) +
                moveNotation.slice(1);
            }
          }
        }
      }
      /*** use chessUtil getPieceColor ***/
      const currentPlayer =
        selectedPiece.piece === selectedPiece.piece.toUpperCase()
          ? "white"
          : "black";
      if (isKingInCheck(newBoard, currentPlayer, hasMoved)) {
        console.log("Move rejected: King would be in check");
        setSelectedPiece(null);
        return; // Block the move
      }

      // handle En Passant Capture
      if (
        selectedPiece.piece.toLowerCase() == "p" &&
        enPassantTarget &&
        enPassantTarget.row === row &&
        enPassantTarget.col === col
      ) {
        const capturedPawnRow = selectedPiece.piece === "P" ? row + 1 : row - 1;
        capturedPiece = newBoard[(capturedPawnRow, col)];
        newBoard[capturedPawnRow][col] = null; // Remove captured pawn
        moveNotation = createNotation(
          row,
          col,
          selectedPiece,
          capturedPiece,
          letterNotation
        );
      }
      /*** move letterNotation to chessUtils....and move below as well to chessUtils ***/

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

      // Check if this move creates an en passant opportunity
      if (
        selectedPiece.piece.toLowerCase() === "p" &&
        Math.abs(selectedPiece.row - row) === 2
      ) {
        setEnPassantTarget({ row: (selectedPiece.row + row) / 2, col }); // Middle square is where en passant can happen
      } else {
        setEnPassantTarget(null); // Reset en passant if it's not a two-square move
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
      setBoard(newBoard);
      setSelectedPiece(null);
      // Check for Checkmate
      const opponent = currentPlayer === "white" ? "black" : "white";
      if (isCheckmate(newBoard, opponent, hasMoved)) {
        console.log("Checkmate!");
        setGameIsActive(false);
        moveNotation += "#";
      }
      if (checkIfLastMovePutKingInCheck(row, col, newBoard, opponent))
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
