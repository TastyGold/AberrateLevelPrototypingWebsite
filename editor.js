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
};

/**
 * Handle mouse button press
 * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
 * 
 * TODO: Implement tile placing logic here when selectedTool is 'tile'
 * TODO: Implement entity placing logic when selectedTool is 'entity'
 * TODO: Implement erasing logic when selectedTool is 'erase'
 * TODO: Implement camera pan logic when middle mouse is held
 */
export function mouseDown(button) {
  // TODO: Handle left click (button === 0)
  if (button === 0) {
    // Check selectedTool and perform action
    // if (state.selectedTool === 'tile') { ... }
    // if (state.selectedTool === 'entity') { ... }
  }
  // TODO: Handle middle click (button === 1) for camera pan
  // TODO: Handle right click (button === 2)
}

/**
 * Handle mouse button release
 * @param {number} button - Mouse button (0=left, 1=middle, 2=right)
 * 
 * TODO: Clean up any ongoing operations from mouseDown
 */
export function mouseUp(button) {
  // TODO: Stop camera panning if it was active
  // TODO: Finalize any editing operations
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