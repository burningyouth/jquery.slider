enum Align {
  horizontal,
  vertical
}

class Model {
  settings: Settings = {
    min: 0,
    max: 100,
    range: true,
    startValue: [0, 100],
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

  static pow(num: number, p: number): number {
    return num ** p;
  }
}

export { Model, Align };
