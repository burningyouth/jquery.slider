import { Model, Align } from './model';
import View from './view';

class Presenter {
  public model: Model;
  public view: View;

  constructor(input: JQuery<HTMLElement>, model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.view.input = input;

    this.view.elements.parent = input.parent(); //зопоминаем, где находилось поле
    input.remove(); //удаляем поле и снова добавляем его уже во внутрь обертки слайдера
    input.prependTo(this.view.elements.wrapper);

    this.view.elements.wrapper.appendTo(view.elements.parent); //добавляем обертку туда же, где поле находилось
    this.view.addClasses(this.model.settings.additionalClasses);
  }

  public init(): void {
    //инициализация view добавляет ползунки и коннекторы (если нужны) и вызывает колбэк для каждого ползунка
    this.view.init(this, this.handlersCallback);
  }

  public getValue(coords: number): number {
    //возвращает значение ползунка в зависимости от min, max, ширины базы, положения мыши, положения базы и настроек слайдера
    const settings = this.model.settings;
    const base = this.view.elements.base;
    const roundTo = 10 ** settings.roundTo;

    let value: number, devider: number, startCoords: number;
    if (settings.align === Align.vertical) {
      devider = base.height();
      startCoords = base[0].getBoundingClientRect().top;
    } else {
      devider = base.width();
      startCoords = base[0].getBoundingClientRect().left;
    }

    value = (coords - startCoords) / devider;
    value *= settings.max - settings.min;
    value = settings.min + Math.floor(value / settings.step + 0.5) * settings.step; //форматируется значение в зависимости от step
    value = roundTo ? Math.floor(value * roundTo) / roundTo : value; //округление числа до roundTo

    if (value >= settings.min && value <= settings.max) {
      //если значение не попадает в границы, то мы берем за значение эти границы
      return value;
    } else if (value > settings.max) {
      return settings.max;
    }
    return settings.min;
  }

  public getPercentage(value: number): number {
    //возвращает процентное соотношение value от min, max
    const settings = this.model.settings;
    const percentage = ((value - settings.min) / (settings.max - settings.min)) * 100;
    if (percentage >= 0 && percentage <= 100) {
      return percentage;
    } else if (percentage > 100) {
      return 100;
    }
    return 0;
  }

  public changePosition(handler: JQuery<HTMLElement>, coords: number): Presenter {
    //изменение положения ползунка запускает изменение view и model, отдавая им сформированные значения
    //для view - проценты, для model - числовые значения
    const value = this.getValue(coords);
    const percentage = this.getPercentage(value);
    const handlerIndex = +handler.data('index');

    this.model.values[handlerIndex] = value;

    this.view
      .changeHandlerPosition(handler, percentage)
      .changeConnectorPosition(handler, percentage)
      .changeResultText(this.model.formattedValues);

    return this;
  }

  public handlersCallback(handler: JQuery<HTMLElement>): void {
    //колбэк, который вызывается при инициализации каждого ползунка во view
    const presenter: any = this; //внутри событий презентер будет недоступен

    const handlerIndex = +handler.data('index');
    const value = this.model.values[handlerIndex];
    const percentage = this.getPercentage(value);

    this.view
      .changeHandlerPosition(handler, percentage)
      .changeConnectorPosition(handler, percentage)
      .changeResultText(this.model.formattedValues)
      .updateInput(this.model.sortedValues);

    handler.on('mousedown', function(e) {
      e.preventDefault();
      if (e.which == 1) {
        $(window).on('mousemove', function(e2) {
          const mouseCords =
            presenter.model.settings.align === Align.horizontal ? e2.clientX : e2.clientY;
          presenter.changePosition($(e.target), mouseCords);
        });
        $(window).on('mouseup', function(e2) {
          if (e2.which == 1) {
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
  }
}

export default Presenter;
