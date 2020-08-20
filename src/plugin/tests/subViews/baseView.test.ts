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
  reverse: false,
  startValues: [30, 70],
  handlersColors: [],
  connectorsColors: [],
  step: 5,
  roundTo: 2,
  vertical: false,
  showProgressBar: false,
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
const view = new View(input);
const presenter = new Presenter(model, view);
view.init();

describe('BaseView', () => {
  const baseView = view.elements.base;
  test('Base has clickable class', () => {
    expect(baseView.element.hasClass(baseView.clickableClass)).toBe(true);
  });
  test('baseClicked event is working', () => {
    let counter = 0;
    view.on('baseClicked', () => {
      counter++;
    });
    presenter.on('baseClicked', () => {
      counter++;
    });
    baseView.element.trigger('click');
    expect(counter).toBe(2);
    baseView.element.trigger('touch');
    expect(counter).toBe(4);
  });
});
