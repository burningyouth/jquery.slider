import $ from 'jquery';

import View from '../view';
import BasicElementView from './basicElementView';

class MarkView extends BasicElementView {
  public static elementBase = $('<span class="js-slider__mark"></span>');
  public static valueBase = $('<span class="js-slider__mark-value"></span>');
  public clickableClass = 'js-slider__mark_clickable';
  public reversedValueClass = 'js-slider__mark-value_reversed';
  public percentage: number;
  public value: number;
  public index: number;
  public valueElement: JQuery<HTMLElement>;

  constructor(
    view: View,
    index: number,
    base: BasicElementView,
    initCallback: Function = MarkView.init,
  ) {
    super(view, MarkView.elementBase.clone(), base.element, initCallback);
    this.index = index;
    this.percentage = (this.index / this.settings.marksCount) * 100;
    this.value = this._view.getValueFromPercentage(this.percentage);

    if (view.settings.showMarkValue) {
      this.valueElement = MarkView.valueBase.clone();
      this.valueElement.appendTo(this.element);

      this.valueElement.text(this.value);

      if (view.settings.isMarkValueReversed) {
        this.valueElement.addClass(this.reversedValueClass);
      }

      this._view.trigger('markValueElementAppend', this);
    }
    if (view.settings.isMarkClickable) {
      this.addClass(this.clickableClass);
    }

    this.update();
  }

  public update(): void {
    if (this.settings.isVertical) {
      this.element.css('top', `${this.percentage}%`);
    } else {
      this.element.css('left', `${this.percentage}%`);
    }
  }

  public static init(that: MarkView) {
    super.basicInit(that);

    that.element.on('mousedown', function (e) {
      e.preventDefault();
      if (e.which === 1 && e.target === that.element[0])
        that._view.trigger('markClicked', that);
    });

    that.element.on('touchstart', function (e) {
      e.preventDefault();
      if (e.target === that.element[0]) that._view.trigger('markClicked', that);
    });
  }
}

export default MarkView;
