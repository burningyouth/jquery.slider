import $ from 'jquery';

import View from '../view';
import BasicElementView from './basicElementView';
import HandlerView from './handlerView';

class TooltipView extends BasicElementView {
  public static $elementBase = $(
    '<span class="js-slider__tooltip">undef.</span>',
  );
  public handler: HandlerView;
  public reversedClass = 'js-slider__tooltip_reversed';

  constructor(view: View, handler: HandlerView) {
    super(view, TooltipView.$elementBase.clone(), handler.$element);
    this.handler = handler;

    this.update();
    this.init();
  }

  get value(): number {
    return this.handler.value;
  }

  public update(): TooltipView {
    this.$element.text(this.value);

    this._view.trigger('tooltipUpdated', this);

    return this;
  }

  public init(): void {
    if (this._view.settings.isTooltipReversed) {
      this.addClass(this.reversedClass);
    }

    super.init();
  }
}

export default TooltipView;
