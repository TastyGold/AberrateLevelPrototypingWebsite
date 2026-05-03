import { Component } from "./Component.js";
import { Box } from "../entities/Box.js";
import { TransformComponent } from "../components/TransformComponent.js";
import { AberrateCubeRecipes } from "./AberrateCubeRecipes.js";

export class AberrateCubeComponent extends Component {    
  constructor({ colorId = 0 } = {}) {
    super();
    this.colorId = colorId;
    this.childComponents = [];
    this.aberrated = false;
    this.parentComponent = null;
  }
  
  static ABERRATE_WHITE = 0;
  static ABERRATE_RED = 1;
  static ABERRATE_BLUE = 2;
  static ABERRATE_GREEN = 3;

  static ABERRATED_ID_OFFSET = 8;

  aberrate(state) {
    // only handle aberration logic if is parent or can spawn children
    if (this.childComponents.length < 1 && this.colorId < 4) {
      return; 
    }

    if (this.aberrated) {
      this.toggleParentChildAberration(false); // un-aberrate parent and children
      console.log(`AberrateCubeComponent: Aberrating cube color ${this.colorId} and its children`);
    }
    else if (this.canDefuse()) {
      this.defuse(state);
      console.log(`AberrateCubeComponent: Defusing cube color ${this.colorId} into its components`);
    }
    else {
      this.toggleParentChildAberration(true); // aberrate parent and children
      console.log(`AberrateCubeComponent: No defuse recipe for cube color ${this.colorId}, toggling aberration`);
    }
    
  }

  toggleParentChildAberration(aberrated = true) {
    this.setAberrated(aberrated);
    this.childComponents.forEach(child => {
      child.setAberrated(!aberrated);
    });
  }

  canFuseWith(otherColorId) {
    return AberrateCubeRecipes.fuseRecipes.some(recipe => {
      return (recipe.input[0] === this.colorId && recipe.input[1] === otherBox.colorId) ||
             (recipe.input[1] === this.colorId && recipe.input[0] === otherBox.colorId);
            });
  }

  tryFuseWith(state, otherBox) {
    console.log(`AberrateCubeComponent: trying to fuse ${this.colorId} with color ${otherBox.colorId}`);
    const recipe = AberrateCubeRecipes.fuseRecipes.find(recipe => {
      return (recipe.input[0] === this.colorId && recipe.input[1] === otherBox.colorId) ||
             (recipe.input[1] === this.colorId && recipe.input[0] === otherBox.colorId);
    });

    if (recipe) {
      console.log(`AberrateCubeComponent: Fusing cube color ${this.colorId} with color ${otherBox.colorId} to create color ${recipe.output}`);
      // set this box to the fused color
      this.setColorId(recipe.output);
      const parent = this.parentComponent;
      const otherParent = otherBox.parentComponent;
      // detatch parent children and delete parent
      if (otherParent !== null && otherParent !== parent) {
        otherParent.detachFromParent();
        otherParent.detachChildren();
        state.removePlaymodeEntityFromState(otherParent.entity);
      }
      if (parent !== null) {
        parent.detachFromParent();
        parent.detachChildren();
        state.removePlaymodeEntityFromState(parent.entity);
      }
      // remove the other box from the game state
      state.removePlaymodeEntityFromState(otherBox.entity);
      return true;
    }
    return false;
  }

  detachChildren() {
    this.childComponents.forEach(child => {
      child.parentComponent = null;
    });
    this.childComponents = [];
  }

  detachFromParent() {
    if (this.parentComponent) {
      this.parentComponent.childComponents = this.parentComponent.childComponents.filter(child => child !== this);
      this.parentComponent = null;
    }
  }

  canDefuse() {
    return AberrateCubeRecipes.defuseRecipes.some(recipe => recipe.input === this.colorId);
  }

  defuse(state) {
    const defuseRecipe = AberrateCubeRecipes.defuseRecipes.find(recipe => recipe.input === this.colorId);
    if (defuseRecipe) {
      console.log(`AberrateCubeComponent: Defusing cube color ${this.colorId} into ${defuseRecipe.output}`);

      let offsetX = -50;
      defuseRecipe.output.forEach(colorId => {
        this.spawnChild(state, colorId, offsetX, 0);
        offsetX += 50;
        if (offsetX === 0) offsetX += 50; // skip spawning directly on top of parent
      });
      this.setColorId(AberrateCubeComponent.ABERRATE_WHITE);
      this.toggleAberrated();
      this.updateBoxSpritesheetRenderer();
      return;
    }
  }

  spawnChild(state, colorId, offsetX, offsetY) {
    const child = new Box({ color: colorId });
    const childTransform = child.getComponent(TransformComponent);
    const parentTransform = this.entity.getComponent(TransformComponent);
    if (childTransform) {
      childTransform.x = parentTransform.x + offsetX;
      childTransform.y = parentTransform.y + offsetY;
      state.addPlaymodeEntityToState(child);
      const childAberrateComponent = child.getComponent(AberrateCubeComponent);
      childAberrateComponent.parentComponent = this;
      this.childComponents.push(childAberrateComponent);
      console.log(`AberrateCubeComponent: Spawned child cube with color ${colorId} at offset (${offsetX}, ${offsetY})`);
    }
  }

  setAberrated(value) {
    this.aberrated = value;
    this.updateBoxSpritesheetRenderer();
  }

  toggleAberrated() {
    this.aberrated = !this.aberrated;
    this.updateBoxSpritesheetRenderer();
  }

  setColorId(colorId) {
    this.colorId = colorId;
    this.updateBoxSpritesheetRenderer();
  }

  updateBoxSpritesheetRenderer() {
    if (this.entity instanceof Box) {
      const box = this.entity;
      let newColorId = this.colorId + (this.aberrated ? AberrateCubeComponent.ABERRATED_ID_OFFSET : 0);
      console.log(`AberrateCubeComponent: Updating box color to ${newColorId} (aberrated: ${this.aberrated})`); 
      box.setCubeColor(newColorId);
    }
  }

  onEnterPlayMode() {
    console.log(`AberrateCubeComponent: Entered play mode, this box color is ${this.colorId}`);
  }

  onPlayModeUpdate(dt) {
    const transform = this.entity.getComponent(TransformComponent);
    if (transform && this.colorId % 4 === 0) {
      //transform.y += dt * 0.05; // example update code
    }
  }

  onExitPlayMode() {
  }
}

