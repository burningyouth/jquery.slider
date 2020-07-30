import Model from '../modules/model';
import View from '../modules/view';
import Presenter from '../modules/presenter';
import HandlerView from '../modules/subViews/handlerView';
import $ from 'jquery';

const input = $('<input id="test" type="text">');
const body = $('<body style="width: 500px; height: 500px;"></body>');
input.appendTo(body);

const model = new Model({
  min: 0,
  max: 100,
  range: false,
  startValues: [30, 70],
  step: 1,
  roundTo: 0,
  tooltipReverse: false,
  clickableBase: true,
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
view.init();

describe('Presenter', () => {
  test('Settings and values is accessible', () => {
    expect(presenter.settings).toBeDefined();
    expect(presenter.values).toBeDefined();
    expect(presenter.sortedValues).toBeDefined();
    expect(presenter.formattedValues).toBeDefined();
  });

  test('Settings and values is changable', () => {
    presenter.settings = {
      startValues: [10, 60]
    };
    presenter.values = [1, 30];
    expect(presenter.settings.startValues).toEqual([10, 60]);
    expect(presenter.values).toEqual([1, 30]);
  });

  test('View events is working fine', () => {
    let handler1 = view.elements.handlers[0],
      handler2 = view.elements.handlers[1],
      base = view.elements.base,
      input = view.input,
      inputValBefore = input.val(),
      modelValueBefore = model.values[0],
      handlerValueBefore = handler1.value,
      handlerPercentageBefore = handler1.percentage;
    handler1.trigger('handlerMoved', handler1, 10);
    handler1.trigger('handlerEnd', handler1);
    expect(handlerValueBefore < handler1.value).toBeTruthy();
    expect(modelValueBefore < model.values[0]).toBeTruthy();
    expect(handlerPercentageBefore < handler1.percentage).toBeTruthy();
    expect(inputValBefore != input.val()).toBeTruthy();
    inputValBefore = input.val();
    modelValueBefore = model.values[1];
    handlerValueBefore = handler2.value;
    handlerPercentageBefore = handler2.percentage;
    handler1.trigger('baseClicked', base, -10);
    expect(handlerValueBefore > handler2.value).toBeTruthy();
    expect(modelValueBefore > model.values[1]).toBeTruthy();
    expect(handlerPercentageBefore > handler2.percentage).toBeTruthy();
    expect(inputValBefore != input.val()).toBeTruthy();
  });

  test('Model events is working fine', () => {
    let handler = view.elements.handlers[0];
    const input = view.input,
      inputValBefore = input.val(),
      handlerValueBefore = handler.value,
      handlerPercentageBefore = handler.percentage;
    model.settings = {
      startValues: [10, 30, 50]
    };
    handler = view.elements.handlers[0];
    expect(view.elements.handlers.length === 3).toBeTruthy();
    expect(inputValBefore != input.val()).toBeTruthy();
    expect(handlerValueBefore != handler.value).toBeTruthy();
    expect(handlerPercentageBefore != handler.percentage).toBeTruthy();
  });
});
