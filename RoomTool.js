import { Tool } from './Tool.js';

/**
 * Room tool for placing and editing rooms/tiles
 */
export class RoomTool extends Tool {
  getName() {
      return 'room';
  }

  onEnter(state) {
    console.log('Room tool activated');
    state.creatingRoom = false;
  }

  onExit(state) {
    console.log('Room tool deactivated');
    state.creatingRoom = false;
  }

  onMouseDown(state, button) {
    // TODO: Implement room/tile placing logic
    state.creatingRoom = true;
    console.log('Started creating room at grid position:', state.mouse.mouseDownGridX, state.mouse.mouseDownGridY);
  }

  onMouseMove(state) {
    // TODO: Implement room/tile editing logic
  }

  onMouseUp(state, button) {
    // TODO: Implement room/tile finalization logic
    state.creatingRoom = false;
  }

  onKeyDown(state, key) {
    // TODO: Implement keyboard shortcuts for room tool
  }

  onKeyUp(state, key) {
    // TODO: Implement keyboard shortcuts for room tool
  }
}