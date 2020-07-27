import BasicElementView from './basicElementView';
import View from '../view';
import { Values } from '../../types/slider';
import $ from 'jquery';

class InputView extends BasicElementView {
  public values: Values;

  constructor(
    view: View,
    input: JQuery<HTMLElement>,
    values: Values,
    wrapper: BasicElementView,
    initCallback: Function = InputView.init
  ) {
    super(view, input, wrapper.element, initCallback);
    this.values = values;
    this.update();
  }

  public static init(that: InputView) {
    that.element.remove();
    that.element.prependTo(that.parent);
  }

  public update(values?: Values): InputView {
    if (values) this.values = values;
    this.element.attr(
      'value',
      JSON.stringify({
        value: this.values
      })
    );
    this.trigger('inputUpdated');

    return this;
  }
}

export default InputView;
