import * as slider from '../types/slider';

class View {
  public elements: slider.Elements = {
    wrapper: $('<div class="js-slider"></div>'),
    base: $('<div class="js-slider__base"></div>'),
    handlers: [$('<div class="js-slider__handler"></div>')],
    connector: $('<div class="js-slider__connector"></div>')
  };

  private methodsToElements: slider.MethodsToElements = {
    wrapper: [this.addWrapperClass, this.removeWrapperClass],
    base: [this.addBaseClass, this.removeBaseClass],
    handler: [this.addHandlerClass, this.removeHandlerClass],
    connector: [this.addConnectorClass, this.removeConnectorClass]
  };

  constructor() {
    this.elements.wrapper.append(this.elements.base);
    this.elements.base.append(this.elements.connector);
    this.elements.base.append(...this.elements.handlers);
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
}

export default View;
