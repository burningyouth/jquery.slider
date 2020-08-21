import Model from './model';
import { Values, Settings } from '../types/slider';
import View from './view';
import HandlerView from './subViews/handlerView';
import events from './mixins/eventsMixin';
import $ from 'jquery';
import BaseView from './subViews/baseView';
import MarkView from './subViews/markView';
import InputView from './subViews/inputView';

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

    this.initClickEvents();
    this.initBasicEvents();
    this.exec('sliderInit');
  }

  public initClickEvents() {
    if (this._model.settings.clickableBase && !this._model.settings.showMarks) {
      this.on('baseClicked connectorClicked progressBarClicked', function (
        base: BaseView,
        coords: number
      ) {
        const value = this._model.valueFromCoords(coords),
          percentage = this._view.getPercentage(value),
          nearestHandler = this._view.nearestHandler(percentage);
        if (nearestHandler) {
          nearestHandler.focus = true;
          this._model.values[nearestHandler.index] = value;
          this.exec('valueUpdated');
          this.exec('valueEnd');
        }
      });
    }

    if (this.settings.clickableMark && this.settings.showMarks) {
      this.on('markClicked', function (mark: MarkView) {
        const value = this._model.valueFromPercentage(mark.percentage),
          nearestHandler = this._view.nearestHandler(mark.percentage);
        if (nearestHandler) {
          nearestHandler.focus = true;
          this._model.values[nearestHandler.index] = value;
          this.exec('valueUpdated');
          this.exec('valueEnd');
        }
      });
    }
  }

  public initBasicEvents() {
    this.on('handlerMoved', function (handler: HandlerView, coords: number) {
      const value = this._model.valueFromCoords(coords),
        percentage = this._view.getPercentage(value);
      this._model.values[handler.index] = value;
      handler.update(percentage, value);
      if (this._view.elements.result) {
        this._view.elements.result.update(this._model.templateValues);
      }
      this.exec('valueUpdated');
      this.exec('sliderUpdated');
    });

    this.on('handlerEnd', function () {
      if (this._view.elements.input) this._view.elements.input.update(this._model.sortedValues);
      this.exec('sliderEnd');
    });

    this.on('markValueElementAppend', function (mark: MarkView) {
      mark.value.text(this._model.valueFromPercentage(mark.percentage));
    });

    this.on('settingsEnd', function () {
      this._view.reset();
      this.reset();
      this.exec('sliderReset');
    });

    this.on('inputChange', function (input: InputView) {
      let values = input.values;
      values = values.map((value) => {
        return this._model.getValueRelativeToBounds(this._model.getFormattedValue(value));
      })
      this._model.values = values;
      this.exec('valueEnd');
    });

    this.on('valueEnd', function () {
      this._view.elements.input.update(this._model.sortedValues);
      if (this._view.elements.result) {
        this._view.elements.result.update(this._model.templateValues);
      }
      this._view.elements.handlers.forEach((handler: HandlerView, index: number) => {
        const value = this._model.values[index];
        handler.update(this._view.getPercentage(value), value);
      });
      this.exec('sliderUpdated');
      this.exec('sliderEnd');
    });
  }

  public reset() {
    this.off('baseClicked connectorClicked progressBarClicked markClicked');
    this.initClickEvents();
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

  get templateValues(): string {
    return this._model.templateValues;
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
}

Object.assign(Presenter.prototype, events);

export default Presenter;
