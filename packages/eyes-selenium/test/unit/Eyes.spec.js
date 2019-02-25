'use strict';

const assert = require('assert');

const { Eyes, EyesSelenium, EyesRendering, RenderingConfiguration } = require('../../index');

describe('Eyes', function () {

  it('should create EyesSelenium by default', async function () {
    const eyes = new Eyes();
    assert.ok(eyes instanceof EyesSelenium);
  });

  it('should create EyesSelenium with `false`', async function () {
    const eyes = new Eyes(undefined, undefined, false);
    assert.ok(eyes instanceof EyesSelenium);
  });

  it('should create EyesRendering with `true`', async function () {
    const eyes = new Eyes(undefined, undefined, true);
    assert.ok(eyes instanceof EyesRendering);
  });

  it('should create EyesRendering with RenderingConfiguration', async function () {
    const eyes = new Eyes(undefined, undefined, new RenderingConfiguration());
    assert.ok(eyes instanceof EyesRendering);
  });
});
