import { Model } from './model';
import View from './view';

class Presenter {
  model: Model;
  view: View;

  constructor(target: JQuery<HTMLElement>, model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.view.elements.parent = target.parent();
    target.remove();
    target.prependTo(this.view.elements.wrapper);
    this.view.elements.wrapper.prependTo(view.elements.parent);
    this.view.addClasses(this.model.settings.additionalClasses);
  }

  public init(): void {
    this.view.initHandlers(this, this.handlersCallback);
  }

  public getValue(mouseX: number): number {
    const settings = this.model.settings;
    const base = this.view.elements.base;
    const roundTo = 10 ** settings.roundTo;

    let value = (mouseX - base.offset().left) / base.width();
    value *= settings.max - settings.min;
    value = settings.min + Math.floor(value / settings.step + 0.5) * settings.step;
    value = Math.floor(value * roundTo) / roundTo;

    if (value >= settings.min && value <= settings.max) {
      return value;
    } else if (value > settings.max) {
      return settings.max;
    }
    return settings.min;
  }

  public getPercentage(value: number): number {
    const settings = this.model.settings;
    const percentage = ((value - settings.min) / (settings.max - settings.min)) * 100;
    if (percentage >= 0 && percentage <= 100) {
      return percentage;
    } else if (percentage > 100) {
      return 100;
    }
    return 0;
  }

  public changePosition(handler: JQuery<HTMLElement>, mouseX: number): Presenter {
    const value = this.getValue(mouseX);
    const percentage = this.getPercentage(value);
    const handlerIndex = +handler.data('index');
    this.model.setValue(handlerIndex, value);
    this.view
      .changeHandlerPosition(handler, percentage)
      .changeConnectorPosition(handlerIndex, percentage)
      .changeResultText(`${this.model.values.toString()}`);

    return this;
  }

  public handlersCallback(handler: JQuery<HTMLElement>): void {
    const presenter: any = this;
    const handlerIndex = +handler.data('index');
    const value = this.model.values[handlerIndex];
    const percentage = this.getPercentage(value);

    presenter.view
      .changeHandlerPosition(handler, percentage)
      .changeConnectorPosition(handlerIndex, percentage)
      .changeResultText(`${this.model.values.toString()}`);

    handler.on('mousedown', function(e) {
      e.preventDefault();
      if (e.which == 1) {
        $(window).on('mousemove', function(e2) {
          presenter.changePosition($(e.target), e2.clientX);
        });
        $(window).on('mouseup', function(e2) {
          if (e2.which == 1) {
            $(this).off('mousemove mouseup');
          }
        });
      }
    });

    handler.on('touchstart', function(e) {
      e.preventDefault();
      $(window).on('touchmove', function(e2) {
        presenter.changePosition($(e.target), e2.touches[0].clientX);
      });
      $(window).on('touched', function() {
        $(this).off('touchmove touched');
      });
    });
  }
}

export default Presenter;
