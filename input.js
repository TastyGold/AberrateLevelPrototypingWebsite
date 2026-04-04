/**
 * Input handlers that mutate the editor state
 * Handles mouse movement, clicks, keyboard, and UI interactions
 */

import { mouseDown, mouseUp, keyDown, keyUp, mouseMove, zoom, setTool } from './editor.js';

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

    // Calculate which grid tile the mouse is over (before applying zoom)
    // TODO: Convert screen position to world position using camera for accurate grid detection
    state.mouse.gridX = Math.floor(x / state.gridSize);
    state.mouse.gridY = Math.floor(y / state.gridSize);

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
    keyDown(event.key);
  });

  /**
   * KEYBOARD - KEY UP
   * Stops tracking modifier keys
   */
  document.addEventListener('keyup', (event) => {
    keyUp(event.key);
  });

  /**
   * TOOL BUTTON SELECTION
   * Handles clicking the tool buttons at the bottom
   * Updates the active tool via setTool
   */
  const toolButtons = document.querySelectorAll('.tool-btn');
  toolButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      // Remove active class from all buttons
      toolButtons.forEach((btn) => btn.classList.remove('active'));
      // Add active class to clicked button
      event.target.classList.add('active');
      // Set the active tool
      setTool(event.target.dataset.tool);
    });
  });
}
