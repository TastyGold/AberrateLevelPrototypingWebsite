export function draw(ctx, state) {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw grid
  drawGrid(ctx, state);

  // Draw highlighted tile
  drawHighlightedTile(ctx, state);

  // Draw debug circle at exact mouse position
  drawDebugMouse(ctx, state);
}

function drawGrid(ctx, state) {
  const gridSize = state.gridSize;
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x < ctx.canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y < ctx.canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
    ctx.stroke();
  }
}

function drawHighlightedTile(ctx, state) {
  const gridSize = state.gridSize;
  const tileX = state.mouse.gridX * gridSize;
  const tileY = state.mouse.gridY * gridSize;

  // Draw semi-transparent highlight
  ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
  ctx.fillRect(tileX, tileY, gridSize, gridSize);

  // Draw bright border
  ctx.strokeStyle = '#64c8ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(tileX, tileY, gridSize, gridSize);
}

/**
 * DEBUG: Draw a circle at the exact mouse position
 * This helps verify the input system is running at expected frame rates
 * and that mouse coordinates are being tracked accurately
 */
function drawDebugMouse(ctx, state) {
  const x = state.mouse.x;
  const y = state.mouse.y;

  // Draw small circle at exact mouse position
  ctx.fillStyle = '#ff00ff';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();

  // Draw velocity indicator (small line showing delta)
  if (state.mouse.deltaX !== 0 || state.mouse.deltaY !== 0) {
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + state.mouse.deltaX * 2, y + state.mouse.deltaY * 2);
    ctx.stroke();
  }
}
