import * as slider from '../types/slider';
import Presenter from './presenter';

class View {
  public settings: slider.Settings;

  public elements: slider.Elements = {
    wrapper: $('<div class="js-slider"></div>'),
    base: $('<div class="js-slider__base"></div>'),
    handlers: [$('<button type="button" class="js-slider__handler"></button>')],
    connector: $('<div class="js-slider__connector"></div>'),
    result: $('<div class="js-slider__result">undefined</div>')
  };

  private methodsToElements: slider.MethodsToElements = {
    wrapper: [this.addWrapperClass, this.removeWrapperClass],
    base: [this.addBaseClass, this.removeBaseClass],
    handler: [this.addHandlerClass, this.removeHandlerClass],
    connector: [this.addConnectorClass, this.removeConnectorClass]
  };

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
    this.elements.connector.addClass(className);
    return this;
  }

  public removeConnectorClass(className: string): View {
    this.elements.connector.removeClass(className);
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

  public initHandlers(presenter: Presenter, func: Function): View {
    const startValue = presenter.model.settings.startValue;
    if (startValue.length > 1) {
      startValue.forEach((value, index) => {
        if (index > 0) {
          this.elements.handlers.push(this.elements.handlers[index - 1].clone());
        }
        this.elements.handlers[index].data('index', index);
      });

      this.elements.base.append(this.elements.handlers);
      if (this.elements.handlers.length % 2 === 0) {
        this.elements.base.prepend(this.elements.connector);
      }

      this.elements.handlers.forEach(handler => {
        func.call(presenter, handler);
      });
    } else {
      this.elements.handlers[0].data('index', 0);
      this.elements.base.append(this.elements.handlers[0]);
      func.call(presenter, this.elements.handlers[0]);
    }

    return this;
  }

  public changeHandlerPosition(handler: JQuery<HTMLElement>, percentage: number): View {
    handler.data('percentage', percentage);
    handler.css('left', `calc(${percentage}% - 2px`);
    return this;
  }

  public changeConnectorPosition(handlerIndex: number, percentage: number): View {
    if (this.elements.handlers.length % 2 == 0) {
      const pairedHandlerIndex = handlerIndex % 2 === 0 ? handlerIndex + 1 : handlerIndex - 1;
      const pairedPercentage = this.elements.handlers[pairedHandlerIndex].data('percentage');
      if (pairedPercentage > percentage) {
        this.elements.connector.css('left', `${percentage}%`);
        this.elements.connector.css('right', `${100 - pairedPercentage}%`);
      } else {
        this.elements.connector.css('left', `${pairedPercentage}%`);
        this.elements.connector.css('right', `${100 - percentage}%`);
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
