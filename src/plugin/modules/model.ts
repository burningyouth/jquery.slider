import { Settings, Values } from '../types/slider';

enum Align {
  horizontal,
  vertical
}

class Model {
  settings: Settings = {
    min: 45,
    max: 200,
    range: false,
    startValue: [50, 123, 60, 55],
    step: 0.25,
    roundTo: 2,
    align: Align.horizontal,
    additionalClasses: {
      wrapper: 'slider',
      base: 'slider__base',
      handler: 'slider__handler',
      connector: 'slider__connector'
    }
  };

  private _values: Values;

  constructor(options?: Object) {
    if (options) this.settings = $.extend(this.settings, options);

    if (this.checkValue(this.settings.startValue)) {
      this._values = this.settings.startValue;
    } else {
      throw new Error('Start value is invalid (out of range)!');
    }
  }

  get values(): Values {
    return this._values;
  }

  set values(newValues: Values) {
    this._values = newValues;
  }

  public checkValue(value: number | Values): boolean {
    if (Array.isArray(value)) {
      let result = true;
      value.forEach(item => {
        if (!this.checkValue(item)) result = false;
      });
      return result;
    } else {
      return value >= this.settings.min && value <= this.settings.max;
    }
  }

  public setValue(index: number, value: number): Model {
    this._values[index] = value;
    return this;
  }
}

export { Model, Align };
