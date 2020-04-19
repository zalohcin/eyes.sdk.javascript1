# Applitools Eyes Service for webdriver.io 5

Applitools Eyes service for [webdriver.io](https://webdriver.io/).

## Installation

### Install npm package

Install the service as a local dev dependency in your tested project:

```bash
npm install --save-dev @applitools/eyes-webdriverio5-service
```

### Add the service to webdriver.io's configuration

The config file is normally located at `wdio.conf.js`:

```js
exports.config = {
  // ...
  services: ['@applitools/eyes-webdriverio5-service']
  // ...
}
```

### Applitools API key

In order to authenticate via the Applitools server, you need to supply the Applitools service with the API key you got from Applitools. Read more about how to obtain the API key [here](https://applitools.com/docs/topics/overview/obtain-api-key.html).

#### Using an environment variable

To to this, set the environment variable `APPLITOOLS_API_KEY` to the API key before running your tests.
For example, on Linux/Mac:

```bash
export APPLITOOLS_API_KEY=<your_key>
```

And on Windows:

```bash
set APPLITOOLS_API_KEY=<your_key>
```

#### Using webdriver.io's config file

It's also possible to specify the API key in the webdriver.io config file (normally located at `wdio.conf.js`). This should be placed inside the general configuration for the service, under the `eyes` property:

```js
// wdio.conf.js

exports.config = {
  // ...
  services: ['@applitools/eyes-webdriverio5-service'], // reminder :)
  eyes: {
    apiKey: 'YOUR_API_KEY',
  }
  // ...
}
```

See the [Configuration](#Configuration) section below for more information on using the config file.

## Usage

After completing the installation and defining the service and the API key, you will be able to use Eyes commands inside your webdriver.io tests to create visual tests.

### Example

```js
describe('webdriver.io page', () => {
  it('is visually perfect', () => {
    browser.url('https://webdriver.io')
    browser.eyesCheck('homepage')
  })
})
```

### Using the service vs. direct SDK

As users of webdriver.io 5, you may choose to use the SDK directly (package name `@applitools/eyes-webdriverio`). However, using the Applitools Eyes service provides several boilerplate operations and default values, and lets you concentrate on the core logic.

Here are the main differences between the service and the SDK:

1. No need to call `eyes.open` and `eyes.close`. Only `eyes.check` (or its service equivalent, `browser.eyesCheck`) is needed. The `open` and `close` calls are made between different `it`'s, so each functional test that contains visual checkpoints will appear in Eyes dashboard separately.

2. No need to specify `testName` and `appName` in the configuration. These values are automatically extracted from the `it`'s and `describe`'s. The default test name is the containing `it`, and the default app name is the `it`'s containing `describe`.

3. No need to instantiate the `Eyes` class. It is instantiated for you, and configured appropriately from `wdio.conf.js`.

### Configuration

Every configuration parameter that exists in the configuration for Applitools' Eyes SDK for webdriver.io can be specified in the `wdio.conf.js` file (or any other webdriver.io configuration file specified by the user).

This is provided in the `eyes` entry in the configuration file. For example:

```js
exports.config = {
  eyes: {
    viewportSize: {width: 1200, height: 800},
    matchLevel: 'Layout',
    matchTimeout: 0,
    batch: {name: 'This will appear as the batch name in Eyes dashboard'},
    // ...
  }
}
```

_For more information, visit our documentation page: https://applitools.com/docs/api/eyes-sdk/index-gen/class-configuration-webdriverio_sdk5-javascript.html_

#### Verbose logging

For troubleshooting, it is possible to enable versbose logging by specifying the following in the `wdio.conf.js` file:

```js
exports.config = {
  // ...
  enableEyesLogs: true,
  // ...
}
```

### Commands

#### `browser.eyesCheck(tag, checkSettings)`

Generate a screenshot of the current page and add it to the Applitools Test.

##### Arguments to `browser.eyesCheck`

`tag`

Defines a name for the checkpoint in the Eyes Test Manager. The name may be any string and serves to identify the step to the user in the Test manager. You may change the tag value without impacting testing in any way since Eyes does not use the tag to identify the baseline step that corresponds to the checkpoint - Eyes matches steps based on their content and position in the sequences of images of the test. See [How Eyes compares checkpoints and baseline images](https://applitools.com/docs/topics/general-concepts/how-eyes-compares-checkpoints.html) for details.

`checkSettings`

Holds the checkpoint's configuration. This is defined using the fluent API, starting with `Target`. The default is `Target.window().fully()`, which takes a full page screenshot.

For example, to take a viewport screenshot:

```js
const {Target} = require('@applitools/eyes-webdriverio5-service')

// ...

browser.eyesCheck(tag, Target.window())
```

The `Target` API can be used to configure more parameters, such as ignore regions, match level, etc.

_For more information, visit our documentation page: https://applitools.com/docs/api/eyes-sdk/index-gen/class-target-webdriverio_sdk5-javascript.html_

#### `browser.eyesGetTestResults()`

Close the current visual test and return the test results. For example:

```js
describe('webdriver.io page', () => {
  it('is visually perfect', () => {
    browser.url('https://webdriver.io')
    browser.eyesCheck('homepage')
    $('a[href="/docs/gettingstarted.html"]').click()
    browser.eyesCheck('getting started page')
    const testResults = browser.eyesGetTestResults()

    // example for using the testResults -
    // fail the test if visual differences were found
    if (testResults.getStatus() !== 'Passed') {
      const testName = `'${testResults.getName()}' of '${testResults.getAppName()}'`
      throw new Error(`Test ${testName} detected differences! See details at: ${testResults.getUrl()}`)
    }
  })
})
```

_For more information, visit our documentation page: https://applitools.com/docs/api/eyes-sdk/index-gen/class-testresults-webdriverio_sdk5-javascript.html_

#### `browser.eyesSetScrollRootElement(By)`

Set the scroll root element to a specific element on the page. This is the element that will be scrolled when taking a full page screenshot.

For example:

```js
const {By} = require('@applitools/eyes-webdriverio5-service')

// ...
browser.eyesSetScrollRootElement(By.css('.container'))
```

#### `browser.eyesSetConfiguration(configuration)`

Set a new configuration for the underlying Eyes instance. This will override the configuration specified in the `wdio.conf.js` file for the remainder of test execution.

#### `browser.eyesGetConfiguration()`

Get the configuration object that's defined for the underlying Eyes instance.

#### `browser.eyesAddProperty(key, value)`

Add a custom property to the the test. This can later be viewed in Eyes dashboard.

#### `browser.eyesClearProperties`

Clear all custom properties related to the test.
