import { Settings } from '../types/slider';

enum Align {
  horizontal,
  vertical
}

class Model {
  settings: Settings = {
    min: 0,
    max: 100,
    range: true,
    startValue: 50,
    align: Align.horizontal,
    additionalClasses: {
      wrapper: 'slider',
      base: 'slider__base',
      handler: 'slider__handler',
      connector: 'slider__connector'
    }
  };

  data: Object;

  constructor(options?: Object) {
    if (options) this.settings = $.extend(this.settings, options);
    this.data = {
      values: this.settings.startValue
    };
  }
}

export { Model, Align };
