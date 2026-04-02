/**
 * Input handlers that mutate the editor state
 */

export function setupInputHandlers(canvas, state) {
  // Mouse move - track grid position and mouse coords
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Update absolute mouse position
    state.mouse.x = x;
    state.mouse.y = y;

    // Calculate grid position
    state.mouse.gridX = Math.floor(x / state.gridSize);
    state.mouse.gridY = Math.floor(y / state.gridSize);
  });

  // Tool button selection
  const toolButtons = document.querySelectorAll('.tool-btn');
  toolButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      // Remove active from all buttons
      toolButtons.forEach((btn) => btn.classList.remove('active'));
      // Add active to clicked button
      event.target.classList.add('active');
      // Update state
      state.selectedTool = event.target.dataset.tool;
    });
  });
}
