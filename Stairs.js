import { BoxColliderComponent } from "./BoxColliderComponent.js";
import { Entity } from "./Entity.js";
import { SpriteRendererComponent } from "./SpriteRendererComponent.js";
import { TransformComponent } from "./TransformComponent.js";


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
