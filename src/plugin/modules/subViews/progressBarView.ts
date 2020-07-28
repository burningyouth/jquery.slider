import BasicElementView from './basicElementView';
import HandlerView from './handlerView';
import View from '../view';
import $ from 'jquery';

class ProgressBarView extends BasicElementView {
  public static elementBase = $('<div class="js-slider__connector"></div>');
  public pairedHandler: HandlerView;

  constructor(
    view: View,
    pairedHandler: HandlerView,
    parent: JQuery<HTMLElement> = $('body'),
    initCallback: Function = ProgressBarView.init
  ) {
    super(view, ProgressBarView.elementBase.clone(), parent, initCallback);
    this.pairedHandler = pairedHandler;
    this.update();
  }

  public update(): ProgressBarView {
    const percentage = this.pairedHandler.percentage;

    if (this.settings.vertical) {
      this.element.css('top', `${percentage}%`);
    } else {
      this.element.css('right', `${100 - percentage}%`);
    }

    this.element.trigger('progressBarUpdated', this);

    return this;
  }

  public static init(that: ProgressBarView): void {
    if (that.parent) that.parent.prepend(that.element);
  }
}

export default ProgressBarView;
