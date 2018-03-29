'use strict';

const assert = require('assert');

const { PromiseFactory } = require('../lib/PromiseFactory');

// construct
const promiseFactory = new PromiseFactory(asyncAction => new Promise(asyncAction));

describe('PromiseFactory', () => {
  describe('#makePromise()', () => {
    it('should create promise which resolves value', done => {
      const promise = promiseFactory.makePromise(resolve => {
        resolve('resolve value');
      });

      promise.then(result => {
        assert.equal(result, 'resolve value', 'wrong resolved value');
        done();
      });
    });

    it('should create promise which reject value', done => {
      const promise = promiseFactory.makePromise((resolve, reject) => {
        reject('reject value');
      });

      promise.then(result => {
        assert.equal(result, null); // should jump over
      }).catch(err => {
        assert.equal(err, 'reject value', 'wrong reject value');
        done();
      });
    });
  });

  describe('#resolve()', () => {
    it('should create promise which resolves value', done => {
      const promise = promiseFactory.resolve('resolve value');

      promise.then(result => {
        assert.equal(result, 'resolve value', 'wrong resolved value');
        done();
      });
    });
  });

  describe('#reject()', () => {
    it('should create promise which reject value', done => {
      const promise = promiseFactory.reject('reject value');

      promise.then(result => {
        assert.equal(result, null); // should jump over
      }).catch(err => {
        assert.equal(err, 'reject value', 'wrong reject value');
        done();
      });
    });
  });

  describe('#race()', () => {
    it('should return first resolved promise value', done => {
      const p1 = promiseFactory.makePromise(resolve => {
        setTimeout(resolve, 500, 'one');
      });
      const p2 = promiseFactory.makePromise(resolve => {
        setTimeout(resolve, 100, 'two');
      });

      promiseFactory.race([p1, p2]).then(result => {
        assert.deepEqual(result, 'two', 'wrong values returned');
        done();
      });
    });
  });

  describe('#all()', () => {
    it('should wait for all promises to be resolved and collect their values', done => {
      const p1 = promiseFactory.resolve(3);
      const p2 = 1337;
      const p3 = promiseFactory.makePromise(resolve => {
        setTimeout(resolve, 100, 'foo');
      });

      promiseFactory.all([p1, p2, p3]).then(values => {
        assert.deepEqual(values, [3, 1337, 'foo'], 'wrong values returned');
        done();
      });
    });
  });
});
