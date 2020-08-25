import $ from 'jquery';

import View from '../view';
import BasicElementView from './basicElementView';
import HandlerView from './handlerView';
import BaseView from './baseView';

class ProgressBarView extends BasicElementView {
  public static $elementBase = $('<span class="js-slider__connector"></span>');
  public pairedHandler: HandlerView;

  constructor(view: View, pairedHandler: HandlerView, base: BaseView) {
    super(view, ProgressBarView.$elementBase.clone(), base.$element);
    this.pairedHandler = pairedHandler;

    this.update();
    this.init();
  }

  public update(): ProgressBarView {
    const percentage = this.pairedHandler.percentage;

    if (this.settings.isVertical) {
      this.$element.css('top', `${percentage}%`);
    } else {
      this.$element.css('right', `${100 - percentage}%`);
    }

    this._view.trigger('progressBarUpdated', this);

    return this;
  }

  public init(): void {
    if (this._view.settings.connectorsColors[0]) {
      this.$element.css(
        'background-color',
        this._view.settings.connectorsColors[0],
      );
    } else if (this._view.settings.handlersColors[0]) {
      this.$element.css(
        'background-color',
        this._view.settings.handlersColors[0],
      );
    }

    if (this.$parent) this.$parent.prepend(this.$element);
  }
}

export default ProgressBarView;
