import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

let page, browser;

const contentHtml = `<html>
    <body>
        <div id='horizontal-test'>
            <input id="slider1" type="text"/>
        </div>
        <div id='vertical-test'>
            <input id="slider2" type="text"/>
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
    y: boundingBox.y + boundingBox.height / 2
  };
}

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.setContent(contentHtml);
  await page.addStyleTag({
    path: path.resolve(__dirname, '../../../dist/assets/css/', 'jquery.slider.min.css')
  });
  await page.addScriptTag({
    url: 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js'
  });
  await page.addScriptTag({
    path: path.resolve(__dirname, '../../../dist/assets/js/', 'jquery.slider.min.js')
  });
  await page.evaluate(() => {
    $('#slider1').slider({
      //не трогать настройки, нужны для корректной работы теста
      min: 50,
      max: 200,
      step: 0,
      range: true,
      showTooltip: true,
      roundTo: 1,
      startValues: [90, 100],
      sortValues: true,
      tooltipPosition: 1,
      additionalClasses: {
        wrapper: 'slider',
        result: 'slider__result'
      }
    });
    $('#slider2').slider({
      //не трогать, нужны для тестов
      min: 0,
      max: 500,
      step: 0,
      align: 1,
      range: true,
      startValues: [90, 150, 205, 420],
      sortValues: true,
      sortOnlyPares: true,
      showTooltip: true,
      showBounds: false,
      tooltipReverse: true,
      resultTemplate: '$1 - $2; $3 - $4',
      additionalClasses: {
        wrapper: 'slider',
        result: 'slider__result'
      }
    });
  });
  const screenshotPath = path.resolve(__dirname, './screenshots/', 'loaded.jpeg');
  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });
  console.dir(`Loaded screenshot: ${screenshotPath}`);
});

describe('View', () => {
  test('Input is defined', async () => {
    const input = await page.$('#slider1');
    const val = await input.getProperty('value');

    expect(val._remoteObject.value).toBe('{"value":[90,100]}');
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
    const handler = await page.$('#horizontal-test .js-slider__handler'),
      connector = await page.$('#horizontal-test .js-slider__connector'),
      handlerBoundingBoxBefore = centerCoords(await handler.boundingBox()),
      connectorBoundingBoxBefore = centerCoords(await connector.boundingBox());

    await page.mouse.move(handlerBoundingBoxBefore.x, handlerBoundingBoxBefore.y);
    await page.mouse.down();
    const classes = await handler.getProperty('className');
    expect(classes._remoteObject.value).toMatch(/js-slider__handler_active/);

    await page.mouse.move(handlerBoundingBoxBefore.x + 100, handlerBoundingBoxBefore.y);
    await page.mouse.up();

    const handlerBoundingBoxAfter = centerCoords(await handler.boundingBox()),
      connectorBoundingBoxAfter = centerCoords(await connector.boundingBox());

    expect(handlerBoundingBoxAfter.x - handlerBoundingBoxBefore.x).toBeCloseTo(100.5, 0);
    expect(connectorBoundingBoxAfter.x - connectorBoundingBoxBefore.x).toBeCloseTo(50.25, 0);
  });

  test('Correct tooltip value (horizontal)', async () => {
    const handler = await page.$('#horizontal-test .js-slider__handler'),
      tooltip = await page.$('#horizontal-test .js-slider__tooltip'),
      handlerBoundingBox = centerCoords(await handler.boundingBox()),
      tooltipTextBefore = await page.evaluate(tooltip => tooltip.textContent, tooltip);

    await page.mouse.move(handlerBoundingBox.x, handlerBoundingBox.y);
    await page.mouse.down();

    await page.mouse.move(handlerBoundingBox.x + 100, handlerBoundingBox.y);
    await page.mouse.up();

    const tooltipTextAfter = await page.evaluate(tooltip => tooltip.textContent, tooltip);

    expect(tooltipTextBefore).toBe('110.8');
    expect(tooltipTextAfter).toBe('131.6');
  });

  /*test('Correct handle and connector moving (vertical)', async () => {
    const handler = await page.$('#vertical-test .js-slider__handler'),
      connector = await page.$('#vertical-test .js-slider__connector'),
      handlerBoundingBoxBefore = centerCoords(await handler.boundingBox()),
      connectorBoundingBoxBefore = centerCoords(await connector.boundingBox());

    await page.mouse.move(handlerBoundingBoxBefore.x, handlerBoundingBoxBefore.y);
    await page.mouse.down();
    const classes = await handler.getProperty('className');
    expect(classes._remoteObject.value).toMatch(/js-slider__handler_active/);

    await page.mouse.move(handlerBoundingBoxBefore.x, handlerBoundingBoxBefore.y + 100);
    await page.mouse.up();

    const handlerBoundingBoxAfter = centerCoords(await handler.boundingBox()),
      connectorBoundingBoxAfter = centerCoords(await connector.boundingBox());

    expect(handlerBoundingBoxAfter.x - handlerBoundingBoxBefore.x).toBeCloseTo(92.3, 0);
    expect(connectorBoundingBoxAfter.x - connectorBoundingBoxBefore.x).toBeCloseTo(37.2, 0);
  });

  test('Correct tooltip value (vertical)', async () => {
    const handler = await page.$('#vertical-test .js-slider__handler'),
      tooltip = await page.$('#vertical-test .js-slider__tooltip'),
      handlerBoundingBox = centerCoords(await handler.boundingBox()),
      tooltipTextBefore = await page.evaluate(tooltip => tooltip.textContent, tooltip);

    await page.mouse.move(handlerBoundingBox.x, handlerBoundingBox.y);
    await page.mouse.down();

    await page.mouse.move(handlerBoundingBox.x, handlerBoundingBox.y + 100);
    await page.mouse.up();

    const tooltipTextAfter = await page.evaluate(tooltip => tooltip.textContent, tooltip);

    expect(tooltipTextBefore).toBe('114.8');
    expect(tooltipTextAfter).toBe('139.8');
  });*/
});

afterAll(async () => {
  const screenshotPath = path.resolve(__dirname, './screenshots/', 'tested.jpeg');
  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });
  console.dir(`Tested screenshot: ${screenshotPath}`);
  browser.close();
});
