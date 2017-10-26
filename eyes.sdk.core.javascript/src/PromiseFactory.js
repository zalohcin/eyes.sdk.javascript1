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
     * The Promise object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.
     *
     * @param {function} executor A function that is passed with the arguments resolve and reject.
     * @return {*}
     */
    makePromise(executor) {
        if (this._promiseFactoryFunc) {
            return this._promiseFactoryFunc(executor);
        }

        throw new Error('Promise factory was not initialized with proper callback');
    }

    /**
     * The method returns a Promise object that is resolved with the given value.
     *
     * @template T
     * @param {T} [value] argument to be resolved by this Promise. Can also be a Promise or a thenable to resolve.
     * @return {Promise.<T>}
     */
    resolve(value) {
        return this.makePromise(resolve => {
            resolve(value);
        });
    }

    /**
     * The method returns a Promise object that is rejected with the given reason.
     *
     * @template T
     * @param {T} [value] reason why this Promise rejected.
     * @return {Promise.<T>}
     */
    reject(value) {
        return this.makePromise((resolve, reject) => {
            reject(value);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * The method returns a promise that resolves or rejects as soon as one of the promises in the iterable resolves or rejects, with the value or reason from that promise.
     *
     * @param {Iterable.<Promise>} iterable
     * @return {Promise.<*>}
     */
    race(iterable) {
        return this.makePromise((resolve, reject) => {
            // noinspection JSUnresolvedVariable
            for (let i = 0, len = iterable.length; i < len; i++) {
                iterable[i].then(resolve, reject);
            }
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * The method returns a single Promise that resolves when all of the promises in the iterable argument have resolved or when the iterable argument contains no promises.
     * It rejects with the reason of the first promise that rejects.
     *
     * @param {Iterable.<Promise>} iterable
     * @return {Promise.<[*]>}
     */
    all(iterable) {
        const args = Array.prototype.slice.call(iterable);

        return this.makePromise((resolve, reject) => {
            if (args.length === 0) return resolve([]);
            let remaining = args.length;

            function resolveFn(curr, i) {
                try {
                    if (curr && (typeof curr === 'object' || typeof curr === 'function') && typeof curr.then === 'function') {
                        // noinspection JSUnresolvedFunction
                        curr.then.call(curr, val => resolveFn(val, i), reject);
                        return;
                    }
                    args[i] = curr;
                    if (--remaining === 0) resolve(args);
                } catch (ex) {
                    reject(ex);
                }
            }

            for (let i = 0; i < args.length; i++) {
                resolveFn(args[i], i);
            }
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Iterate over an array, or a promise of an array, which contains promises (or a mix of promises and values) with the given
     * iterator function with the signature (value, index, length) where value is the resolved value of a respective promise in the input array.
     * Iteration happens serially. If the iterator function returns a promise or a thenable, then the result of the promise is awaited before continuing with next iteration.
     * If any promise in the input array is rejected, then the returned promise is rejected as well.
     *
     * @Template T
     * @param {Iterable.<T>} iterable
     * @param {function(item: T, index: int, length: int)} iterator
     * @return {Promise<Iterable.<T>>} resolves to the original array unmodified.
     */
    each(iterable, iterator) {
        // noinspection JSUnresolvedFunction
        const args = Array.prototype.slice.call(iterable);

        if (args.length === 0) {
            return this.resolve();
        }

        const empty = this.resolve();
        return this.makePromise((resolve, reject) => {
            if (args.length === 0) return resolve();

            function reduce(prev, curr, i) {
                if (curr && (typeof curr === 'object' || typeof curr === 'function') && typeof curr.then === 'function') {
                    return curr.then.call(curr, val => reduce(prev, val, i), reject);
                }
                return prev.then(() => iterator(curr, i, args.length));
            }

            return args.reduce(reduce, empty).then(() => resolve(args));
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
