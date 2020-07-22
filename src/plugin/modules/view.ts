import * as slider from '../types/slider';
import Presenter from './presenter';

class View {
  public settings: slider.Settings;

  public elements: slider.Elements = {
    wrapper: $('<div class="js-slider"></div>'),
    base: $('<div class="js-slider__base"></div>'),
    handlers: [$('<button type="button" class="js-slider__handler"></button>')],
    connectors: [$('<div class="js-slider__connector"></div>')],
    result: $('<div class="js-slider__result">undefined</div>')
  };

  public range: boolean;
  public startValues: slider.Values;

  constructor() {
    this.elements.wrapper.append(this.elements.base);
    this.elements.wrapper.append(this.elements.result);
  }

  public addClasses(obj: slider.AdditionalClasses): View {
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
        throw new Error(`There is no ${obj[key]} element!`);
      }
    });
    return this;
  }

  public removeClasses(obj: slider.AdditionalClasses): View {
    Object.keys(obj).forEach((key: keyof slider.AdditionalClasses) => {
      if (this.elements[key]) {
        if (Array.isArray(this.elements[key])) {
          (this.elements[key] as Array<JQuery<HTMLElement>>).forEach(element => {
            element.removeClass(obj[key]);
          });
        } else {
          (this.elements[key] as JQuery<HTMLElement>).removeClass(obj[key]);
        }
      } else {
        throw new Error(`There is no ${obj[key]} element!`);
      }
    });
    return this;
  }

  public init(presenter: Presenter, callback: Function): View {
    this.startValues = presenter.model.settings.startValues;
    this.range = presenter.model.settings.range;
    if (this.startValues.length > 1) {
      this.startValues.forEach((value, index) => {
        if (index > 0) {
          this.elements.handlers.push(this.elements.handlers[index - 1].clone());
        }
        this.elements.handlers[index].data('index', index);

        if (this.range) {
          const connectorIndex = Math.floor(index / 2);
          if (index % 2 === 0 && index > 1) {
            this.elements.connectors.push(this.elements.connectors[connectorIndex - 1].clone());
          }
          this.elements.connectors[connectorIndex].data('index', connectorIndex);
          this.elements.handlers[index].data('pairedConnector', connectorIndex);
        }
      });

      this.elements.base.append(this.elements.handlers);
      if (this.elements.handlers.length % 2 === 0 && this.range) {
        this.elements.base.prepend(this.elements.connectors);
      }

      this.elements.handlers.forEach(handler => {
        callback.call(presenter, handler);
      });
    } else {
      this.elements.handlers[0].data('index', 0);
      this.elements.base.append(this.elements.handlers[0]);
      callback.call(presenter, this.elements.handlers[0]);
    }

    return this;
  }

  public changeHandlerPosition(handler: JQuery<HTMLElement>, percentage: number): View {
    handler.data('percentage', percentage);
    handler.css('left', `calc(${percentage}% - 2px`);
    return this;
  }

  public changeConnectorPosition(handler: JQuery<HTMLElement>, percentage: number): View {
    if (this.elements.handlers.length % 2 == 0 && this.range) {
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
}

export default View;
