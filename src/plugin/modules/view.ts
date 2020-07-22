import * as slider from '../types/slider';
import Presenter from './presenter';
import { Align } from './model';

class View {
  public settings: slider.Settings; //настройки из модели
  public input: JQuery<HTMLElement>; //поле, в которое записывается значения ползунков

  public elements: slider.Elements = {
    wrapper: $('<div class="js-slider"></div>'), //обертка
    base: $('<div class="js-slider__base"></div>'), //элемент, по которому перемещается ползунок
    handlers: [$('<span class="js-slider__handler"></span>')], //ползунок
    connectors: [$('<div class="js-slider__connector"></div>')], //элемент, соединяющий ползунки
    result: $('<div class="js-slider__result">undefined</div>') //элемент с результатами
  };

  constructor() {
    this.elements.wrapper.append(this.elements.base);
    this.elements.wrapper.append(this.elements.result);
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
        throw new Error(`View: There is no ${obj[key]} element!`);
      }
    });
    return this;
  }

  public init(presenter: Presenter, callback: Function): View {
    this.settings = presenter.model.settings;
    if (this.settings.align === Align.vertical) {
      this.elements.wrapper.addClass('js-slider_vertical');
    }
    if (this.settings.startValues.length > 1) {
      //если количество значений больше одного, то нужно создать новые ползунки и коннекторы (если они нужны)
      this.settings.startValues.forEach((value, index) => {
        if (index > 0) {
          this.elements.handlers.push(this.elements.handlers[index - 1].clone());
        }
        this.elements.handlers[index].data('index', index);

        if (this.settings.range) {
          const connectorIndex = Math.floor(index / 2);
          if (index % 2 === 0 && index > 1) {
            this.elements.connectors.push(this.elements.connectors[connectorIndex - 1].clone());
          }
          this.elements.connectors[connectorIndex].data('index', connectorIndex);
          this.elements.handlers[index].data('pairedConnector', connectorIndex);
        }
      });

      this.elements.base.append(this.elements.handlers);
      if (this.elements.handlers.length % 2 === 0 && this.settings.range) {
        this.elements.base.prepend(this.elements.connectors);
      }

      this.elements.handlers.forEach(handler => {
        callback.call(presenter, handler); //вызываем колбэк для каждого ползунка c this == presenter
      });
    } else {
      this.elements.handlers[0].data('index', 0);
      this.elements.base.append(this.elements.handlers[0]);
      callback.call(presenter, this.elements.handlers[0]); //вызываем колбэк для одного ползунка
    }

    return this;
  }

  public changeHandlerPosition(handler: JQuery<HTMLElement>, percentage: number): View {
    //менеяем позицию ползунка в процентах от ширины base
    handler.data('percentage', percentage);
    handler.css('left', `calc(${percentage}% - 2px`);
    return this;
  }

  public changeConnectorPosition(handler: JQuery<HTMLElement>, percentage: number): View {
    //меняем позицию коннектора в зависимости от положения спаренных ползунков
    if (this.elements.handlers.length % 2 === 0 && this.settings.range) {
      const handlerIndex = +handler.data('index');
      const pairedHandlerIndex = handlerIndex % 2 === 0 ? handlerIndex + 1 : handlerIndex - 1;
      const pairedPercentage = this.elements.handlers[pairedHandlerIndex].data('percentage');
      const pairedConnectorIndex = +handler.data('pairedConnector');

      if (pairedPercentage > percentage) {
        this.elements.connectors[pairedConnectorIndex].css('left', `${percentage}%`);
        this.elements.connectors[pairedConnectorIndex].css('right', `${100 - pairedPercentage}%`);
      } else {
        this.elements.connectors[pairedConnectorIndex].css('left', `${pairedPercentage}%`);
        this.elements.connectors[pairedConnectorIndex].css('right', `${100 - percentage}%`);
      }
    }

    return this;
  }

  public changeResultText(text: string): View {
    this.elements.result.text(text);
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
