# SDK spec

## Screenshot types

The following main use cases are supported:

### 1. Viewport

#### API

```js
eyes.check(Target.window())
```

#### Behavior

Just take the screenshot

### 2. Full page

#### API

```js
eyes.check(Target.window().fully())
```

#### Behavior

TBD

### 3. Element

#### API

Element can be provided as one of the following:

1. CSS selector string
2. Selenium Locator object (or equivalent in other frameworks if exists)
3. WebElement object (or equivalent in other frameworks  if exists)

```js
// 1. CSS selector string
eyes.check(Target.region('#content'))

// 2. Selenium locator
eyes.check(Target.region(By.id('content')))

// 3. WebElement
const el = await driver.findElement(By.id('content'))
eyes.check(Target.region(el))

// 3a. WDIO element
const el = await browser.element('#content')
eyes.check(Target.region(el))
```

If element is inside a frame (relative to current driver state), then the frame chain should be specified. The element can still be provided in all possible methods described above by chaining `.region`:

```js
eyes.check(Target.frame('frame').region('#content'))
```

#### Behavior

1. For all inputs except a WebElement, the existence of the element should be verified. For WebElement, need to verify it's not stale, and if it is then refresh it (locator information should exist)

### 4. Element fully

#### API

All methods of providing the element from [the element section](#3.-Element) apply.

#### Behavior

TBD

### 5. Region

#### API

```js
eyes.
```

#### Behavior

TBD
