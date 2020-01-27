
module.exports = function captureFrameAndPoll () {
  var captureFrameAndPoll = (function () {
	'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var runtime_1 = createCommonjsModule(function (module) {
	  /**
	   * Copyright (c) 2014-present, Facebook, Inc.
	   *
	   * This source code is licensed under the MIT license found in the
	   * LICENSE file in the root directory of this source tree.
	   */
	  var runtime = function (exports) {

	    var Op = window.Object.prototype;
	    var hasOwn = Op.hasOwnProperty;
	    var undefined$1; // More compressible than void 0.

	    var $Symbol = typeof window.Symbol === "function" ? window.Symbol : {};
	    var iteratorSymbol = $Symbol.iterator || "@@iterator";
	    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	    function wrap(innerFn, outerFn, self, tryLocsList) {
	      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	      var generator = window.Object.create(protoGenerator.prototype);
	      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
	      // .throw, and .return methods.

	      generator._invoke = makeInvokeMethod(innerFn, self, context);
	      return generator;
	    }

	    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
	    // record like context.tryEntries[i].completion. This interface could
	    // have been (and was previously) designed to take a closure to be
	    // invoked without arguments, but in all the cases we care about we
	    // already have an existing method we want to call, so there's no need
	    // to create a new function object. We can even get away with assuming
	    // the method takes exactly one argument, since that happens to be true
	    // in every case, so we don't have to touch the arguments object. The
	    // only additional allocation required is the completion record, which
	    // has a stable shape and so hopefully should be cheap to allocate.

	    function tryCatch(fn, obj, arg) {
	      try {
	        return {
	          type: "normal",
	          arg: fn.call(obj, arg)
	        };
	      } catch (err) {
	        return {
	          type: "throw",
	          arg: err
	        };
	      }
	    }

	    var GenStateSuspendedStart = "suspendedStart";
	    var GenStateSuspendedYield = "suspendedYield";
	    var GenStateExecuting = "executing";
	    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
	    // breaking out of the dispatch switch statement.

	    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
	    // .constructor.prototype properties for functions that return Generator
	    // objects. For full spec compliance, you may wish to configure your
	    // minifier not to mangle the names of these two functions.

	    function Generator() {}

	    function GeneratorFunction() {}

	    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
	    // don't natively support it.


	    var IteratorPrototype = {};

	    IteratorPrototype[iteratorSymbol] = function () {
	      return this;
	    };

	    var getProto = window.Object.getPrototypeOf;
	    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

	    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	      // This environment has a native %IteratorPrototype%; use it instead
	      // of the polyfill.
	      IteratorPrototype = NativeIteratorPrototype;
	    }

	    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = window.Object.create(IteratorPrototype);
	    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	    GeneratorFunctionPrototype.constructor = GeneratorFunction;
	    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
	    // Iterator interface in terms of a single ._invoke method.

	    function defineIteratorMethods(prototype) {
	      ["next", "throw", "return"].forEach(function (method) {
	        prototype[method] = function (arg) {
	          return this._invoke(method, arg);
	        };
	      });
	    }

	    exports.isGeneratorFunction = function (genFun) {
	      var ctor = typeof genFun === "function" && genFun.constructor;
	      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
	      // do is to check its .name property.
	      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
	    };

	    exports.mark = function (genFun) {
	      if (window.Object.setPrototypeOf) {
	        window.Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	      } else {
	        genFun.__proto__ = GeneratorFunctionPrototype;

	        if (!(toStringTagSymbol in genFun)) {
	          genFun[toStringTagSymbol] = "GeneratorFunction";
	        }
	      }

	      genFun.prototype = window.Object.create(Gp);
	      return genFun;
	    }; // Within the body of any async function, `await x` is transformed to
	    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	    // `hasOwn.call(value, "__await")` to determine if the yielded value is
	    // meant to be awaited.


	    exports.awrap = function (arg) {
	      return {
	        __await: arg
	      };
	    };

	    function AsyncIterator(generator) {
	      function invoke(method, arg, resolve, reject) {
	        var record = tryCatch(generator[method], generator, arg);

	        if (record.type === "throw") {
	          reject(record.arg);
	        } else {
	          var result = record.arg;
	          var value = result.value;

	          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
	            return Promise.resolve(value.__await).then(function (value) {
	              invoke("next", value, resolve, reject);
	            }, function (err) {
	              invoke("throw", err, resolve, reject);
	            });
	          }

	          return Promise.resolve(value).then(function (unwrapped) {
	            // When a yielded Promise is resolved, its final value becomes
	            // the .value of the Promise<{value,done}> result for the
	            // current iteration.
	            result.value = unwrapped;
	            resolve(result);
	          }, function (error) {
	            // If a rejected Promise was yielded, throw the rejection back
	            // into the async generator function so it can be handled there.
	            return invoke("throw", error, resolve, reject);
	          });
	        }
	      }

	      var previousPromise;

	      function enqueue(method, arg) {
	        function callInvokeWithMethodAndArg() {
	          return new Promise(function (resolve, reject) {
	            invoke(method, arg, resolve, reject);
	          });
	        }

	        return previousPromise = // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
	        // invocations of the iterator.
	        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
	      } // Define the unified helper method that is used to implement .next,
	      // .throw, and .return (see defineIteratorMethods).


	      this._invoke = enqueue;
	    }

	    defineIteratorMethods(AsyncIterator.prototype);

	    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	      return this;
	    };

	    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
	    // AsyncIterator objects; they just return a Promise for the value of
	    // the final result produced by the iterator.

	    exports.async = function (innerFn, outerFn, self, tryLocsList) {
	      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
	      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function (result) {
	        return result.done ? result.value : iter.next();
	      });
	    };

	    function makeInvokeMethod(innerFn, self, context) {
	      var state = GenStateSuspendedStart;
	      return function invoke(method, arg) {
	        if (state === GenStateExecuting) {
	          throw new Error("Generator is already running");
	        }

	        if (state === GenStateCompleted) {
	          if (method === "throw") {
	            throw arg;
	          } // Be forgiving, per 25.3.3.3.3 of the spec:
	          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


	          return doneResult();
	        }

	        context.method = method;
	        context.arg = arg;

	        while (true) {
	          var delegate = context.delegate;

	          if (delegate) {
	            var delegateResult = maybeInvokeDelegate(delegate, context);

	            if (delegateResult) {
	              if (delegateResult === ContinueSentinel) continue;
	              return delegateResult;
	            }
	          }

	          if (context.method === "next") {
	            // Setting context._sent for legacy support of Babel's
	            // function.sent implementation.
	            context.sent = context._sent = context.arg;
	          } else if (context.method === "throw") {
	            if (state === GenStateSuspendedStart) {
	              state = GenStateCompleted;
	              throw context.arg;
	            }

	            context.dispatchException(context.arg);
	          } else if (context.method === "return") {
	            context.abrupt("return", context.arg);
	          }

	          state = GenStateExecuting;
	          var record = tryCatch(innerFn, self, context);

	          if (record.type === "normal") {
	            // If an exception is thrown from innerFn, we leave state ===
	            // GenStateExecuting and loop back for another invocation.
	            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

	            if (record.arg === ContinueSentinel) {
	              continue;
	            }

	            return {
	              value: record.arg,
	              done: context.done
	            };
	          } else if (record.type === "throw") {
	            state = GenStateCompleted; // Dispatch the exception by looping back around to the
	            // context.dispatchException(context.arg) call above.

	            context.method = "throw";
	            context.arg = record.arg;
	          }
	        }
	      };
	    } // Call delegate.iterator[context.method](context.arg) and handle the
	    // result, either by returning a { value, done } result from the
	    // delegate iterator, or by modifying context.method and context.arg,
	    // setting context.delegate to null, and returning the ContinueSentinel.


	    function maybeInvokeDelegate(delegate, context) {
	      var method = delegate.iterator[context.method];

	      if (method === undefined$1) {
	        // A .throw or .return when the delegate iterator has no .throw
	        // method always terminates the yield* loop.
	        context.delegate = null;

	        if (context.method === "throw") {
	          // Note: ["return"] must be used for ES3 parsing compatibility.
	          if (delegate.iterator["return"]) {
	            // If the delegate iterator has a return method, give it a
	            // chance to clean up.
	            context.method = "return";
	            context.arg = undefined$1;
	            maybeInvokeDelegate(delegate, context);

	            if (context.method === "throw") {
	              // If maybeInvokeDelegate(context) changed context.method from
	              // "return" to "throw", let that override the TypeError below.
	              return ContinueSentinel;
	            }
	          }

	          context.method = "throw";
	          context.arg = new TypeError("The iterator does not provide a 'throw' method");
	        }

	        return ContinueSentinel;
	      }

	      var record = tryCatch(method, delegate.iterator, context.arg);

	      if (record.type === "throw") {
	        context.method = "throw";
	        context.arg = record.arg;
	        context.delegate = null;
	        return ContinueSentinel;
	      }

	      var info = record.arg;

	      if (!info) {
	        context.method = "throw";
	        context.arg = new TypeError("iterator result is not an object");
	        context.delegate = null;
	        return ContinueSentinel;
	      }

	      if (info.done) {
	        // Assign the result of the finished delegate to the temporary
	        // variable specified by delegate.resultName (see delegateYield).
	        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

	        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
	        // exception, let the outer generator proceed normally. If
	        // context.method was "next", forget context.arg since it has been
	        // "consumed" by the delegate iterator. If context.method was
	        // "return", allow the original .return call to continue in the
	        // outer generator.

	        if (context.method !== "return") {
	          context.method = "next";
	          context.arg = undefined$1;
	        }
	      } else {
	        // Re-yield the result returned by the delegate method.
	        return info;
	      } // The delegate iterator is finished, so forget it and continue with
	      // the outer generator.


	      context.delegate = null;
	      return ContinueSentinel;
	    } // Define Generator.prototype.{next,throw,return} in terms of the
	    // unified ._invoke helper method.


	    defineIteratorMethods(Gp);
	    Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
	    // @@iterator function is called on it. Some browsers' implementations of the
	    // iterator prototype chain incorrectly implement this, causing the Generator
	    // object to not be returned from this call. This ensures that doesn't happen.
	    // See https://github.com/facebook/regenerator/issues/274 for more details.

	    Gp[iteratorSymbol] = function () {
	      return this;
	    };

	    Gp.toString = function () {
	      return "[object Generator]";
	    };

	    function pushTryEntry(locs) {
	      var entry = {
	        tryLoc: locs[0]
	      };

	      if (1 in locs) {
	        entry.catchLoc = locs[1];
	      }

	      if (2 in locs) {
	        entry.finallyLoc = locs[2];
	        entry.afterLoc = locs[3];
	      }

	      this.tryEntries.push(entry);
	    }

	    function resetTryEntry(entry) {
	      var record = entry.completion || {};
	      record.type = "normal";
	      delete record.arg;
	      entry.completion = record;
	    }

	    function Context(tryLocsList) {
	      // The root entry object (effectively a try statement without a catch
	      // or a finally block) gives us a place to store values thrown from
	      // locations where there is no enclosing try statement.
	      this.tryEntries = [{
	        tryLoc: "root"
	      }];
	      tryLocsList.forEach(pushTryEntry, this);
	      this.reset(true);
	    }

	    exports.keys = function (object) {
	      var keys = [];

	      for (var key in object) {
	        keys.push(key);
	      }

	      keys.reverse(); // Rather than returning an object with a next method, we keep
	      // things simple and return the next function itself.

	      return function next() {
	        while (keys.length) {
	          var key = keys.pop();

	          if (key in object) {
	            next.value = key;
	            next.done = false;
	            return next;
	          }
	        } // To avoid creating an additional object, we just hang the .value
	        // and .done properties off the next function object itself. This
	        // also ensures that the minifier will not anonymize the function.


	        next.done = true;
	        return next;
	      };
	    };

	    function values(iterable) {
	      if (iterable) {
	        var iteratorMethod = iterable[iteratorSymbol];

	        if (iteratorMethod) {
	          return iteratorMethod.call(iterable);
	        }

	        if (typeof iterable.next === "function") {
	          return iterable;
	        }

	        if (!isNaN(iterable.length)) {
	          var i = -1,
	              next = function next() {
	            while (++i < iterable.length) {
	              if (hasOwn.call(iterable, i)) {
	                next.value = iterable[i];
	                next.done = false;
	                return next;
	              }
	            }

	            next.value = undefined$1;
	            next.done = true;
	            return next;
	          };

	          return next.next = next;
	        }
	      } // Return an iterator with no values.


	      return {
	        next: doneResult
	      };
	    }

	    exports.values = values;

	    function doneResult() {
	      return {
	        value: undefined$1,
	        done: true
	      };
	    }

	    Context.prototype = {
	      constructor: Context,
	      reset: function (skipTempReset) {
	        this.prev = 0;
	        this.next = 0; // Resetting context._sent for legacy support of Babel's
	        // function.sent implementation.

	        this.sent = this._sent = undefined$1;
	        this.done = false;
	        this.delegate = null;
	        this.method = "next";
	        this.arg = undefined$1;
	        this.tryEntries.forEach(resetTryEntry);

	        if (!skipTempReset) {
	          for (var name in this) {
	            // Not sure about the optimal order of these conditions:
	            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
	              this[name] = undefined$1;
	            }
	          }
	        }
	      },
	      stop: function () {
	        this.done = true;
	        var rootEntry = this.tryEntries[0];
	        var rootRecord = rootEntry.completion;

	        if (rootRecord.type === "throw") {
	          throw rootRecord.arg;
	        }

	        return this.rval;
	      },
	      dispatchException: function (exception) {
	        if (this.done) {
	          throw exception;
	        }

	        var context = this;

	        function handle(loc, caught) {
	          record.type = "throw";
	          record.arg = exception;
	          context.next = loc;

	          if (caught) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            context.method = "next";
	            context.arg = undefined$1;
	          }

	          return !!caught;
	        }

	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];
	          var record = entry.completion;

	          if (entry.tryLoc === "root") {
	            // Exception thrown outside of any try block that could handle
	            // it, so set the completion value of the entire function to
	            // throw the exception.
	            return handle("end");
	          }

	          if (entry.tryLoc <= this.prev) {
	            var hasCatch = hasOwn.call(entry, "catchLoc");
	            var hasFinally = hasOwn.call(entry, "finallyLoc");

	            if (hasCatch && hasFinally) {
	              if (this.prev < entry.catchLoc) {
	                return handle(entry.catchLoc, true);
	              } else if (this.prev < entry.finallyLoc) {
	                return handle(entry.finallyLoc);
	              }
	            } else if (hasCatch) {
	              if (this.prev < entry.catchLoc) {
	                return handle(entry.catchLoc, true);
	              }
	            } else if (hasFinally) {
	              if (this.prev < entry.finallyLoc) {
	                return handle(entry.finallyLoc);
	              }
	            } else {
	              throw new Error("try statement without catch or finally");
	            }
	          }
	        }
	      },
	      abrupt: function (type, arg) {
	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];

	          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	            var finallyEntry = entry;
	            break;
	          }
	        }

	        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
	          // Ignore the finally entry if control is not jumping to a
	          // location outside the try/catch block.
	          finallyEntry = null;
	        }

	        var record = finallyEntry ? finallyEntry.completion : {};
	        record.type = type;
	        record.arg = arg;

	        if (finallyEntry) {
	          this.method = "next";
	          this.next = finallyEntry.finallyLoc;
	          return ContinueSentinel;
	        }

	        return this.complete(record);
	      },
	      complete: function (record, afterLoc) {
	        if (record.type === "throw") {
	          throw record.arg;
	        }

	        if (record.type === "break" || record.type === "continue") {
	          this.next = record.arg;
	        } else if (record.type === "return") {
	          this.rval = this.arg = record.arg;
	          this.method = "return";
	          this.next = "end";
	        } else if (record.type === "normal" && afterLoc) {
	          this.next = afterLoc;
	        }

	        return ContinueSentinel;
	      },
	      finish: function (finallyLoc) {
	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];

	          if (entry.finallyLoc === finallyLoc) {
	            this.complete(entry.completion, entry.afterLoc);
	            resetTryEntry(entry);
	            return ContinueSentinel;
	          }
	        }
	      },
	      "catch": function (tryLoc) {
	        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	          var entry = this.tryEntries[i];

	          if (entry.tryLoc === tryLoc) {
	            var record = entry.completion;

	            if (record.type === "throw") {
	              var thrown = record.arg;
	              resetTryEntry(entry);
	            }

	            return thrown;
	          }
	        } // The context.catch method must only be called with a location
	        // argument that corresponds to a known catch block.


	        throw new Error("illegal catch attempt");
	      },
	      delegateYield: function (iterable, resultName, nextLoc) {
	        this.delegate = {
	          iterator: values(iterable),
	          resultName: resultName,
	          nextLoc: nextLoc
	        };

	        if (this.method === "next") {
	          // Deliberately forget the last sent value so that we don't
	          // accidentally pass it on to the delegate.
	          this.arg = undefined$1;
	        }

	        return ContinueSentinel;
	      }
	    }; // Regardless of whether this script is executing as a CommonJS module
	    // or not, return the runtime object so that we can declare the variable
	    // regeneratorRuntime in the outer scope, which allows this module to be
	    // injected easily by `bin/regenerator --include-runtime script.js`.

	    return exports;
	  }( // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	   module.exports );

	  try {
	    regeneratorRuntime = runtime;
	  } catch (accidentalStrictMode) {
	    // This module should not be running in strict mode, so the above
	    // assignment should always work unless something is misconfigured. Just
	    // in case runtime.js accidentally runs in strict mode, we can escape
	    // strict mode using a global Function call. This could conceivably fail
	    // if a Content Security Policy forbids using Function, but in that case
	    // the proper solution is to fix the accidental strict mode problem. If
	    // you've misconfigured your bundler to force strict mode and applied a
	    // CSP to forbid Function, and you're not willing to fix either of those
	    // problems, please detail your unique predicament in a GitHub issue.
	    Function("r", "regeneratorRuntime = r")(runtime);
	  }
	});

	var regenerator = runtime_1;

	const styleProps = ['background-repeat', 'background-origin', 'background-position', 'background-color', 'background-image', 'background-size', 'border-width', 'border-color', 'border-style', 'color', 'display', 'font-size', 'line-height', 'margin', 'opacity', 'overflow', 'padding', 'visibility'];
	const rectProps = ['width', 'height', 'top', 'left'];
	const ignoredTagNames = ['HEAD', 'SCRIPT'];
	var defaultDomProps = {
	  styleProps,
	  rectProps,
	  ignoredTagNames
	};

	const bgImageRe = /url\((?!['"]?:)['"]?([^'")]*)['"]?\)/;

	function getBackgroundImageUrl(cssText) {
	  const match = cssText ? cssText.match(bgImageRe) : undefined;
	  return match ? match[1] : match;
	}

	var getBackgroundImageUrl_1 = getBackgroundImageUrl;

	const psetTimeout = t => new Promise(res => {
	  setTimeout(res, t);
	});

	function getImageSizes({
	  bgImages,
	  timeout = 5000,
	  Image = window.Image
	}) {
	  return regenerator.async(function getImageSizes$(_context) {
	    while (1) switch (_context.prev = _context.next) {
	      case 0:
	        _context.next = 2;
	        return regenerator.awrap(Promise.all(window.Array.from(bgImages).map(url => Promise.race([new Promise(resolve => {
	          const img = new Image();

	          img.onload = () => resolve({
	            url,
	            width: img.naturalWidth,
	            height: img.naturalHeight
	          });

	          img.onerror = () => resolve();

	          img.src = url;
	        }), psetTimeout(timeout)]))));

	      case 2:
	        _context.t0 = (images, curr) => {
	          if (curr) {
	            images[curr.url] = {
	              width: curr.width,
	              height: curr.height
	            };
	          }

	          return images;
	        };

	        _context.t1 = {};
	        return _context.abrupt("return", _context.sent.reduce(_context.t0, _context.t1));

	      case 5:
	      case "end":
	        return _context.stop();
	    }
	  });
	}

	var getImageSizes_1 = getImageSizes;

	function genXpath(el) {
	  if (!el.ownerDocument) return ''; // this is the document node

	  let xpath = '',
	      currEl = el,
	      doc = el.ownerDocument,
	      frameElement = doc.defaultView.frameElement;

	  while (currEl !== doc) {
	    xpath = `${currEl.tagName}[${getIndex(currEl)}]/${xpath}`;
	    currEl = currEl.parentNode;
	  }

	  if (frameElement) {
	    xpath = `${genXpath(frameElement)},${xpath}`;
	  }

	  return xpath.replace(/\/$/, '');
	}

	function getIndex(el) {
	  return window.Array.prototype.filter.call(el.parentNode.childNodes, node => node.tagName === el.tagName).indexOf(el) + 1;
	}

	var genXpath_1 = genXpath;

	function absolutizeUrl(url, absoluteUrl) {
	  return new URL(url, absoluteUrl).href;
	}

	var absolutizeUrl_1 = absolutizeUrl;

	function makeGetBundledCssFromCssText({
	  parseCss,
	  CSSImportRule,
	  absolutizeUrl,
	  getCssFromCache,
	  unfetchedToken
	}) {
	  return function getBundledCssFromCssText(cssText, styleBaseUrl) {
	    let unfetchedResources;
	    let bundledCss = '';

	    try {
	      const styleSheet = parseCss(cssText);

	      for (const rule of window.Array.from(styleSheet.cssRules)) {
	        if (rule instanceof CSSImportRule) {
	          const nestedUrl = absolutizeUrl(rule.href, styleBaseUrl);
	          const nestedResource = getCssFromCache(nestedUrl);

	          if (nestedResource !== undefined) {
	            const {
	              bundledCss: nestedCssText,
	              unfetchedResources: nestedUnfetchedResources
	            } = getBundledCssFromCssText(nestedResource, nestedUrl);
	            nestedUnfetchedResources && (unfetchedResources = new window.Set(nestedUnfetchedResources));
	            bundledCss = `${nestedCssText}${bundledCss}`;
	          } else {
	            unfetchedResources = new window.Set([nestedUrl]);
	            bundledCss = `\n${unfetchedToken}${nestedUrl}${unfetchedToken}`;
	          }
	        }
	      }
	    } catch (ex) {
	      console.log(`error during getBundledCssFromCssText, styleBaseUrl=${styleBaseUrl}`, ex);
	    }

	    bundledCss = `${bundledCss}${getCss(cssText, styleBaseUrl)}`;
	    return {
	      bundledCss,
	      unfetchedResources
	    };
	  };
	}

	function getCss(newText, url) {
	  return `\n/** ${url} **/\n${newText}`;
	}

	var getBundledCssFromCssText = makeGetBundledCssFromCssText;

	function parseCss(styleContent) {
	  var doc = document.implementation.createHTMLDocument(''),
	      styleElement = doc.createElement('style');
	  styleElement.textContent = styleContent; // the style will only be parsed once it is added to a document

	  doc.body.appendChild(styleElement);
	  return styleElement.sheet;
	}

	var parseCss_1 = parseCss;

	function makeFetchCss(fetch) {
	  return function fetchCss(url) {
	    var response;
	    return regenerator.async(function fetchCss$(_context) {
	      while (1) switch (_context.prev = _context.next) {
	        case 0:
	          _context.prev = 0;
	          _context.next = 3;
	          return regenerator.awrap(fetch(url, {
	            cache: 'force-cache'
	          }));

	        case 3:
	          response = _context.sent;

	          if (!response.ok) {
	            _context.next = 8;
	            break;
	          }

	          _context.next = 7;
	          return regenerator.awrap(response.text());

	        case 7:
	          return _context.abrupt("return", _context.sent);

	        case 8:
	          console.log('/failed to fetch (status ' + response.status + ') css from: ' + url + '/');
	          _context.next = 14;
	          break;

	        case 11:
	          _context.prev = 11;
	          _context.t0 = _context["catch"](0);
	          console.log('/failed to fetch (error ' + _context.t0.toString() + ') css from: ' + url + '/');

	        case 14:
	        case "end":
	          return _context.stop();
	      }
	    }, null, null, [[0, 11]]);
	  };
	}

	var fetchCss = makeFetchCss;

	var getHrefAttr = function getHrefAttr(node) {
	  const attr = window.Array.from(node.attributes).find(attr => attr.name.toLowerCase() === 'href');
	  return attr && attr.value;
	};

	var isLinkToStyleSheet = function isLinkToStyleSheet(node) {
	  return node.nodeName && node.nodeName.toUpperCase() === 'LINK' && node.attributes && window.Array.from(node.attributes).find(attr => attr.name.toLowerCase() === 'rel' && attr.value.toLowerCase() === 'stylesheet');
	};

	function isDataUrl(url) {
	  return url && url.startsWith('data:');
	}

	var isDataUrl_1 = isDataUrl;

	function makeExtractCssFromNode({
	  getCssFromCache,
	  absolutizeUrl
	}) {
	  return function extractCssFromNode(node, baseUrl) {
	    let cssText, styleBaseUrl, isUnfetched;

	    if (isStyleElement(node)) {
	      cssText = window.Array.from(node.childNodes).map(node => node.nodeValue).join('');
	      styleBaseUrl = baseUrl;
	    } else if (isLinkToStyleSheet(node)) {
	      const href = getHrefAttr(node);

	      if (!isDataUrl_1(href)) {
	        styleBaseUrl = absolutizeUrl(href, baseUrl);
	        cssText = getCssFromCache(styleBaseUrl);
	      } else {
	        styleBaseUrl = baseUrl;
	        cssText = href.match(/,(.+)/)[1];
	      }

	      isUnfetched = cssText === undefined;
	    }

	    return {
	      cssText,
	      styleBaseUrl,
	      isUnfetched
	    };
	  };
	}

	function isStyleElement(node) {
	  return node.nodeName && node.nodeName.toUpperCase() === 'STYLE';
	}

	var extractCssFromNode = makeExtractCssFromNode;

	function makeCaptureNodeCss({
	  extractCssFromNode,
	  getBundledCssFromCssText,
	  unfetchedToken
	}) {
	  return function captureNodeCss(node, baseUrl) {
	    const {
	      styleBaseUrl,
	      cssText,
	      isUnfetched
	    } = extractCssFromNode(node, baseUrl);
	    let unfetchedResources;
	    let bundledCss = '';

	    if (cssText) {
	      const {
	        bundledCss: nestedCss,
	        unfetchedResources: nestedUnfetched
	      } = getBundledCssFromCssText(cssText, styleBaseUrl);
	      bundledCss += nestedCss;
	      unfetchedResources = new window.Set(nestedUnfetched);
	    } else if (isUnfetched) {
	      bundledCss += `${unfetchedToken}${styleBaseUrl}${unfetchedToken}`;
	      unfetchedResources = new window.Set([styleBaseUrl]);
	    }

	    return {
	      bundledCss,
	      unfetchedResources
	    };
	  };
	}

	var captureNodeCss = makeCaptureNodeCss;

	const NODE_TYPES = {
	  ELEMENT: 1,
	  TEXT: 3
	};
	var nodeTypes = {
	  NODE_TYPES
	};

	const {
	  NODE_TYPES: NODE_TYPES$1
	} = nodeTypes;

	function makePrefetchAllCss(fetchCss) {
	  return function prefetchAllCss(doc = document) {
	    var cssMap, start, promises, fetchNodeCss, fetchBundledCss, doFetchAllCssFromFrame;
	    return regenerator.async(function prefetchAllCss$(_context6) {
	      while (1) switch (_context6.prev = _context6.next) {
	        case 0:
	          doFetchAllCssFromFrame = function _ref3(frameDoc, cssMap, promises) {
	            fetchAllCssFromNode(frameDoc.documentElement);

	            function fetchAllCssFromNode(node) {
	              promises.push(fetchNodeCss(node, frameDoc.location.href, cssMap));

	              switch (node.nodeType) {
	                case NODE_TYPES$1.ELEMENT:
	                  {
	                    const tagName = node.tagName.toUpperCase();

	                    if (tagName === 'IFRAME') {
	                      return fetchAllCssFromIframe(node);
	                    } else {
	                      return fetchAllCssFromElement(node);
	                    }
	                  }
	              }
	            }

	            function fetchAllCssFromElement(el) {
	              return regenerator.async(function fetchAllCssFromElement$(_context4) {
	                while (1) switch (_context4.prev = _context4.next) {
	                  case 0:
	                    window.Array.prototype.map.call(el.childNodes, fetchAllCssFromNode);

	                  case 1:
	                  case "end":
	                    return _context4.stop();
	                }
	              });
	            }

	            function fetchAllCssFromIframe(el) {
	              return regenerator.async(function fetchAllCssFromIframe$(_context5) {
	                while (1) switch (_context5.prev = _context5.next) {
	                  case 0:
	                    fetchAllCssFromElement(el);

	                    try {
	                      doFetchAllCssFromFrame(el.contentDocument, cssMap, promises);
	                    } catch (ex) {
	                      console.log(ex);
	                    }

	                  case 2:
	                  case "end":
	                    return _context5.stop();
	                }
	              });
	            }
	          };

	          fetchBundledCss = function _ref2(cssText, resourceUrl, cssMap) {
	            var styleSheet, promises, rule;
	            return regenerator.async(function fetchBundledCss$(_context3) {
	              while (1) switch (_context3.prev = _context3.next) {
	                case 0:
	                  _context3.prev = 0;
	                  styleSheet = parseCss_1(cssText);
	                  promises = [];

	                  for (rule of window.Array.from(styleSheet.cssRules)) {
	                    if (rule instanceof CSSImportRule) {
	                      promises.push((() => {
	                        var nestedUrl, cssText;
	                        return regenerator.async(function _callee$(_context2) {
	                          while (1) switch (_context2.prev = _context2.next) {
	                            case 0:
	                              nestedUrl = absolutizeUrl_1(rule.href, resourceUrl);
	                              _context2.next = 3;
	                              return regenerator.awrap(fetchCss(nestedUrl));

	                            case 3:
	                              cssText = _context2.sent;
	                              cssMap[nestedUrl] = cssText;

	                              if (!(cssText !== undefined)) {
	                                _context2.next = 8;
	                                break;
	                              }

	                              _context2.next = 8;
	                              return regenerator.awrap(fetchBundledCss(cssText, nestedUrl, cssMap));

	                            case 8:
	                            case "end":
	                              return _context2.stop();
	                          }
	                        });
	                      })());
	                    }
	                  }

	                  _context3.next = 6;
	                  return regenerator.awrap(Promise.all(promises));

	                case 6:
	                  _context3.next = 11;
	                  break;

	                case 8:
	                  _context3.prev = 8;
	                  _context3.t0 = _context3["catch"](0);
	                  console.log(`error during fetchBundledCss, resourceUrl=${resourceUrl}`, _context3.t0);

	                case 11:
	                case "end":
	                  return _context3.stop();
	              }
	            }, null, null, [[0, 8]]);
	          };

	          fetchNodeCss = function _ref(node, baseUrl, cssMap) {
	            var cssText, resourceUrl;
	            return regenerator.async(function fetchNodeCss$(_context) {
	              while (1) switch (_context.prev = _context.next) {
	                case 0:
	                  if (!isLinkToStyleSheet(node)) {
	                    _context.next = 6;
	                    break;
	                  }

	                  resourceUrl = absolutizeUrl_1(getHrefAttr(node), baseUrl);
	                  _context.next = 4;
	                  return regenerator.awrap(fetchCss(resourceUrl));

	                case 4:
	                  cssText = _context.sent;

	                  if (cssText !== undefined) {
	                    cssMap[resourceUrl] = cssText;
	                  }

	                case 6:
	                  if (!cssText) {
	                    _context.next = 9;
	                    break;
	                  }

	                  _context.next = 9;
	                  return regenerator.awrap(fetchBundledCss(cssText, resourceUrl, cssMap));

	                case 9:
	                case "end":
	                  return _context.stop();
	              }
	            });
	          };

	          cssMap = {};
	          start = Date.now();
	          promises = [];
	          doFetchAllCssFromFrame(doc, cssMap, promises);
	          _context6.next = 9;
	          return regenerator.awrap(Promise.all(promises));

	        case 9:
	          console.log('[prefetchAllCss]', Date.now() - start);
	          return _context6.abrupt("return", function fetchCssSync(url) {
	            return cssMap[url];
	          });

	        case 11:
	        case "end":
	          return _context6.stop();
	      }
	    });
	  };
	}

	var prefetchAllCss = makePrefetchAllCss;

	const {
	  NODE_TYPES: NODE_TYPES$2
	} = nodeTypes;
	const API_VERSION = '1.1.0';

	function captureFrame({
	  styleProps,
	  rectProps,
	  ignoredTagNames
	} = defaultDomProps, doc = document, addStats = false) {
	  var performance, startTime, endTime, promises, unfetchedResources, iframeCors, iframeToken, unfetchedToken, separator, prefetchAllCss$1, getCssFromCache, getBundledCssFromCssText$1, extractCssFromNode$1, captureNodeCss$1, capturedFrame, iframePrefix, unfetchedPrefix, metaPrefix, stats, ret, filter, notEmptyObj, captureTextNode, doCaptureFrame;
	  return regenerator.async(function captureFrame$(_context) {
	    while (1) switch (_context.prev = _context.next) {
	      case 0:
	        doCaptureFrame = function _ref7(frameDoc) {
	          const bgImages = new window.Set();
	          let bundledCss = '';
	          const ret = captureNode(frameDoc.documentElement);
	          ret.css = bundledCss;
	          promises.push(getImageSizes_1({
	            bgImages
	          }).then(images => ret.images = images));
	          return ret;

	          function captureNode(node) {
	            const {
	              bundledCss: nodeCss,
	              unfetchedResources: nodeUnfetched
	            } = captureNodeCss$1(node, frameDoc.location.href);
	            bundledCss += nodeCss;
	            if (nodeUnfetched) for (const elem of nodeUnfetched) unfetchedResources.add(elem);

	            switch (node.nodeType) {
	              case NODE_TYPES$2.TEXT:
	                {
	                  return captureTextNode(node);
	                }

	              case NODE_TYPES$2.ELEMENT:
	                {
	                  const tagName = node.tagName.toUpperCase();

	                  if (tagName === 'IFRAME') {
	                    return iframeToJSON(node);
	                  } else {
	                    return elementToJSON(node);
	                  }
	                }

	              default:
	                {
	                  return null;
	                }
	            }
	          }

	          function elementToJSON(el) {
	            const childNodes = window.Array.prototype.map.call(el.childNodes, captureNode).filter(filter);
	            const tagName = el.tagName.toUpperCase();
	            if (ignoredTagNames.indexOf(tagName) > -1) return null;
	            const computedStyle = window.getComputedStyle(el);
	            const boundingClientRect = el.getBoundingClientRect();
	            const style = {};

	            for (const p of styleProps) style[p] = computedStyle.getPropertyValue(p);

	            if (!style['border-width']) {
	              style['border-width'] = `${computedStyle.getPropertyValue('border-top-width')} ${computedStyle.getPropertyValue('border-right-width')} ${computedStyle.getPropertyValue('border-bottom-width')} ${computedStyle.getPropertyValue('border-left-width')}`;
	            }

	            const rect = {};

	            for (const p of rectProps) rect[p] = boundingClientRect[p];

	            const attributes = window.Array.from(el.attributes).map(a => ({
	              key: a.name,
	              value: a.value
	            })).reduce((obj, attr) => {
	              obj[attr.key] = attr.value;
	              return obj;
	            }, {});
	            const bgImage = getBackgroundImageUrl_1(computedStyle.getPropertyValue('background-image'));

	            if (bgImage) {
	              bgImages.add(bgImage);
	            }

	            return {
	              tagName,
	              style: notEmptyObj(style),
	              rect: notEmptyObj(rect),
	              attributes: notEmptyObj(attributes),
	              childNodes
	            };
	          }

	          function iframeToJSON(el) {
	            const obj = elementToJSON(el);
	            let doc;

	            try {
	              doc = el.contentDocument;
	            } catch (ex) {
	              markFrameAsCors();
	              return obj;
	            }

	            try {
	              if (doc) {
	                obj.childNodes = [doCaptureFrame(el.contentDocument)];
	              } else {
	                markFrameAsCors();
	              }
	            } catch (ex) {
	              console.log('error in iframeToJSON', ex);
	            }

	            return obj;

	            function markFrameAsCors() {
	              const xpath = genXpath_1(el);
	              iframeCors.push(xpath);
	              obj.childNodes = [`${iframeToken}${xpath}${iframeToken}`];
	            }
	          }
	        };

	        captureTextNode = function _ref6(node) {
	          return {
	            tagName: '#text',
	            text: node.textContent
	          };
	        };

	        notEmptyObj = function _ref5(obj) {
	          return window.Object.keys(obj).length ? obj : undefined;
	        };

	        filter = function _ref4(x) {
	          return !!x;
	        };

	        stats = function _ref3() {
	          if (!addStats) {
	            return '';
	          }

	          return `\n${separator}\n${JSON.stringify(performance)}`;
	        };

	        endTime = function _ref2(obj) {
	          obj.endTime = Date.now();
	          obj.ellapsedTime = obj.endTime - obj.startTime;
	        };

	        startTime = function _ref(obj) {
	          obj.startTime = Date.now();
	        };

	        performance = {
	          total: {},
	          prefetchCss: {},
	          doCaptureFrame: {},
	          waitForImages: {}
	        };
	        promises = [];
	        startTime(performance.total);
	        unfetchedResources = new window.Set();
	        iframeCors = [];
	        iframeToken = '@@@@@';
	        unfetchedToken = '#####';
	        separator = '-----';
	        startTime(performance.prefetchCss);
	        prefetchAllCss$1 = prefetchAllCss(fetchCss(fetch));
	        _context.next = 19;
	        return regenerator.awrap(prefetchAllCss$1(doc));

	      case 19:
	        getCssFromCache = _context.sent;
	        endTime(performance.prefetchCss);
	        getBundledCssFromCssText$1 = getBundledCssFromCssText({
	          parseCss: parseCss_1,
	          CSSImportRule,
	          getCssFromCache,
	          absolutizeUrl: absolutizeUrl_1,
	          unfetchedToken
	        });
	        extractCssFromNode$1 = extractCssFromNode({
	          getCssFromCache,
	          absolutizeUrl: absolutizeUrl_1
	        });
	        captureNodeCss$1 = captureNodeCss({
	          extractCssFromNode: extractCssFromNode$1,
	          getBundledCssFromCssText: getBundledCssFromCssText$1,
	          unfetchedToken
	        });
	        startTime(performance.doCaptureFrame);
	        capturedFrame = doCaptureFrame(doc);
	        endTime(performance.doCaptureFrame);
	        startTime(performance.waitForImages);
	        _context.next = 30;
	        return regenerator.awrap(Promise.all(promises));

	      case 30:
	        endTime(performance.waitForImages); // Note: Change the API_VERSION when changing json structure.

	        capturedFrame.version = API_VERSION;
	        capturedFrame.scriptVersion = 'DOM_CAPTURE_SCRIPT_VERSION_TO_BE_REPLACED';
	        iframePrefix = iframeCors.length ? `${iframeCors.join('\n')}\n` : '';
	        unfetchedPrefix = unfetchedResources.size ? `${Array.from(unfetchedResources).join('\n')}\n` : '';
	        metaPrefix = JSON.stringify({
	          separator,
	          cssStartToken: unfetchedToken,
	          cssEndToken: unfetchedToken,
	          iframeStartToken: `"${iframeToken}`,
	          iframeEndToken: `${iframeToken}"`
	        });
	        endTime(performance.total);
	        ret = `${metaPrefix}\n${unfetchedPrefix}${separator}\n${iframePrefix}${separator}\n${JSON.stringify(capturedFrame)}${stats()}`;
	        console.log('[captureFrame]', JSON.stringify(performance));
	        return _context.abrupt("return", ret);

	      case 40:
	      case "end":
	        return _context.stop();
	    }
	  });
	}

	var captureFrame_1 = captureFrame;

	const EYES_NAME_SPACE = '__EYES__APPLITOOLS__';

	function captureFrameAndPoll(...args) {
	  if (!window[EYES_NAME_SPACE]) {
	    window[EYES_NAME_SPACE] = {};
	  }

	  if (!window[EYES_NAME_SPACE].captureDomResult) {
	    window[EYES_NAME_SPACE].captureDomResult = {
	      status: 'WIP',
	      value: null,
	      error: null
	    };
	    captureFrame_1.apply(void 0, args).then(r => (resultObject.status = 'SUCCESS', resultObject.value = r)).catch(e => (resultObject.status = 'ERROR', resultObject.error = e.message));
	  }

	  const resultObject = window[EYES_NAME_SPACE].captureDomResult;

	  if (resultObject.status === 'SUCCESS') {
	    window[EYES_NAME_SPACE].captureDomResult = null;
	  }

	  return JSON.stringify(resultObject);
	}

	var captureFrameAndPoll_1 = captureFrameAndPoll;

	return captureFrameAndPoll_1;

}());
  return captureFrameAndPoll()
}