import $ from 'jquery';

import View from '../view';
import BasicElementView from './basicElementView';
import BaseView from './baseView';
import ConnectorView from './connectorView';
import TooltipView from './tooltipView';
import ProgressBarView from './progressBarView';

class HandlerView extends BasicElementView {
  public static $elementBase = $('<span class="js-slider__handler"></span>');

  public activeClass = 'js-slider__handler_active';
  public focusClass = 'js-slider__handler_focus';

  private _active: boolean = false;
  private _focus: boolean = false;

  public index: number;
  public connector: ConnectorView | ProgressBarView;
  public tooltip: TooltipView;

  constructor(view: View, index: number = 0, base: BaseView) {
    super(view, HandlerView.$elementBase.clone(), base.$element);
    this.index = index;

    if (view.settings.handlersStateClasses.active) {
      this.activeClass += ` ${view.settings.handlersStateClasses.active}`;
    }

    if (view.settings.handlersStateClasses.focus) {
      this.focusClass += ` ${view.settings.handlersStateClasses.focus}`;
    }

    this.update();
    this.init();
  }

  get percentage(): number {
    return this._view.getPercentage(this.value);
  }

  set active(newValue: boolean) {
    this._active = newValue;
    if (newValue) {
      this.addClass(this.activeClass);
    } else {
      this.removeClass(this.activeClass);
    }
  }

  set focus(newValue: boolean) {
    this._focus = newValue;
    if (newValue) {
      this.addClass(this.focusClass);
    } else {
      this.removeClass(this.focusClass);
    }
  }

  get active(): boolean {
    return this._active;
  }

  get focus(): boolean {
    return this._focus;
  }

  get value(): number {
    return this._view.values[this.index];
  }

  public init() {
    const that = this;
    const coordsAxis = that.settings.isVertical ? 'clientY' : 'clientX';

    if (that._view.settings.handlersColors[that.index]) {
      that.$element.css(
        'background-color',
        that._view.settings.handlersColors[that.index],
      );
    }

    that.$element.off('mousedown touchstart');

    that.$element.on('mousedown', function (e) {
      e.preventDefault();
      if (e.which === 1 && e.target === that.$element[0]) {
        that._view.trigger('handlerStart', that);
        $(window).on('mousemove', function (e2) {
          const coords = e2[coordsAxis];
          const offset = that._view.getValueFromCoords(coords) - that.value;
          if (offset !== 0) {
            that._view.trigger('handlerMoved', that, offset);
          }
        });
      }
    });

    that.$element.on('touchstart', function (e) {
      e.preventDefault();
      if (e.target === that.$element[0]) {
        that._view.trigger('handlerStart', that);
        $(window).on('touchmove', function (e2) {
          const coords = e2.touches[0][coordsAxis];
          const offset = that._view.getValueFromCoords(coords) - that.value;
          if (offset !== 0) {
            that._view.trigger('handlerMoved', that, offset);
          }
        });
      }
    });

    $(window).on('mouseup touchend', function (e) {
      e.preventDefault();
      if (that.active) {
        $(window).off('mousemove touchmove');
        that._view.trigger('handlerEnd', that);
      }
    });

    super.init();
  }

  public update(): HandlerView {
    if (this.settings.isVertical) {
      this.$element.css('top', `calc(${this.percentage}% - 7.5px)`);
    } else {
      this.$element.css('left', `calc(${this.percentage}% - 7.5px)`);
    }

    this._view.trigger('handlerUpdated', this);

    if (this.connector) this.connector.update();
    if (this.tooltip) this.tooltip.update();

    return this;
  }
}

export default HandlerView;
