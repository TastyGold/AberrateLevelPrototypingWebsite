import { EditorIntegrationComponent } from "../components/EditorIntegrationComponent.js";
import { TransformComponent } from "../components/TransformComponent.js";

/**
 * Base entity class for all spawned editor entities.
 */
export class Entity {
  constructor() {
    this.components = [];
    this.addComponent(new TransformComponent());
    this.addComponent(new EditorIntegrationComponent());
    this.id = Entity.nextEntityID++;
  }

  static nextEntityID = 0;

  static getName() {
    return 'entity';
  }

  static getDisplayName() {
    return 'Entity';
  }

  getName() {
    return this.constructor.getName();
  }

  getDisplayName() {
    return this.constructor.getDisplayName();
  }

  addComponent(component) {
    component.entity = this;
    this.components.push(component);
    return component;
  }

  getComponent(ComponentClass) {
    return this.components.find((component) => component instanceof ComponentClass) || null;
  }

  hasComponent(ComponentClass) {
    return this.getComponent(ComponentClass) !== null;
  }
}


