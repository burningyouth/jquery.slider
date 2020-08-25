import Model from '../modules/model';
import BaseView from '../modules/subViews/basicElementView';
import View from '../modules/view';
import $ from 'jquery';

const model = new Model({
  min: 10,
  max: 230,
  showRange: true,
  isReversed: false,
  startValues: [30, 70],
  handlersColors: [],
  connectorsColors: [],
  step: 0,
  precision: 1,
  isVertical: false,
  showProgressBar: false,
  isTooltipReversed: true,
  showTooltip: true,
  showResult: false,
  showBounds: false,
  sortValues: true,
  sortReversed: false,
  sortOnlyPares: true,
  resultTemplate: '$1 - $2',
  handlersStateClasses: {
    active: 'active',
  },
  additionalClasses: {
    wrapper: 'test',
  },
});

const view = new View();
const base = new BaseView(
  view,
  $('<div style="width: 200px; height: 200px;"></div>'),
);

describe('Model', () => {
  test('isValueInBounds() is working fine', () => {
    model.settings.min = 0;
    model.settings.max = 100;
    expect(model.isValueInBounds(152)).toBe(false);
    expect(model.isValueInBounds(100)).toBe(true);
    expect(model.isValueInBounds(68)).toBe(true);
    expect(model.isValueInBounds(0)).toBe(true);
  });

  test("Values doesn't sort if settings is false", () => {
    model.values = [89, 32, 64, 2];
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
    model.settings.sortReversed = true;
    expect(model.sortedValues).toEqual([89, 32, 64, 2]);
    model.settings.sortOnlyPares = false;
    expect(model.sortedValues).toEqual([89, 64, 32, 2]);
  });

  test('Template is working fine', () => {
    model.settings.sortOnlyPares = true;
    model.settings.resultTemplate = '$1 - $2;,,,, $22 - $12 -- $3 :: -$4';
    expect(model.templateValues).toBe('89 - 32;,,,, $22 - $12 -- 64 :: -2');
    model.settings.resultTemplate = 'default';
    expect(model.templateValues).toBe('89,32,64,2');
  });

  test('getValueFromPercentage() is working fine', () => {
    model.settings.min = 0;
    model.settings.max = 100;
    expect(model.getValueFromPercentage(0)).toBe(0);
    expect(model.getValueFromPercentage(50)).toBe(50);
    expect(model.getValueFromPercentage(100)).toBe(100);
    model.settings.min = -50;
    model.settings.max = 120;
    expect(model.getValueFromPercentage(20)).toBe(-16);
    expect(model.getValueFromPercentage(70)).toBe(68.9);
    expect(model.getValueFromPercentage(89)).toBe(101.3);
  });

  test('getValueFromCoords() is working fine', () => {
    model.settings.min = 0;
    model.settings.max = 100;
    expect(model.getValueFromCoords(100, base)).toBe(50);
    model.settings.isVertical = true;
    expect(model.getValueFromCoords(100, base)).toBe(50);
    model.settings.isVertical = false;
    model.settings.min = -50;
    model.settings.max = 150;
    expect(model.getValueFromCoords(50, base)).toBe(0);
    model.settings.min = -350;
    model.settings.max = -150;
    expect(model.getValueFromCoords(50, base)).toBe(-300);
    model.settings.min = -50;
    model.settings.max = 150;
    model.settings.isReversed = true;
    expect(model.getValueFromCoords(50, base)).toBe(100);
    model.settings.isVertical = true;
    expect(model.getValueFromCoords(100, base)).toBe(50);
    model.settings.isVertical = false;
    model.settings.isReversed = false;
    model.settings.min = -150;
    model.settings.max = 50;
    expect(model.getValueFromCoords(50, base)).toBe(-100);
    expect(model.getValueFromCoords(-50, base)).toBe(-150);
    expect(model.getValueFromCoords(100000, base)).toBe(50);
    model.settings.isReversed = true;
    expect(model.getValueFromCoords(50, base)).toBe(0);
  });
});
