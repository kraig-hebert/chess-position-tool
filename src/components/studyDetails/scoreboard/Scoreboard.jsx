import React from "react";

import { useGameState } from "../../../context/GameStateProvider";

import "./scoreboardStyles.css";

const Scoreboard = () => {
  const { capturedPieces, pieceValues } = useGameState();
  console.log("render");
  let whiteScore = 0;
  let blackScore = 0;
  capturedPieces.white.forEach((piece) => {
    console.log(piece);

    whiteScore += pieceValues[piece];
  });
  capturedPieces.black.forEach((piece) => {
    console.log(piece);
    blackScore += pieceValues[piece.toLowerCase()];
  });
  console.log(whiteScore, blackScore);

  return (
    <div className="scoreboard">
      <div id="scoreboard-white" className="scoreboard-side">
        <div className="side-title">
          White {whiteScore - blackScore > 0 ? whiteScore - blackScore : ""}
        </div>
        <div className="captured-pieces">{capturedPieces.white}</div>
      </div>
      <div id="scoreboard-black" className="scoreboard-side">
        <div className="captured-pieces">{capturedPieces.black}</div>
        <div className="side-title">
          Black {blackScore - whiteScore > 0 ? blackScore - whiteScore : ""}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
