import BasicElementView from './basicElementView';
import View from '../view';
import $ from 'jquery';

class ResultView extends BasicElementView {
  public static elementBase = $('<div class="js-slider__result">undef.</div>');
  public text: string;

  constructor(
    view: View,
    text: string = 'undef.',
    parent: JQuery<HTMLElement> = $('body'),
    initCallback?: Function
  ) {
    super(view, ResultView.elementBase.clone(), parent, initCallback);
    this.text = text;
    this.update();
  }

  public update(text?: string): ResultView {
    if (text) {
      this.text = text;
    }
    this.element.text(this.text);
    this.trigger('resultUpdated', this);

    return this;
  }
}

export default ResultView;
