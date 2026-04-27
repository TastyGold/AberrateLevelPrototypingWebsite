import { BoxColliderComponent } from "../components/BoxColliderComponent.js";
import { Entity } from "./Entity.js";
import { SpriteRendererComponent, SpritesheetRendererComponent } from "../components/SpriteRendererComponent.js";
import { TransformComponent } from "../components/TransformComponent.js";

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

    static BOX_SPRITE_SHEET_PATH = 'sprites/cubes_sprite_sheet.png';

    constructor() {
        super();
        this.color = Box.BOX_COLOR_WHITE;
        this.addComponent(new BoxColliderComponent({ width: 40, height: 45 }));
        this.addComponent(new SpritesheetRendererComponent({ 
            sprite: Box.BOX_SPRITE_SHEET_PATH, 
            colorTint: '#ffffff', 
            src: { x: 0, y: 0, w: 160, h: 160 }, 
            dest: { x: 0, y: 0, w: 50, h: 50 } ,
            spriteIndexX: Math.floor(Math.random()*4),
            spriteIndexY: Math.floor(Math.random()*4)
         }));
    }

    setCubeColor(color) {
        if (this.color === color) return;
        this.color = color;
        return;
    }

    getColor() {
        return this.color;
    }
}
