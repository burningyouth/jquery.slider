import BasicElementView from './basicElementView';
import View from '../view';
import { Values } from '../../types/slider';
import $ from 'jquery';

class InputView extends BasicElementView {
  public _values: Values;

  constructor(
    view: View,
    input: JQuery<HTMLElement>,
    values: Values,
    wrapper: BasicElementView,
    initCallback: Function = InputView.init
  ) {
    super(view, input, wrapper.element, initCallback);
    this.update(values);
  }

  public static init(that: InputView) {
    that.element.remove();
    that.element.appendTo(that.parent);

    that.addClass('js-slider__input');
    if (that.settings.showInput) {
      that.addClass('js-slider__input_show');
    } else {
      that.removeClass('js-slider__input_show');
    }
    if (that.settings.readonlyInput) {
      that.element.attr('readonly', 'true');
    }

    that.element.on('change', function (e) {
      that.values = (that.element.val() as string).split(',').map((item) => {
        return +item;
      });
      that._view.trigger('inputChange', that);
    });
  }

  public update(values?: Values): InputView {
    this.values = values;
    return this;
  }

  set values(newValues: Values) {
    this._values = newValues;
    if (this._values.length > 1) {
      this.element.val(this.values.toString());
    } else {
      this.element.val(this.values[0]);
    }
    this._view.trigger('inputUpdated', this);
  }

  get values(): Values {
    return this._values;
  }

}

export default InputView;
