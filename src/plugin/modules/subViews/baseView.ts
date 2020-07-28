import BasicElementView from './basicElementView';
import View from '../view';
import $ from 'jquery';

class BaseView extends BasicElementView {
  public static elementBase = $('<div class="js-slider__base"></div>');

  constructor(view: View, baseWrapper: BasicElementView, initCallback: Function = BaseView.init) {
    super(view, BaseView.elementBase.clone(), baseWrapper.element, initCallback);
  }

  public static init(that: BaseView) {
    super.basicInit(that);

    const coordsAxis = that.settings.vertical ? 'clientY' : 'clientX';

    that.element.on('click touch', function(e) {
      e.preventDefault();
      that.trigger('baseClicked', that, e[coordsAxis]);
    });
  }
}

export default BaseView;
