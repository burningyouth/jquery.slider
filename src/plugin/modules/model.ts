import BaseView from './subViews/baseView';
import Presenter from './presenter';
import { Settings, Values } from '../types/slider';
import $ from 'jquery';

class Model {
  private _presenter: Presenter;
  private _settings: Settings = {
    min: 0,
    max: 100,
    range: false,
    progressBar: false,
    reverse: false,
    startValues: [30, 70],
    handlersColors: [],
    connectorsColors: [],
    step: 1,
    roundTo: 0,
    vertical: false,
    tooltipReverse: false,
    showTooltip: false,
    showResult: true,
    showBounds: true,
    sortValues: false,
    sortOnlyPares: false,
    sortReverse: false,
    resultTemplate: 'default',
    handlersStateClasses: {},
    additionalClasses: {}
  };

  private _values: Values;

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
          return this._values.slice(0).sort(function(a: number, b: number): number {
            return b - a;
          });
        }
        return this._values.slice(0).sort(function(a: number, b: number): number {
          return a - b;
        });
      }
    }
    return this._values;
  }

  get formattedValues(): string {
    const resultTemplate = this._settings.resultTemplate;
    const sortedValues = this.sortedValues;
    let formattedString = 'undefined';
    if (resultTemplate !== 'default') {
      formattedString = resultTemplate.replace(/\$(\d+)/g, function(
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
    if (this.checkValue(newValues)) {
      this._values = newValues;
      this.trigger('modelValueChanged');
    }
  }

  set settings(newSettings: Settings) {
    this._settings = $.extend(this._settings, newSettings);
    if (this.checkValue(this._settings.startValues)) {
      this._values = this._settings.startValues;
    } else {
      throw new RangeError('Start value is invalid (out of range)!');
    }
    this.trigger('modelSettingsUpdated');
  }

  set presenter(newPresenter: Presenter) {
    this._presenter = newPresenter;
  }

  public getValue(coords: number, base: BaseView): number {
    //возвращает значение ползунка в зависимости от min, max, ширины базы, положения мыши, положения базы и настроек слайдера
    const settings = this.settings;
    const roundTo = 10 ** settings.roundTo;

    let value: number, devider: number, startCoords: number;
    if (settings.vertical) {
      devider = base.element.height();
      startCoords = base.element[0].getBoundingClientRect().top;
    } else {
      devider = base.element.width();
      startCoords = base.element[0].getBoundingClientRect().left;
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
