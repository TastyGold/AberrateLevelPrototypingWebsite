import { BoxColliderComponent } from "./BoxColliderComponent.js";
import { Entity } from "./Entity.js";
import { SpriteRendererComponent } from "./SpriteRendererComponent.js";
import { TransformComponent } from "./TransformComponent.js";


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
