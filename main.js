import { state } from './editor.js';
import { draw } from './renderer.js';
import { setupInputHandlers } from './input.js';

let canvas = document.getElementById('editor');
let ctx = canvas.getContext('2d');
let container = document.getElementById('canvasContainer');

// Resize canvas to fit container
function resizeCanvas() {
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Setup input handlers
setupInputHandlers(canvas, state);

// Main game loop
function loop() {
  // Update state (to be implemented)

  // Render
  draw(ctx, state);

  requestAnimationFrame(loop);
}

loop();