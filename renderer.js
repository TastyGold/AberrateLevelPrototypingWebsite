export function draw(ctx, state) {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw grid
  drawGrid(ctx, state);

  // Draw highlighted tile
  drawHighlightedTile(ctx, state);
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
