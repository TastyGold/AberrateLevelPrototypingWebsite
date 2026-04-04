import { Tool } from './Tool.js';
import { panCamera } from './editor.js';

/**
 * Camera tool for panning and zooming the view
 */
export class CameraTool extends Tool {
  onMouseDown(state, button) {
    if (button === 1) {
      state.input.isMiddleMouseDown = true;
    }
    if (button === 0) {
      state.input.isLeftMouseDown = true;
    }
  }

  onMouseMove(state) {
    if (state.input.isMiddleMouseDown || (state.input.isAltDown && state.input.isLeftMouseDown)) {
      panCamera(-state.mouse.deltaX, -state.mouse.deltaY);
    }
  }

  onMouseUp(state, button) {
    if (button === 1) {
      state.input.isMiddleMouseDown = false;
    }
    if (button === 0) {
      state.input.isLeftMouseDown = false;
    }
  }

  onKeyDown(state, key) {
    if (key.toLowerCase() === 'alt') {
      state.input.isAltDown = true;
    }
  }

  onKeyUp(state, key) {
    if (key.toLowerCase() === 'alt') {
      state.input.isAltDown = false;
    }
  }
}