import Model from '../../modules/model';
import View from '../../modules/view';
import Presenter from '../../modules/presenter';
import $ from 'jquery';

const input = $('<input id="test" type="text">');
const body = $('<body style="width: 500px; height: 500px;"></body>');
input.appendTo(body);

const model = new Model({
  min: 0,
  max: 100,
  showRange: true,
  reverse: false,
  startValues: [50, 30],
  handlersColors: [],
  connectorsColors: [],
  step: 5,
  roundTo: 2,
  vertical: true,
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

$.event.special.leftclick = {
  bindType: 'mousedown',
  delegateType: 'mousedown',
  handle: function (e) {
    e.which = 1;
    let handleObj = e.handleObj;

    $(document).one('contextmenu', false);

    e.type = handleObj.origType;
    let ret = handleObj.handler.apply(this, arguments);
    e.type = handleObj.type;

    return ret;
  },
};

describe('HandlerView', () => {
  let handler = view.elements.handlers[0];
  test('Index, percentage and value is defined correctly', () => {
    expect(handler.index).toBe(0);
    expect(handler.percentage).toBe(50);
    expect(handler.value).toBe(50);
  });
  test('Handler is inside of base', () => {
    expect(handler.element.parent()).toEqual(view.elements.base.element);
  });
  test('Handler active and focus working', () => {
    handler.active = true;
    expect(handler.active).toBe(true);
    expect(handler.element.hasClass(handler.activeClass)).toBe(true);
    handler.active = false;
    expect(handler.active).toBe(false);
    expect(handler.element.hasClass(handler.activeClass)).toBe(false);

    handler.focus = true;
    expect(handler.focus).toBe(true);
    expect(handler.element.hasClass(handler.focusClass)).toBe(true);
    handler.focus = false;
    expect(handler.focus).toBe(false);
    expect(handler.element.hasClass(handler.focusClass)).toBe(false);
  });
  test('Events is working fine', () => {
    let counter = 0;
    view.on('handlerStart', () => {
      counter++;
    });
    presenter.on('handlerStart', () => {
      counter++;
    });
    view.on('handlerMove', () => {
      counter++;
    });
    presenter.on('handlerMove', () => {
      counter++;
    });
    view.on('handlerEnd', () => {
      counter++;
    });
    presenter.on('handlerEnd', () => {
      counter++;
    });
    handler.element.trigger('touchstart');
    expect(counter).toBe(2);
  });
});
