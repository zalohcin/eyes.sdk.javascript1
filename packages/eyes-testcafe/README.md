# Eyes-Testcafe

<img src="https://img.shields.io/badge/classic-beta-yellow" style="margin-right: 10px">
<img src="https://img.shields.io/badge/node-%3E%3D%2010-green">

Applitools Eyes SDK for [Testcafe](https://devexpress.github.io/testcafe/).

## Installation

Install Eyes-Testcafe as a local dev dependency in your tested project:

```bash
npm i -D @applitools/eyes-testcafe@beta
```

## Applitools API key

In order to authenticate via the Applitools server, you need to supply the Eyes-Testcafe SDK with the API key you got from Applitools. Read more about how to obtain the API key [here](https://applitools.com/docs/topics/overview/obtain-api-key.html).

To to this, set the environment variable `APPLITOOLS_API_KEY` to the API key before running your tests.
For example, on Linux/Mac:

```bash
export APPLITOOLS_API_KEY=<your_key>
npx testcafe chrome:headless some-test-dir
```

And on Windows:

```bash
set APPLITOOLS_API_KEY=<your_key>
npx testcafe chrome:headless some-test-dir
```

It's also possible to specify the API key in the `applitools.config.js` file. The property name is `apiKey`. For example:

```js
module.exports = {
  apiKey: 'YOUR_API_KEY',
  ...
}
```

See the [Advanced configuration](#method-3-the-applitoolsconfigjs-file) section below for more information on using the config file.

## Usage

After defining the API key, you will be able to use commands from Eyes-Testcafe in your testcafe tests to take screenshots and use Applitools Eyes to manage them:

### Example

```js
import {Eyes, Target} from '@applitools/eyes-testcafe';

const eyes = new Eyes();

fixture`Hello world`
  .page('https://applitools.com/helloworld')
  .afterEach(() => eyes.close());
  
test('Hello world page', async t => {
  await eyes.open(t, 'Hello World!', 'My first JavaScript test!', {width: 1200, height: 800});
  await eyes.check('Main Page', Target.window());
  await t.click('button')
  await eyes.check('Click!', Target.window());
});
```

## API

### open

Create an Applitools test.
This will start a session with the Applitools server.

```js
eyes.open(t, appName, testName, viewportSize)
```

### check

Generate a screenshot of the current page and add it to the Applitools Test.

```js
eyes.check(tag, checkSettings)
```

#### Arguments to `eyes.check`

##### `tag`

Defines a name for the checkpoint in the Eyes Test Manager. The name may be any string and serves to identify the step to the user in the Test manager. You may change the tag value without impacting testing in any way since Eyes does not use the tag to identify the baseline step that corresponds to the checkpoint - Eyes matches steps based on their content and position in the sequences of images of the test. See [How Eyes compares checkpoints and baseline images](https://applitools.com/docs/topics/general-concepts/how-eyes-compares-checkpoints.html) for details.

##### `checkSettings`

Holds the checkpoint's configuration. This is defined using the fluent API, starting with `Target`.

- For taking a viewport screenshot, call `Target.window()`.
- For a full page screenshot, call `Target.window().fully()`.

### close

Close the applitools test and check that all screenshots are valid.

It is important to call this at the end of each test, symmetrically to `open`(or in `afterEach()`, see [Best practice for using the SDK](#best-practice-for-using-the-sdk)).

```js
const testResults = await eyes.close(throwEx);
```

## Best practice for using the SDK

Every call to `eyes.open` and `eyes.close` defines a test in Applitools Eyes, and all the calls to `eyes.check` between them are called "steps". In order to get a test structure in Applitools that corresponds to the test structure in Testcafe, it's best to open/close tests in every `test` call. **You can use `afterEach` for calling `eyes.close()`**

```js
fixture`Hello world`
  .page('https://applitools.com/helloworld')
  .afterEach(async () => eyes.close());
```
