import * as slider from '../types/slider';
import Presenter from './presenter';
import BasicElementView from './subViews/basicElementView';
import BoundView from './subViews/boundView';
import HandlerView from './subViews/handlerView';
import ConnectorView from './subViews/connectorView';
import ResultView from './subViews/resultView';
import TooltipView from './subViews/tooltipView';
import InputView from './subViews/inputView';
import events from './mixins/eventsMixin';
import $ from 'jquery';

class View {
  private _eventHandlers: Object = {};
  public exec: Function;
  public on: Function;
  public off: Function;

  public input: JQuery<HTMLElement>; //поле, в которое записывается значения ползунков
  public presenter: Presenter;

  public elements: slider.Elements = {};

  constructor(input: JQuery<HTMLElement>) {
    this.elements = {
      handlers: [],
      connectors: [],
      tooltips: [],
      bounds: []
    };
    this.input = input;
  }

  get settings(): slider.Settings {
    return this.presenter.model.settings;
  }

  public addClasses(obj: slider.AdditionalClasses): View {
    //добавляем дополнительные классы для элементов
    Object.keys(obj).forEach((key: keyof slider.AdditionalClasses) => {
      if (this.elements[key]) {
        if (Array.isArray(this.elements[key])) {
          (this.elements[key] as Array<BasicElementView>).forEach(element => {
            element.addClass(obj[key]);
          });
        } else {
          (this.elements[key] as BasicElementView).addClass(obj[key]);
        }
      }
    });
    return this;
  }

  public initParent(): View {
    this.elements.parent = new BasicElementView(this, this.input.parent());
    return this;
  }

  public initWrapper(): View {
    this.elements.wrapper = new BasicElementView(
      this,
      $('<div class="js-slider"></div>'),
      this.elements.parent.element
    );
    if (this.settings.align) {
      this.elements.wrapper.element.addClass('js-slider_vertical');
    }
    return this;
  }

  public initInput(): View {
    this.elements.input = new InputView(
      this,
      this.input,
      this.settings.startValues,
      this.elements.wrapper
    );
    return this;
  }

  public initBaseWrapper(): View {
    this.elements.baseWrapper = new BasicElementView(
      this,
      $('<div class="js-slider__base-wrapper"></div>'),
      this.elements.wrapper.element
    );
    return this;
  }

  public initBase(): View {
    this.elements.base = new BasicElementView(
      this,
      $('<div class="js-slider__base"></div>'),
      this.elements.baseWrapper.element
    );
    return this;
  }

  public initBounds(): View {
    if (this.settings.showBounds) {
      this.elements.bounds.push(
        new BoundView(this, this.settings.min, this.elements.baseWrapper.element, function(
          that: BoundView
        ) {
          that.element.prependTo(that.parent);
        })
      );
      this.elements.bounds.push(
        new BoundView(this, this.settings.max, this.elements.baseWrapper.element)
      );
    }
    return this;
  }

  public initResult(): View {
    if (this.settings.showResult) {
      this.elements.result = new ResultView(
        this,
        this.presenter.model.formattedValues,
        this.elements.wrapper.element
      );
    }
    return this;
  }

  public initTooltip(index: number): View {
    if (this.settings.showTooltip) {
      this.elements.tooltips.push(new TooltipView(this, this.elements.handlers[index]));
      this.elements.handlers[index].tooltip = this.elements.tooltips[index];
      if (this.settings.align && this.settings.tooltipReverse) {
        this.elements.tooltips[index].addClass('js-slider__tooltip_left');
      } else if (this.settings.tooltipReverse) {
        this.elements.tooltips[index].addClass('js-slider__tooltip_bottom');
      }
    }
    return this;
  }

  public initConnector(index: number): View {
    if (this.settings.range && index % 2 === 1) {
      const connectorIndex = Math.floor(index / 2);
      this.elements.connectors.push(
        new ConnectorView(
          this,
          connectorIndex,
          [this.elements.handlers[index - 1], this.elements.handlers[index]],
          this.elements.base.element
        )
      );
      this.elements.handlers[index - 1].connector = this.elements.connectors[connectorIndex];
      this.elements.handlers[index].connector = this.elements.connectors[connectorIndex];
      if (this.settings.connectorsColors[connectorIndex]) {
        this.elements.connectors[connectorIndex].css(
          'background-color',
          this.settings.connectorsColors[connectorIndex]
        );
      } else if (this.settings.handlersColors[index]) {
        this.elements.connectors[connectorIndex].css(
          'background-color',
          this.settings.handlersColors[index]
        );
      }
    }

    return this;
  }

  public initHandler(value: number, index: number): View {
    this.elements.handlers.push(
      new HandlerView(this, index, this.getPercentage(value), value, this.elements.base)
    );
    if (this.settings.handlersColors[index]) {
      this.elements.handlers[index].css('background-color', this.settings.handlersColors[index]);
    }
    this.initTooltip(index).initConnector(index);
    return this;
  }

  public init(): View {
    this.initParent()
      .initWrapper()
      .initInput()
      .initBaseWrapper()
      .initBase()
      .initBounds()
      .initResult();

    this.settings.startValues.forEach((value, index) => {
      this.initHandler(value, index);
    });

    this.addClasses(this.settings.additionalClasses);

    this.on('handlerStart', function(handler: HandlerView) {
      handler.addClass('js-slider__handler_active');
    });

    this.on('handlerEnd', function(handler: HandlerView) {
      handler.removeClass('js-slider__handler_active');
    });

    return this;
  }

  public getPercentage(value: number): number {
    //возвращает процентное соотношение value от min, max
    const settings = this.settings;
    const percentage = ((value - settings.min) / (settings.max - settings.min)) * 100;
    if (percentage >= 0 && percentage <= 100) {
      return percentage;
    } else if (percentage > 100) {
      return 100;
    }
    return 0;
  }

  public trigger(eventType: string, ...args: any) {
    this.exec(eventType, ...args);
    this.presenter.trigger(eventType, ...args);
  }
}

Object.assign(View.prototype, events);

export default View;
