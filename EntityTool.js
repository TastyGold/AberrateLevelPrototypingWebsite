import { Tool } from './Tool.js';
import { onEntityHotkeyPressed } from './editor.js';

export class EntityTool extends Tool {
  onEnter(state) {
    // Show the entity palette with animation
    const palette = document.getElementById('entityPalette');
    if (palette) {
      palette.classList.add('visible');
      palette.classList.remove('hidden');
      // Update button highlighting
      const entityButtons = document.querySelectorAll('.entity-btn');
      entityButtons.forEach((button) => {
        button.classList.remove('active');
        if (button.dataset.entity === state.selectedEntityType) {
          button.classList.add('active');
        }
      });
    }
    state.placingEntity = true;
  }

  onExit(state) {
    // Hide the entity palette with animation
    const palette = document.getElementById('entityPalette');
    if (palette) {
      palette.classList.add('hidden');
      palette.classList.remove('visible');
    }
    state.placingEntity = false;
  }

  onMouseDown(state, button) {
    if (button === 0) { // Left click
      // Place the selected entity at mouse position
      // For now, just log or something
      console.log('Placing entity:', state.selectedEntityType, 'at', state.mouse.gridX, state.mouse.gridY);
      state.entities.push({ // add entity to list
        type: state.selectedEntityType,
        x: state.mouse.worldX,
        y: state.mouse.worldY,
      });
    }
    console.log(state.entities);
  }

  onMouseMove(state) {
    // Update entity preview position
    if (state.placingEntity) {
      state.entityPreview.x = state.mouse.worldX - state.gridSize / 2;
      state.entityPreview.y = state.mouse.worldY - state.gridSize / 2;
      state.entityPreview.visible = true;
    }
  }

  onMouseUp(state, button) {
  }

  onKeyDown(state, key) {
  }

  onKeyUp(state, key) {
  }
}