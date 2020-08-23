import BasicElementView from '../../modules/subViews/basicElementView';
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
  precision: 2,
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

const basicElementView = view.elements.baseWrapper;

describe('BasicElementView', () => {
  test('Parent and element is defined', () => {
    expect(basicElementView.parent).toBeDefined();
    expect(basicElementView.element).toBeDefined();
  });
  test('Element is inside of parent', () => {
    expect(
      basicElementView.parent.find(basicElementView.element).length,
    ).toBeGreaterThanOrEqual(1);
  });
  test('addClass(), removeClass() and css() is working correctly', () => {
    basicElementView.addClass('test');
    expect(basicElementView.element.hasClass('test')).toBeTruthy();
    basicElementView.removeClass('test');
    expect(basicElementView.element.hasClass('test')).toBeFalsy();
    basicElementView.css('color', 'red');
    expect(basicElementView.css('color')).toBe('red');
  });
  test('remove() is working correctly', () => {
    basicElementView.remove();
    expect(basicElementView.parent.find(basicElementView.element).length).toBe(
      0,
    );
  });
});
