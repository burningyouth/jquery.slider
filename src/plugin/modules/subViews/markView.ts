import BasicElementView from './basicElementView';

import View from '../view';
import $ from 'jquery';

class MarkView extends BasicElementView {
  public static elementBase = $('<span class="js-slider__mark"></span>');
  public static valueBase = $('<span class="js-slider__mark-value"></span>');
  public clickableClass = 'js-slider__mark_clickable';
  public reversedValueClass = 'js-slider__mark-value_reversed';
  public percentage: number;
  public index: number;
  public value: JQuery<HTMLElement>;

  constructor(
    view: View,
    index: number,
    base: BasicElementView,
    initCallback: Function = MarkView.init
  ) {
    super(view, MarkView.elementBase.clone(), base.element, initCallback);
    this.index = index;
    this.percentage = (this.index / this.settings.marksCount) * 100;

    if (view.settings.showMarkValue) {
      this.value = MarkView.valueBase.clone();
      this.value.text(view.valueFromPercentage(this.percentage));
      this.value.appendTo(this.element);
    }
    if (view.settings.markValueReverse) {
      this.value.addClass(this.reversedValueClass);
    }

    if (view.settings.clickableMark) {
      this.addClass(this.clickableClass);
    }
    this.update();
  }

  public update(): void {
    if (this.settings.vertical) {
      this.css('top', `${this.percentage}%`);
    } else {
      this.css('left', `${this.percentage}%`);
    }
  }

  public static init(that: MarkView) {
    super.basicInit(that);

    that.element.on('click touch', function (e) {
      e.preventDefault();
      that._view.trigger('markClicked', that);
    });
  }
}

export default MarkView;
