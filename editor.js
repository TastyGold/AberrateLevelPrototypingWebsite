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

// Import tools
import { CameraTool } from './CameraTool.js';
import { RoomTool } from './RoomTool.js';
import { UniversalTool } from './UniversalTool.js';

// Tool instances
const tools = {
  camera: new CameraTool(),
  room: new RoomTool(),
  universal: new UniversalTool(),
};

export const state = {
  // Grid properties
  gridSize: 40,

  // Editor data
  tiles: [],
  entities: [],

  // UI state
  selectedTool: 'camera',

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

  // Current active tool
  currentTool: tools.camera,
  // Previous tool (for Alt key temporary override)
  previousTool: tools.camera,
  isAltOverride: false,
};


/**
 * Set the active tool (permanent selection)
 * @param {string} name - Name of the tool to activate
 */
export function setTool(name) {
  if (state.currentTool === tools[name]) return;

  state.currentTool?.onExit(state);
  state.previousTool = tools[state.selectedTool];
  state.selectedTool = name;
  state.currentTool = tools[name];
  state.currentTool?.onEnter(state);
  state.isAltOverride = false;
}

/**
 * Temporarily switch to camera tool (when Alt key is pressed)
 */
export function activateAltOverride() {
  if (state.isAltOverride) return; // Already active

  state.isAltOverride = true;
  state.previousTool = tools[state.selectedTool];
  state.currentTool?.onExit(state);
  state.currentTool = tools.camera;
  state.currentTool?.onEnter(state);
}

/**
 * Return to the previous tool (when Alt key is released)
 */
export function deactivateAltOverride() {
  if (!state.isAltOverride) return; // Not active

  state.isAltOverride = false;
  state.currentTool?.onExit(state);
  state.currentTool = tools[state.selectedTool];
  state.currentTool?.onEnter(state);
}

/**
 * Get the current tool name
 */
export function getCurrentTool() {
  return state.selectedTool;
}

/**
 * Get the previous tool name (for when Alt is overriding)
 */
export function getPreviousTool() {
  return Object.keys(tools).find(name => tools[name] === state.previousTool);
}

/**
 * Check if Alt override is active
 */
export function isAltOverrideActive() {
  return state.isAltOverride;
}

/**
 * Handle mouse button press
 * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
 */
export function mouseDown(button) {
  tools.universal.onMouseDown(state, button); // Universal tool handles input state
  state.currentTool?.onMouseDown(state, button);
}

/**
 * Handle mouse button release
 * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
 */
export function mouseUp(button) {
  tools.universal.onMouseUp(state, button); // Universal tool handles input state
  state.currentTool?.onMouseUp(state, button);
}

/**
 * Handle keyboard key down
 * @param {string} key - The key that was pressed
 */
export function keyDown(key) {
  tools.universal.onKeyDown(state, key); // Universal tool handles input state
  state.currentTool?.onKeyDown(state, key);
}

/**
 * Handle keyboard key up
 * @param {string} key - The key that was released
 */
export function keyUp(key) {
  tools.universal.onKeyUp(state, key); // Universal tool handles input state
  state.currentTool?.onKeyUp(state, key);
}

// effectively the update function for input - called every time mouse moves
export function mouseMove(event) {
  tools.universal.onMouseMove(state); // Universal tool handles input state
  state.currentTool?.onMouseMove(state);
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

  let foundIndex = state.tiles.findIndex(t => t.x === gridX && t.y === gridY);
  if (foundIndex !== -1) {
    state.tiles[foundIndex].type = tileType; // Update existing tile  
  } else {
    state.tiles.push({ x: gridX, y: gridY, type: tileType }); // Add new tile
  }
}