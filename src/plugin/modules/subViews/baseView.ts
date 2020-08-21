import BasicElementView from './basicElementView';
import View from '../view';
import $ from 'jquery';

class BaseView extends BasicElementView {
  public static elementBase = $('<div class="js-slider__base"></div>');
  public clickableClass = 'js-slider__base_clickable';

  constructor(
    view: View,
    baseWrapper: BasicElementView,
    initCallback: Function = BaseView.init,
  ) {
    super(
      view,
      BaseView.elementBase.clone(),
      baseWrapper.element,
      initCallback,
    );
    if (view.settings.clickableBase && !view.settings.showMarks) {
      this.addClass(this.clickableClass);
    }
  }

  public static init(that: BaseView) {
    super.basicInit(that);

    const coordsAxis = that.settings.vertical ? 'clientY' : 'clientX';

    that.element.on('click touch', function (e) {
      e.preventDefault();
      if (e.target === that.element[0])
        that._view.trigger('baseClicked', that, e[coordsAxis]);
    });
  }
}

export default BaseView;
