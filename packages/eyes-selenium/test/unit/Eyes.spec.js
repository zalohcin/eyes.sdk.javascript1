'use strict';

const assert = require('assert');

const { Eyes, EyesSelenium, EyesVisualGrid } = require('../../index');

describe('Eyes', function () {

  it('should create EyesSelenium by default', async function () {
    const eyes = new Eyes();
    assert.ok(!eyes.isVisualGrid());
    assert.ok(eyes instanceof EyesSelenium);
  });

  it('should create EyesSelenium with `false`', async function () {
    const eyes = new Eyes(undefined, undefined, false);
    assert.ok(!eyes.isVisualGrid());
    assert.ok(eyes instanceof EyesSelenium);
  });

  it('should create EyesVisualGrid with `true`', async function () {
    const eyes = new Eyes(undefined, undefined, true);
    assert.ok(eyes.isVisualGrid());
    assert.ok(eyes instanceof EyesVisualGrid);
  });

  it('should create EyesSelenium with `false` first argument', async function () {
    const eyes = new Eyes(false);
    assert.ok(!eyes.isVisualGrid());
    assert.ok(eyes instanceof EyesSelenium);
  });

  it('should create EyesVisualGrid with `true` first argument', async function () {
    const eyes = new Eyes(true);
    assert.ok(eyes.isVisualGrid());
    assert.ok(eyes instanceof EyesVisualGrid);
  });

});
