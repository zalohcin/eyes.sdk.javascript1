# visual-grid-client

A library that drives the visual grid with dom snapshot rendering.

## Installing

```sh
npm install @applitools/visual-grid-client
```

## Using the package

```js
const {makeVisualGridClient} = require('@applitools/visual-grid-client')
const {domNodesToCdt} = require('@applitools/visual-grid-client/browser')
```

See below for the full API.

## API

### makeVisualGridClient

* To create a visualGridClient, call `makeVisualGridClient`:

```js
const {makeVisualGridClient} = require('@applitools/visual-grid-client')
const visualGridClient = makeVisualGridClient()
```

The visualGridClient, returned by `makeVisualGridClient`, is an object with three functions:

* `openEyes(configOverride)`: to start a set of tests, where each step is a set of renderings according to the browser
  stuff in the configuration.
  This function will return an object with functions (see below) allowing you to create renderings (or "steps" in
  Applitools parlance) for the test.
* `waitForTestResults(promises[])`: A convenience async function. Pass a set of promises returned by the various `close`-es
  of `openEyes`, and it will wait on all of them and return an array of results, or throw if there was a difference
  detected in one of the `close`-s.
* `getError()`: This function will return an error if there was one during the running of the tests. Poll
  it sometimes to see if you need to abort anything.

### openEyes

Async function `openEyes` will create a test. Actually, it will create a series of test, one for each browser configuration
defined in the `browser` property of the configuraion.

* `openEyes` accepts a configuration object that will override the default configuration found by
  `makeVisualGridClient`, per this test.

* Returns a promise to an object with the following functions:

* `checkWindow(...)`: creates a "step" that checks the window according to the baseline. Note that this
  function will not fail, and you need to call `waitForTestResults` to wait for the failure or success
  of a batch of steps in the test.
* `close()`: async closes the test (or series of tests) created by `openEyes`.
* `abort()`: if you want to abort this test (or series of tests). Async.

### `checkWindow(...)`

`checkWindow` receives an object with the following parameters:

* `tag`: the name of the step, as seen in Applitools Eyes.
* `url`: the URL appearing in the address bar of the browser. All relative URLs in the CDT will be relative to it.
* `cdt`: the HTML and set and resources, in the `x-applitools-html/cdt` format (see below).
  you can use `domNodesToCdt` to create a CDT from a `document`.
* `sizeMode`: the target of the rendering. Can be one of `viewport`, `full-page`, `selector`, `region`
* `selector`: if the `sizeMode` is selector, this is the selector we are targetting.
* `region`: if the `sizeMode` is region, this is the region we are targetting.
  This is an object with `x`, `y`, `width`, `height` properties.
* `ignore`: TBD
* `floating`: TBD
* `sendDom`: TBD
* `scriptHooks`: a set of scripts to be run by the browser during the rendering.
   An object with the following properties:
  * `beforeCaptureScreenshot`: a script that runs after the page is loaded but before taking the screenshot.
* `resourceUrls`: By default, an empty array. Additional resource URLs not found in the CDT.
* `resourceContents`: a map of all resource values (buffers). The keys are URLs (relative to the `url` property).
  The value  is an object with the following properties:
  * `url`: yes, again.
  * `type`: the content type of the resource.
  * `value`: a `Buffer` of the resource content.

### close()

`close` receives no parameters, and returns a promise.

* The promise will be resolved (with `undefined` as value) if all tests defined in the `openEyes` passed.
* The promise will be rejected (with `DiffsFoundError`
   as defined in [Applitools Eyes SDK Core](https://www.npmjs.com/package/@applitools/eyes.sdk.core))
   if there were differences found in some tests defined in the `openEyes`.

### The CDT format

```js
{
  domNodes: [
    {
      nodeType: number, // like in the DOM Standard
      nodeName: ‘...’ , // for elements and DocumentType
      nodeValue: ‘...’, // for text nodes
      attributes: [{name, value}, ...],
      childNodeIndexes: [index, index, ...]
    },
    //...
  ],
  resources: [
    {
      hashFormat: 'sha256', // currently the only hash format allowed
      hash: '....', // the hash of the resource.
      contentType: '...', // the mime type of the resource.
    },
    //...
  ]
}

```

### domNodesToCdt

Accepts a document object conforming to the DOM specification (browser document is fine, as is the JSDOM document).
Returns a cdt, ready to be passed to `checkWindow`

## Configuration

* See [Eyes Cypress configuration](https://github.com/applitools/eyes.cypress#advanced-configuration)
  for a list of properties in the configuration and to understand how the visual grid client
  reads the configuration.

## Logging

???

## Example

Example [Mocha](https://www.npmjs.com/package/mocha) test that uses the visual grid client:

```js
const path = require('path')
const fs = require('fs')
const {makeVisualGridClient} = require('@applitools/visual-grid-client')
const {domNodesToCdt} = require('@applitools/visual-grid-client/browser')
const {JSDOM} = require('jsdom')

describe('visual-grid-client test', function() {
  let visualGridClient
  let closePromises = []

  before(() => {
    visualGridClient = makeVisualGridClient({
      showLogs: true,
      renderStatusTimeout: 60000,
      renderStatusInterval: 1000,
    })
  })

  after(() => visualGridClient.waitForTestResults(closePromises))

  let checkWindow, close
  beforeEach(async () => {
    ;({checkWindow, close} = await visualGridClient.openEyes({
      appName: 'visual grid client with a cat',
      testName: 'visual-grid-client test',
    }))
  })
  afterEach(() => closePromises.push(close()))

  it('should work', async () => {
    checkWindow({
      tag: 'first test',
      url: 'http://localhost/index.html',
      cdt: domNodesToCdt(
        new JSDOM(fs.readFileSync(path.join(__dirname, 'resources/index.html'), 'utf-8')).window
          .document,
      ),
      sizeMode: 'viewport',
      resourceContents: {
        'cat.jpeg': {
          url: 'cat.jpeg',
          type: 'image/jpeg',
          value: fs.readFileSync(path.join(__dirname, 'resources/cat.jpeg')),
        },
      },
    })
  })
})
```

## Contributing

### Generating a changelog

The best way is to run `npm run changelog`. The prerequisite for that is to have [jq](https://stedolan.github.io/jq/) installed, and also define the following in git configuration:

```sh
git config changelog.format "* %s - %an [[%h](https://github.com/applitools/visual-grid-client/commit/%H)]"
```