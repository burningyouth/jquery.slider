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
  startValues: [30, 70],
  handlersColors: [],
  connectorsColors: [],
  step: 5,
  precision: 2,
  isVertical: false,
  showProgressBar: false,
  isTooltipReversed: true,
  showTooltip: true,
  showResult: false,
  showBounds: false,
  showMarks: true,
  showMarkValue: true,
  isMarkClickable: true,
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

describe('MarkView', () => {
  const mark = view.elements.marks[0];
  test('Base has clickable class', () => {
    expect(mark.$element.hasClass(mark.clickableClass)).toBe(true);
  });
});
