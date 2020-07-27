import { Model, Align } from './model';
import View from './view';
import events from './mixins/eventsMixin';
import $ from 'jquery';

class Presenter {
  private _eventHandlers: Object = {};
  public exec: Function;
  public on: Function;
  public off: Function;

  public model: Model;
  public view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.view.presenter = this;
  }

  public init(): void {
    //инициализация view добавляет ползунки и коннекторы (если нужны) и вызывает колбэк для каждого ползунка
    this.view.init(() => {});
  }

  /*public changePosition(handler: JQuery<HTMLElement>, coords: number): Presenter {
    //изменение положения ползунка запускает изменение view и model, отдавая им сформированные значения
    //для view - проценты, для model - числовые значения
    const value = this.model.getValue(coords, this.view.elements.base);
    const percentage = this.view.getPercentage(value);
    const handlerIndex = +handler.data('index');

    this.model.values[handlerIndex] = value;

    this.view
      .changeHandlerPosition(handler, percentage)
      .changeConnectorPosition(handler, percentage)
      .changeResultText(this.model.formattedValues)
      .changeTooltipText(handlerIndex, value);

    return this;
  }

  public handlersCallback(handler: JQuery<HTMLElement>): void {
    //колбэк, который вызывается при инициализации каждого ползунка во view
    const presenter: any = this, //внутри событий презентер будет недоступен
      handlerIndex = +handler.data('index'),
      value = this.model.values[handlerIndex],
      percentage = this.view.getPercentage(value);

    this.view
      .changeHandlerPosition(handler, percentage)
      .changeConnectorPosition(handler, percentage)
      .changeResultText(this.model.formattedValues)
      .updateInput(this.model.sortedValues)
      .changeTooltipText(handlerIndex, value);

    handler.on('mousedown', function(e) {
      e.preventDefault();
      if (e.which == 1) {
        handler.addClass('js-slider__handler_active');
        $(window).on('mousemove', function(e2) {
          const mouseCords =
            presenter.model.settings.align === Align.horizontal ? e2.clientX : e2.clientY;
          presenter.changePosition($(e.target), mouseCords);
        });
        $(window).on('mouseup', function(e2) {
          if (e2.which == 1) {
            handler.removeClass('js-slider__handler_active');
            $(this).off('mousemove mouseup');
            presenter.view.updateInput(presenter.model.sortedValues);
          }
        });
      }
    });

    handler.on('touchstart', function(e) {
      e.preventDefault();
      $(window).on('touchmove', function(e2) {
        const touchCords =
          presenter.model.settings.align === Align.horizontal
            ? e2.touches[0].clientX
            : e2.touches[0].clientY;
        presenter.changePosition($(e.target), touchCords);
      });
      $(window).on('touchend', function() {
        $(this).off('touchmove touched');
        presenter.view.updateInput(presenter.model.sortedValues);
      });
    });
  }*/

  public trigger(eventType: string, args?: any) {
    this.exec(eventType, args);
    this.model.trigger(eventType, args);
  }
}

Object.assign(Presenter.prototype, events);

export default Presenter;
