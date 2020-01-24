class Model {
  settings = {
    min: 0,
    max: 100
  };

  constructor(options: Object) {
    this.settings = $.extend(this.settings, options);
  }

  static pow(num: number, pow: number): number {
    return num ** pow;
  }
}

export default Model;
