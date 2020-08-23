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

  public init() {
    this.initClickEvents();
    this.initBasicEvents();
    this.exec('sliderInit');
  }

  public initClickEvents() {
    if (this._model.settings.clickableBase && !this._model.settings.showMarks) {
      this.on('baseClicked connectorClicked progressBarClicked', function (
        base: BaseView,
        coords: number,
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
          this.exec('valueEnd', true);
        }
      });
    }
  }

  public initBasicEvents() {
    this.on('handlerMoved', function (handler: HandlerView, coords: number) {
      if (this.settings.enabled) {
        const value = this._model.valueFromCoords(coords);
        handler.update();
        this._model.values[handler.index] = value;
        if (this._view.elements.result) {
          this._view.elements.result.update(this._model.templateValues);
        }
        this.exec('valueUpdated');
        this._view.elements.input.element.trigger('slider.updated');
      }
    });

    this.on('handlerEnd', function () {
      this._view.elements.input.update(this._model.sortedValues);
      this._view.elements.input.element.trigger('slider.end');
    });

    this.on('markValueElementAppend', function (mark: MarkView) {
      mark.value.text(this._model.valueFromPercentage(mark.percentage));
    });

    this.on('settingsEnd', function () {
      this._view.reset();
      this.reset();
      this._view.elements.input.element.trigger('slider.reset');
    });

    this.on('inputChange', function (values: Values) {
      if (this.settings.enabled) {
        this._model.values = values.map((value) => {
          return this._model.getValueRelativeToBounds(
            this._model.getFormattedValue(value),
          );
        });
        this.exec('valueEnd');
      }
    });

    this.on('valueEnd', function () {
      if (this.settings.enabled) {
        this._view.elements.handlers.forEach((handler: HandlerView) => {
          handler.update();
        });
        if (this._view.elements.result) {
          this._view.elements.result.update(this._model.templateValues);
        }
        this._view.elements.input.element.trigger('slider.updated');
        this.exec('handlerEnd');
      }
    });
  }

  public reset() {
    this.off('baseClicked connectorClicked progressBarClicked markClicked');
    this.initClickEvents();
  }
}

Object.assign(Presenter.prototype, events);

export default Presenter;
