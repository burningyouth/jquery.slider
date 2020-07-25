import { Settings, Values } from '../types/slider';

enum Align {
  horizontal,
  vertical
}

class Model {
  public settings: Settings = {
    min: 0,
    max: 100,
    range: false,
    startValues: [30, 70],
    step: 1,
    roundTo: 0,
    align: Align.horizontal,
    tooltipReverse: false,
    showTooltip: false,
    showResult: true,
    showBounds: true,
    sortValues: false,
    sortOnlyPares: false,
    resultTemplate: 'default',
    additionalClasses: {}
  };

  private _values: Values;

  constructor(options?: Object) {
    if (options) this.settings = $.extend(this.settings, options);
    if (this.checkValue(this.settings.startValues)) {
      this._values = this.settings.startValues;
    } else {
      throw {
        name: 'ModelError',
        message: 'Start value is invalid (out of range)!'
      };
    }
  }

  get values(): Values {
    return this._values;
  }

  get sortedValues(): Values {
    if (this.settings.sortValues) {
      if (this.settings.sortOnlyPares && this._values.length % 2 === 0) {
        //если нужно сортировать попарно и количество значений четно
        const arr = this._values.slice(0);
        for (let i = 0; i < arr.length; i += 2) {
          if (arr[i] > arr[i + 1]) {
            let tmp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = tmp;
          }
        }
        return arr;
      } else {
        return this._values.slice(0).sort(function(a: number, b: number): number {
          return a - b;
        });
      }
    }
    return this._values;
  }

  get formattedValues(): string {
    const resultTemplate = this.settings.resultTemplate;
    const sortedValues = this.sortedValues;
    let formattedString = 'undefined';
    if (resultTemplate !== 'default') {
      formattedString = resultTemplate.replace(/\$(\d)/g, function(
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
    if (this.checkValue(newValues)) this._values = newValues;
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
}

export { Model, Align };
