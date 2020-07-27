import BasicElementView from './basicElementView';
import HandlerView from './handlerView';
import View from '../view';
import { Align } from '../model';
import $ from 'jquery';

class ConnectorView extends BasicElementView {
  public static elementBase = $('<div class="js-slider__connector"></div>');
  public index: number;
  public pairedHandlers: HandlerView[];
  public percentage: number[];

  constructor(
    view: View,
    index: number = 0,
    pairedHandlers: HandlerView[],
    parent: JQuery<HTMLElement> = $('body'),
    initCallback: Function = ConnectorView.init
  ) {
    super(view, ConnectorView.elementBase.clone(), parent, initCallback);
    this.index = index;
    this.pairedHandlers = pairedHandlers;
    this.update();
  }

  public update(): ConnectorView {
    const percentage = this.pairedHandlers[0].percentage;
    const pairedPercentage = this.pairedHandlers[1].percentage;

    if (pairedPercentage > percentage) {
      this.percentage = [percentage, 100 - pairedPercentage];
    } else {
      this.percentage = [pairedPercentage, 100 - percentage];
    }

    if (this.settings.align === Align.vertical) {
      this.element.css('top', `${this.percentage[0]}%`);
      this.element.css('bottom', `${this.percentage[1]}%`);
    } else {
      this.element.css('left', `${this.percentage[0]}%`);
      this.element.css('right', `${this.percentage[1]}%`);
    }

    this.element.trigger('connectorUpdated');

    return this;
  }

  public static init(that: ConnectorView): void {
    if (that.parent) that.parent.prepend(that.element);
  }
}

export default ConnectorView;
