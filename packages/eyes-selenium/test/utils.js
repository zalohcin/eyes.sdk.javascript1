'use strict';

const assert = require('assert');

exports.throwsAsync = async function throwsAsync(fn, error, message) {
  let f = () => {};
  try {
    await fn();
  } catch (e) {
    f = () => {
      throw e;
    };
  } finally {
    assert.throws(f, error, message);
  }
};
