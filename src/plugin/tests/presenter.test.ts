import Model from '../modules/model';
import View from '../modules/view';
import Presenter from '../modules/presenter';
import $ from 'jquery';

const input = $('<input id="test" type="text">');

const model = new Model({
  min: 0,
  max: 100,
  range: false,
  startValues: [30, 70],
  step: 1,
  roundTo: 0,
  align: 0,
  tooltipReverse: false,
  showTooltip: false,
  showResult: true,
  showBounds: true,
  sortValues: false,
  sortOnlyPares: false,
  resultTemplate: 'default',
  additionalClasses: {}
});

const view = new View(input);
const presenter = new Presenter(model, view);

describe('Presenter', () => {
  test('Model and view is defined', () => {
    expect(presenter._model).toBeDefined();
    expect(presenter._view).toBeDefined();
  });

  /*test('Percentage is calculated fine', () => {
    expect(presenter.view.getPercentage(0)).toBe(0);
    expect(presenter.getPercentage(42)).toBe(42);
    expect(presenter.getPercentage(89)).toBe(89);
    expect(presenter.getPercentage(100)).toBe(100);
  });*/
});
