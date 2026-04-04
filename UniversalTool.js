import { Tool } from './Tool.js';
import { panCamera, activateAltOverride, deactivateAltOverride } from './editor.js';

/**
 * Universal tool for handling various editor actions
 */
export class UniversalTool extends Tool {
    onEnter(state) {
        // universal tool doesn't need lifecycle methods
    }

    onExit(state) {
        // universal tool doesn't need lifecycle methods
    }

    onMouseDown(state, button) {
        if (button === 1) {
        state.input.isMiddleMouseDown = true;
        }
        if (button === 0) {
        state.input.isLeftMouseDown = true;
        }
    }

    onMouseMove(state) {
        if (state.input.isMiddleMouseDown) {
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
        // Handle Alt key specially for temporary camera override
        if (!state.isAltOverride && state.selectedTool !== 'camera') {
            activateAltOverride();
        }
        }
    }

    onKeyUp(state, key) {
        if (key.toLowerCase() === 'alt') {
            state.input.isAltDown = false;
            // Handle Alt key release to return to previous tool
            if (state.isAltOverride) {
                deactivateAltOverride();
            }
        }
    }
}