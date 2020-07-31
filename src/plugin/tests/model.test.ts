import Model from '../modules/model';
import BaseView from '../modules/subViews/basicElementView';
import View from '../modules/view';
import $ from 'jquery';

const model = new Model({
  min: 10,
  max: 230,
  range: true,
  reverse: false,
  startValues: [30, 70],
  handlersColors: [],
  connectorsColors: [],
  step: 0,
  roundTo: 1,
  vertical: false,
  progressBar: false,
  tooltipReverse: true,
  showTooltip: true,
  showResult: false,
  showBounds: false,
  sortValues: true,
  sortReverse: false,
  sortOnlyPares: true,
  resultTemplate: '$1 - $2',
  handlersStateClasses: {
    active: 'active'
  },
  additionalClasses: {
    wrapper: 'test'
  }
});

const view = new View();
const base = new BaseView(view, $('<div style="width: 200px; height: 200px;"></div>'));

describe('Model', () => {
  test('checkValue() is working fine', () => {
    model.settings.min = 0;
    model.settings.max = 100;
    expect(model.checkValue(152)).toBe(false);
    expect(model.checkValue(100)).toBe(true);
    expect(model.checkValue(68)).toBe(true);
    expect(model.checkValue(0)).toBe(true);
  });

  test("Values doesn't change if out of range", () => {
    model.values = [89, 32, 64, 2];
    model.values = [124, -24];
    expect(model.values).toEqual([89, 32, 64, 2]);
  });

  test("Values doesn't sort if settings is false", () => {
    model.settings.sortValues = false;
    model.settings.sortOnlyPares = false;
    expect(model.sortedValues).toEqual([89, 32, 64, 2]);
  });

  test('Basic sorting is working', () => {
    model.settings.sortValues = true;
    expect(model.sortedValues).toEqual([2, 32, 64, 89]);
  });

  test('Paired sorting is working', () => {
    model.settings.sortOnlyPares = true;
    expect(model.sortedValues).toEqual([32, 89, 2, 64]);
  });

  test('Reversed sorting is working', () => {
    model.settings.sortReverse = true;
    expect(model.sortedValues).toEqual([89, 32, 64, 2]);
    model.settings.sortOnlyPares = false;
    expect(model.sortedValues).toEqual([89, 64, 32, 2]);
  });

  test('Template is working fine', () => {
    model.settings.sortOnlyPares = true;
    model.settings.resultTemplate = '$1 - $2;,,,, $22 - $12 -- $3 :: -$4';
    expect(model.formattedValues).toBe('89 - 32;,,,, $22 - $12 -- 64 :: -2');
    model.settings.resultTemplate = 'default';
    expect(model.formattedValues).toBe('89,32,64,2');
  });

  test('valueFromPercentage() is working fine', () => {
    model.settings.min = 0;
    model.settings.max = 100;
    expect(model.valueFromPercentage(0)).toBe(0);
    expect(model.valueFromPercentage(50)).toBe(50);
    expect(model.valueFromPercentage(100)).toBe(100);
    model.settings.min = -50;
    model.settings.max = 120;
    expect(model.valueFromPercentage(20)).toBe(-16);
    expect(model.valueFromPercentage(70)).toBe(68.9);
    expect(model.valueFromPercentage(89)).toBe(101.3);
  });

  test('valueFromCoords() is working fine', () => {
    model.settings.min = 0;
    model.settings.max = 100;
    expect(model.valueFromCoords(100, base)).toBe(50);
    model.settings.vertical = true;
    expect(model.valueFromCoords(100, base)).toBe(50);
    model.settings.vertical = false;
    model.settings.min = -50;
    model.settings.max = 150;
    expect(model.valueFromCoords(50, base)).toBe(0);
    model.settings.min = -350;
    model.settings.max = -150;
    expect(model.valueFromCoords(50, base)).toBe(-300);
    model.settings.min = -50;
    model.settings.max = 150;
    model.settings.reverse = true;
    expect(model.valueFromCoords(50, base)).toBe(100);
    model.settings.vertical = true;
    expect(model.valueFromCoords(100, base)).toBe(50);
    model.settings.vertical = false;
    model.settings.reverse = false;
    model.settings.min = -150;
    model.settings.max = 50;
    expect(model.valueFromCoords(50, base)).toBe(-100);
    expect(model.valueFromCoords(-50, base)).toBe(-150);
    expect(model.valueFromCoords(100000, base)).toBe(50);
    model.settings.reverse = true;
    expect(model.valueFromCoords(50, base)).toBe(0);
  });
});
