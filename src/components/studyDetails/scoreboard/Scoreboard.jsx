import React from "react";

import { useGameState } from "../../../context/GameStateProvider";

import "./scoreboardStyles.css";
import PieceIcon from "../../board/pieceIcon/PieceIcon";

const Scoreboard = () => {
  const { capturedPieces, pieceValues, pieceIcons } = useGameState();
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
      else
        pieceList.push(
          <PieceIcon
            key={index}
            Icon={pieceIcons[piece].icon}
            className={`${pieceIcons[piece].className} + small`}
          />
        );
    });
    const pawnIconType = color === "white" ? "p" : "P";
    if (pawnTotal > 0)
      pieceList.unshift(
        <>
          <PieceIcon
            key={17}
            Icon={pieceIcons[pawnIconType].icon}
            className={`${pieceIcons[pawnIconType].className} + small`}
          />
          x {pawnTotal}
        </>
      );
    return pieceList;
  };

  return (
    <div className="scoreboard">
      <div id="scoreboard-white" className="scoreboard-side">
        <div className="side-title">White: </div>
        <div className="captured-pieces">{renderPieceIcons("white")}</div>
        <span>
          {whiteScore - blackScore > 0 ? `+ ${whiteScore - blackScore}` : ""}
        </span>
      </div>
      <div id="scoreboard-black" className="scoreboard-side">
        <div className="side-title">Black: </div>
        <div className="captured-pieces">{renderPieceIcons("black")}</div>
        <span>
          {blackScore - whiteScore > 0 ? `+${blackScore - whiteScore}` : ""}
        </span>
      </div>
    </div>
  );
};

export default Scoreboard;
