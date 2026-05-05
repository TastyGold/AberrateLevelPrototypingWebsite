import { BoxColliderComponent } from "../components/BoxColliderComponent.js";
import { Entity } from "./Entity.js";
import { SpriteRendererComponent } from "../components/SpriteRendererComponent.js";
import { TransformComponent } from "../components/TransformComponent.js";
import { SignalSenderComponent } from "../components/SignalSenderComponent.js";


export class Button extends Entity {
    static getName() {
        return 'button';
    }

    static getDisplayName() {
        return 'Button';
    }

    constructor(options = {}) {
        super(options);
        this.addComponent(new BoxColliderComponent({ width: 60, height: 60 }));
        this.addComponent(new SpriteRendererComponent({
            sprite: 'sprites/cubebutton.png',
            colorTint: '#ff5555',
            src: { x: 0, y: 0, w: 208, h: 208 },
            dest: { x: 0, y: 0, w: 60, h: 60 }
        }));
        this.addComponent(new SignalReceiverComponent());
    }
}
