import { Tool } from './Tool.js';

export class EntityTool extends Tool {
  onEnter(state) {
    // Show the entity palette
    const palette = document.getElementById('entityPalette');
    if (palette) {
      palette.style.display = 'flex';
      // Update button highlighting
      const entityButtons = document.querySelectorAll('.entity-btn');
      entityButtons.forEach((button) => {
        button.classList.remove('active');
        if (button.dataset.entity === state.selectedEntityType) {
          button.classList.add('active');
        }
      });
    }
  }

  onExit(state) {
    // Hide the entity palette
    const palette = document.getElementById('entityPalette');
    if (palette) {
      palette.style.display = 'none';
    }
  }

  onMouseDown(state, button) {
    if (button === 0) { // Left click
      // Place the selected entity at mouse position
      // For now, just log or something
      console.log('Placing entity:', state.selectedEntityType, 'at', state.mouse.gridX, state.mouse.gridY);
    }
  }
}