import {
  copyBoard,
  getPieceColor,
  getPossibleMoves,
  getPossiblePawnDiagonalPressures,
} from "./chessUtils";
import { makePieceMove } from "./moveValidation";

export const getSquarePressures = (board, color) => {
  const boardWithPressures = copyBoard(board).map((row) => row.map((col) => 0));
  let possibleMovesList = [];

  board.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const piece = board[rowIndex][colIndex];
      if (piece !== null && color === getPieceColor(piece)) {
        // handle pawns separately to only check diagonal pressures
        if (piece.toLowerCase() === "p") {
          const moves = getPossiblePawnDiagonalPressures(
            rowIndex,
            colIndex,
            color
          );
          moves.forEach((move) => possibleMovesList.push(move));
        } else {
          const moves = getPossibleMoves(board, rowIndex, colIndex, color, {
            coverageValidation: true,
          });
          moves.forEach((move) => possibleMovesList.push(move));
        }
      }
    });
  });
  possibleMovesList.forEach(
    (move) => (boardWithPressures[move.row][move.col] += 1)
  );
  return boardWithPressures;
};

export const getSquareControl = (row, col, whitePressure, blackPressure) => {
  const whitePressureValue = whitePressure[row][col];
  const blackPressureValue = blackPressure[row][col];
  if (whitePressureValue > blackPressureValue) {
    return {
      color: "white",
      control: whitePressureValue - blackPressureValue,
    };
  } else if (blackPressureValue > whitePressureValue) {
    return {
      color: "black",
      control: blackPressureValue - whitePressureValue,
    };
  } else return { color: "none", control: 0 };
};

// =====================
// Attacker Inspect helpers
// =====================

const isSlider = (piece) => {
  if (!piece) return false;
  const p = piece.toLowerCase();
  return p === "r" || p === "b" || p === "q";
};

const sliderSupportsDirection = (piece, dRow, dCol) => {
  const p = piece.toLowerCase();
  const isStraight = dRow === 0 || dCol === 0;
  const isDiagonal = Math.abs(dRow) === Math.abs(dCol);
  if (p === "r") return isStraight;
  if (p === "b") return isDiagonal;
  if (p === "q") return isStraight || isDiagonal;
  return false;
};

const unitDirection = (fromRow, fromCol, targetRow, targetCol) => {
  const dRow = targetRow - fromRow;
  const dCol = targetCol - fromCol;
  const sign = (n) => (n === 0 ? 0 : n > 0 ? 1 : -1);
  const stepRow = sign(dRow);
  const stepCol = sign(dCol);
  // Must be aligned straight or diagonal
  if (stepRow === 0 || stepCol === 0 || Math.abs(dRow) === Math.abs(dCol)) {
    return { stepRow, stepCol };
  }
  return null;
};

/**
 * Check if a piece at (fromRow,fromCol) attacks (targetRow,targetCol) immediately using existing move validation.
 */
const isImmediateAttack = (
  board,
  fromRow,
  fromCol,
  targetRow,
  targetCol,
  options
) => {
  const piece = board[fromRow][fromCol];

  // Special handling for pawns - they only attack diagonally
  if (piece && piece.toLowerCase() === "p") {
    const color = getPieceColor(piece);
    // Use the existing function for pawn diagonal attacks
    const diagonalMoves = getPossiblePawnDiagonalPressures(
      fromRow,
      fromCol,
      color
    );
    // Check if the target square is in the list of diagonal moves
    return diagonalMoves.some(
      (move) => move.row === targetRow && move.col === targetCol
    );
  }

  // For all other pieces, use the normal move validation
  const res = makePieceMove(fromRow, fromCol, targetRow, targetCol, board, {
    coverageValidation: true,
    enPassantTarget: options?.enPassantTarget ?? null,
    hasMoved: options?.hasMoved ?? null,
  });
  return !!(res && res.newBoard);
};

/**
 * Determine if piece at (fr,fc) attacks (tr,tc) with optional chaining.
 * Returns 'immediate' | 'chained' | null.
 */
export const canPieceAttackSquare = (
  board,
  fromRow,
  fromCol,
  targetRow,
  targetCol,
  options,
  memo
) => {
  const key = `${fromRow},${fromCol}->${targetRow},${targetCol}`;
  if (!memo) memo = new Map();
  if (memo.has(key)) return memo.get(key);

  const piece = board[fromRow][fromCol];
  if (!piece) {
    memo.set(key, null);
    return null;
  }

  // Immediate
  if (
    isImmediateAttack(board, fromRow, fromCol, targetRow, targetCol, options)
  ) {
    memo.set(key, "immediate");
    return "immediate";
  }

  // Chain only if enabled and slider aligned
  if (!(options?.includeChained ?? true)) {
    memo.set(key, null);
    return null;
  }

  if (!isSlider(piece)) {
    memo.set(key, null);
    return null;
  }

  const dir = unitDirection(fromRow, fromCol, targetRow, targetCol);
  if (!dir) {
    memo.set(key, null);
    return null;
  }
  if (
    !sliderSupportsDirection(piece, targetRow - fromRow, targetCol - fromCol)
  ) {
    memo.set(key, null);
    return null;
  }

  // Walk toward target to find the first blocker
  let currentRow = fromRow + dir.stepRow;
  let currentCol = fromCol + dir.stepCol;
  while (currentRow !== targetRow || currentCol !== targetCol) {
    const blocker = board[currentRow][currentCol];
    if (blocker) {
      // Enemy blocks chain
      if (getPieceColor(blocker) !== getPieceColor(piece)) {
        memo.set(key, null);
        return null;
      }
      // Same color: can blocker attack target?
      const result = canPieceAttackSquare(
        board,
        currentRow,
        currentCol,
        targetRow,
        targetCol,
        options,
        memo
      );
      const chained = result === "immediate" || result === "chained";
      memo.set(key, chained ? "chained" : null);
      return chained ? "chained" : null;
    }
    currentRow += dir.stepRow;
    currentCol += dir.stepCol;
  }

  // If no blocker found, immediate would have been true already
  memo.set(key, null);
  return null;
};

/**
 * Get attackers of a target square. Options:
 * - colors: { white: bool, black: bool }
 * - includeChained: boolean
 * - enPassantTarget, hasMoved
 */
export const getAttackersOfSquareInspect = (
  board,
  targetRow,
  targetCol,
  options
) => {
  const attackers = [];
  const colors = options?.colors || { white: true, black: true };
  const memo = new Map();

  for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
    for (let colIndex = 0; colIndex < 8; colIndex++) {
      const piece = board[rowIndex][colIndex];
      if (!piece) continue;
      const color = getPieceColor(piece);
      if (!colors[color]) continue;
      const kind = canPieceAttackSquare(
        board,
        rowIndex,
        colIndex,
        targetRow,
        targetCol,
        options,
        memo
      );
      if (!kind) continue;
      if (
        kind === "immediate" ||
        (kind === "chained" && (options?.includeChained ?? true))
      ) {
        attackers.push({ row: rowIndex, col: colIndex, piece, kind });
      }
    }
  }

  return attackers;
};
