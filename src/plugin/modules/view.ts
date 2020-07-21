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

  private methodsToElements: slider.MethodsToElements = {
    wrapper: [this.addWrapperClass, this.removeWrapperClass],
    base: [this.addBaseClass, this.removeBaseClass],
    handler: [this.addHandlerClass, this.removeHandlerClass],
    connector: [this.addConnectorClass, this.removeConnectorClass]
  };

  public range: boolean;
  public startValues: slider.Values;

  constructor() {
    this.elements.wrapper.append(this.elements.base);
    this.elements.wrapper.append(this.elements.result);
  }

  public addWrapperClass(className: string): View {
    this.elements.wrapper.addClass(className);
    return this;
  }

  public removeWrapperClass(className: string): View {
    this.elements.wrapper.removeClass(className);
    return this;
  }

  public addBaseClass(className: string): View {
    this.elements.base.addClass(className);
    return this;
  }

  public removeBaseClass(className: string): View {
    this.elements.base.removeClass(className);
    return this;
  }

  public addHandlerClass(className: string): View {
    this.elements.handlers.forEach(handler => handler.addClass(className));
    return this;
  }

  public removeHandlerClass(className: string): View {
    this.elements.handlers.forEach(handler => handler.removeClass(className));
    return this;
  }

  public addConnectorClass(className: string): View {
    this.elements.connectors.forEach(connector => connector.addClass(className));
    return this;
  }

  public removeConnectorClass(className: string): View {
    this.elements.connectors.forEach(connector => connector.removeClass(className));
    return this;
  }

  public addClasses(obj: slider.AdditionalClasses): View {
    Object.keys(obj).forEach((key: keyof slider.AdditionalClasses) => {
      if (this.methodsToElements[key]) {
        this.methodsToElements[key][0].call(this, obj[key]);
      } else {
        throw new Error(`Method to add ${obj[key]} not found!`);
      }
    });
    return this;
  }

  public removeClasses(obj: slider.AdditionalClasses): View {
    Object.keys(obj).forEach((key: keyof slider.AdditionalClasses) => {
      if (this.methodsToElements[key]) {
        this.methodsToElements[key][1].call(this, obj[key]);
      } else {
        throw new Error(`Method to remove ${obj[key]} not found!`);
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
