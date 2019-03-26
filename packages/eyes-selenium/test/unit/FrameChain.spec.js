'use strict';

const assert = require('assert');

const { FrameChain, Frame, Logger, Location, RectangleSize } = require('../../index');

describe('FrameChain', function () {
  const logger = new Logger(true);

  it('clone', async function () {
    const frameChain = new FrameChain(logger);
    const frame = new Frame(logger, 'ref', new Location(0, 0), new RectangleSize(10, 20), new RectangleSize(10, 20), new Location(0, 0), 'mock');
    frameChain.push(frame);

    assert.strictEqual(frameChain.size(), 1);

    const clone = frameChain.clone();
    assert.strictEqual(frameChain.size(), 1);
    assert.strictEqual(clone.size(), 1);

    clone.pop();
    assert.strictEqual(frameChain.size(), 1);
    assert.strictEqual(clone.size(), 0);
  });
});
