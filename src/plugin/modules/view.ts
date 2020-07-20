import * as slider from '../types/slider';

class View {
  public settings: slider.Settings;

  public elements: slider.Elements = {
    wrapper: $('<div class="js-slider"></div>'),
    base: $('<div class="js-slider__base"></div>'),
    handlers: [$('<button type="button" class="js-slider__handler"></button>')],
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

  public initHandlers(func: Function): View {
    if (Array.isArray(this.settings.startValue) && this.settings.startValue.length > 1) {
      this.settings.startValue.forEach((value, index) => {
        if (index > 0) {
          this.elements.handlers[index] = this.elements.handlers[index - 1];
        }
      });
    }
    this.elements.base.append(...this.elements.handlers);

    this.elements.handlers.forEach(handler => {
      func.call(this, handler);
    });

    return this;
  }

  public changeHandlerValue(handler: JQuery<HTMLElement>, value: any): View {
    const pos = ((value - this.elements.base.offset().left) / this.elements.base.width()) * 100;
    if (pos >= 0 && pos <= 100) {
      handler.css('left', `calc(${pos}% - 2px`);
    } else if (pos < 0) {
      handler.css('left', 'calc(0% - 2px)');
    } else {
      handler.css('left', 'calc(100% - 2px)');
    }
    return this;
  }

  public changeHandlerPosition(handler: JQuery<HTMLElement>, posX: number): View {
    const pos = ((posX - this.elements.base.offset().left) / this.elements.base.width()) * 100;
    if (pos >= 0 && pos <= 100) {
      handler.css('left', `calc(${pos}% - 2px`);
    } else if (pos < 0) {
      handler.css('left', 'calc(0% - 2px)');
    } else {
      handler.css('left', 'calc(100% - 2px)');
    }
    return this;
  }

  public changeConnectorPosition(posX: number): View {
    const pos = ((posX - this.elements.base.offset().left) / this.elements.base.width()) * 100;
    if (pos >= 0 && pos <= 100) {
      this.elements.connector.css('width', `${pos}%`);
    } else if (pos < 0) {
      this.elements.connector.css('width', `0%`);
    } else {
      this.elements.connector.css('width', `100%`);
    }
    return this;
  }
}

export default View;
