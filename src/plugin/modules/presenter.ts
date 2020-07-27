import { Model, Align } from './model';
import View from './view';
import events from './mixins/eventsMixin';
import $ from 'jquery';
import HandlerView from './subViews/handlerView';

class Presenter {
  private _eventHandlers: Object = {};
  public exec: Function;
  public on: Function;
  public off: Function;

  public model: Model;
  public view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.view.presenter = this;
    this.on('handlerMoved', function(handler: HandlerView, coords: number) {
      const value = this.model.getValue(coords, this.view.elements.base),
        percentage = this.view.getPercentage(value);
      this.model.values[handler.index] = value;
      handler.update(percentage, value);
      if (view.elements.result) {
        view.elements.result.update(this.model.formattedValues);
      }
    });
    this.on('handlerEnd', function() {
      if (view.elements.input) {
        view.elements.input.update(this.model.sortedValues);
      }
    });
  }

  public trigger(eventType: string, ...args: any) {
    this.exec(eventType, ...args);
  }
}

Object.assign(Presenter.prototype, events);

export default Presenter;
