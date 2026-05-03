import { BoxColliderComponent } from '../components/BoxColliderComponent.js';
import { TransformComponent } from '../components/TransformComponent.js';
import { callMethodOnEntities } from '../editor.js';
import { Tool } from './Tool.js';


export class PlaymodeTool extends Tool {
  getName() {
    return 'playmode';
  }

  onEnter(state) {
    console.log('Playmode tool activated');
  }

  onExit(state) {
    console.log('Playmode tool deactivated');
  }

  onMouseDown(state, button) {
    this.findEntityAtMouse(state);
  }

  onMouseMove(state) {

  }

  onMouseUp(state, button) {
  }

  onKeyDown(state, key) {
    if (key === 'r') {
      callMethodOnEntities('aberrate', state);
    }
  }

  onKeyUp(state, key) {
    // TODO: Implement keyboard shortcuts for select tool
  }
}
