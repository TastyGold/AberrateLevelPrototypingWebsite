import { Component } from "./Component.js";
import { TransformComponent } from "./TransformComponent.js";

/**
 * Box collider component for point and AABB intersection.
 */
export class BoxColliderComponent extends Component {
    constructor({ offsetX = 0, offsetY = 0, width = 40, height = 40 } = {}) {
        super();
        this.highlighted = false; // Whether to draw the collider with a highlight (for debugging)
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width;
        this.height = height;
    }

    getBounds() {
        const transform = this.entity?.getComponent(TransformComponent);
        if (!transform) {
            return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        }
        const x = transform.x + this.offsetX - this.width / 2;
        const y = transform.y + this.offsetY - this.height / 2;
        return {
            minX: x,
            minY: y,
            maxX: x + this.width,
            maxY: y + this.height,
        };
    }

    pointIntersect(px, py) {
        const b = this.getBounds();
        return px >= b.minX && px <= b.maxX && py >= b.minY && py <= b.maxY;
    }

    intersects(otherBoxCollider) {
        if (!(otherBoxCollider instanceof BoxColliderComponent)) {
            return false;
        }
        const a = this.getBounds();
        const b = otherBoxCollider.getBounds();
        return a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY;
    }
}
