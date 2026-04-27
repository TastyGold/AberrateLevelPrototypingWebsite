import { Component } from "./Component.js";
import { Box } from "../entities/Box.js";

export class AberrateCubeComponent extends Component {
  aberrate() {
    if (this.entity instanceof Box) {
      // set cube color to current color + 8 mod 16
      const box = this.entity;
      const newColor = (box.getColor() + 8) % 16;
      box.setCubeColor(newColor);
    }
  }
}