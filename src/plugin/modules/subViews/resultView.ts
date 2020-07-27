import BasicElementView from './basicElementView';
import View from '../view';

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

  public update(): ResultView {
    this.element.text(this.text);
    this.trigger('resultUpdated');

    return this;
  }
}

export default ResultView;
