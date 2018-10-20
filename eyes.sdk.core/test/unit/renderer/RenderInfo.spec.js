'use strict';

const assert = require('assert');

const { RenderInfo, Region, RectangleSize, EmulationInfo, ScreenOrientation } = require('../../../index');

describe('RenderInfo', () => {
  it('constructor', () => {
    const renderInfo = new RenderInfo();
    assert.equal(renderInfo.hasOwnProperty('_width'), true);
    assert.equal(renderInfo.hasOwnProperty('_height'), true);
    assert.equal(renderInfo.hasOwnProperty('_sizeMode'), true);
    assert.equal(renderInfo.hasOwnProperty('_selector'), true);
    assert.equal(renderInfo.hasOwnProperty('_region'), true);
    assert.equal(renderInfo.hasOwnProperty('_emulationInfo'), true);
  });

  it('fromObject', () => {
    const regionObj = { left: 3, top: 4, width: 5, height: 6 };
    const emulationInfoObj = { deviceName: 'deviceName' };

    const renderInfo = RenderInfo.fromObject({
      width: 1,
      height: 2,
      sizeMode: 'some size mode',
      selector: 'some selector',
      region: regionObj,
      emulationInfo: emulationInfoObj,
    });

    const region = Region.fromObject(regionObj);
    const emulationInfo = EmulationInfo.fromObject(emulationInfoObj);

    assert.equal(renderInfo.getWidth(), 1);
    assert.equal(renderInfo.getHeight(), 2);
    assert.equal(renderInfo.getSizeMode(), 'some size mode');
    assert.equal(renderInfo.getSelector(), 'some selector');
    assert.deepEqual(renderInfo.getRegion(), region);
    assert.deepEqual(renderInfo.getEmulationInfo(), emulationInfo);
  });

  it('fromObject handles undefined region', () => {
    const renderInfo = RenderInfo.fromObject({});
    assert.equal(renderInfo.getRegion(), undefined);
  });

  it('fromRectangleSize', () => {
    const rectangleSize = RectangleSize.fromObject({ width: 1, height: 2 });
    const renderInfo = RenderInfo.fromRectangleSize(rectangleSize, 'some size mode');

    assert.equal(renderInfo.getWidth(), 1);
    assert.equal(renderInfo.getHeight(), 2);
    assert.equal(renderInfo.getSizeMode(), 'some size mode');
    assert.equal(renderInfo.getSelector(), undefined);
    assert.equal(renderInfo.getRegion(), undefined);
  });

  it('fromRectangleSize has a default sizeMode', () => {
    const rectangleSize = RectangleSize.fromObject({ width: 1, height: 2 });
    const renderInfo = RenderInfo.fromRectangleSize(rectangleSize);

    assert.equal(renderInfo.getWidth(), 1);
    assert.equal(renderInfo.getHeight(), 2);
    assert.equal(renderInfo.getSizeMode(), 'full-page');
    assert.equal(renderInfo.getSelector(), undefined);
    assert.equal(renderInfo.getRegion(), undefined);
  });

  it('toJSON', () => {
    const regionObj = { left: 3, top: 4, width: 5, height: 6 };
    const emulationInfo = { deviceName: 'deviceName', screenOrientation: ScreenOrientation.PORTRAIT };
    const renderInfoObj = {
      width: 1,
      height: 2,
      sizeMode: 'some size mode',
      selector: 'some selector',
      region: regionObj,
      emulationInfo,
    };

    const renderInfo = RenderInfo.fromObject(renderInfoObj);
    const renderInfoWithAdjustedLeftTop = Object.assign(renderInfoObj, {
      region: { x: 3, y: 4, width: 5, height: 6, coordinatesType: 'SCREENSHOT_AS_IS' },
    });

    assert.deepEqual(renderInfo.toJSON(), renderInfoWithAdjustedLeftTop);
  });

  it('toString', () => {
    const regionObj = { left: 3, top: 4, width: 5, height: 6 };
    const emulationInfo = { deviceName: 'deviceName', screenOrientation: ScreenOrientation.PORTRAIT };
    const renderInfoObj = {
      width: 1,
      height: 2,
      sizeMode: 'some size mode',
      selector: 'some selector',
      region: regionObj,
      emulationInfo,
    };

    const renderInfo = RenderInfo.fromObject(renderInfoObj);
    assert.deepEqual(renderInfo.toString(), 'RenderInfo { {"width":1,"height":2,"sizeMode":"some size mode","selector":"some selector","region":{"width":5,"height":6,"coordinatesType":"SCREENSHOT_AS_IS","x":3,"y":4},"emulationInfo":{"deviceName":"deviceName","screenOrientation":"portrait"}} }');
  });
});
