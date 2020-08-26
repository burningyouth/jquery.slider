import $ from 'jquery';

import View from '../view';
import BasicElementView from './basicElementView';
import { Values } from '../../types/slider';

class InputView extends BasicElementView {
  constructor(
    view: View,
    input: JQuery<HTMLElement>,
    wrapper: BasicElementView,
  ) {
    super(view, input, wrapper.$element);
    this.update();
    this.init();
  }

  get sortedValues(): Values {
    return this._view.sortedValues;
  }

  public init() {
    const that = this;

    that.$element.remove();

    that.addClass('js-slider__input');

    if (that.settings.showInput) {
      that.addClass('js-slider__input_shown');
    } else {
      that.removeClass('js-slider__input_shown');
    }

    if (!that.settings.isEnabled) {
      that.$element.attr('disabled', 'true');
    }

    that.$element.off('change');

    that.$element.on('change', function (e) {
      e.preventDefault();
      if (e.target === that.$element[0]) {
        const values = ($(e.currentTarget).val() as string)
          .split(',')
          .map((item) => {
            return +item;
          });
        that._view.trigger('inputChange', values);
      }
    });

    that.$element.appendTo(that.$parent);
  }

  public update(): InputView {
    if (this.sortedValues.length > 1) {
      this.$element.val(this.sortedValues.toString());
    } else {
      this.$element.val(this.sortedValues[0]);
    }
    return this;
  }
}

export default InputView;
