import BasicElementView from './basicElementView';
import HandlerView from './handlerView';
import View from '../view';
import { Align } from '../model';

class TooltipView extends BasicElementView {
  public static elementBase = $('<span class="js-slider__tooltip">undef.</span>');
  public value: number;
  public handler: HandlerView;

  constructor(view: View, value: number = 0, handler: HandlerView, initCallback?: Function) {
    super(view, TooltipView.elementBase, handler.element, initCallback);
    this.value = value;
    this.update();
  }

  public update(): TooltipView {
    if (this.settings.showTooltip) {
      this.element.text(this.value);
    }

    this.trigger('tooltipUpdated');

    return this;
  }
}

export default TooltipView;
