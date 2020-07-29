import BasicElementView from '../../modules/subViews/basicElementView';
import Model from '../../modules/model';
import View from '../../modules/view';
import Presenter from '../../modules/presenter';
import $ from 'jquery';

const model = new Model({
  min: 10,
  max: 230,
  range: true,
  reverse: false,
  startValues: [30, 70],
  handlersColors: [],
  connectorsColors: [],
  step: 5,
  roundTo: 2,
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
const presenter = new Presenter(model, view);
const basicElementView = new BasicElementView(view, $('<div>Test</div>'), $('<body></body>'));

describe('BasicElementView', () => {
  test('Parent and element is defined', () => {
    expect(basicElementView.parent).toBeDefined();
    expect(basicElementView.element).toBeDefined();
  });
  test('Element is inside of parent', () => {
    expect(basicElementView.parent.find(basicElementView.element).length).toBeGreaterThanOrEqual(1);
  });
  test('addClass(), removeClass() and css() is working correctly', () => {
    basicElementView.addClass('test');
    expect(basicElementView.element.hasClass('test')).toBeTruthy();
    basicElementView.removeClass('test');
    expect(basicElementView.element.hasClass('test')).toBeFalsy();
    basicElementView.css('color', 'red');
    expect(basicElementView.css('color')).toBe('red');
  });
  test('Events is working correctly', () => {
    let counter = 0;
    basicElementView.on('test', () => {
      counter++;
    });
    view.on('test', () => {
      counter++;
    });
    presenter.on('test', () => {
      counter++;
    });
    basicElementView.on('test2', () => {
      counter++;
    });
    view.on('test2', () => {
      counter++;
    });
    presenter.on('test2', () => {
      counter++;
    });
    basicElementView.trigger('test');
    expect(counter).toBe(3);
    basicElementView.trigger('test test2');
    expect(counter).toBe(9);
    basicElementView.exec('test test2');
    expect(counter).toBe(11);
    basicElementView.off('test test2');
    view.off('test test2');
    presenter.off('test test2');
    basicElementView.trigger('test test2');
    expect(counter).toBe(11);
  });
  test('remove() is working correctly', () => {
    basicElementView.remove();
    expect(basicElementView.parent.find(basicElementView.element).length).toBe(0);
  });
});
