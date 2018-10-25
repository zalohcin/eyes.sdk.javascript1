'use strict';

const assert = require('assert');

const { RenderStatusResults } = require('../../../index');

describe('RenderStatusResults', () => {
  it('constructor', () => {
    const results = new RenderStatusResults();
    assert.equal(Object.prototype.hasOwnProperty.call(results, '_status'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(results, '_imageLocation'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(results, '_domLocation'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(results, '_error'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(results, '_os'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(results, '_userAgent'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(results, '_deviceSize'), true);
    assert.equal(Object.prototype.hasOwnProperty.call(results, '_selectorRegions'), true);
  });

  it('fromObject', () => {
    const status = 'some status';
    const error = 'some error';
    const imageLocation = 'some image location';
    const domLocation = 'some dom location';
    const os = 'some os';
    const userAgent = 'some user agent';
    const deviceSize = { width: 1, height: 2 };
    const selectorRegions = [{ x: 1, y: 2, width: 3, height: 4 }];
    const results = RenderStatusResults.fromObject({
      status,
      error,
      imageLocation,
      domLocation,
      os,
      userAgent,
      deviceSize,
      selectorRegions,
    });

    assert.equal(results.getStatus(), status);
    assert.equal(results.getError(), error);
    assert.equal(results.getImageLocation(), imageLocation);
    assert.equal(results.getDomLocation(), domLocation);
    assert.equal(results.getOS(), os);
    assert.equal(results.getUserAgent(), userAgent);
    assert.deepEqual(results.getDeviceSize().toJSON(), deviceSize);
    assert.deepEqual(results.getSelectorRegions().map(region => region.toJSON()), [{ left: 1, top: 2, width: 3, height: 4, coordinatesType: 'SCREENSHOT_AS_IS' }]);
  });

  it('toJSON', () => {
    const status = 'some status';
    const error = 'some error';
    const imageLocation = 'some image location';
    const domLocation = 'some dom location';
    const os = 'some os';
    const userAgent = 'some user agent';
    const deviceSize = { width: 1, height: 2 };
    const selectorRegions = [{ x: 1, y: 2, width: 3, height: 4 }];
    const results = RenderStatusResults.fromObject({
      status,
      error,
      imageLocation,
      domLocation,
      os,
      userAgent,
      deviceSize,
      selectorRegions,
    });

    assert.equal(JSON.stringify(results), '{"status":"some status","imageLocation":"some image location","domLocation":"some dom location","error":"some error","os":"some os","userAgent":"some user agent","deviceSize":{"width":1,"height":2},"selectorRegions":[{"left":1,"top":2,"width":3,"height":4,"coordinatesType":"SCREENSHOT_AS_IS"}]}');
  });

  it('toString', () => {
    const status = 'some status';
    const error = 'some error';
    const imageLocation = 'some image location';
    const domLocation = 'some dom location';
    const os = 'some os';
    const userAgent = 'some user agent';
    const deviceSize = { width: 1, height: 2 };
    const selectorRegions = [{ x: 1, y: 2, width: 3, height: 4 }];
    const results = RenderStatusResults.fromObject({
      status,
      error,
      imageLocation,
      domLocation,
      os,
      userAgent,
      deviceSize,
      selectorRegions,
    });

    assert.equal(results.toString(), 'RenderStatusResults { {"status":"some status","imageLocation":"some image location","domLocation":"some dom location","error":"some error","os":"some os","userAgent":"some user agent","deviceSize":{"width":1,"height":2},"selectorRegions":[{"left":1,"top":2,"width":3,"height":4,"coordinatesType":"SCREENSHOT_AS_IS"}]} }');
  });
});
