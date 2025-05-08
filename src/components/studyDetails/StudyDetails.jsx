import React from "react";
import { FaCode } from "react-icons/fa6"; // Using a placeholder icon for now
import "./studyDetailsStyles.css";
import Scoreboard from "./scoreboard/Scoreboard";
import MovesList from "./movesList/MovesList";
import StudyDetailsButton from "./studyDetailsButton/StudyDetailsButton";

const StudyDetails = () => {
  return (
    <div className="study-details">
      <Scoreboard />
      <MovesList />
      <div className="study-details__variation-btns">
        <StudyDetailsButton
          icon={FaCode}
          label="Button 1"
          onClick={() => {}}
          disabled={true}
        />
        <StudyDetailsButton
          icon={FaCode}
          label="Button 2"
          onClick={() => {}}
          disabled={true}
        />
        <StudyDetailsButton
          icon={FaCode}
          label="Button 3"
          onClick={() => {}}
          disabled={true}
        />
        <StudyDetailsButton
          icon={FaCode}
          label="Button 4"
          onClick={() => {}}
          active={true}
        />
      </div>
    </div>
  );
};

export default StudyDetails;
