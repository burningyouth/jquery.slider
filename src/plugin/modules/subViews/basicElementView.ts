import View from '../view';
import events from '../mixins/eventsMixin';
import { Settings } from '../../types/slider';
import $ from 'jquery';

class BasicElementView {
  private _eventHandlers: Object = {};
  protected _view: View;

  public exec: Function;
  public on: Function;
  public off: Function;

  public parent: JQuery<HTMLElement>;
  public element: JQuery<HTMLElement>;

  constructor(
    view: View,
    element: JQuery<HTMLElement>,
    parent: JQuery<HTMLElement> | undefined = undefined,
    initCallback: Function = BasicElementView.basicInit
  ) {
    this.element = element;
    this.parent = parent;
    this._view = view;
    initCallback(this);
  }

  get settings(): Settings {
    return this._view.settings;
  }

  public removeClass(className: string): any {
    this.element.removeClass(className);
    return this;
  }

  public addClass(className: string): any {
    this.element.addClass(className);
    return this;
  }

  public css(
    propertyName: string,
    value_function?:
      | string
      | number
      | ((this: HTMLElement, index: number, value: string) => string | number | void)
  ): any {
    if (value_function) {
      this.element.css(propertyName, value_function);
      return this;
    } else {
      return this.element.css(propertyName);
    }
  }

  public remove(): void {
    this.element.remove();
  }

  public static basicInit(that: BasicElementView): void {
    if (that.parent) that.parent.append(that.element);
  }
}

Object.assign(BasicElementView.prototype, events);

export default BasicElementView;
