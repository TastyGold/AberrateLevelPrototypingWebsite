export function draw(ctx, state) {
  // Clear canvas
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Save canvas state for camera transformations
  ctx.save();

  // Apply camera transformation for world view
  applyCamera(ctx, state);

  // Draw grid (in world coordinates)
  drawGrid(ctx, state);

  // Draw highlighted tile (in world coordinates)
  drawHighlightedTile(ctx, state);

  // Restore canvas state for screen-space UI elements
  ctx.restore();

  // Draw debug circle at exact mouse position (screen space)
  drawDebugMouse(ctx, state);
}

/**
 * Apply camera transformation to canvas context
 * This makes everything drawn afterwards appear in world coordinates
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} state - Editor state with camera info
 */
function applyCamera(ctx, state) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  const zoom = state.camera.zoom;

  // Translate to canvas center
  ctx.translate(canvasWidth / 2, canvasHeight / 2);

  // Scale by zoom level
  ctx.scale(zoom, zoom);

  // Translate by negative camera position (camera position is world center)
  ctx.translate(-state.camera.x, -state.camera.y);
}

/**
 * Convert screen coordinates to world coordinates using camera
 * @returns {object} World position {x, y}
 */
function screenToWorld(screenX, screenY, state, canvasWidth, canvasHeight) {
  const zoom = state.camera.zoom;

  // Convert screen to relative-to-center
  const relX = screenX - canvasWidth / 2;
  const relY = screenY - canvasHeight / 2;

  // Convert to world coordinates
  const worldX = relX / zoom + state.camera.x;
  const worldY = relY / zoom + state.camera.y;

  return { x: worldX, y: worldY };
}

function drawGrid(ctx, state) {
  const gridSize = state.gridSize;
  const zoom = state.camera.zoom;

  ctx.strokeStyle = '#333';
  // Adjust line width based on zoom so lines are always visible
  ctx.lineWidth = 1 / zoom;

  // Calculate the visible world bounds
  // (rough estimate, we'll just draw more than necessary)
  const camX = state.camera.x;
  const camY = state.camera.y;
  const canvasWidth = ctx.canvas.width / zoom;
  const canvasHeight = ctx.canvas.height / zoom;

  const startX = Math.floor((camX - canvasWidth / 2) / gridSize) * gridSize;
  const startY = Math.floor((camY - canvasHeight / 2) / gridSize) * gridSize;
  const endX = startX + canvasWidth + gridSize;
  const endY = startY + canvasHeight + gridSize;

  // Draw vertical lines
  for (let x = startX; x <= endX; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.lineTo(x, endY);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = startY; y <= endY; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.stroke();
  }
}

function drawHighlightedTile(ctx, state) {
  const gridSize = state.gridSize;
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  // Get world position of mouse cursor
  const worldMouse = screenToWorld(state.mouse.x, state.mouse.y, state, canvasWidth, canvasHeight);
  const tileX = Math.floor(worldMouse.x / gridSize) * gridSize;
  const tileY = Math.floor(worldMouse.y / gridSize) * gridSize;

  // Draw semi-transparent highlight
  ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
  ctx.fillRect(tileX, tileY, gridSize, gridSize);

  // Draw bright border
  ctx.strokeStyle = '#64c8ff';
  ctx.lineWidth = 2 / state.camera.zoom;
  ctx.strokeRect(tileX, tileY, gridSize, gridSize);
}

/**
 * DEBUG: Draw a circle at the exact mouse position (screen space)
 * This helps verify the input system is running at expected frame rates
 * and that mouse coordinates are being tracked accurately
 */
function drawDebugMouse(ctx, state) {
  const x = state.mouse.x;
  const y = state.mouse.y;
  const mdx = state.mouse.mouseDownX;
  const mdy = state.mouse.mouseDownY;

  // Draw small circle at exact mouse position (screen coordinates)
  drawCircle(ctx, x, y, 5, 'rgba(255, 0, 255, 0.8)');
  drawCircle(ctx, mdx, mdy, 5, 'rgba(255, 0, 255, 0.4)');

  // Draw velocity indicator (small line showing delta)
  if (state.mouse.deltaX !== 0 || state.mouse.deltaY !== 0) {
    drawLine(ctx, x, y, x + state.mouse.deltaX * 2, y + state.mouse.deltaY * 2, '#ffff00', 1);
  }

  // If left mouse is down, draw a rectangle from mouse down position to current position
  if (state.input.isLeftMouseDown) {
    drawRectLines(ctx, x, y, mdx - x, mdy - y, 'rgba(255, 0, 255, 0.8)', 1);
  }
}

function drawCircle(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawRectLines(ctx, x, y, width, height, color, lineWidth) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(x, y, width, height);
}