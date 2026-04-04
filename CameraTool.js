import { Tool } from './Tool.js';
import { panCamera } from './editor.js';

/**
 * Camera tool for panning and zooming the view
 */
export class CameraTool extends Tool {
  onEnter(state) {
    console.log('Camera tool activated');
  }

  onExit(state) {
    console.log('Camera tool deactivated');
  }

  onMouseDown(state, button) {
  }

  onMouseMove(state) {
    if (state.input.isMiddleMouseDown || (state.input.isAltDown && state.input.isLeftMouseDown)) {
      panCamera(-state.mouse.deltaX, -state.mouse.deltaY);
    }
  }

  onMouseUp(state, button) {
  }

  onKeyDown(state, key) {
  }

  onKeyUp(state, key) {
  }
}