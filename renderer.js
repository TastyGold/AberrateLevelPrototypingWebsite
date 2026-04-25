import { config, screenToWorld } from './editor.js';
import { SpriteRendererComponent } from "./components/SpriteRendererComponent.js";
import { TransformComponent } from "./components/TransformComponent.js";
import { BoxColliderComponent } from './components/BoxColliderComponent.js';

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

  if (state.creatingRoom) {
    // Draw room creation preview (if applicable)
    drawRoomTool(ctx, state);
  }
  else if (!state.placingEntity){
    // Draw highlighted tile (in world coordinates)
    drawHighlightedTile(ctx, state);
  }

  if (state.placingEntity) {
    // Draw entity placement preview (if applicable)
    drawRectLines(ctx, state.entityPreview.x, state.entityPreview.y, state.gridSize, state.gridSize, 'rgba(255, 255, 0, 0.5)', 2);
  }

  // Draw entities
  drawEntites(ctx, state);

  // Draw entity collisions (if enabled)
  if (config.showEntityCollision) {
    drawEntityCollisions(ctx, state);
  }

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
  const worldMouse = screenToWorld(state.mouse.x, state.mouse.y, canvasWidth, canvasHeight);
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

function drawRoomTool(ctx, state) {
  const { gridSize, mouse, camera } = state;

  // Get world position of mouse down and current mouse grid positions
  const ax = mouse.mouseDownGridX * gridSize;
  const ay = mouse.mouseDownGridY * gridSize;
  const bx = mouse.gridX * gridSize;
  const by = mouse.gridY * gridSize;

  // Calculate top-left corner and size of the rectangle defined by (ax, ay) and (bx, by)
  const x = Math.min(ax, bx);
  const y = Math.min(ay, by);
  const w = Math.abs(bx - ax) + gridSize;
  const h = Math.abs(by - ay) + gridSize;

  // Room preview fill
  ctx.fillStyle = 'rgba(100, 255, 159, 0.3)';
  ctx.fillRect(x, y, w, h);

  // Room border
  ctx.strokeStyle = '#64ff98';
  ctx.lineWidth = 2 / camera.zoom;
  ctx.strokeRect(x, y, w, h);
}

function drawEntites(ctx, state) {
  state.entities.forEach(entity => {
    const transform = entity.getComponent(TransformComponent);
    const sprite = entity.getComponent(SpriteRendererComponent);
    if (sprite && transform) {
      sprite.draw(ctx, transform);
      return; // Skip fallback drawing if sprite is present
    }

    // fallback to draw when theres no spritecomponent
    if (transform) {
      ctx.fillStyle = 'rgb(255, 0, 255)';
      ctx.fillRect(transform.x - 20, transform.y - 20, 40, 40);
    }
  });
}

function drawEntityCollisions(ctx, state) {
  state.entities.forEach(entity => {
    const transform = entity.getComponent(TransformComponent);
    const collider = entity.getComponent(BoxColliderComponent);
    if (collider && transform) {
      ctx.strokeStyle = config.collisionOutlineColor;
      ctx.lineWidth = 1 / state.camera.zoom;
      if (collider.highlighted) ctx.lineWidth *= 3;
      ctx.strokeRect(transform.x - collider.width / 2, transform.y - collider.height / 2, collider.width, collider.height);
    }
  });
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
    drawLine(ctx, x, y, x - state.mouse.deltaX, y - state.mouse.deltaY, '#ffff00', 1);
  }

  // If left mouse is down, draw a rectangle from mouse down position to current position
  if (state.input.isLeftMouseDown) {
    if (state.selectedToolName === 'room') {
      drawRectLines(ctx, x, y, mdx - x, mdy - y, 'rgba(255, 0, 255, 0.8)', 1);
    }
    else if (state.selectedToolName === 'camera') {
      // Draw camera-specific debug visuals
      drawLine(ctx, x, y, mdx, mdy, 'rgba(255, 0, 255, 0.8)', 1);
    }
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