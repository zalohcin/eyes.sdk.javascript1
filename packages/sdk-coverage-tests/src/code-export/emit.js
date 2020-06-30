const defaultCoverageTests = require('../tests')
const {getNameFromObject} = require('../common-util')

function convertExecutionModeToSuffix(executionMode) {
  if (executionMode.useStrictName) return ''
  switch (getNameFromObject(executionMode)) {
    case 'isVisualGrid':
      return '_VG'
    case 'isScrollStitching':
      return '_Scroll'
    default:
      return ''
  }
}

function makeEmitTests(initializeSdkImplementation, coverageTests = defaultCoverageTests) {
  let output = []
  function emitTests(supportedTests, {host, all = false} = {}) {
    supportedTests.forEach(supportedTest => {
      const coverageTest = coverageTests[supportedTest.name]
      if (
        !coverageTest ||
        !(typeof coverageTest === 'function' || typeof coverageTest.test === 'function')
      ) {
        throw new Error('missing implementation for test ' + supportedTest.name)
      }
      const coverageTestFunc = coverageTest.test || coverageTest
      const baselineTestName = `${supportedTest.name}${convertExecutionModeToSuffix(
        supportedTest.executionMode,
      )}`
      const branchName = supportedTest.baselineVersion
        ? `v${supportedTest.baselineVersion}`
        : 'master'
      const sdkImplementation = initializeSdkImplementation({
        baselineTestName,
        branchName,
        host,
        ...supportedTest,
        ...coverageTest.options,
      })
      // test
      coverageTestFunc(sdkImplementation)
      // store
      output.push({
        name: baselineTestName,
        disabled: !all && supportedTest.disabled,
        ...sdkImplementation.tracker,
      })
    })
    return output
  }
  return {emitTests}
}

class EmitTracker {
  constructor() {
    this.hooks = {
      deps: [],
      vars: [],
      beforeEach: [],
      afterEach: [],
    }
    this.syntax = {
      var: () => {
        throw new TypeError(
          "EmitTracker don't have an implementation for `var` syntax. Use `addSyntax` method to add an implementation",
        )
      },
      getter: () => {
        throw new TypeError(
          "EmitTracker don't have an implementation for `getter` syntax. Use `addSyntax` method to add an implementation",
        )
      },
      call: () => {
        throw new TypeError(
          "EmitTracker don't have an implementation for `call` syntax. Use `addSyntax` method to add an implementation",
        )
      },
    }
    this.commands = []
  }

  createRef(resolve) {
    const ref = function() {}
    ref.isRef = true
    ref.resolve = () => {
      if (!ref.resolved) {
        ref.resolved = resolve()
      }
      return ref.resolved
    }
    return new Proxy(ref, {
      get: (ref, key) => {
        if (key in ref) return Reflect.get(ref, key)
        return this.createRef(() => this.syntax.getter({target: ref.resolve(), key}))
      },
      apply: (ref, _, args) => {
        return this.createRef(() =>
          this.syntax.call({target: ref.resolve(), args: Array.from(args)}),
        )
      },
    })
  }

  addSyntax(name, callback) {
    this.syntax[name] = callback
  }

  storeCommand(command) {
    const id = this.commands.push(command)
    return this.createRef(() => {
      const name = `var_${id}`
      const value = this.commands[id - 1]
      this.commands[id - 1] = this.syntax.var({name, value})
      return name
    })
  }

  storeHook(name, value) {
    switch (name) {
      case 'deps':
      case 'vars':
      case 'beforeEach':
      case 'afterEach':
        return this.hooks[name].push(value)
      default:
        throw new Error(
          `Unsupported hook ${name}. Please specify one of either ${Object.keys(this.hooks).join(
            ', ',
          )}`,
        )
    }
  }

  out() {
    return {
      hooks: this.hooks,
      commands: this.commands,
    }
  }
}

function makeEmitTracker() {
  return new EmitTracker()
}

module.exports = {
  makeEmitTracker,
  makeEmitTests,
}
