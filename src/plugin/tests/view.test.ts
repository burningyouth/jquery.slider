import puppeteer from 'puppeteer';
import path from 'path';

let page, browser;

const contentHtml = `<html>
    <body>
        <div id='horizontal-test1'>
            <input id="slider1" type="text"/>
        </div>
        <div id='horizontal-test2'>
            <input id="slider2" type="text"/>
        </div>
        <div id='isVertical-test1'>
          <input id="slider3" type="text"/>
        </div>
        <div id='isVertical-test2'>
          <input id="slider4" type="text"/>
        </div>
    </body>
</html>`;

interface BoundingBox {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

function centerCoords(boundingBox: BoundingBox): BoundingBox {
  return {
    x: boundingBox.x + boundingBox.width / 2,
    y: boundingBox.y + boundingBox.height / 2,
  };
}

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.setContent(contentHtml);
  await page.addStyleTag({
    path: path.resolve(
      __dirname,
      '../../../dist/assets/css/',
      'jquery.slider.min.css',
    ),
  });
  await page.addScriptTag({
    url: 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',
  });
  await page.addScriptTag({
    path: path.resolve(
      __dirname,
      '../../../dist/assets/js/',
      'jquery.slider.min.js',
    ),
  });
  await page.evaluate(() => {
    $('#slider1').slider({
      //не трогать настройки, нужны для корректной работы теста
      min: 50,
      max: 200,
      step: 0,
      showRange: true,
      showTooltip: true,
      decimalPlaces: 1,
      values: [90, 100],
      sortValues: true,
      tooltipPosition: 1,
      additionalClasses: {
        wrapper: 'slider',
        result: 'slider__result',
      },
    });
    $('#slider2').slider({
      min: -100,
      max: 100,
      step: 0,
      decimalPlaces: 1,
      showProgressBar: true,
      isReversed: true,
      values: [-90],
      showTooltip: true,
      showBounds: false,
      isTooltipReversed: true,
      resultTemplate: '$1',
      additionalClasses: {
        wrapper: 'slider',
        result: 'slider__result',
      },
    });
    $('#slider3').slider({
      min: 0,
      max: 500,
      step: 0,
      decimalPlaces: 1,
      isVertical: true,
      showRange: true,
      values: [90, 150, 205, 420],
      sortValues: true,
      sortOnlyPares: true,
      showTooltip: true,
      showBounds: false,
      isTooltipReversed: true,
      resultTemplate: '$1 - $2; $3 - $4',
      additionalClasses: {
        wrapper: 'slider',
        result: 'slider__result',
      },
    });
    $('#slider4').slider({
      min: -500,
      max: -100,
      step: 0,
      decimalPlaces: 1,
      isVertical: true,
      showRange: true,
      values: [-430, -150],
      sortValues: true,
      sortReversed: true,
      showTooltip: true,
      isTooltipReversed: true,
      resultTemplate: '$1 --- $2',
      additionalClasses: {
        wrapper: 'slider',
        result: 'slider__result',
      },
    });
  });
  const screenshotPath = path.resolve(
    __dirname,
    './screenshots/',
    'loaded.jpeg',
  );
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });
  console.dir(`Loaded screenshot: ${screenshotPath}`);
});

describe('View', () => {
  test('Inputs did initialized fine', async () => {
    const input1 = await page.$('#slider1');
    const val1 = await input1.getProperty('value');
    const input2 = await page.$('#slider2');
    const val2 = await input2.getProperty('value');
    const input3 = await page.$('#slider3');
    const val3 = await input3.getProperty('value');
    const input4 = await page.$('#slider4');
    const val4 = await input4.getProperty('value');

    expect(val1._remoteObject.value).toBe('90,100');
    expect(val2._remoteObject.value).toBe('-90');

    expect(val3._remoteObject.value).toBe('90,150,205,420');
    expect(val4._remoteObject.value).toBe('-150,-430');
  });
  test('Correct init', async () => {
    const wrapper = await page.$('.js-slider'),
      baseWrapper = await page.$('.js-slider__base-wrapper'),
      base = await page.$('.js-slider__base'),
      connector = await page.$('.js-slider__connector'),
      handler = await page.$('.js-slider__connector'),
      tooltip = await page.$('.js-slider__connector'),
      bound = await page.$('.js-slider__bound');

    expect(wrapper).toBeDefined();
    expect(baseWrapper).toBeDefined();
    expect(base).toBeDefined();
    expect(connector).toBeDefined();
    expect(handler).toBeDefined();
    expect(tooltip).toBeDefined();
    expect(bound).toBeDefined();
  });

  test('Correct handle and connector moving (horizontal)', async () => {
    const handler1 = await page.$('#horizontal-test1 .js-slider__handler'),
      connector1 = await page.$('#horizontal-test1 .js-slider__connector');
    const handler2 = await page.$('#horizontal-test2 .js-slider__handler'),
      connector2 = await page.$('#horizontal-test2 .js-slider__connector');

    //first
    let handlerBoundingBoxBefore = centerCoords(await handler1.boundingBox()),
      connectorBoundingBoxBefore = centerCoords(await connector1.boundingBox());

    await page.mouse.move(
      handlerBoundingBoxBefore.x,
      handlerBoundingBoxBefore.y,
    );
    await page.mouse.down();
    let classes = await handler1.getProperty('className');
    expect(classes._remoteObject.value).toMatch(/js-slider__handler_active/);

    await page.mouse.move(
      handlerBoundingBoxBefore.x + 100,
      handlerBoundingBoxBefore.y,
    );
    await page.mouse.up();

    let handlerBoundingBoxAfter = centerCoords(await handler1.boundingBox()),
      connectorBoundingBoxAfter = centerCoords(await connector1.boundingBox());

    expect(handlerBoundingBoxAfter.x - handlerBoundingBoxBefore.x).toBeCloseTo(
      100,
      0,
    );
    expect(
      connectorBoundingBoxAfter.x - connectorBoundingBoxBefore.x,
    ).toBeCloseTo(50, 0);

    //second
    handlerBoundingBoxBefore = centerCoords(await handler2.boundingBox());
    connectorBoundingBoxBefore = centerCoords(await connector2.boundingBox());

    await page.mouse.move(
      handlerBoundingBoxBefore.x,
      handlerBoundingBoxBefore.y,
    );
    await page.mouse.down();
    classes = await handler2.getProperty('className');
    expect(classes._remoteObject.value).toMatch(/js-slider__handler_active/);

    await page.mouse.move(
      handlerBoundingBoxBefore.x - 100,
      handlerBoundingBoxBefore.y,
    );
    await page.mouse.up();

    handlerBoundingBoxAfter = centerCoords(await handler2.boundingBox());
    connectorBoundingBoxAfter = centerCoords(await connector2.boundingBox());

    expect(handlerBoundingBoxBefore.x - handlerBoundingBoxAfter.x).toBeCloseTo(
      100,
      0,
    );
    expect(
      connectorBoundingBoxBefore.x - connectorBoundingBoxAfter.x,
    ).toBeCloseTo(50, 0);
  });

  test('Correct tooltip value (horizontal)', async () => {
    const handler1 = await page.$('#horizontal-test1 .js-slider__handler'),
      tooltip1 = await page.$(
        '#horizontal-test1 .js-slider__handler .js-slider__tooltip',
      ),
      handler2 = await page.$('#horizontal-test2 .js-slider__handler'),
      tooltip2 = await page.$(
        '#horizontal-test2 .js-slider__handler .js-slider__tooltip',
      );

    let handlerBoundingBox = centerCoords(await handler1.boundingBox()),
      tooltipTextBefore = await page.evaluate(
        (tooltip) => tooltip.textContent,
        tooltip1,
      );

    await page.mouse.move(handlerBoundingBox.x, handlerBoundingBox.y);
    await page.mouse.down();

    await page.mouse.move(handlerBoundingBox.x + 100, handlerBoundingBox.y);
    await page.mouse.up();

    let tooltipTextAfter = await page.evaluate(
      (tooltip) => tooltip.textContent,
      tooltip1,
    );

    expect(tooltipTextBefore).toBe('110.8');
    expect(tooltipTextAfter).toBe('131.6');

    //second

    handlerBoundingBox = centerCoords(await handler2.boundingBox());
    tooltipTextBefore = await page.evaluate(
      (tooltip) => tooltip.textContent,
      tooltip2,
    );

    await page.mouse.move(handlerBoundingBox.x, handlerBoundingBox.y);
    await page.mouse.down();

    await page.mouse.move(handlerBoundingBox.x + 100, handlerBoundingBox.y);
    await page.mouse.up();

    tooltipTextAfter = await page.evaluate(
      (tooltip) => tooltip.textContent,
      tooltip2,
    );

    expect(tooltipTextBefore).toBe('-64.5');
    expect(tooltipTextAfter).toBe('-90.3');
  });

  test('Correct handle and connector moving (isVertical)', async () => {
    const handler1 = await page.$(
        '#isVertical-test1 .js-slider__handler:last-of-type',
      ),
      connector1 = await page.$('#isVertical-test1 .js-slider__connector'),
      handler2 = await page.$(
        '#isVertical-test2 .js-slider__handler:last-of-type',
      ),
      connector2 = await page.$('#isVertical-test2 .js-slider__connector');

    let handlerBoundingBoxBefore = centerCoords(await handler1.boundingBox()),
      connectorBoundingBoxBefore = centerCoords(await connector1.boundingBox());

    await page.mouse.move(
      handlerBoundingBoxBefore.x,
      handlerBoundingBoxBefore.y,
    );
    await page.mouse.down();
    let classes = await handler1.getProperty('className');
    expect(classes._remoteObject.value).toMatch(/js-slider__handler_active/);

    await page.mouse.move(
      handlerBoundingBoxBefore.x,
      handlerBoundingBoxBefore.y + 10,
    );
    await page.mouse.up();

    let handlerBoundingBoxAfter = centerCoords(await handler1.boundingBox()),
      connectorBoundingBoxAfter = centerCoords(await connector1.boundingBox());

    expect(handlerBoundingBoxAfter.y - handlerBoundingBoxBefore.y).toBeCloseTo(
      10.8,
      0,
    );
    expect(
      connectorBoundingBoxAfter.y - connectorBoundingBoxBefore.y,
    ).toBeCloseTo(5.4, 0);

    //second
    handlerBoundingBoxBefore = centerCoords(await handler2.boundingBox());
    connectorBoundingBoxBefore = centerCoords(await connector2.boundingBox());

    await page.mouse.move(
      handlerBoundingBoxBefore.x,
      handlerBoundingBoxBefore.y,
    );
    await page.mouse.down();
    classes = await handler2.getProperty('className');
    expect(classes._remoteObject.value).toMatch(/js-slider__handler_active/);

    await page.mouse.move(
      handlerBoundingBoxBefore.x,
      handlerBoundingBoxBefore.y + 10,
    );
    await page.mouse.up();

    handlerBoundingBoxAfter = centerCoords(await handler2.boundingBox());
    connectorBoundingBoxAfter = centerCoords(await connector2.boundingBox());

    expect(handlerBoundingBoxAfter.y - handlerBoundingBoxBefore.y).toBeCloseTo(
      10.8,
      0,
    );
    expect(
      connectorBoundingBoxAfter.y - connectorBoundingBoxBefore.y,
    ).toBeCloseTo(5.4, 0);
  });

  test('Correct tooltip value (isVertical)', async () => {
    const handler1 = await page.$(
        '#isVertical-test1 .js-slider__handler:last-of-type',
      ),
      tooltip1 = await page.$(
        '#isVertical-test1 .js-slider__handler:last-of-type .js-slider__tooltip',
      ),
      handler2 = await page.$(
        '#isVertical-test2 .js-slider__handler:last-of-type',
      ),
      tooltip2 = await page.$(
        '#isVertical-test2 .js-slider__handler:last-of-type .js-slider__tooltip',
      );
    let handlerBoundingBox = centerCoords(await handler1.boundingBox()),
      tooltipTextBefore = await page.evaluate(
        (tooltip) => tooltip.textContent,
        tooltip1,
      );

    await page.mouse.move(handlerBoundingBox.x, handlerBoundingBox.y);
    await page.mouse.down();

    await page.mouse.move(handlerBoundingBox.x, handlerBoundingBox.y + 50);
    await page.mouse.up();

    let tooltipTextAfter = await page.evaluate(
      (tooltip) => tooltip.textContent,
      tooltip1,
    );

    expect(+tooltipTextBefore > +tooltipTextAfter).toBe(true);

    //second
    handlerBoundingBox = centerCoords(await handler2.boundingBox());
    tooltipTextBefore = await page.evaluate(
      (tooltip) => tooltip.textContent,
      tooltip2,
    );

    await page.mouse.move(handlerBoundingBox.x, handlerBoundingBox.y);
    await page.mouse.down();

    await page.mouse.move(handlerBoundingBox.x, handlerBoundingBox.y + 20);
    await page.mouse.up();

    tooltipTextAfter = await page.evaluate(
      (tooltip) => tooltip.textContent,
      tooltip2,
    );

    expect(+tooltipTextBefore > +tooltipTextAfter).toBe(true);
  });
});

afterAll(async () => {
  const screenshotPath = path.resolve(
    __dirname,
    './screenshots/',
    'tested.jpeg',
  );
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });
  console.dir(`Tested screenshot: ${screenshotPath}`);
  browser.close();
});
