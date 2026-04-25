/**
 * Base component class for all entity components.
 */
export class Component {
  constructor(entity = null) {
    this.entity = entity;
  }
}

/**
 * Transform component stores position, rotation, and size.
 */
export class TransformComponent extends Component {
  constructor({ x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1 } = {}) {
    super();
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }
}

/**
 * Box collider component for point and AABB intersection.
 */
export class BoxColliderComponent extends Component {
  constructor({ offsetX = 0, offsetY = 0, width = 40, height = 40 } = {}) {
    super();
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.width = width;
    this.height = height;
  }

  getBounds() {
    const transform = this.entity?.getComponent(TransformComponent);
    if (!transform) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }
    const x = transform.x + this.offsetX - this.width / 2;
    const y = transform.y + this.offsetY - this.height / 2;
    return {
      minX: x,
      minY: y,
      maxX: x + this.width,
      maxY: y + this.height,
    };
  }

  pointIntersect(px, py) {
    const b = this.getBounds();
    return px >= b.minX && px <= b.maxX && py >= b.minY && py <= b.maxY;
  }

  intersects(otherBoxCollider) {
    if (!(otherBoxCollider instanceof BoxColliderComponent)) {
      return false;
    }
    const a = this.getBounds();
    const b = otherBoxCollider.getBounds();
    return a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY;
  }
}

/**
 * Sprite renderer component for drawing entities.
 */
export class SpriteRendererComponent extends Component {
  constructor({ sprite = null, colorTint = '#ffffff', width = 40, height = 40 } = {}) {
    super();
    this.sprite = sprite;
    this.colorTint = colorTint;
    this.width = width;
    this.height = height;
    this.image = null;
  }

  draw(ctx, transform) {
    // Center sprite on entity position
    const x = transform.x - this.width / 2;
    const y = transform.y - this.height / 2;
    const w = this.width;
    const h = this.height;

    ctx.save(); // Save canvas state

    // Apply transformations: translate to center, rotate, scale, translate back
    ctx.translate(transform.x, transform.y); // Move origin to entity center
    ctx.rotate(transform.rotation); // Rotate coordinate system
    ctx.scale(transform.scaleX, transform.scaleY); // Scale coordinate system
    ctx.translate(-transform.x, -transform.y); // Move origin back

    if (this.sprite) {
      // Lazy-load the image if not already loaded
      if (!this.image) {
        this.image = new Image();
        this.image.src = this.sprite;
      }
      // Draw loaded image if ready, otherwise fallback to colored rect
      if (this.image.complete && this.image.naturalWidth > 0) {
        ctx.drawImage(this.image, x, y, w, h);
      } else {
        ctx.fillStyle = this.colorTint;
        ctx.fillRect(x, y, w, h);
      }
    } else {
      // No sprite specified, draw colored rectangle
      ctx.fillStyle = this.colorTint;
      ctx.fillRect(x, y, w, h);
    }

    ctx.restore(); // Restore canvas state
  }
}

/**
 * Base entity class for all spawned editor entities.
 */
export class Entity {
  constructor() {
    this.components = [];
    this.addComponent(new TransformComponent());
  }

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

export class Box extends Entity {
  static getName() {
    return 'box';
  }

  static getDisplayName() {
    return 'Cube';
  }

  // Color constants
  static BOX_COLOR_WHITE = 0;
  static BOX_COLOR_RED = 1;
  static BOX_COLOR_BLUE = 2;
  static BOX_COLOR_GREEN = 3;

  static getColorSpritePath(color) {
    switch (color) {
      case this.BOX_COLOR_RED:
        return 'sprites/redcube.png';
      case this.BOX_COLOR_BLUE:
        return 'sprites/bluecube.png';
      case this.BOX_COLOR_GREEN:
        return 'sprites/greencube.png';
      case this.BOX_COLOR_WHITE:
      default:
        return 'sprites/whitecube.png';
    }
  }

  constructor() {
    super();
    this.color = Box.BOX_COLOR_WHITE;
    const transform = this.getComponent(TransformComponent);
    this.addComponent(new BoxColliderComponent({ width: 40, height: 45 }));
    this.addComponent(new SpriteRendererComponent({ sprite: Box.getColorSpritePath(this.color), colorTint: '#ffffff', width: 40, height: 45 }));
  }

  setCubeColor(color) {
    if (this.color === color) return;
    this.color = color;
    const sprite = this.getComponent(SpriteRendererComponent);
    if (sprite) {
      sprite.sprite = Box.getColorSpritePath(color);
      sprite.image = null; // Reset cached image so it reloads
    }
  }

  getColor() {
    return this.color;
  }
}

export class Button extends Entity {
  static getName() {
    return 'button';
  }

  static getDisplayName() {
    return 'Button';
  }

  constructor() {
    super();
    const transform = this.getComponent(TransformComponent);
    this.addComponent(new BoxColliderComponent({ width: 40, height: 40 }));
    this.addComponent(new SpriteRendererComponent({ colorTint: '#ff5555', width: 40, height: 40 }));
  }
}

export class Stairs extends Entity {
  static getName() {
    return 'stairs';
  }

  static getDisplayName() {
    return 'Stairs';
  }

  constructor() {
    super();
    const transform = this.getComponent(TransformComponent);
    this.addComponent(new BoxColliderComponent({ width: 40, height: 40 }));
    this.addComponent(new SpriteRendererComponent({ colorTint: '#55ccff', width: 120, height: 80 }));
  }
}

export const entityTypes = {
  box: Box,
  button: Button,
  stairs: Stairs,
  player:  null, // Placeholder for future Player entity
};
