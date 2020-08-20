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
  startValues: [70, 30],
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
    active: 'active'
  },
  additionalClasses: {
    wrapper: 'test'
  }
});
const view = new View(input);
const presenter = new Presenter(model, view);
view.init();

describe('ConnectorView', () => {
  let connector = view.elements.connectors[0];
  test('Index and paired handlers is defined correctly', () => {
    expect(connector.index).toBeDefined();
    expect(connector.pairedHandlers).toBeDefined();
    expect(connector.pairedHandlers.length).toBe(2);
  });
  test('Connector is inside of base', () => {
    expect(connector.element.parent()).toEqual(view.elements.base.element);
  });
  test('Percentage is defined correctly', () => {
    expect(connector.percentage).toBeDefined();
    expect(connector.percentage).toEqual([30, 30]);
    model.settings = {
      startValues: [40, 80]
    };
    connector = view.elements.connectors[0];
    expect(connector.percentage).toEqual([20, 40]);
  });
});
