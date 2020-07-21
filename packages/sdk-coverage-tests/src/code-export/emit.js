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

function makeEmitTests(initializeSdkImplementation, coverageTests) {
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

function Ref(syntax, resolver) {
  const ref = function() {}
  ref.isRef = true
  ref.ref = function(name) {
    if (name) {
      ref._name = name
      return this
    } else if (ref._isResolved) {
      return ref._name
    } else {
      ref._name = resolver({type: ref._type, name: ref._name})
      ref._isResolved = true
      return ref._name
    }
  }
  ref.type = function(type) {
    if (type) {
      ref._type = ref
      return this
    } else {
      return ref._type
    }
  }
  return new Proxy(ref, {
    get(ref, key) {
      if (key in ref) return Reflect.get(ref, key)
      return new Ref(syntax, () => syntax.getter({type: ref.type(), target: ref.ref(), key}))
    },
    apply(ref, _, args) {
      return new Ref(syntax, () => syntax.call({target: ref.ref(), args: Array.from(args)}))
    },
  })
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

  addSyntax(name, callback) {
    this.syntax[name] = callback
  }

  storeCommand(command) {
    const id = this.commands.push(command)
    return new Ref(this.syntax, ({name = `var_${id}`, type} = {}) => {
      const value = this.commands[id - 1]
      this.commands[id - 1] = this.syntax.var({name, value, type})
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
