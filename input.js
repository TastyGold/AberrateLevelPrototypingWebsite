/**
 * Input handlers that mutate the editor state
 * Handles mouse movement, clicks, and UI interactions
 */

import { mouseDown, mouseUp } from './editor.js';

export function setupInputHandlers(canvas, state) {
  // Track previous mouse position for delta calculation
  let prevMouseX = 0;
  let prevMouseY = 0;

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

    // Calculate which grid tile the mouse is over
    state.mouse.gridX = Math.floor(x / state.gridSize);
    state.mouse.gridY = Math.floor(y / state.gridSize);
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
   * TOOL BUTTON SELECTION
   * Handles clicking the tool buttons at the bottom
   * Updates state.selectedTool based on which button was clicked
   */
  const toolButtons = document.querySelectorAll('.tool-btn');
  toolButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      // Remove active class from all buttons
      toolButtons.forEach((btn) => btn.classList.remove('active'));
      // Add active class to clicked button
      event.target.classList.add('active');
      // Update selected tool in state
      state.selectedTool = event.target.dataset.tool;
    });
  });
}
