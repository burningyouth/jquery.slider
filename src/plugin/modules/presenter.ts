import Model from './model';
import { Values, Settings } from '../types/slider';
import View from './view';
import HandlerView from './subViews/handlerView';
import events from './mixins/eventsMixin';
import $ from 'jquery';
import BaseView from './subViews/baseView';
import MarkView from './subViews/markView';

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
    view.valueFromPercentage = model.valueFromPercentage;
    this.on('handlerMoved', function(handler: HandlerView, coords: number) {
      const value = model.valueFromCoords(coords),
        percentage = view.getPercentage(value);
      model.values[handler.index] = value;
      handler.update(percentage, value);
      if (view.elements.result) {
        view.elements.result.update(model.formattedValues);
      }
      this.trigger('valueUpdated');
      this.trigger('sliderUpdated');
    });

    this.on('handlerEnd', function() {
      if (view.elements.input) view.elements.input.update(model.sortedValues);
      this.trigger('sliderEnd');
    });

    if (model.settings.clickableBase && !model.settings.showMarks) {
      this.on('baseClicked connectorClicked progressBarClicked', function(
        base: BaseView,
        coords: number
      ) {
        const value = model.valueFromCoords(coords),
          percentage = view.getPercentage(value),
          nearestHandler = view.nearestHandler(percentage);
        if (nearestHandler) {
          nearestHandler.focus = true;
          model.values[nearestHandler.index] = value;
          this.trigger('valueUpdated');
          this.trigger('valueEnd');
        }
      });
    }

    if (model.settings.clickableMark && model.settings.showMarks) {
      this.on('markClicked', function(mark: MarkView) {
        const value = model.valueFromPercentage(mark.percentage),
          nearestHandler = view.nearestHandler(mark.percentage);
        if (nearestHandler) {
          nearestHandler.focus = true;
          model.values[nearestHandler.index] = value;
          this.trigger('valueUpdated');
          this.trigger('valueEnd');
        }
      });
    }

    this.on('settingsEnd', function() {
      view.reset();
    });

    this.on('valueEnd', function() {
      view.elements.input.update(model.sortedValues);
      if (view.elements.result) {
        view.elements.result.update(model.formattedValues);
      }
      view.elements.handlers.forEach((handler: HandlerView, index: number) => {
        const value = model.values[index];
        handler.update(view.getPercentage(value), value);
      });
      this.trigger('sliderUpdated');
      this.trigger('sliderEnd');
    });
  }

  get base(): BaseView {
    return this._view.elements.base;
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
