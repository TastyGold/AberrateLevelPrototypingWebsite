/**
 * Base Entity class
 * Defines common properties and methods for all entities in the editor
 */
export class Entity {
  /**
   * Get the machine-readable name of this entity type
   * Used for identification and data storage
   * @returns {string}
   */
  getName() {
    throw new Error('Entity.getName() must be implemented by subclass');
  }

  /**
   * Get the human-readable display name for this entity type
   * Used in the UI
   * @returns {string}
   */
  getDisplayName() {
    throw new Error('Entity.getDisplayName() must be implemented by subclass');
  }
}

/**
 * Box Entity
 * Represents a cube/box in the level
 */
export class Box extends Entity {
  getName() {
    return 'box';
  }

  getDisplayName() {
    return 'Cube';
  }
}
