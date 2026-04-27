import { BoxColliderComponent } from "../components/BoxColliderComponent.js";
import { Entity } from "./Entity.js";
import { SpriteRendererComponent } from "../components/SpriteRendererComponent.js";
import { TransformComponent } from "../components/TransformComponent.js";


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
        this.addComponent(new SpriteRendererComponent({ 
            colorTint: '#55ccff',
            src: { x: 0, y: 0, w: 40, h: 40 },
            dest: { x: 0, y: 0, w: 120, h: 80 }
        }));
    }
}
