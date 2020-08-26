import $ from 'jquery';

import View from '../view';
import BasicElementView from './basicElementView';

class MarkView extends BasicElementView {
  public static $elementBase = $('<span class="js-slider__mark"></span>');
  public static $valueBase = $('<span class="js-slider__mark-value"></span>');
  public $valueElement: JQuery<HTMLElement>;

  public clickableClass = 'js-slider__mark_clickable';
  public reversedValueClass = 'js-slider__mark-value_reversed';

  public percentage: number;
  public value: number;
  public index: number;

  constructor(view: View, index: number, base: BasicElementView) {
    super(view, MarkView.$elementBase.clone(), base.$element);
    this.index = index;
    this.percentage = (this.index / this.settings.marksCount) * 100;
    this.value = this._view.getValueFromPercentage(this.percentage);

    this.update();
    this.init();
  }

  public update(): void {
    if (this.settings.isVertical) {
      this.$element.css('top', `${this.percentage}%`);
    } else {
      this.$element.css('left', `${this.percentage}%`);
    }
  }

  public init() {
    const that = this;

    if (that._view.settings.showMarkValue) {
      that.$valueElement = MarkView.$valueBase.clone();
      that.$valueElement.appendTo(that.$element);

      that.$valueElement.text(that.value);

      if (that._view.settings.isMarkValueReversed) {
        that.$valueElement.addClass(that.reversedValueClass);
      }
    }

    if (that._view.settings.isMarkClickable) {
      that.addClass(that.clickableClass);
    }

    that.$element.off('mousedown touchstart');

    that.$element.on('mousedown', function (e) {
      e.preventDefault();
      if (e.which === 1 && e.target === that.$element[0])
        that._view.trigger('markClicked', that);
    });

    that.$element.on('touchstart', function (e) {
      e.preventDefault();
      if (e.target === that.$element[0])
        that._view.trigger('markClicked', that);
    });

    super.init();
  }
}

export default MarkView;
