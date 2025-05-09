import { makePieceMove } from "./moveValidation";

export const letterNotation = {
  1: "a",
  2: "b",
  3: "c",
  4: "d",
  5: "e",
  6: "f",
  7: "g",
  8: "h",
};

export const pieceValues = {
  p: 1,
  r: 5,
  n: 3,
  b: 3,
  q: 9,
  k: 0,
};

export const isWhite = (piece) => piece && piece === piece.toUpperCase();
export const isBlack = (piece) => piece && piece === piece.toLowerCase();
export const getPieceColor = (piece) =>
  piece.toUpperCase() === piece ? "white" : "black";
export const isSameColor = (firstPiece, secondPiece) => {
  if (!firstPiece || !secondPiece) return false;
  return getPieceColor(firstPiece) === getPieceColor(secondPiece);
};

export const copyBoard = (board) => board.map((row) => [...row]);

export const createNotation = (
  row,
  col,
  selectedPiece,
  capturedPiece,
  board,
  castlingSide
) => {
  let moveNotation = "";
  const letter = letterNotation[col + 1];
  const number = Math.abs(row - 8);
  const piece = selectedPiece.piece.toUpperCase();
  if (["R", "N", "B", "Q"].includes(piece))
    moveNotation = handleMajorPieceNotation(
      piece,
      letter,
      number,
      selectedPiece,
      capturedPiece,
      row,
      col,
      board
    );
  else if (piece === "P") {
    if (!capturedPiece) moveNotation = `${letter}${number}`;
    else
      moveNotation = `${
        letterNotation[selectedPiece.col + 1]
      }x${letter}${number}`;
  } else if (piece === "K") {
    if (castlingSide) {
      if (castlingSide === "kingside") moveNotation = "0-0";
      else if (castlingSide === "queenside") moveNotation = "0-0-0";
    } else
      moveNotation = handleMajorPieceNotation(
        piece,
        letter,
        number,
        selectedPiece,
        capturedPiece,
        row,
        col,
        board
      );
  }
  return moveNotation;
};

// edit notation if two pieces of the same kind can make move
export const handleMajorPieceNotation = (
  piece,
  letter,
  number,
  selectedPiece,
  capturedPiece,
  row,
  col,
  board
) => {
  let moveNotation = "";
  if (!capturedPiece) moveNotation = `${piece}${letter}${number}`;
  else moveNotation = `${piece}x${letter}${number}`;

  // check if other pieces of same king can make the same move
  const otherPiecePositions = getAllPiecePositions(selectedPiece.piece, board);
  if (otherPiecePositions.length > 1) {
    const checkList = otherPiecePositions
      .map((position) => {
        if (makePieceMove(position.row, position.col, row, col, board))
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
  return moveNotation;
};

// find position of king based on color
export const getKingPostion = (board, color) => {
  const king = color === "white" ? "K" : "k";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === king) {
        return { row, col };
      }
    }
  }
};

// find all positions of piece type
export const getAllPiecePositions = (piece, board) => {
  const piecePositions = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === piece) {
        piecePositions.push({ row, col });
      }
    }
  }
  return piecePositions;
};

// Function to check if a path is blocked (used for rooks, bishops, and queens)
export const isPathBlocked = (startRow, startCol, endRow, endCol, board) => {
  // set step direction based on start and end position
  const rowStep = startRow === endRow ? 0 : endRow > startRow ? 1 : -1;
  const colStep = startCol === endCol ? 0 : endCol > startCol ? 1 : -1;

  let currentRow = startRow + rowStep;
  let currentCol = startCol + colStep;

  // check each square in path until destination or path is blocked
  while (currentRow !== endRow || currentCol !== endCol) {
    if (board[currentRow][currentCol] !== null) return true; // A piece is blocking the path
    currentRow += rowStep;
    currentCol += colStep;
  }

  return false; // No pieces in the way
};

// Check if castling is valid
export const canCastle = (color, side, board, hasMoved) => {
  const row = color === "white" ? 7 : 0; // White on row 7, black on row 0

  // Determine which rook and king are involved
  const kingCol = 4;

  const rookCol = side === "kingside" ? 7 : 0;
  const newKingCol = side === "kingside" ? 6 : 2;
  const newRookCol = side === "kingside" ? 5 : 3;
  // Check if the king or rook have moved
  if (
    side === "kingside" &&
    (hasMoved[color + "King"] || hasMoved[color + "RookKingside"])
  ) {
    return false;
  }
  if (
    side === "queenside" &&
    (hasMoved[color + "King"] || hasMoved[color + "RookQueenside"])
  ) {
    return false;
  }

  // Ensure path between king and rook is clear
  if (isPathBlocked(row, kingCol, row, rookCol, board)) {
    return false;
  }

  // set middle square validate isKingInCheck
  let middleCol = null;
  if (side === "kingside") middleCol = 5;
  else middleCol = 3;

  //  Ensure the king does not pass through or end in check
  if (
    isKingInCheck(board, color, hasMoved) || // King cannot castle while in check
    isKingInCheck(
      simulateMove(board, row, kingCol, row, middleCol),
      color,
      hasMoved
    ) || // King cannot pass through check
    isKingInCheck(
      simulateMove(board, row, kingCol, row, newKingCol),
      color,
      hasMoved
    ) // King cannot land in check
  ) {
    return false;
  }

  return { kingTo: [row, newKingCol], rookTo: [row, newRookCol] };
};

// check if current king is in check
export const isKingInCheck = (board, color, hasMoved) => {
  const kingPosition = getKingPostion(board, color);

  if (!kingPosition) return false; // King not found (should never happen)

  // Check if any opponent's piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (
        piece &&
        !isSameColor(piece, board[kingPosition.row][kingPosition.col])
      ) {
        if (
          makePieceMove(row, col, kingPosition.row, kingPosition.col, board, {
            hasMoved,
          })
        )
          return true; // King is under attack
      }
    }
  }

  return false; // King is safe
};

export const isCheckmate = (board, color, hasMoved) => {
  // If not in check, not checkmate
  if (!isKingInCheck(board, color, hasMoved)) return false;
  const kingPosition = getKingPostion(board, color);

  // Use default/empty hasMoved state if not provided
  const castlingState = hasMoved || {
    whiteKing: false,
    whiteRookQueenside: false,
    whiteRookKingside: false,
    blackKing: false,
    blackRookKingside: false,
    blackRookQueenside: false,
  };

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (
        piece &&
        isSameColor(piece, board[kingPosition.row][kingPosition.col])
      ) {
        for (let targetRow = 0; targetRow < 8; targetRow++) {
          for (let targetCol = 0; targetCol < 8; targetCol++) {
            if (
              makePieceMove(row, col, targetRow, targetCol, board, {
                hasMoved: castlingState,
              })
            ) {
              // Simulate the move
              const newBoard = board.map((row) => [...row]);
              newBoard[targetRow][targetCol] = piece;
              newBoard[row][col] = null;
              if (!isKingInCheck(newBoard, color, castlingState)) {
                return false; // The king can escape, so not checkmate
              }
            }
          }
        }
      }
    }
  }

  return true; // No legal moves = Checkmate
};

export const getPossibleMoves = (
  board,
  selectedPieceRow,
  selectedPieceCol,
  color,
  options
) => {
  const moves = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const nextMove = makePieceMove(
        selectedPieceRow,
        selectedPieceCol,
        row,
        col,
        board,
        options
      );

      if (nextMove.newBoard) {
        if (options?.validateCheckAndCastle ?? false) {
          if (!isKingInCheck(nextMove.newBoard, color, options.hasMoved))
            moves.push({ row, col });
        } else moves.push({ row, col }); // If not validating check, add all moves
      }
    }
  }
  return moves;
};

export const getPossiblePawnDiagonalPressures = (
  selectedPieceRow,
  selectedPieceCol,
  color
) => {
  const moves = [];
  const direction = color === "white" ? -1 : 1; // White moves up, black moves down
  const attackMoves = [
    [selectedPieceRow + direction, selectedPieceCol - 1],
    [selectedPieceRow + direction, selectedPieceCol + 1],
  ];

  for (const [row, col] of attackMoves) {
    if (row >= 0 && row < 8 && col >= 0 && col < 8) moves.push({ row, col });
  }

  return moves;
};

// used to set up inital data for moveValidation
export const setUpMoveValidation = (
  startRow,
  startCol,
  endRow,
  endCol,
  board
) => {
  const newBoard = copyBoard(board);
  const piece = newBoard[startRow][startCol];
  const nextMove = newBoard[endRow][endCol];
  newBoard[startRow][startCol] = null;
  return { piece, nextMove, newBoard };
};

// Simulates a move to check if the king would be in check
export const simulateMove = (board, startRow, startCol, endRow, endCol) => {
  const newBoard = board.map((row) => [...row]); // Deep copy of board
  newBoard[endRow][endCol] = newBoard[startRow][startCol]; // Move piece
  newBoard[startRow][startCol] = null; // Clear old position
  return newBoard;
};

// Count pieces of each type on the board
export const countPieces = (boardState) => {
  const pieceCounts = {
    white: { P: 0, R: 0, N: 0, B: 0, Q: 0, K: 0 },
    black: { p: 0, r: 0, n: 0, b: 0, q: 0, k: 0 },
  };

  boardState.forEach((row) => {
    row.forEach((piece) => {
      if (piece) {
        const color = getPieceColor(piece);
        pieceCounts[color][piece]++;
      }
    });
  });
  return pieceCounts;
};

// Calculate captured pieces by comparing with initial position
export const calculateCapturedPieces = (currentBoard, initialBoard) => {
  const initialPieceCounts = countPieces(initialBoard);
  const currentPieceCounts = countPieces(currentBoard);

  const captured = {
    white: [],
    black: [],
  };

  // Add missing white pieces to black's captured list
  Object.entries(initialPieceCounts.white).forEach(([piece, count]) => {
    const missing = count - (currentPieceCounts.white[piece] || 0);
    for (let i = 0; i < missing; i++) {
      captured.black.push(piece);
    }
  });

  // Add missing black pieces to white's captured list
  Object.entries(initialPieceCounts.black).forEach(([piece, count]) => {
    const missing = count - (currentPieceCounts.black[piece] || 0);
    for (let i = 0; i < missing; i++) {
      captured.white.push(piece);
    }
  });

  return captured;
};

// Calculate castling rights based on piece positions
export const calculateCastlingRights = (board) => {
  const castlingRights = {
    whiteKing: false,
    whiteRookKingside: false,
    whiteRookQueenside: false,
    blackKing: false,
    blackRookKingside: false,
    blackRookQueenside: false,
  };

  // Check white pieces
  if (board[7][4] === "K") {
    castlingRights.whiteKing = true;
    if (board[7][7] === "R") castlingRights.whiteRookKingside = true;
    if (board[7][0] === "R") castlingRights.whiteRookQueenside = true;
  }

  // Check black pieces
  if (board[0][4] === "k") {
    castlingRights.blackKing = true;
    if (board[0][7] === "r") castlingRights.blackRookKingside = true;
    if (board[0][0] === "r") castlingRights.blackRookQueenside = true;
  }

  return castlingRights;
};

export const findPossibleEnPassantTargets = (board, nextMoveColor) => {
  const targets = [];
  // Track target squares to avoid duplicates
  const targetSquares = new Set();

  if (nextMoveColor === "white") {
    // If white moves next, look for white pawns on the 5th rank (index 3)
    for (let col = 0; col < 8; col++) {
      if (board[3][col] === "P") {
        // Check if there are adjacent black pawns
        if (col > 0 && board[3][col - 1] === "p") {
          // For en passant to be valid:
          // 1. Square behind the black pawn (row 2) must be empty
          // 2. Square two ranks behind (row 1) must also be empty
          if (board[2][col - 1] === null && board[1][col - 1] === null) {
            const targetKey = `2-${col - 1}`;
            if (!targetSquares.has(targetKey)) {
              targetSquares.add(targetKey);
              targets.push({
                row: 2,
                col: col - 1,
                notation: `${letterNotation[col]}6`,
              });
            }
          }
        }
        if (col < 7 && board[3][col + 1] === "p") {
          // For en passant to be valid:
          // 1. Square behind the black pawn (row 2) must be empty
          // 2. Square two ranks behind (row 1) must also be empty
          if (board[2][col + 1] === null && board[1][col + 1] === null) {
            const targetKey = `2-${col + 1}`;
            if (!targetSquares.has(targetKey)) {
              targetSquares.add(targetKey);
              targets.push({
                row: 2,
                col: col + 1,
                notation: `${letterNotation[col + 2]}6`,
              });
            }
          }
        }
      }
    }
  } else {
    // If black moves next, look for black pawns on the 4th rank (index 4)
    for (let col = 0; col < 8; col++) {
      if (board[4][col] === "p") {
        // Check if there are adjacent white pawns
        if (col > 0 && board[4][col - 1] === "P") {
          // For en passant to be valid:
          // 1. Square behind the white pawn (row 5) must be empty
          // 2. Square two ranks behind (row 6) must also be empty
          if (board[5][col - 1] === null && board[6][col - 1] === null) {
            const targetKey = `5-${col - 1}`;
            if (!targetSquares.has(targetKey)) {
              targetSquares.add(targetKey);
              targets.push({
                row: 5,
                col: col - 1,
                notation: `${letterNotation[col]}3`,
              });
            }
          }
        }
        if (col < 7 && board[4][col + 1] === "P") {
          // For en passant to be valid:
          // 1. Square behind the white pawn (row 5) must be empty
          // 2. Square two ranks behind (row 6) must also be empty
          if (board[5][col + 1] === null && board[6][col + 1] === null) {
            const targetKey = `5-${col + 1}`;
            if (!targetSquares.has(targetKey)) {
              targetSquares.add(targetKey);
              targets.push({
                row: 5,
                col: col + 1,
                notation: `${letterNotation[col + 2]}3`,
              });
            }
          }
        }
      }
    }
  }

  return targets;
};

export const validatePosition = (board, nextMoveColor) => {
  const errors = [];

  let whiteKingCount = 0;
  let blackKingCount = 0;
  let whitePawnCount = 0;
  let blackPawnCount = 0;

  let pawnsOnInvalidRanks = false;

  // Analyze the board
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      // Count kings and pawns
      if (piece === "K") whiteKingCount++;
      else if (piece === "k") blackKingCount++;
      else if (piece === "P") whitePawnCount++;
      else if (piece === "p") blackPawnCount++;

      // Check pawns on first/last rank
      if ((piece === "P" || piece === "p") && (row === 0 || row === 7)) {
        pawnsOnInvalidRanks = true;
      }
    }
  }

  // Validate king counts
  if (whiteKingCount !== 1) {
    errors.push(`White must have exactly one king (found ${whiteKingCount})`);
  }

  if (blackKingCount !== 1) {
    errors.push(`Black must have exactly one king (found ${blackKingCount})`);
  }

  // Validate pawn counts
  if (whitePawnCount > 8) {
    errors.push(`White has too many pawns (${whitePawnCount}/8)`);
  }

  if (blackPawnCount > 8) {
    errors.push(`Black has too many pawns (${blackPawnCount}/8)`);
  }

  // Validate pawn positions
  if (pawnsOnInvalidRanks) {
    errors.push("Pawns cannot be placed on the first or last rank");
  }

  // Skip check validation if we don't have exactly one king of each color or nextMoveColor isn't provided
  if (whiteKingCount === 1 && blackKingCount === 1 && nextMoveColor) {
    // Check if the non-moving side's king is in check (illegal position)
    const oppositeColor = nextMoveColor === "white" ? "black" : "white";

    if (isKingInCheck(board, oppositeColor)) {
      errors.push(
        `${
          oppositeColor === "white" ? "White" : "Black"
        } king is in check but it's ${nextMoveColor}'s turn to move (illegal position)`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to get piece name
const getPieceName = (pieceType) => {
  const names = {
    P: "Pawn",
    R: "Rook",
    N: "Knight",
    B: "Bishop",
    Q: "Queen",
    K: "King",
    p: "Pawn",
    r: "Rook",
    n: "Knight",
    b: "Bishop",
    q: "Queen",
    k: "King",
  };
  return names[pieceType];
};
