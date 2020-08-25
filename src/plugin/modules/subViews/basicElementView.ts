import $ from 'jquery';

import View from '../view';
import events from '../mixins/eventsMixin';
import { Settings } from '../../types/slider';

class BasicElementView {
  private _eventHandlers: Object = {};
  protected _view: View;

  public exec: Function;
  public on: Function;
  public off: Function;

  public $parent: JQuery<HTMLElement>;
  public $element: JQuery<HTMLElement>;

  constructor(
    view: View,
    $element: JQuery<HTMLElement>,
    $parent: JQuery<HTMLElement> | undefined = undefined,
  ) {
    this.$element = $element;
    this.$parent = $parent;
    this._view = view;
    this.init();
  }

  get settings(): Settings {
    return this._view.settings;
  }

  public removeClass(className: string): any {
    this.$element.removeClass(className);
    return this;
  }

  public addClass(className: string): any {
    this.$element.addClass(className);
    return this;
  }

  public remove(): void {
    this.$element.remove();
  }

  public init(): void {
    if (this.$parent) this.$parent.append(this.$element);
  }
}

Object.assign(BasicElementView.prototype, events);

export default BasicElementView;
