import $ from 'jquery';

import BasicElementView from './basicElementView';
import View from '../view';

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
    if (view.settings.isBaseClickable && !view.settings.showMarks) {
      this.addClass(this.clickableClass);
    }
  }

  public static init(that: BaseView) {
    super.basicInit(that);

    const coordsAxis = that.settings.isVertical ? 'clientY' : 'clientX';

    that.element.on('mousedown', function (e) {
      e.preventDefault();
      if (e.which === 1) that._view.trigger('baseClicked', e[coordsAxis]);
    });

    that.element.on('touchstart', function (e) {
      e.preventDefault();
      that._view.trigger('baseClicked', e.touches[0][coordsAxis]);
    });
  }
}

export default BaseView;
