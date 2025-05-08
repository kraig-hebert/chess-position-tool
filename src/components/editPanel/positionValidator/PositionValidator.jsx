import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectNextMoveColorAfterEdit } from "../../../store/slices/uiSlice";
import {
  setPositionIsValid,
  selectBoard,
} from "../../../store/slices/gameSlice";
import { validatePosition } from "../../../logic/chessUtils";
import "./positionValidatorStyles.css";

const PositionValidator = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const nextMoveColorAfterEdit = useSelector(selectNextMoveColorAfterEdit);
  const [validationResult, setValidationResult] = useState({
    isValid: true,
    errors: [],
  });

  // Re-validate whenever the board changes or nextMoveColorAfterEdit changes
  useEffect(() => {
    const result = validatePosition(board, nextMoveColorAfterEdit);
    setValidationResult(result);

    // Update the global positionIsValid state in Redux
    dispatch(setPositionIsValid(result.isValid));
  }, [board, nextMoveColorAfterEdit, dispatch]);

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
