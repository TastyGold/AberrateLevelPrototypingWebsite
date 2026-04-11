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
  // Alt key behavior
  altModeKey: ' ',
  altModeTool: 'camera',
  // Hotkey settings
  enableToolHotkeys: false,
  hotkeys: {
    tools: {
      camera: 'q',
      select: 'w',
      entity: 'e',
      room: 'r',
      erase: 't',
    }
  }
};

// Import tools
import { CameraTool } from './CameraTool.js';
import { RoomTool } from './RoomTool.js';
import { UniversalTool } from './UniversalTool.js';
import { EntityTool } from './EntityTool.js';

// Import entity types
import { Box } from './Entity.js';
import { Button } from './Entity.js';
import { Stairs } from './Entity.js';

// Tool instances
const tools = {
  universal: new UniversalTool(),
  camera: new CameraTool(),
  select: null,
  entity: new EntityTool(), // Placeholder for future EntityTool
  room: new RoomTool(),
  erase: null, // Placeholder for future EraseTool
};

// Entity types available in the editor
export const entityTypes = {
  box: Box,
  button: Button,
  stairs: Stairs,
  item1:null,
  item2:null,
  item3:null,
  item4:null,
  item5:null,
  item6:null,
  item7:null,
};

export const state = {
  // Grid properties
  gridSize: 40,

  // Editor data
  tiles: [],
  entities: [],

  // UI state
  selectedToolName: 'camera',
  previousToolName: 'camera',

  // Selected entity type for entity tool
  selectedEntityType: 'box', // Default
  placingEntity: false, // Whether we're currently placing an entity (for click-and-drag)
  entityPreview: {
    x: 0,
    y: 0,
    visible: false,
  },

  // Mouse state (in local canvas coordinates)
  mouse: {
    canvasX: 0,
    canvasY: 0,
    // World coordinates (calculated from screen coordinates + camera)
    worldX: 0,
    worldY: 0,
    // Grid coordinates (calculated from world coordinates)
    gridX: 0,
    gridY: 0,
    // Mouse velocity (delta from previous frame)
    deltaX: 0,
    deltaY: 0,
    // Position where mouse was last pressed down (for drag calculations)
    mouseDownX: 0,
    mouseDownY: 0,
    mouseDownGridX: 0,
    mouseDownGridY: 0,
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
  isAltOverride: false,

  // Room Tool
  creatingRoom: false,
};


/**
 * Transition to a new tool, calling lifecycle hooks.
 * ONLY place that lifecycle methods should EVER be called
 */
function transitionToTool(nextTool) {
  if (state.currentTool === nextTool) return;
  state.currentTool?.onExit(state);
  state.currentTool = nextTool;
  state.currentTool?.onEnter(state);
}

/**
 * Set the active tool (permanent selection).
 * @param {string} name - Name of the tool to activate
 */
export function setTool(name) {
  if (state.isAltOverride) {
    state.previousToolName = name; // Update previous tool if Alt is currently overriding
    return; // Don't change current tool while Alt override is active
  }
  state.selectedToolName = name;
  transitionToTool(tools[name]);
}

/**
 * Temporarily switch to camera tool (when Alt key is pressed).
 */
export function activateAltOverride() {
  if (state.isAltOverride) return;
  state.previousToolName = state.selectedToolName;
  state.isAltOverride = true;
  transitionToTool(tools.camera);
}

/**
 * Return to the selected tool (when Alt key is released).
 */
export function deactivateAltOverride() {
  if (!state.isAltOverride) return;
  state.isAltOverride = false;
  state.selectedToolName = state.previousToolName; // Ensure selected tool is correct when returning
  transitionToTool(tools[state.selectedToolName]);
}

/**
 * Get the current tool name
 */
export function getCurrentTool() {
  return state.selectedToolName;
}

/**
 * Get the previous tool name (for when Alt is overriding)
 */
export function getPreviousTool() {
  return state.previousToolName;
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

// effectively the update function for input - called every time mouse moves
export function mouseMove(event) {
  tools.universal.onMouseMove(state); // Universal tool handles input state
  state.currentTool?.onMouseMove(state);
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

/**
 * Pan the camera (move view)
 * @param {number} deltaX - Amount to move camera in X (screen pixels)
 * @param {number} deltaY - Amount to move camera in Y (screen pixels)
 */
export function panCamera(deltaX, deltaY) {
  // Convert screen pixel movement to world units by dividing by zoom
  // When zoomed in (zoom > 1), camera moves slower (more precise)
  // When zoomed out (zoom < 1), camera moves faster (covers more ground)
  state.camera.x += (deltaX * config.panSpeed) / state.camera.zoom;
  state.camera.y += (deltaY * config.panSpeed) / state.camera.zoom;
}

/**
 * Convert screen coordinates to world coordinates
 * @param {number} screenX - Screen X coordinate
 * @param {number} screenY - Screen Y coordinate
 * @param {number} canvasWidth - Width of canvas
 * @param {number} canvasHeight - Height of canvas
 * @returns {Object} World coordinates {x, y}
 */
export function screenToWorld(screenX, screenY, canvasWidth, canvasHeight) {
  return {
    x: (screenX - canvasWidth / 2) / state.camera.zoom + state.camera.x,
    y: (screenY - canvasHeight / 2) / state.camera.zoom + state.camera.y
  };
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
  const worldPos = screenToWorld(screenX, screenY, canvasWidth, canvasHeight);

  // Update zoom level
  const newZoom = state.camera.zoom * (1 + zoomDelta * config.zoomSpeed);
  state.camera.zoom = Math.max(config.minZoom, Math.min(config.maxZoom, newZoom));

  // Adjust camera position to keep world point under cursor
  state.camera.x = worldPos.x - (screenX - canvasWidth / 2) / state.camera.zoom;
  state.camera.y = worldPos.y - (screenY - canvasHeight / 2) / state.camera.zoom;
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