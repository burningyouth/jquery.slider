import BasicElementView from './basicElementView';
import HandlerView from './handlerView';
import BaseView from './baseView';
import View from '../view';
import $ from 'jquery';

class ProgressBarView extends BasicElementView {
  public static elementBase = $('<span class="js-slider__connector"></span>');
  public pairedHandler: HandlerView;

  constructor(
    view: View,
    pairedHandler: HandlerView,
    base: BaseView,
    initCallback: Function = ProgressBarView.init,
  ) {
    super(
      view,
      ProgressBarView.elementBase.clone(),
      base.element,
      initCallback,
    );
    this.pairedHandler = pairedHandler;

    if (view.settings.connectorsColors[0]) {
      this.element.css('background-color', view.settings.connectorsColors[0]);
    } else if (view.settings.handlersColors[0]) {
      this.element.css('background-color', view.settings.handlersColors[0]);
    }

    this.update();
  }

  public update(): ProgressBarView {
    const percentage = this.pairedHandler.percentage;

    if (this.settings.vertical) {
      this.element.css('top', `${percentage}%`);
    } else {
      this.element.css('right', `${100 - percentage}%`);
    }

    this._view.trigger('progressBarUpdated', this);

    return this;
  }

  public static init(that: ProgressBarView): void {
    if (that.parent) that.parent.prepend(that.element);

    const coordsAxis = that.settings.vertical ? 'clientY' : 'clientX';

    that.element.on('click touch', function (e) {
      e.preventDefault();
      if (e.target === that.element[0])
        that._view.trigger('progressBarClicked', that, e[coordsAxis]);
    });
  }
}

export default ProgressBarView;
