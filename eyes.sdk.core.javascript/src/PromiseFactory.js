'use strict';

/**
 * After initialization, provides factory methods for creating deferreds/promises.
 */
class PromiseFactory {

    /**
     * @param {function} promiseFactoryFunc A function which receives as a parameter
     *                   the same function you would pass to a Promise constructor.
     * @param {function} deferredFactoryFunc A function which returns a deferred.
     */
    constructor(promiseFactoryFunc, deferredFactoryFunc) {
        this._promiseFactoryFunc = promiseFactoryFunc;
        this._deferredFactoryFunc = deferredFactoryFunc;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets the factory methods which will be used to create promises and deferred-s.
     *
     * @param {function} promiseFactoryFunc A function which receives as a parameter
     *                   the same function you would pass to a Promise constructor.
     * @param {function} deferredFactoryFunc A function which returns a deferred.
     */
    setFactoryMethods(promiseFactoryFunc, deferredFactoryFunc) {
        this._promiseFactoryFunc = promiseFactoryFunc;
        this._deferredFactoryFunc = deferredFactoryFunc;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     *
     * @param {function} asyncAction
     * @return {*}
     */
    makePromise(asyncAction) {
        if (this._promiseFactoryFunc) {
            return this._promiseFactoryFunc(asyncAction);
        }

        throw new Error('Promise factory was not initialized with proper callback');
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @template T
     * @param {T} [resolveValue]
     * @return {Promise.<T>}
     */
    resolve(resolveValue) {
        return this.makePromise(resolve => {
            resolve(resolveValue);
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @template T
     * @param {T} [rejectValue]
     * @return {Promise.<T>}
     */
    reject(rejectValue) {
        return this.makePromise((resolve, reject) => {
            reject(rejectValue);
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     @param {Promise[]} promises
     @return {Promise.<[*]>}
     */
    all(promises) {
        const accumulator = [];
        let ready = this.resolve(null);

        promises.forEach(function (promise, ndx) {
            ready = ready.then(function () {
                return promise;
            }).then(function (value) {
                accumulator[ndx] = value;
            });
        });

        return ready.then(function () {
            return accumulator;
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {Function<boolean>} condition
     * @param {Function<Promise>} action
     * @return {Promise}
     */
    promiseWhile(condition, action) {
        if (!condition()) {
            return this.resolve();
        }

        const that = this;
        return action().then(() => {
            return that.promiseWhile(condition, action)
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * @deprecated
     * @return {*}
     */
    makeDeferred() {
        if (this._deferredFactoryFunc) {
            return this._deferredFactoryFunc();
        }

        throw new Error('Promise factory was not initialized with proper callback');
    }
}

module.exports = PromiseFactory;
