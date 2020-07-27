import View from '../view';
import events from '../mixins/eventsMixin';
import { Settings } from '../../types/slider';

class BasicElementView {
  private _eventHandlers: Object = {};
  public exec: Function;
  public on: Function;
  public off: Function;

  public parent: JQuery<HTMLElement>;
  public element: JQuery<HTMLElement>;
  public view: View;

  constructor(
    view: View,
    element: JQuery<HTMLElement>,
    parent: JQuery<HTMLElement> | undefined = undefined,
    initCallback: Function = BasicElementView.basicInit
  ) {
    this.element = element;
    this.parent = parent;
    this.view = view;
    initCallback(this);
  }

  get settings(): Settings {
    return this.view.settings;
  }

  public trigger(eventType: string, args?: any) {
    this.exec(eventType, args);
    this.view.trigger(eventType, args);
  }

  public addClass(className: string): any {
    this.element.addClass(className);
    return this;
  }

  public css(
    propertyName: string,
    value_function:
      | string
      | number
      | ((this: HTMLElement, index: number, value: string) => string | number | void)
  ): any {
    this.element.css(propertyName, value_function);
    return this;
  }

  public static basicInit(that: BasicElementView): void {
    if (that.parent) that.parent.append(that.element);
  }
}

Object.assign(BasicElementView.prototype, events);

export default BasicElementView;
