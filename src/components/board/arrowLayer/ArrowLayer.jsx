import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectArrows,
  selectArrowDrawing,
  selectIsEditMode,
  selectPov,
} from "../../../store/slices/uiSlice";
import "./arrowLayerStyles.css";

const SQUARE_SIZE = 85; // Match the board's grid size
const BOARD_SIZE = SQUARE_SIZE * 8;

const drawArrow = (ctx, start, end, pov) => {
  // Save the current context state
  ctx.save();

  if (pov === "black") {
    // Translate to center, rotate 180 degrees, translate back
    ctx.translate(BOARD_SIZE / 2, BOARD_SIZE / 2);
    ctx.rotate(Math.PI);
    ctx.translate(-BOARD_SIZE / 2, -BOARD_SIZE / 2);
  }

  // Convert board coordinates to canvas coordinates
  const startX = (start.col + 0.5) * SQUARE_SIZE;
  const startY = (start.row + 0.5) * SQUARE_SIZE;
  const endX = (end.col + 0.5) * SQUARE_SIZE;
  const endY = (end.row + 0.5) * SQUARE_SIZE;

  // Arrow styling
  ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";
  ctx.fillStyle = ctx.strokeStyle;
  ctx.lineWidth = 20;

  // Draw arrow shaft
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Calculate arrow head
  const angle = Math.atan2(endY - startY, endX - startX);
  const headLength = SQUARE_SIZE / 3;
  const headWidth = Math.PI / 2;

  // Draw arrow head starting from the base at the line end
  ctx.beginPath();
  ctx.moveTo(
    endX - headLength * Math.cos(angle - headWidth),
    endY - headLength * Math.sin(angle - headWidth)
  );
  // Move the tip forward by headLength
  ctx.lineTo(
    endX + headLength * Math.cos(angle),
    endY + headLength * Math.sin(angle)
  );
  ctx.lineTo(
    endX - headLength * Math.cos(angle + headWidth),
    endY - headLength * Math.sin(angle + headWidth)
  );
  ctx.closePath();
  ctx.fill();

  // Restore the context state
  ctx.restore();
};

const ArrowLayer = () => {
  const canvasRef = useRef(null);
  const arrows = useSelector(selectArrows);
  const arrowDrawing = useSelector(selectArrowDrawing);
  const isEditMode = useSelector(selectIsEditMode);
  const pov = useSelector(selectPov);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If edit mode is active, don't draw anything
    if (isEditMode) return;

    // Draw all permanent arrows
    arrows.forEach((arrow) => {
      drawArrow(ctx, arrow.start, arrow.end, pov);
    });

    // Draw preview arrow if drawing
    if (arrowDrawing.isDrawing && arrowDrawing.currentEndSquare) {
      drawArrow(
        ctx,
        arrowDrawing.startSquare,
        arrowDrawing.currentEndSquare,
        pov
      );
    }
  }, [arrows, arrowDrawing, pov]);

  return (
    <canvas
      ref={canvasRef}
      className="arrow-layer"
      width={BOARD_SIZE}
      height={BOARD_SIZE}
    />
  );
};

export default ArrowLayer;
