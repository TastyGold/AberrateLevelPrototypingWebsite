import { state } from './editor.js';
import { draw } from './renderer.js';
import { setupInputHandlers } from './input.js';

let canvas = document.getElementById('editor');
let ctx = canvas.getContext('2d');
let container = document.getElementById('canvasContainer');
let lastTime = Date.now();

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

    let dt = Date.now() - lastTime;
    lastTime = Date.now();

    // Update state (to be implemented)

    // Render
    draw(ctx, state);

    requestAnimationFrame(loop);
}

loop();