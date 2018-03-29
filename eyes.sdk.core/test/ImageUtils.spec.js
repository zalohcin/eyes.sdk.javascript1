'use strict';

const assert = require('assert');

const { ImageUtils } = require('../lib/images/ImageUtils');
const { PromiseFactory } = require('../lib/PromiseFactory');
const { makeImageMock } = require('./helpers');

// construct
const promiseFactory = new PromiseFactory(asyncAction => new Promise(asyncAction));

describe('ImageUtils', function () {
  this.timeout(60 * 1000);

  let originalImage;
  beforeEach(() => {
    originalImage = makeImageMock(
      'vvv',
      'iii',
      'bbb',
      'ggg',
      'yyy',
      'ooo',
      'rrr'
    );
  });

  describe('rotateImage()', () => {
    it('should rotate image for 90 degrees', () => {
      const expectedImage = makeImageMock(
        'roygbiv',
        'roygbiv',
        'roygbiv'
      );

      return ImageUtils.rotateImage(originalImage, 90, promiseFactory)
        .then(rotatedImage => assert.deepEqual(rotatedImage, expectedImage));
    });

    it('should rotate image for -90 degrees', () => {
      const expectedImage = makeImageMock(
        'vibgyor',
        'vibgyor',
        'vibgyor'
      );

      return ImageUtils.rotateImage(originalImage, -90, promiseFactory)
        .then(rotatedImage => assert.deepEqual(rotatedImage, expectedImage));
    });

    it('should rotate image for 115 degrees (90 degrees)', () => {
      const expectedImage = makeImageMock(
        'roygbiv',
        'roygbiv',
        'roygbiv'
      );

      return ImageUtils.rotateImage(originalImage, 115, promiseFactory)
        .then(rotatedImage => assert.deepEqual(rotatedImage, expectedImage));
    });

    it('should rotate image for 180 degrees', () => {
      const expectedImage = makeImageMock(
        'rrr',
        'ooo',
        'yyy',
        'ggg',
        'bbb',
        'iii',
        'vvv'
      );

      return ImageUtils.rotateImage(originalImage, 180, promiseFactory)
        .then(rotatedImage => assert.deepEqual(rotatedImage, expectedImage));
    });
  });
});
