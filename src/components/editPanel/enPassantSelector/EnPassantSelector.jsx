import React from "react";
import "./enPassantSelectorStyles.css";

const EnPassantSelector = () => {
  return (
    <div className="en-passant-selector">
      <div className="en-passant-toggle">
        <input type="checkbox" id="enable-en-passant" />
        <label htmlFor="enable-en-passant">Allow En Passant Captures</label>
      </div>

      {/* This section will show potential en passant targets when enabled */}
      <div className="en-passant-targets" style={{ display: "none" }}>
        <div className="targets-label">Capture at:</div>
        <div className="targets-list">
          {/* Example targets that will be replaced with real data */}
          <div className="target-option">e6</div>
          <div className="target-option target-selected">d3</div>
        </div>
      </div>
    </div>
  );
};

export default EnPassantSelector;
