import { BoxColliderComponent } from "../components/BoxColliderComponent.js";
import { Entity } from "./Entity.js";
import { SpritesheetRendererComponent } from "../components/SpritesheetRendererComponent.js";
import { AberrateCubeComponent } from "../components/AberrateCubeComponent.js";

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
    static BOX_COLOR_TRIPLE = 4;
    static BOX_COLOR_REDBLUE = 5;
    static BOX_COLOR_REDGREEN = 6;
    static BOX_COLOR_BLUEGREEN = 7;

    static BOX_SPRITE_SHEET_PATH = 'sprites/cubes_sprite_sheet.png';

    constructor({options = {}, color = Box.BOX_COLOR_REDBLUE} = {}) {
        super(options);
        this.addComponent(new BoxColliderComponent({ width: 40, height: 45 }));
        const renderer = new SpritesheetRendererComponent({ 
            sprite: Box.BOX_SPRITE_SHEET_PATH, 
            colorTint: '#ffffff', 
            src: { x: 0, y: 0, w: 160, h: 160 }, 
            dest: { x: 0, y: 0, w: 50, h: 50 },
            sheetColumns: 4,
        });
        this.color = color;
        this.addComponent(renderer);
        renderer.setSpriteIndex(this.color);
        console.log(`Box: Created box with initial color ${this.color}`);
        this.addComponent(new AberrateCubeComponent({ colorId: color }));
    }

    setCubeColor(color) {
        if (this.color === color) return;
        this.color = color;
        console.log(`Box: Setting cube color to ${color}`);
        this.getComponent(SpritesheetRendererComponent).setSpriteIndex(this.color);
        return;
    }

    getColor() {
        return this.color;
    }
}
