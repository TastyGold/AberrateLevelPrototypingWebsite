import { Component } from "./Component.js";

export class EditorIntegrationComponent extends Component {
    constructor({ selected = false, highlighted = false } = {}) {
        super();
        this.selected = selected;
        this.highlighted = highlighted;
    }

    onSelected() {
        this.selected = true;
    }

    onDeselected() {
        this.selected = false;
    }

    onHighlighted() {
        this.highlighted = true;
    }

    onUnhighlighted() {
        this.highlighted = false;
    }
}
