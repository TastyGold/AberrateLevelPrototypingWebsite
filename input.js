/**
 * Input handlers that mutate the editor state
 * Handles mouse movement, clicks, keyboard, and UI interactions
 */

import { config, mouseDown, mouseUp, keyDown, keyUp, mouseMove, zoom, setTool, activateAltOverride, deactivateAltOverride, getCurrentTool, getPreviousTool, isAltOverrideActive, screenToWorld, onEntityHotkeyPressed } from './editor.js';
import { entityTypes } from "./entityTypes.js";

/**
 * Generate entity buttons dynamically from entityTypes
 */
function generateEntityButtons() {
  const palette = document.getElementById('entityPalette');
  if (!palette) return;

  // Clear existing buttons
  palette.innerHTML = '';

  // Create a button for each entity type
  Object.entries(entityTypes).forEach(([typeKey, EntityClass]) => {
    const button = document.createElement('button');
    button.className = 'entity-btn';
    const staticName = EntityClass?.getName?.();
    const staticDisplayName = EntityClass?.getDisplayName?.();
    button.dataset.entity = staticName || typeKey;
    button.textContent = staticDisplayName ?? staticName ??`${typeKey} [null]`;
    palette.appendChild(button);
  });
}

/**
 * Update entity button highlighting based on selected entity type
 */
function updateEntityButtonsUI(state) {
  const entityButtons = document.querySelectorAll('.entity-btn');
  entityButtons.forEach((button) => {
    button.classList.remove('active');
    if (button.dataset.entity === state.selectedEntityType) {
      button.classList.add('active');
    }
  });
}

/**
 * Update tool button highlighting based on current state
 */
function updateToolButtonsUI() {
  const toolButtons = document.querySelectorAll('.tool-btn');
  const currentTool = getCurrentTool();
  const previousTool = getPreviousTool();
  const altActive = isAltOverrideActive();
  console.log('Updating tool buttons UI:', { currentTool, previousTool, altActive });

  toolButtons.forEach((button) => {
    const toolName = button.dataset.tool;
    button.classList.remove('active', 'alt-override', 'previous-tool');
    if (config.enableToolHotkeys) {
      // add hotkey hint to button text if enabled in config
      const hotkey = config.hotkeys.tools[toolName];
      if (hotkey) {
        button.innerHTML = `${button.dataset.text} [${hotkey.toUpperCase()}]`;
      }
    }
    else {
      button.innerHTML = button.dataset.text; // reset to default text if hotkeys are disabled
    }

    if (altActive) {
      // When Alt is held, camera is highlighted in override style
      if (toolName === config.altModeTool) {
        button.classList.add('alt-override');
      }
      // The tool we're returning to gets a subtle outline
      if (toolName === previousTool) {
        button.classList.add('previous-tool');
      }
    } else {
      // Normal mode: just highlight the current tool
      if (toolName === currentTool) {
        button.classList.add('active');
      }
    }
  });
}

export function setupInputHandlers(canvas, state) {
  /**
   * MOUSE MOVEMENT
   * Called when mouse moves anywhere on the canvas
   * Updates: mouse position, grid position, and mouse delta (velocity)
   */
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate delta (difference from last frame)
    const deltaX = x - state.mouse.x;
    const deltaY = y - state.mouse.y;

    // Update absolute mouse position
    state.mouse.x = x;
    state.mouse.y = y;

    // Update mouse delta for camera movement, etc.
    state.mouse.deltaX = deltaX;
    state.mouse.deltaY = deltaY;

    // Convert screen position to world position using camera for accurate grid detection
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const worldPos = screenToWorld(x, y, canvasWidth, canvasHeight);

    // Update world coordinates based on camera position and zoom
    state.mouse.worldX = worldPos.x;
    state.mouse.worldY = worldPos.y;

    // Calculate which grid tile the mouse is over in world coordinates
    state.mouse.gridX = Math.floor(worldPos.x / state.gridSize);
    state.mouse.gridY = Math.floor(worldPos.y / state.gridSize);

    // Defer editor actions that depend on mouse movement to editor.js
    mouseMove(event);
  });

  /**
   * MOUSE DOWN
   * Called when any mouse button is pressed on the canvas
   * Passes button info to editor.js for handling
   * button: 0=left, 1=middle, 2=right
   */
  canvas.addEventListener('mousedown', (event) => {
    state.mouse.mouseDownX = state.mouse.x;
    state.mouse.mouseDownY = state.mouse.y;
    console.log('Mouse down at', state.mouse.mouseDownX, state.mouse.mouseDownY, 'grid', state.mouse.gridX, state.mouse.gridY);
    state.mouse.mouseDownGridX = state.mouse.gridX;
    state.mouse.mouseDownGridY = state.mouse.gridY;
    console.log('grid positions:', state.mouse.mouseDownGridX, state.mouse.mouseDownGridY);
    mouseDown(event.button);
  });

  /**
   * MOUSE UP
   * Called when any mouse button is released on the canvas
   * Passes button info to editor.js for cleanup
   */
  canvas.addEventListener('mouseup', (event) => {
    mouseUp(event.button);
  });

  /**
   * MOUSE WHEEL
   * Handles zoom in/out when scrolling
   * Zoom is centered on the current mouse position
   */
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent default scroll behavior

    // Determine zoom direction: negative deltaY = scroll up = zoom in
    const zoomDirection = event.deltaY > 0 ? -1 : 1;

    // Get canvas dimensions for coordinate conversion
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Call zoom function with current mouse position and canvas dimensions
    zoom(zoomDirection, state.mouse.x, state.mouse.y, canvasWidth, canvasHeight);
  });

  /**
   * KEYBOARD - KEY DOWN
   * Tracks modifier keys like Alt for alt+drag camera panning
   */
  document.addEventListener('keydown', (event) => {
    if (event.repeat) return; // don't allow repeat key pressed for held key
    const lastTool = state.currentTool;
    const lastEntity = state.selectedEntityType;
    keyDown(event.key);
    const newTool = state.currentTool;
    const newEntity = state.selectedEntityType;
    if (lastTool !== newTool) {
      updateToolButtonsUI();
    }
    if (lastEntity !== newEntity) {
      updateEntityButtonsUI(state);
    }
  });

  /**
   * KEYBOARD - KEY UP
   * Stops tracking modifier keys
   */
  document.addEventListener('keyup', (event) => {
    const wasAltActive = isAltOverrideActive();
    keyUp(event.key);
    const isAltActive = isAltOverrideActive();
    // Update buttons if Alt state changed
    if (event.key.toLowerCase() === config.altModeKey && wasAltActive !== isAltActive) {
      updateToolButtonsUI();
    }
  });

  /**
   * TOOL BUTTON SELECTION
   * Handles clicking the tool buttons at the bottom
   * Updates the active tool via setTool
   */
  const toolButtons = document.querySelectorAll('.tool-btn');
  toolButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      // Set the active tool
      setTool(event.target.dataset.tool);
      // Update button UI
      updateToolButtonsUI();
    });
  });

  // Initialize button highlighting
  updateToolButtonsUI();

  // Generate entity buttons dynamically
  generateEntityButtons();

  /**
   * ENTITY BUTTON SELECTION
   * Handles clicking the entity buttons in the palette
   */
  const entityButtons = document.querySelectorAll('.entity-btn');
  entityButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      state.selectedEntityType = event.target.dataset.entity;
      // Update UI
      entityButtons.forEach((btn) => btn.classList.remove('active'));
      event.target.classList.add('active');
    });
  });

  // Set up hotkey button toggle
  const hotkeyBtn = document.getElementById('hotkeyBtn');
  hotkeyBtn.innerHTML = config.enableToolHotkeys ? hotkeyBtn.dataset.activetext : hotkeyBtn.dataset.inactivetext;
  hotkeyBtn.addEventListener('click', () => {
    config.enableToolHotkeys = !config.enableToolHotkeys;
    hotkeyBtn.innerHTML = config.enableToolHotkeys ? hotkeyBtn.dataset.activetext : hotkeyBtn.dataset.inactivetext;
    updateToolButtonsUI();
  });
}
