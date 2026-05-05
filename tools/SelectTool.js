import { Tool } from './Tool.js';
import { TransformComponent } from '../components/TransformComponent.js';
import { BoxColliderComponent } from '../components/BoxColliderComponent.js';
import { EditorIntegrationComponent } from '../components/EditorIntegrationComponent.js';
import { SignalSenderComponent } from '../components/SignalSenderComponent.js';
import { SignalReceiverComponent } from '../components/SignalReceiverComponent.js';
import { config } from '../editor.js';

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
    let entityAtMouse = this.findEntityAtMouse(state);
    if (entityAtMouse) {

      if (state.drawingConnection) {
        this.finishDrawingConnectionTo(state, entityAtMouse);
        return; // don't do anything else if currently drawing connection
      }

      let alreadySelected = this.addSelectableToSelection(state, entityAtMouse);
      if (alreadySelected) {
        // if entity was already selected, start drag move
        state.dragMoving = true;
      }
    }
    if (!state.dragMoving) {
      state.dragSelecting = true;
      
      if (!state.input.isShiftDown) {
        this.clearSelection(state);
        if (entityAtMouse) {
          this.addSelectableToSelection(state, entityAtMouse);
        }
      }
    }
  }

  onMouseMove(state) {
    if (state.drawingConnection) {
      return; // don't do anything else if currently drawing connection
    }

    // handle drag move of selected entities
    if (state.dragMoving) {
      state.selectedEntites.forEach(entity => {
        const transform = entity.getComponent(TransformComponent);
        if (transform) {
          transform.x += state.mouse.deltaX / state.camera.zoom;
          transform.y += state.mouse.deltaY / state.camera.zoom;
        }
      });
      return;
    }

    this.clearHighlighted(state);
    // Highlight entity under mouse if not currently drag selecting
    if (!state.dragSelecting) {
      let entityAtMouse = this.findEntityAtMouse(state);
      if (entityAtMouse) {
        this.addSelectableToHighlighted(state, entityAtMouse);
      }
      return;
    }
    // check for entities in drag selection box
    for (const entity of state.entities) {
      const transform = entity.getComponent(TransformComponent);
      const collider = entity.getComponent(BoxColliderComponent);
      if (transform && collider) {
        if (state.dragSelecting && collider.aabbIntersectCorners(state.mouse.mouseDownWorldX, state.mouse.worldX, state.mouse.mouseDownWorldY, state.mouse.worldY)) {
          this.addSelectableToHighlighted(state, entity);
        } else {
          this.removeSelectableFromHighlighted(state, entity);
        }
      }
    }
  }

  onMouseUp(state, button) {
    state.dragSelecting = false;
    state.dragMoving = false;
    this.addHighlightedEntitiesToSelection(state);
  }

  onKeyDown(state, key) {
    console.log('Key down:', key);
    console.log('Started drawing connection', config.hotkeys.drawConnection);
    
    if (key === config.hotkeys.drawConnection) {
      this.startDrawingConnection(state);
      }
  }

  onKeyUp(state, key) {
    // TODO: Implement keyboard shortcuts for select tool
  }

  startDrawingConnection(state) {
    state.drawingConnection = true;
    // put all selected entities that have SignalSenderComponent into drawingConnectionFromComponents
    state.drawingConnectionFromComponents = [];
    state.selectedEntites.forEach(entity => {
      console.log('Checking entity for SignalSenderComponent:', entity);
      const signalSenderComponent = entity.getComponent(SignalSenderComponent);
      if (signalSenderComponent) {
        state.drawingConnectionFromComponents.push(signalSenderComponent);
      }
    });
    console.log('Started drawing connection from components:', state.drawingConnectionFromComponents);
    if (state.drawingConnectionFromComponents.length === 0) {
      // if no selected entities have SignalSenderComponent, cancel drawing connection
      state.drawingConnection = false;
      console.log('No SignalSenderComponents found in selected entities, canceling drawing connection');
    }
  }

  finishDrawingConnectionTo(state, targetEntity) {
    if (!state.drawingConnection) return;
    state.drawingConnection = false;
    // for each component in drawingConnectionFromComponents, add targetEntity's SignalReceiverComponent as a receiver
    const signalReceiverComponent = targetEntity.getComponent(SignalReceiverComponent);
    if (signalReceiverComponent) {
      state.drawingConnectionFromComponents.forEach(signalSenderComponent => {
        signalSenderComponent.addReceiver(signalReceiverComponent);
        console.log('Finished drawing connection from', signalSenderComponent, 'to', signalReceiverComponent);
      });
    }
  }

  addHighlightedEntitiesToSelection(state) {
    for (const entity of state.highlightedEntities) {
      this.addSelectableToSelection(state, entity);
    }
  }

  clearSelection(state) {
    for (const entity of state.selectedEntites) {
      this.removeSelectableFromSelection(state, entity);
    }
  }

  // only method that adds entity to selection (handles onSelected callback)
  addSelectableToSelection(state, entity) {
    if (!state.selectedEntites.some(selectedEntity => selectedEntity.id === entity.id)) {
      const editorIntegrationComponent = entity.getComponent(EditorIntegrationComponent);
      if (editorIntegrationComponent) {
        editorIntegrationComponent.onSelected();
      }
      state.selectedEntites.push(entity);
      return false; // entity was not previously selected, added to selection now
    }
    return true; // entity was already in selection
  }

  // only method that removes entity from selection (handles onDeselected callback)
  removeSelectableFromSelection(state, entity) {
    const editorIntegrationComponent = entity.getComponent(EditorIntegrationComponent);
    if (editorIntegrationComponent) {
      editorIntegrationComponent.onDeselected();
    }
    state.selectedEntites = state.selectedEntites.filter(selectedEntity => selectedEntity.id !== entity.id);
  }

  clearHighlighted(state) {
    for (const entity of state.highlightedEntities) {
      this.removeSelectableFromHighlighted(state, entity);
    }
    state.highlightedEntities = [];
  }

  // only method that adds entity to highlighted (handles onHighlighted callback)
  addSelectableToHighlighted(state, entity) {
    if (!state.highlightedEntities.some(selectedEntity => selectedEntity.id === entity.id)) {
      const editorIntegrationComponent = entity.getComponent(EditorIntegrationComponent);
      if (editorIntegrationComponent) {
        editorIntegrationComponent.onHighlighted();
      }
      state.highlightedEntities.push(entity);
    }
  }

  // only method that removes entity from highlighted (handles onUnhighlighted callback)
  removeSelectableFromHighlighted(state, entity) {
    const editorIntegrationComponent = entity.getComponent(EditorIntegrationComponent);
    if (editorIntegrationComponent) {
      editorIntegrationComponent.onUnhighlighted();
    }
    state.highlightedEntities = state.highlightedEntities.filter(selectedEntity => selectedEntity.id !== entity.id);
  }
}