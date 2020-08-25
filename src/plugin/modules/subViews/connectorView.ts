import $ from 'jquery';

import BasicElementView from './basicElementView';
import BaseView from './baseView';
import HandlerView from './handlerView';
import View from '../view';

class ConnectorView extends BasicElementView {
  public static $elementBase = $('<span class="js-slider__connector"></span>');
  public index: number;
  public pairedHandlers: HandlerView[];
  public percentage: number[];

  constructor(
    view: View,
    index: number = 0,
    pairedHandlers: HandlerView[],
    base: BaseView,
    initCallback: Function = ConnectorView.init,
  ) {
    super(
      view,
      ConnectorView.$elementBase.clone(),
      base.$element,
      initCallback,
    );
    this.index = index;
    this.pairedHandlers = pairedHandlers;

    if (view.settings.connectorsColors[index]) {
      this.$element.css(
        'background-color',
        view.settings.connectorsColors[index],
      );
    } else if (view.settings.handlersColors[index * 2]) {
      this.$element.css(
        'background-color',
        view.settings.handlersColors[index * 2],
      );
    }

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

    if (this.settings.isVertical) {
      this.$element.css('top', `${this.percentage[0]}%`);
      this.$element.css('bottom', `${this.percentage[1]}%`);
    } else {
      this.$element.css('left', `${this.percentage[0]}%`);
      this.$element.css('right', `${this.percentage[1]}%`);
    }

    this.$element.trigger('connectorUpdated', this);

    return this;
  }

  public static init(that: ConnectorView): void {
    if (that.$parent) that.$parent.prepend(that.$element);
  }
}

export default ConnectorView;
