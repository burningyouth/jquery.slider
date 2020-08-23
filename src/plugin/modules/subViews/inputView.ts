import BasicElementView from './basicElementView';
import View from '../view';
import { Values } from '../../types/slider';
import $ from 'jquery';

class InputView extends BasicElementView {
  constructor(
    view: View,
    input: JQuery<HTMLElement>,
    wrapper: BasicElementView,
    initCallback: Function = InputView.init,
  ) {
    super(view, input, wrapper.element, initCallback);
    this.update();
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
    if (!that.settings.enabled) {
      that.element.attr('disabled', 'true');
    }

    that.element.on('change', function (e) {
      const values = (that.element.val() as string).split(',').map((item) => {
        return +item;
      });
      that._view.trigger('inputChange', values);
    });
  }

  get sortedValues(): Values {
    return this._view.sortedValues;
  }

  public update(): InputView {
    if (this.sortedValues.length > 1) {
      this.element.val(this.sortedValues.toString());
    } else {
      this.element.val(this.sortedValues[0]);
    }
    return this;
  }
}

export default InputView;
