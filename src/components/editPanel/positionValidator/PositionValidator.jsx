import React, { useEffect, useState } from "react";
import { useGameState } from "../../../context/GameStateProvider";
import { validatePosition } from "../../../logic/chessUtils";
import "./positionValidatorStyles.css";

const PositionValidator = () => {
  const { board, setPositionIsValid, nextMoveColor } = useGameState();
  const [validationResult, setValidationResult] = useState({
    isValid: true,
    errors: [],
  });

  // Re-validate whenever the board changes or nextMoveColor changes
  useEffect(() => {
    const result = validatePosition(board, nextMoveColor);
    setValidationResult(result);

    // Update the global positionIsValid state
    setPositionIsValid(result.isValid);
  }, [board, nextMoveColor, setPositionIsValid]);

  // If there are no errors, don't render anything
  if (validationResult.isValid) {
    return null;
  }

  return (
    <div className="position-validator">
      <div className="validation-header">Position Invalid:</div>
      <ul className="validation-errors">
        {validationResult.errors.map((error, index) => (
          <li key={index} className="validation-error">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PositionValidator;
