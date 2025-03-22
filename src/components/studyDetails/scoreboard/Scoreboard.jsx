import React from "react";

import { useGameState } from "../../../context/GameStateProvider";

import "./scoreboardStyles.css";

const Scoreboard = () => {
  const { capturedPieces, pieceValues } = useGameState();
  let whiteScore = 0;
  let blackScore = 0;
  capturedPieces.white.forEach((piece) => {
    whiteScore += pieceValues[piece];
  });
  capturedPieces.black.forEach((piece) => {
    blackScore += pieceValues[piece];
  });

  return (
    <div className="scoreboard">
      <div id="scoreboard-white" className="scoreboard-side">
        <div className="side-title">
          White {whiteScore > 0 ? whiteScore : ""}
        </div>
        <div className="captured-pieces">{capturedPieces.white}</div>
      </div>
      <div id="scoreboard-black" className="scoreboard-side">
        <div className="captured-pieces">{capturedPieces.black}</div>
        <div className="side-title">
          Black {blackScore > 0 ? blackScore : ""}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
