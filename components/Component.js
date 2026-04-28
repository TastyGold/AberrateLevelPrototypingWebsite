/**
 * Base component class for all entity components.
 */

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map(cloneValue);
  }
  if (value && typeof value === 'object' && value.constructor === Object) {
    const copy = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        copy[key] = cloneValue(value[key]);
      }
    }
    return copy;
  }
  return value;
}

export class Component {
    constructor(entity = null) {
        this.entity = entity;
    }

    clone() {
        const copy = new this.constructor();
        for (const key of Object.keys(this)) {
            if (key === 'entity') continue;
            copy[key] = cloneValue(this[key]);
        }
        copy.entity = null;
        return copy;
    }
}


