/**
 * Base Entity class
 * Defines common properties and methods for all entities in the editor
 */
export class Entity {
    static name = null;
    static displayName = null;
}

export class Box extends Entity {
    static name = 'box';
    static displayName = 'Cube';
}

export class Button extends Entity {
    static name = 'button';
    static displayName = 'Button';
}

export class Stairs extends Entity {
    static name = 'stairs';
    static displayName = 'Stairs';
}
