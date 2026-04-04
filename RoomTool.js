import { Tool } from './Tool.js';

/**
 * Room tool for placing and editing rooms/tiles
 */
export class RoomTool extends Tool {
  onEnter(state) {
    console.log('Room tool activated');
  }

  onExit(state) {
    console.log('Room tool deactivated');
  }

  onMouseDown(state, button) {
    // TODO: Implement room/tile placing logic
  }

  onMouseMove(state) {
    // TODO: Implement room/tile editing logic
  }

  onMouseUp(state, button) {
    // TODO: Implement room/tile finalization logic
  }

  onKeyDown(state, key) {
    // TODO: Implement keyboard shortcuts for room tool
  }

  onKeyUp(state, key) {
    // TODO: Implement keyboard shortcuts for room tool
  }
}