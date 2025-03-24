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

  const renderedWhitePieces = capturedPieces.white.map((piece, index) => (
    <PieceIcon
      key={index}
      Icon={pieceIcons[piece].icon}
      className={pieceIcons[piece].className}
    />
  ));
  const renderedBlackPieces = capturedPieces.black.map((piece, index) => (
    <PieceIcon
      key={index}
      Icon={pieceIcons[piece].icon}
      className={pieceIcons[piece].className}
    />
  ));

  return (
    <div className="scoreboard">
      <div id="scoreboard-white" className="scoreboard-side">
        <div className="side-title">
          White {whiteScore - blackScore > 0 ? whiteScore - blackScore : ""}
        </div>
        <div className="captured-pieces">{renderedWhitePieces}</div>
      </div>
      <div id="scoreboard-black" className="scoreboard-side">
        <div className="side-title">
          Black {blackScore - whiteScore > 0 ? blackScore - whiteScore : ""}
        </div>
        <div className="captured-pieces">{renderedBlackPieces}</div>
      </div>
    </div>
  );
};

export default Scoreboard;
