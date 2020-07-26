import * as slider from '../types/slider';
import Presenter from './presenter';
import { Align } from './model';
import $ from 'jquery';

class View {
  public input: JQuery<HTMLElement>; //поле, в которое записывается значения ползунков
  public presenter: Presenter;

  public elements: slider.Elements = {
    wrapper: $('<div class="js-slider"></div>'), //обертка
    base: $('<div class="js-slider__base"></div>'), //элемент, по которому перемещается ползунок
    baseWrapper: $('<div class="js-slider__base-wrapper"></div>'), //обертка базы
    bounds: [
      $('<div class="js-slider__bound">undef.</div>'),
      $('<div class="js-slider__bound">undef.</div>')
    ],
    handlers: [$('<span class="js-slider__handler"></span>')], //ползунок
    tooltips: [$('<span class="js-slider__tooltip">undef.</span>')], //тултип со значением ползунка
    connectors: [$('<div class="js-slider__connector"></div>')], //элемент, соединяющий ползунки
    result: $('<div class="js-slider__result">undef.</div>') //элемент с результатами
  };

  constructor(input: JQuery<HTMLElement>) {
    this.input = input;

    this.elements.parent = input.parent(); //зопоминаем, где находилось поле
    input.remove(); //удаляем поле и снова добавляем его уже во внутрь обертки слайдера
    input.prependTo(this.elements.wrapper);

    this.elements.wrapper.appendTo(this.elements.parent); //добавляем обертку туда же, где поле находилось
    this.elements.wrapper.append(this.elements.baseWrapper);
    this.elements.baseWrapper.append(this.elements.base);
  }

  get settings(): slider.Settings {
    return this.presenter.model.settings;
  }

  public addClasses(obj: slider.AdditionalClasses): View {
    //добавляем дополнительные классы для элементов
    Object.keys(obj).forEach((key: keyof slider.AdditionalClasses) => {
      if (this.elements[key]) {
        if (Array.isArray(this.elements[key])) {
          (this.elements[key] as Array<JQuery<HTMLElement>>).forEach(element => {
            element.addClass(obj[key]);
          });
        } else {
          (this.elements[key] as JQuery<HTMLElement>).addClass(obj[key]);
        }
      } else {
        throw {
          name: 'ViewError',
          message: `There is no ${key} element!`
        };
      }
    });
    return this;
  }

  public init(callback: Function): View {
    this.addClasses(this.settings.additionalClasses);
    if (this.settings.showBounds) {
      this.elements.bounds[0].text(this.settings.min);
      this.elements.bounds[1].text(this.settings.max);
      this.elements.baseWrapper.prepend(this.elements.bounds[0]);
      this.elements.baseWrapper.append(this.elements.bounds[1]);
    }

    if (this.settings.showResult) {
      this.elements.wrapper.append(this.elements.result);
    }

    if (this.settings.align === Align.vertical) {
      this.elements.wrapper.addClass('js-slider_vertical');
      if (this.settings.tooltipReverse && this.settings.showTooltip) {
        this.elements.tooltips[0].addClass('js-slider__tooltip_left');
      }
    } else if (this.settings.tooltipReverse && this.settings.showTooltip) {
      this.elements.tooltips[0].addClass('js-slider__tooltip_bottom');
    }

    if (this.settings.startValues.length) {
      //если количество значений больше одного, то нужно создать новые ползунки и коннекторы (если они нужны)
      this.settings.startValues.forEach((value, index) => {
        if (index > 0) {
          this.elements.handlers.push(this.elements.handlers[0].clone());
          if (this.settings.handlersColors[index]) {
            this.elements.handlers[index].css(
              'background-color',
              this.settings.handlersColors[index]
            );
          }
          if (this.settings.showTooltip) {
            this.elements.tooltips.push(this.elements.tooltips[0].clone());
            this.elements.handlers[index].append(this.elements.tooltips[index]);
          }
        }
        this.elements.handlers[index].data('index', index);

        if (this.settings.range) {
          const connectorIndex = Math.floor(index / 2);
          if (index % 2 === 0 && index > 1) {
            this.elements.connectors.push(this.elements.connectors[0].clone());
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
          this.elements.connectors[connectorIndex].data('index', connectorIndex);
          this.elements.handlers[index].data('pairedConnector', connectorIndex);
        }
      });

      if (this.settings.showTooltip) {
        this.elements.handlers[0].append(this.elements.tooltips[0]);
      }
      if (this.settings.handlersColors[0]) {
        this.elements.handlers[0].css('background-color', this.settings.handlersColors[0]);
      }
      if (this.settings.connectorsColors[0]) {
        this.elements.connectors[0].css('background-color', this.settings.connectorsColors[0]);
      } else if (this.settings.handlersColors[0]) {
        this.elements.connectors[0].css('background-color', this.settings.handlersColors[0]);
      }
      this.elements.base.append(this.elements.handlers);

      if (this.elements.handlers.length % 2 === 0 && this.settings.range) {
        this.elements.base.prepend(this.elements.connectors);
      }

      this.elements.handlers.forEach(handler => {
        callback.call(this.presenter, handler); //вызываем колбэк для каждого ползунка c this == this.presenter
      });
    } else {
      this.elements.handlers[0].data('index', 0);
      if (this.settings.handlersColors[0]) {
        this.elements.handlers[0].css('background-color', this.settings.handlersColors[0]);
      }
      if (this.settings.showTooltip) {
        this.elements.handlers[0].append(this.elements.tooltips[0]);
      }
      this.elements.base.append(this.elements.handlers[0]);
      callback.call(this.presenter, this.elements.handlers[0]); //вызываем колбэк для одного ползунка
    }

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

  public changeHandlerPosition(handler: JQuery<HTMLElement>, percentage: number): View {
    //менеяем позицию ползунка в процентах от ширины base
    handler.data('percentage', percentage);
    if (this.settings.align === Align.vertical) {
      handler.css('top', `calc(${percentage}% - 7.5px`);
    } else {
      handler.css('left', `calc(${percentage}% - 7.5px`);
    }
    return this;
  }

  public changeConnectorPosition(handler: JQuery<HTMLElement>, percentage: number): View {
    //меняем позицию коннектора в зависимости от положения спаренных ползунков
    if (this.elements.handlers.length % 2 === 0 && this.settings.range) {
      const handlerIndex = +handler.data('index');
      const pairedHandlerIndex = handlerIndex % 2 === 0 ? handlerIndex + 1 : handlerIndex - 1;
      const pairedPercentage = this.elements.handlers[pairedHandlerIndex].data('percentage');
      const pairedConnectorIndex = +handler.data('pairedConnector');

      if (this.settings.align === Align.vertical) {
        if (pairedPercentage > percentage) {
          this.elements.connectors[pairedConnectorIndex].css('top', `${percentage}%`);
          this.elements.connectors[pairedConnectorIndex].css(
            'bottom',
            `${100 - pairedPercentage}%`
          );
        } else {
          this.elements.connectors[pairedConnectorIndex].css('top', `${pairedPercentage}%`);
          this.elements.connectors[pairedConnectorIndex].css('bottom', `${100 - percentage}%`);
        }
      } else {
        if (pairedPercentage > percentage) {
          this.elements.connectors[pairedConnectorIndex].css('left', `${percentage}%`);
          this.elements.connectors[pairedConnectorIndex].css('right', `${100 - pairedPercentage}%`);
        } else {
          this.elements.connectors[pairedConnectorIndex].css('left', `${pairedPercentage}%`);
          this.elements.connectors[pairedConnectorIndex].css('right', `${100 - percentage}%`);
        }
      }
    }

    return this;
  }

  public changeResultText(text: string): View {
    if (this.settings.showResult === true) {
      this.elements.result.text(text);
    }
    return this;
  }

  public changeTooltipText(handlerIndex: number, value: number): View {
    if (this.settings.showTooltip) {
      this.elements.tooltips[handlerIndex].text(value);
    }
    return this;
  }

  public updateInput(values: slider.Values): View {
    this.input.attr(
      'value',
      JSON.stringify({
        value: values
      })
    );
    return this;
  }
}

export default View;
