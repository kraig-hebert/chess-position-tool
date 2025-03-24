import React from "react";

import "./studyDetailsStyles.css";
import Scoreboard from "./scoreboard/Scoreboard";
import MovesList from "./movesList/MovesList";

const StudyDetails = () => {
  return (
    <div className="study-details">
      <Scoreboard />
      <MovesList />
    </div>
  );
};

export default StudyDetails;
