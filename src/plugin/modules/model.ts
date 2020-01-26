enum Align {
  horizontal,
  vertical
}

class Model {
  public settings: Settings = {
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

  public data: Object;

  constructor(options?: Object) {
    if (options) this.settings = $.extend(this.settings, options);
    this.data = {
      values: this.settings.startValue
    };
  }
}

export { Model, Align };
