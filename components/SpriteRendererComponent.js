import { Component } from "./Component.js";

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
