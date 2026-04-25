import { Tool } from './Tool.js';
import { TransformComponent } from '../components/TransformComponent.js';
import { BoxColliderComponent } from '../components/BoxColliderComponent.js';

/**
 * Select tool for selecting and manipulating entities
 */
export class SelectTool extends Tool {
  getName() {
      return 'select';
  }

  onEnter(state) {
    console.log('Select tool activated');
  }

  onExit(state) {
    console.log('Select tool deactivated');
  }

  onMouseDown(state, button) {

  }

  onMouseMove(state) {
    // check for entity under mouse cursor and highlight it
    let foundEntity = false;
    for (const entity of state.entities) {
      const transform = entity.getComponent(TransformComponent);
      const collider = entity.getComponent(BoxColliderComponent);
        if (transform && collider) {
            if (collider.pointIntersect(state.mouse.worldX, state.mouse.worldY)) {
                console.log(state.mouse.worldX);
                collider.highlighted = true;
                foundEntity = true;
            } else {
                collider.highlighted = false;
            }
        }
    }
  }

  onMouseUp(state, button) {
  }

  onKeyDown(state, key) {
    // TODO: Implement keyboard shortcuts for select tool
  }

  onKeyUp(state, key) {
    // TODO: Implement keyboard shortcuts for select tool
  }
}