import Model from '../modules/model';

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

describe('Model', () => {
  test('Settings are merged', () => {
    expect(model.settings).toEqual({
      min: 10,
      max: 230,
      range: true,
      reverse: false,
      progressBar: false,
      startValues: [30, 70],
      handlersColors: [],
      connectorsColors: [],
      step: 5,
      roundTo: 2,
      vertical: false,
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
  });

  test('checkValue() is working fine', () => {
    model.settings.min = 0;
    model.settings.max = 100;
    expect(model.checkValue(152)).toBe(false);
    expect(model.checkValue(100)).toBe(true);
    expect(model.checkValue(68)).toBe(true);
    expect(model.checkValue(0)).toBe(true);
  });

  test("Values doesn't change if out of range", () => {
    model.values = [89, 32, 64, 2];
    model.values = [124, -24];
    expect(model.values).toEqual([89, 32, 64, 2]);
  });

  test("Values doesn't sort if settings is false", () => {
    model.settings.sortValues = false;
    model.settings.sortOnlyPares = false;
    expect(model.sortedValues).toEqual([89, 32, 64, 2]);
  });

  test('Basic sorting is working', () => {
    model.settings.sortValues = true;
    expect(model.sortedValues).toEqual([2, 32, 64, 89]);
  });

  test('Pared sorting is working', () => {
    model.settings.sortOnlyPares = true;
    expect(model.sortedValues).toEqual([32, 89, 2, 64]);
  });

  test('Template is working fine', () => {
    model.settings.resultTemplate = '$1 - $2;,,,, $22 - $12 -- $3 :: -$4';
    expect(model.formattedValues).toBe('32 - 89;,,,, $22 - $12 -- 2 :: -64');
    model.settings.resultTemplate = 'default';
    expect(model.formattedValues).toBe('32,89,2,64');
  });
});
