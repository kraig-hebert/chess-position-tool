import React from "react";
import { useSelector } from "react-redux";
import { pieceValues } from "../../../logic/chessUtils";
import { selectPieceIcons } from "../../../store/slices/uiSlice";
import { selectCapturedPieces } from "../../../store/slices/gameSlice";
import "./scoreboardStyles.css";
import PieceIcon from "../../board/pieceIcon/PieceIcon";

const Scoreboard = () => {
  const capturedPieces = useSelector(selectCapturedPieces);
  const pieceIcons = useSelector(selectPieceIcons);
  let whiteScore = 0;
  let blackScore = 0;
  capturedPieces.white.forEach((piece) => {
    whiteScore += pieceValues[piece];
  });
  capturedPieces.black.forEach((piece) => {
    blackScore += pieceValues[piece.toLowerCase()];
  });

  const renderPieceIcons = (color) => {
    let pawnTotal = 0;
    const pieceList = [];
    capturedPieces[color].forEach((piece, index) => {
      if (piece === "P" || piece === "p") pawnTotal += 1;
      else {
        const { icon: Icon, className } = pieceIcons[piece];
        pieceList.push(
          <PieceIcon key={index} Icon={Icon} className={`${className} small`} />
        );
      }
    });
    const pawnIconType = color === "white" ? "p" : "P";
    if (pawnTotal > 0) {
      const { icon: Icon, className } = pieceIcons[pawnIconType];
      pieceList.unshift(
        <div key="pawn-list" className="pawn-list">
          <PieceIcon Icon={Icon} className={`${className} small`} />x{" "}
          {pawnTotal}
        </div>
      );
    }
    return pieceList;
  };

  return (
    <div className="scoreboard">
      <div id="scoreboard-white" className="scoreboard-side">
        <div className="side-title">White: </div>
        <div className="captured-pieces">{renderPieceIcons("white")}</div>
        <span className="score-diff">
          {whiteScore - blackScore > 0 ? `+ ${whiteScore - blackScore}` : ""}
        </span>
      </div>
      <div id="scoreboard-black" className="scoreboard-side">
        <div className="side-title">Black: </div>
        <div className="captured-pieces">{renderPieceIcons("black")}</div>
        <span className="score-diff">
          {blackScore - whiteScore > 0 ? `+${blackScore - whiteScore}` : ""}
        </span>
      </div>
    </div>
  );
};

export default Scoreboard;
