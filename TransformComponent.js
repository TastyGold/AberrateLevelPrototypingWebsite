import { Component } from "./Component.js";

/**
 * Transform component stores position, rotation, and size.
 */
export class TransformComponent extends Component {
    constructor({ x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1 } = {}) {
        super();
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }
}
