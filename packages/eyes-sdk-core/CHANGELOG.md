# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.5.3](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.2...@applitools/eyes-sdk-core@4.5.3) (2018-12-11)


### Bug Fixes

* **eyes-sdk-core:** fix error when response of renderStatusById is null ([8f1e3f5](https://github.com/applitools/eyes.sdk.javascript1/commit/8f1e3f5))





## [4.5.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.1...@applitools/eyes-sdk-core@4.5.2) (2018-12-07)


### Bug Fixes

* **eyes-sdk-core:** Remove check for fs in ImageUtils before parse/pack ([febea66](https://github.com/applitools/eyes.sdk.javascript1/commit/febea66))





## [4.5.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.5.0...@applitools/eyes-sdk-core@4.5.1) (2018-12-06)


### Features

* **eyes-sdk-core:** Add EyesSimpleScreenshotFactory class ([d2eb741](https://github.com/applitools/eyes.sdk.javascript1/commit/d2eb741))





# [4.5.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.4.0...@applitools/eyes-sdk-core@4.5.0) (2018-12-04)

**Note:** Version bump only for package @applitools/eyes-sdk-core





# [4.4.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.3.0...@applitools/eyes-sdk-core@4.4.0) (2018-11-29)


### Bug Fixes

* **eyes-sdk-core:** fix not working `setHostOSInfo` method ([24a301e](https://github.com/applitools/eyes.sdk.javascript1/commit/24a301e))
* **eyes-sdk-core:** update docs for return type of `abortIfNotClosed` ([7cd1f44](https://github.com/applitools/eyes.sdk.javascript1/commit/7cd1f44))


### Features

* **eyes-sdk-core:** add `isNotNull(value)` method to `TypeUtils` ([0d402bd](https://github.com/applitools/eyes.sdk.javascript1/commit/0d402bd))





# [4.3.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.2.0...@applitools/eyes-sdk-core@4.3.0) (2018-11-26)


### Features

* **eyes-sdk-core:** add `isNull` method to `TypeUtils` ([3be1d46](https://github.com/applitools/eyes.sdk.javascript1/commit/3be1d46))
* **eyes-sdk-core:** add an ability to completely disable proxy settings ([03a0a7d](https://github.com/applitools/eyes.sdk.javascript1/commit/03a0a7d))





# [4.2.0](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-sdk-core@4.1.0...@applitools/eyes-sdk-core@4.2.0) (2018-11-20)


### Features

* **eyes-sdk-core:** add `deviceInfo`, `osInfo`, `hostingAppInfo` properties to `AppEnvironment` ([e7437bc0](https://github.com/applitools/eyes.sdk.javascript1/commit/e7437bc))
* **eyes-sdk-core:** add `hostOSInfo`, `hostAppInfo`, `deviceInfo` properties to `EyesBase` ([e7437bc0](https://github.com/applitools/eyes.sdk.javascript1/commit/e7437bc))
* **eyes-sdk-core:** send `sendDom` property in `RenderRequest` also when it eq `false` ([ef929ab](https://github.com/applitools/eyes.sdk.javascript1/commit/ef929ab))





## [4.1.0](https://github.com/applitools/eyes.sdk.javascript1/compare/v4.0.3...v4.1.0) (2018-11-08)

**Note:** Version bump only for package @applitools/eyes-sdk-core





## [4.0.3](https://github.com/applitools/eyes.sdk.javascript1/compare/v4.0.2...v4.0.3) (2018-11-07)


### Features

* Add new methods to `TypeUtils`: `isInteger`, `has`. Update other methods, add tests for all methods  ([f12ce4f](https://github.com/lerna/lerna/commit/f12ce4f))





## [4.0.2](https://github.com/applitools/eyes.sdk.javascript1/compare/v4.0.1...v4.0.2) (2018-11-06)


### Features

* Remove @deprecated tag from setMatchLevel/getMatchLevel ([22f8c09](https://github.com/lerna/lerna/commit/22f8c09))




## [4.0.1](https://github.com/applitools/eyes.sdk.javascript1/compare/eyes.selenium-v1.9.0-alpha...v4.0.1) (2018-11-03)


### BREAKING CHANGES

* Changes in `GeneralUtils` ([cc01222](https://github.com/lerna/lerna/commit/cc01222))
  - Removed methods: `assignTo`, `mixin`, `clone`, `getStackTrace` 
  - Methods moved to new class `TypeUtils`: `isString`, `isNumber`, `isBoolean`, `isObject`, `isPlainObject`, `isArray`, `isBuffer`, `isBase64`
  - Changed `cartesianProduct` method, now it returns array instead of generator

* Changes in `CheckSettings` ([ed1f342](https://github.com/lerna/lerna/commit/ed1f342))
  - Removed methods: `ignore`, `ignores` (use `ignoreRegions` instead)
  - Renamed methods: `floating` to `floatingRegion`, `floatings` to `floatingRegions`


### Features

* Fix error when viewportSize in setViewportSize given as an object ([db6472a](https://github.com/lerna/lerna/commit/db6472a))
