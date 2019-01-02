'use strict';

const assert = require('assert');

const { DateTimeUtils } = require('../../../index');

describe('DateTimeUtils', () => {
  describe('toISO8601DateTime()', () => {
    it('should return formatted string', () => {
      // noinspection MagicNumberJS
      const date = new Date(1520616682000);
      assert.equal(DateTimeUtils.toISO8601DateTime(date), '2018-03-09T17:31:22Z');
    });
  });

  describe('toRfc1123DateTime()', () => {
    it('should return formatted string', () => {
      // noinspection MagicNumberJS
      const date = new Date(1520616682000);
      assert.equal(DateTimeUtils.toRfc1123DateTime(date), 'Fri, 09 Mar 2018 17:31:22 GMT');
    });
  });

  describe('toLogFileDateTime()', () => {
    it('should return formatted string', () => {
      // noinspection MagicNumberJS
      const date = new Date(1520616682332);
      assert.equal(DateTimeUtils.toLogFileDateTime(date), '2018_03_09_19_31_22_332');
    });
  });

  describe('fromISO8601DateTime()', () => {
    it('should return formatted string', () => {
      const input = '2018-03-09T17:31:22Z';
      // noinspection MagicNumberJS
      assert.equal(DateTimeUtils.fromISO8601DateTime(input)
        .getTime(), 1520616682000);
    });
  });
});
