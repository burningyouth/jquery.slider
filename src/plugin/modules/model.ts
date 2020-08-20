import Presenter from './presenter';
import { Settings, Values } from '../types/slider';
import $ from 'jquery';
import BaseView from './subViews/baseView';

class Model {
  private _presenter: Presenter;
  private _settings: Settings = {
    //default settings
    min: 0,
    max: 100,
    showRange: false,
    showProgressBar: false,
    startValues: [30, 70],
    marksCount: 10,
    step: 1,
    roundTo: 0,
    vertical: false,
    reverse: false,
    tooltipReverse: false,
    markValueReverse: false,
    showMarks: false,
    showTooltip: false,
    showResult: true,
    showBounds: true,
    showMarkValue: true,
    showInput: false,
    readonlyInput: false,
    clickableBase: true,
    clickableMark: true,
    sortValues: false,
    sortOnlyPares: false,
    sortReverse: false,
    resultTemplate: 'default',
    handlersStateClasses: {},
    additionalClasses: {},
    handlersColors: [],
    connectorsColors: []
  };
  private _values: Values;

  public baseStartCoords: number = 0;
  public baseEndCoords: number = 0;
  public devideTo: number = 1;

  constructor(options?: Settings) {
    this.settings = options;
  }

  get settings(): Settings {
    return this._settings;
  }

  get values(): Values {
    return this._values;
  }

  get sortedValues(): Values {
    if (this._settings.sortValues) {
      if (this._settings.sortOnlyPares && this._values.length % 2 === 0) {
        //если нужно сортировать попарно и количество значений четно
        const arr = this._values.slice(0);
        if (this._settings.sortReverse) {
          for (let i = 0; i < arr.length; i += 2) {
            if (arr[i] < arr[i + 1]) {
              let tmp = arr[i];
              arr[i] = arr[i + 1];
              arr[i + 1] = tmp;
            }
          }
        } else {
          for (let i = 0; i < arr.length; i += 2) {
            if (arr[i] > arr[i + 1]) {
              let tmp = arr[i];
              arr[i] = arr[i + 1];
              arr[i + 1] = tmp;
            }
          }
        }
        return arr;
      } else {
        if (this._settings.sortReverse) {
          return this._values.slice(0).sort(function (a: number, b: number): number {
            return b - a;
          });
        }
        return this._values.slice(0).sort(function (a: number, b: number): number {
          return a - b;
        });
      }
    }
    return this._values;
  }

  get formattedValues(): string {
    const resultTemplate = this._settings.resultTemplate,
      sortedValues = this.sortedValues;
    let formattedString = 'undefined';
    if (resultTemplate !== 'default') {
      formattedString = resultTemplate.replace(/\$(\d+)/g, function (
        substr: string,
        index: string
      ): string {
        const value = sortedValues[+index - 1];
        return typeof value === 'number' ? String(value) : substr;
      });
    } else {
      return sortedValues.toString();
    }
    return formattedString;
  }

  set values(newValues: Values) {
    if (Array.isArray(newValues)) {
      if (this.checkValue(newValues)) {
        this._values = newValues;
        this.trigger('valueUpdated');
        this.trigger('valueEnd');
      } else throw new RangeError('Value is out of range!');
    } else throw new TypeError('New value must be an Array!');
  }

  set settings(newSettings: Settings) {
    this._settings = $.extend(this._settings, newSettings);
    if (this.checkValue(this._settings.startValues)) {
      this._values = this._settings.startValues;
    } else {
      throw new RangeError('Start value is invalid (out of range)!');
    }
    this.trigger('settingsEnd');
  }

  set presenter(newPresenter: Presenter) {
    this._presenter = newPresenter;
  }

  public valueFromPercentage(percentage: number): number {
    const settings = this.settings;
    const roundTo = 10 ** settings.roundTo;

    let value = percentage / 100;
    value *= settings.max - settings.min;

    if ((settings.reverse && !settings.vertical) || (!settings.reverse && settings.vertical)) {
      if (settings.max >= 0 && settings.min >= 0) {
        value = settings.max - value;
      } else if (settings.max < 0 && settings.min < 0) {
        value = settings.max - settings.min - value;
      } else {
        value = settings.max * ((settings.max - settings.min) / settings.max) - value;
      }
    }

    value = settings.step
      ? settings.min + Math.floor(value / settings.step + 0.5) * settings.step
      : settings.min + value; //форматируется значение в зависимости от step
    value = roundTo ? Math.floor(value * roundTo) / roundTo : value; //округление числа до roundTo

    if (value >= settings.min && value <= settings.max) {
      //если значение не попадает в границы, то мы берем за значение эти границы
      return value;
    } else if (value > settings.max) {
      return settings.max;
    }
    return settings.min;
  }

  public valueFromCoords(coords: number, base?: BaseView): number {
    //возвращает значение ползунка в зависимости от min, max, ширины базы, положения мыши, положения базы и настроек слайдера
    const settings = this.settings,
      roundTo = 10 ** settings.roundTo;
    let baseView: BaseView;
    if (base) {
      baseView = base;
    } else {
      baseView = this._presenter.base;
    }

    let value: number, devider: number, startCoords: number;
    if (settings.vertical) {
      devider = baseView.element.height();
      startCoords = baseView.element[0].getBoundingClientRect().top;
    } else {
      devider = baseView.element.width();
      startCoords = baseView.element[0].getBoundingClientRect().left;
    }

    value = (coords - startCoords) / devider;
    value *= settings.max - settings.min;

    if ((settings.reverse && !settings.vertical) || (!settings.reverse && settings.vertical)) {
      if (settings.max >= 0 && settings.min >= 0) {
        value = settings.max - value;
      } else if (settings.max < 0 && settings.min < 0) {
        value = settings.max - settings.min - value;
      } else {
        value = settings.max * ((settings.max - settings.min) / settings.max) - value;
      }
    }

    value = settings.step
      ? settings.min + Math.floor(value / settings.step + 0.5) * settings.step
      : settings.min + value; //форматируется значение в зависимости от step
    value = roundTo ? Math.floor(value * roundTo) / roundTo : value; //округление числа до roundTo

    if (value >= settings.min && value <= settings.max) {
      //если значение не попадает в границы, то мы берем за значение эти границы
      return value;
    } else if (value > settings.max) {
      return settings.max;
    }
    return settings.min;
  }

  public checkValue(value: number | Values): boolean {
    //проверка значений на попадание в диапазон
    if (Array.isArray(value)) {
      let result = true;
      value.forEach(item => {
        if (!this.checkValue(item)) result = false;
      });
      return result;
    } else {
      return value >= this.settings.min && value <= this.settings.max;
    }
  }

  public trigger(eventType: string, ...args: any) {
    if (this._presenter) this._presenter.exec(eventType, ...args);
  }
}

export default Model;
