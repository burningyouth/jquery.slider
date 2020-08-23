import BasicElementView from './basicElementView';
import View from '../view';
import $ from 'jquery';

class ResultView extends BasicElementView {
  public static elementBase = $('<div class="js-slider__result">undef.</div>');

  constructor(view: View, wrapper: BasicElementView, initCallback?: Function) {
    super(view, ResultView.elementBase.clone(), wrapper.element, initCallback);
    this.update();
  }

  get value(): string {
    return this._view.templateValues;
  }

  public update(): ResultView {
    this.element.text(this.value);
    this._view.trigger('resultUpdated', this);

    return this;
  }
}

export default ResultView;
