import $ from 'jquery';

import Model from './model';
import { Values, Settings } from '../types/slider';
import View from './view';
import HandlerView from './subViews/handlerView';
import events from './mixins/eventsMixin';
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

    model.getValueFromPercentage = model.getValueFromPercentage.bind(model);
    model.getValueFromCoords = model.getValueFromCoords.bind(model);

    model.isSliderReversedOrVertical = model.isSliderReversedOrVertical.bind(
      model,
    );

    view.getValueFromPercentage = model.getValueFromPercentage;
    view.getValueFromCoords = model.getValueFromCoords;
    view.isSliderReversedOrVertical = model.isSliderReversedOrVertical;
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

  public debugStart(str: string): void {
    this.settings.debug && console.time(`[slider.Presenter] ${str}`);
  }

  public debugEnd(str: string): void {
    this.settings.debug && console.timeEnd(`[slider.Presenter] ${str}`);
  }

  public init() {
    this.initBasicEvents();
    this.initClickEvents();
    this.exec('sliderInit');
  }

  public initBasicEvents() {
    this.on('handlerMoved', this.handleHandlerMoved);

    this.on('handlerEnd', this.handleHandlerEnd);

    this.on('settingsEnd', this.handleSettingsEnd);

    this.on('inputChange', this.handleInputChange);

    this.on('valueEnd', this.handleValueEnd);
  }

  public initClickEvents() {
    if (
      this._model.settings.isBaseClickable &&
      !this._model.settings.showMarks
    ) {
      this.on('baseClicked', this.handleBaseClicked);
    }

    if (this.settings.isMarkClickable && this.settings.showMarks) {
      this.on('markClicked', this.handleMarkClicked);
    }
  }

  public handleHandlerMoved(handler: HandlerView, offset: number): void {
    if (this.settings.isEnabled) {
      this.debugStart('handlerMoved event took');

      this._model.values[handler.index] += offset;
      handler.update();
      if (this._view.elements.result) {
        this._view.elements.result.update();
      }
      this.exec('valueUpdated');
      this.exec('sliderUpdated');

      this.debugEnd('handlerMoved event took');
    }
  }

  public handleHandlerEnd(): void {
    this.debugStart('handlerEnd event took');

    this._view.elements.input.update();
    this.exec('sliderEnd');

    this.debugEnd('handlerEnd event took');
  }

  public handleSettingsEnd(): void {
    this.debugStart('settingsEnd event took');

    this._view.reset();
    this.reset();
    this.exec('sliderReset');

    this.debugEnd('settingsEnd event took');
  }

  public handleInputChange(values: Values): void {
    if (this.settings.isEnabled) {
      this.debugStart('inputChange event took');

      this._model.values = values.map((value) => {
        return this._model.getValueRelativeToBounds(
          this._model.getFormattedValue(value),
        );
      });
      this.exec('valueEnd');

      this.debugEnd('inputChange event took');
    }
  }

  public handleValueEnd(): void {
    if (this.settings.isEnabled) {
      this.debugStart('valueEnd event took');

      this._view.elements.handlers.forEach((handler: HandlerView) => {
        handler.update();
      });
      if (this._view.elements.result) {
        this._view.elements.result.update();
      }
      this.exec('sliderUpdated');
      this.exec('handlerEnd');

      this.debugEnd('valueEnd event took');
    }
  }

  public handleBaseClicked(coords: number): void {
    const value = this._model.getValueFromCoords(coords),
      percentage = this._view.getPercentage(value),
      getNearestHandler = this._view.getNearestHandler(percentage);
    if (getNearestHandler) {
      this.debugStart('baseClicked event took');

      getNearestHandler.focus = true;
      this._model.values[getNearestHandler.index] = value;
      this.exec('valueUpdated');
      this.exec('valueEnd');

      this.debugEnd('baseClicked event took');
    }
  }

  public handleMarkClicked(mark: MarkView): void {
    const value = this._model.getValueFromPercentage(mark.percentage),
      getNearestHandler = this._view.getNearestHandler(mark.percentage);
    if (getNearestHandler) {
      this.debugStart('markClicked event took');

      getNearestHandler.focus = true;
      this._model.values[getNearestHandler.index] = value;
      this.exec('valueUpdated');
      this.exec('valueEnd');

      this.debugEnd('markClicked event took');
    }
  }

  public reset() {
    this.off('baseClicked connectorClicked progressBarClicked markClicked');
    this.initClickEvents();
  }
}

Object.assign(Presenter.prototype, events);

export default Presenter;
