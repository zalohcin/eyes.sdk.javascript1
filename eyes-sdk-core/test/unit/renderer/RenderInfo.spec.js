'use strict';

const assert = require('assert');

const { RenderInfo, Region, RectangleSize, EmulationInfo, ScreenOrientation } = require('../../../index');

describe('RenderInfo', () => {
  it('constructor', () => {
    const renderInfo = new RenderInfo();
    assert.equal(Object.prototype.hasOwnProperty.call(renderInfo, '_width'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(renderInfo, '_height'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(renderInfo, '_sizeMode'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(renderInfo, '_selector'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(renderInfo, '_region'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(renderInfo, '_emulationInfo'), true);
  });

  it('constructor with object', () => {
    const regionObj = { left: 3, top: 4, width: 5, height: 6 };
    const emulationInfoObj = { deviceName: 'deviceName' };

    const renderInfo = new RenderInfo({
      width: 1,
      height: 2,
      sizeMode: 'some size mode',
      selector: 'some selector',
      region: regionObj,
      emulationInfo: emulationInfoObj,
    });

    const region = new Region(regionObj);
    const emulationInfo = new EmulationInfo(emulationInfoObj);

    assert.equal(renderInfo.getWidth(), 1);
    assert.equal(renderInfo.getHeight(), 2);
    assert.equal(renderInfo.getSizeMode(), 'some size mode');
    assert.equal(renderInfo.getSelector(), 'some selector');
    assert.deepEqual(renderInfo.getRegion(), region);
    assert.deepEqual(renderInfo.getEmulationInfo(), emulationInfo);
  });

  it('constructor handles undefined region', () => {
    const renderInfo = new RenderInfo();
    assert.equal(renderInfo.getRegion(), undefined);
  });

  it('fromRectangleSize', () => {
    const rectangleSize = new RectangleSize({ width: 1, height: 2 });
    const renderInfo = RenderInfo.fromRectangleSize(rectangleSize, 'some size mode');

    assert.equal(renderInfo.getWidth(), 1);
    assert.equal(renderInfo.getHeight(), 2);
    assert.equal(renderInfo.getSizeMode(), 'some size mode');
    assert.equal(renderInfo.getSelector(), undefined);
    assert.equal(renderInfo.getRegion(), undefined);
  });

  it('fromRectangleSize has a default sizeMode', () => {
    const rectangleSize = new RectangleSize({ width: 1, height: 2 });
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

    const renderInfo = new RenderInfo(renderInfoObj);
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

    const renderInfo = new RenderInfo(renderInfoObj);
    assert.deepEqual(renderInfo.toString(), 'RenderInfo { {"width":1,"height":2,"sizeMode":"some size mode","selector":"some selector","region":{"width":5,"height":6,"coordinatesType":"SCREENSHOT_AS_IS","x":3,"y":4},"emulationInfo":{"deviceName":"deviceName","screenOrientation":"portrait"}} }');
  });
});
