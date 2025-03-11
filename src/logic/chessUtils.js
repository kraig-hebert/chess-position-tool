// Check if a piece is white...uppercase = white
export const isWhite = (piece) => piece && piece === piece.toUpperCase();

// Check if two pieces are the same color
export const isSameColor = (firstPiece, secondPiece) => {
  if (!firstPiece || !secondPiece) return false;
  return isWhite(firstPiece) === isWhite(secondPiece);
};
