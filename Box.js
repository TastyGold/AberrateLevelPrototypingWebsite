import { BoxColliderComponent } from "./BoxColliderComponent.js";
import { Entity } from "./Entity.js";
import { SpriteRendererComponent } from "./SpriteRendererComponent.js";
import { TransformComponent } from "./TransformComponent.js";

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
