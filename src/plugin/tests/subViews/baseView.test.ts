import Model from '../../modules/model';
import View from '../../modules/view';
import Presenter from '../../modules/presenter';
import $ from 'jquery';

const input = $('<input id="test" type="text">');
const body = $('<body style="width: 500px; height: 500px;"></body>');
input.appendTo(body);

const model = new Model({
  min: 10,
  max: 230,
  showRange: true,
  isReversed: false,
  values: [30, 70],
  handlersColors: [],
  connectorsColors: [],
  step: 5,
  decimalPlaces: 2,
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
const view = new View(input);
const presenter = new Presenter(model, view);
view.init();
presenter.init();

describe('BaseView', () => {
  const baseView = view.elements.base;
  test('Base has clickable class', () => {
    expect(baseView.$element.hasClass(baseView.clickableClass)).toBe(true);
  });
});
