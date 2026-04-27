import { BoxColliderComponent } from "../components/BoxColliderComponent.js";
import { Entity } from "./Entity.js";
import { SpriteRendererComponent } from "../components/SpriteRendererComponent.js";
import { TransformComponent } from "../components/TransformComponent.js";


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
        this.addComponent(new SpriteRendererComponent({
            colorTint: '#ff5555',
            src: { x: 0, y: 0, w: 40, h: 40 },
            dest: { x: 0, y: 0, w: 40, h: 40 }
        }));
    }
}
