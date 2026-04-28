import { Component } from "./Component.js";
import { Box } from "../entities/Box.js";
import { TransformComponent } from "../components/TransformComponent.js";

export class AberrateCubeComponent extends Component {    
  constructor({ boxColor = 0 } = {}) {
    super();
    this.boxColor = boxColor;
  }

  static ABERRATE_RED = 1;
  static ABERRATE_BLUE = 2;
  static ABERRATE_GREEN = 3;

  aberrate() {
    if (this.entity instanceof Box) {
      // set cube color to current color + 8 mod 16
      const box = this.entity;
      const newColor = (box.getColor() + 8) % 16;
      box.setCubeColor(newColor);
      this.boxColor = newColor;
    }
  }

  onEnterPlayMode() {
    //this.aberrate();
    console.log(`AberrateCubeComponent: Entered play mode, this box color is ${this.boxColor}`);
  }

  onPlayModeUpdate(dt) {
    const transform = this.entity.getComponent(TransformComponent);
    if (transform) {
      transform.rotation += dt * 0.005;
    }
  }

  onExitPlayMode() {
    this.aberrate();
  }
}