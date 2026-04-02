/**
 * Configuration variables for editor behavior
 * Adjust these to fine-tune feel and responsiveness
 */
export const config = {
  // Zoom speed when scrolling (units per scroll wheel tick)
  zoomSpeed: 0.1,
  // Pan speed when middle-dragging (pixels per pixel of mouse movement)
  panSpeed: 1.0,
  // Min and max zoom levels
  minZoom: 0.3,
  maxZoom: 5,
};

export const state = {
  // Grid properties
  gridSize: 40,

  // Editor data
  tiles: [],
  entities: [],

  // UI state
  selectedTool: 'select',
  selectedTile: null,

  // Mouse state (in local canvas coordinates)
  mouse: {
    x: 0,
    y: 0,
    gridX: 0,
    gridY: 0,
    // Mouse velocity (delta from previous frame)
    deltaX: 0,
    deltaY: 0,
  },

  // Camera/viewport
  camera: {
    x: 0,
    y: 0,
    zoom: 1,
  },

  // Input state tracking
  input: {
    isMiddleMouseDown: false,
    isAltDown: false,
    isLeftMouseDown: false,
  },
};

/**
 * Handle mouse button press
 * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
 * 
 * TODO: Implement tile placing logic here when selectedTool is 'tile'
 * TODO: Implement entity placing logic when selectedTool is 'entity'
 * TODO: Implement erasing logic when selectedTool is 'erase'
 */
export function mouseDown(button) {
  // Handle middle click for camera panning
  if (button === 1) {
    state.input.isMiddleMouseDown = true;
    return;
  }

  // Handle left click
  if (button === 0) {
    state.input.isLeftMouseDown = true;
    // Check selectedTool and perform action
    // if (state.selectedTool === 'tile') { ... }
    // if (state.selectedTool === 'entity') { ... }
  }
  // TODO: Handle right click (button === 2)
}

/**
 * Handle mouse button release
 * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
 */
export function mouseUp(button) {
  // Stop camera panning
  if (button === 1) {
    state.input.isMiddleMouseDown = false;
    return;
  }

  // Handle left click release
  if (button === 0) {
    state.input.isLeftMouseDown = false;
    // TODO: Finalize any editing operations
  }
}

/**
 * Handle keyboard key down
 * @param {string} key - The key that was pressed
 */
export function keyDown(key) {
  if (key.toLowerCase() === 'alt') {
    state.input.isAltDown = true;
  }
}

/**
 * Handle keyboard key up
 * @param {string} key - The key that was released
 */
export function keyUp(key) {
  if (key.toLowerCase() === 'alt') {
    state.input.isAltDown = false;
  }
}

/**
 * Pan the camera (move view)
 * @param {number} deltaX - Amount to move camera in X (screen pixels)
 * @param {number} deltaY - Amount to move camera in Y (screen pixels)
 */
export function panCamera(deltaX, deltaY) {
  state.camera.x += deltaX * config.panSpeed;
  state.camera.y += deltaY * config.panSpeed;
}

/**
 * Zoom the camera relative to a point on screen
 * @param {number} zoomDelta - Zoom direction/amount (-1 for zoom out, 1 for zoom in)
 * @param {number} screenX - Screen X coordinate to zoom toward (where cursor is)
 * @param {number} screenY - Screen Y coordinate to zoom toward (where cursor is)
 * @param {number} canvasWidth - Width of canvas (for coordinate conversion)
 * @param {number} canvasHeight - Height of canvas (for coordinate conversion)
 */
export function zoom(zoomDelta, screenX, screenY, canvasWidth, canvasHeight) {
  // Convert screen position to world position BEFORE zoom
  const worldX = (screenX - canvasWidth / 2) / state.camera.zoom + state.camera.x;
  const worldY = (screenY - canvasHeight / 2) / state.camera.zoom + state.camera.y;

  // Update zoom level
  const newZoom = state.camera.zoom * (1 + zoomDelta * config.zoomSpeed);
  state.camera.zoom = Math.max(config.minZoom, Math.min(config.maxZoom, newZoom));

  // Adjust camera position to keep world point under cursor
  state.camera.x = worldX - (screenX - canvasWidth / 2) / state.camera.zoom;
  state.camera.y = worldY - (screenY - canvasHeight / 2) / state.camera.zoom;
}

/**
 * Place a tile at grid position
 * @param {number} gridX - Grid X coordinate
 * @param {number} gridY - Grid Y coordinate
 * @param {string} tileType - Type of tile to place
 */
export function setTile(gridX, gridY, tileType) {
  // TODO: Add tile to state.tiles array
  // Could be an array of objects: { x, y, type }
  // Example: state.tiles.push({ x: gridX, y: gridY, type: tileType });
}