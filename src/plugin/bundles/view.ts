module.exports = class View {
  settings = {
    min: 0,
    max: 100
  };

  constructor(options: Object) {
    this.settings = $.extend(this.settings, options);
  }
};
