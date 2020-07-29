import Model from './model';
import { Values, Settings } from '../types/slider';
import View from './view';
import HandlerView from './subViews/handlerView';
import events from './mixins/eventsMixin';
import $ from 'jquery';
import BaseView from './subViews/baseView';

class Presenter {
  private _eventHandlers: Object = {};
  public exec: Function;
  public on: Function;
  public off: Function;

  private _model: Model;
  private _view: View;

  constructor(model: Model, view: View) {
    this._model = model;
    this._model.presenter = this;
    this._view = view;
    this._view.presenter = this;
    this.on('handlerMoved', function(handler: HandlerView, coords: number) {
      const value = model.getValue(coords, view.elements.base),
        percentage = view.getPercentage(value);
      model.values[handler.index] = value;
      handler.update(percentage, value);
      if (view.elements.result) {
        view.elements.result.update(model.formattedValues);
      }
    });
    this.on('handlerEnd', function() {
      if (view.elements.input) view.elements.input.update(model.sortedValues);
    });
    this.on('modelSettingsUpdated', function() {
      view.update();
    });
    this.on('modelValueChanged', function() {
      view.elements.input.update(model.sortedValues);
      if (view.elements.result) {
        view.elements.result.update(model.formattedValues);
      }
      view.elements.handlers.forEach((handler: HandlerView, index: number) => {
        const value = model.values[index];
        handler.update(view.getPercentage(value), value);
      });
    });
    this.on('baseClicked', function(base: BaseView, coords: number) {
      const value = model.getValue(coords, view.elements.base),
        percentage = view.getPercentage(value);
      let nearestHandler: HandlerView = view.elements.handlers[0];
      if (view.elements.handlers.length > 1) {
        let lastDif: number = 100,
          dif: number;
        view.elements.handlers.forEach(item => {
          item.focus = false;
          dif = Math.abs(item.percentage - percentage);
          if (lastDif > dif) {
            nearestHandler = item;
            lastDif = dif;
          }
        });
      }
      if (nearestHandler) {
        nearestHandler.focus = true;
        model.values[nearestHandler.index] = value;
        this.trigger('modelValueChanged');
      }
    });
  }

  get values(): Values {
    return this._model.values;
  }

  get sortedValues(): Values {
    return this._model.sortedValues;
  }

  get formattedValues(): string {
    return this._model.formattedValues;
  }

  get settings(): Settings {
    return this._model.settings;
  }

  set settings(newSettings: Settings) {
    this._model.settings = newSettings;
  }

  set values(newValues: Values) {
    this._model.values = newValues;
  }

  public trigger(eventType: string, ...args: any) {
    this.exec(eventType, ...args);
  }
}

Object.assign(Presenter.prototype, events);

export default Presenter;
