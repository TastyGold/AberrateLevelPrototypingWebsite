export const state = {
  // Grid properties
  gridSize: 40,

  // Editor data
  tiles: [],
  entities: [],

  // UI state
  selectedTool: 'select',
  selectedTile: null,

  // Mouse state
  mouse: {
    x: 0,
    y: 0,
    gridX: 0,
    gridY: 0,
  },

  // Camera/viewport
  camera: {
    x: 0,
    y: 0,
    zoom: 1,
  },
};