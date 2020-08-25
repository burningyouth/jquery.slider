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
  isReversed: false,
  startValues: [70],
  handlersColors: [],
  connectorsColors: [],
  step: 5,
  precision: 2,
  isVertical: true,
  showProgressBar: true,
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

describe('ConnectorView', () => {
  let progressBar = view.elements.progressBar;
  test('Paired handler is defined', () => {
    expect(progressBar.pairedHandler).toBeDefined();
  });
  test('Progress bar is inside of base', () => {
    expect(progressBar.$element.$parent()).toEqual(view.elements.base.$element);
  });
  test('Style is defined correctly', () => {
    expect(progressBar.$element.attr('style')).toBe('top: 30%;');
    model.settings = {
      isVertical: false,
    };
    expect(view.elements.progressBar.$element.attr('style')).toBe(
      'right: 30%;',
    );
  });
});
