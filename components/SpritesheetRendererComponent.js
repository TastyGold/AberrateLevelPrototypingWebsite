import { SpriteRendererComponent } from "./SpriteRendererComponent.js";


export class SpritesheetRendererComponent extends SpriteRendererComponent {
    constructor({ sprite = null, colorTint = '#ffffff', src = { x: 0, y: 0, w: 40, h: 40 }, dest = { x: 0, y: 0, w: 40, h: 40 }, sheetColumns = 0, spriteIndexX = 0, spriteIndexY = 0 } = {}) {
        super({ sprite, colorTint, src, dest });
        this.sheetColumns = sheetColumns;
        this.spriteIndexX = spriteIndexX;
        this.spriteIndexY = spriteIndexY;
    }

    draw(ctx, transform) {
        this.drawSpecific(ctx, transform, {
            x: this.src.x + this.spriteIndexX * this.src.w,
            y: this.src.y + this.spriteIndexY * this.src.h,
            w: this.src.w,
            h: this.src.h
        });
    }

    setSpriteIndexRowColumn(x, y) {
        this.spriteIndexX = x;
        this.spriteIndexY = y;
    }

    setSpriteIndex(idx) {
        this.setSpriteIndexRowColumn(
            idx % this.sheetColumns,
            Math.floor(idx / this.sheetColumns)
        );
    }
}
