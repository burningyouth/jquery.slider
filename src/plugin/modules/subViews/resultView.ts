import $ from 'jquery';

import View from '../view';
import BasicElementView from './basicElementView';

class ResultView extends BasicElementView {
  public static $elementBase = $('<div class="js-slider__result">undef.</div>');

  constructor(view: View, wrapper: BasicElementView) {
    super(view, ResultView.$elementBase.clone(), wrapper.$element);
    this.update();
    super.init();
  }

  get value(): string {
    return this._view.templateValues;
  }

  public update(): ResultView {
    this.$element.text(this.value);
    this._view.trigger('resultUpdated', this);

    return this;
  }
}

export default ResultView;
