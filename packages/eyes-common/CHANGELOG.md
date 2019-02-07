# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.3](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-common@1.2.2...@applitools/eyes-common@1.2.3) (2019-02-07)


### Bug Fixes

* **eyes-common:** use stack trace only if Error.captureStackTrace exists ([4128a2e](https://github.com/applitools/eyes.sdk.javascript1/commit/4128a2e))





## [1.2.2](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-common@1.2.1...@applitools/eyes-common@1.2.2) (2019-01-28)

**Note:** Version bump only for package @applitools/eyes-common





## [1.2.1](https://github.com/applitools/eyes.sdk.javascript1/compare/@applitools/eyes-common@1.2.0...@applitools/eyes-common@1.2.1) (2019-01-22)


### Bug Fixes

* **eyes-common:** add missing method to Configuration ([6972fc6](https://github.com/applitools/eyes.sdk.javascript1/commit/6972fc6))





# 1.2.0 (2019-01-16)


### Bug Fixes

* **eyes-common:** allow to pass string in Logger constructor ([d1cb451](https://github.com/applitools/eyes.sdk.javascript1/commit/d1cb451))


### Features

* **eyes-common:** Add `hasMethod` method to `TypeUtils` ([f0d37ee](https://github.com/applitools/eyes.sdk.javascript1/commit/f0d37ee))
* finalize eyes-rendering pkg, continue introduction of eyes-common ([c3367b7](https://github.com/applitools/eyes.sdk.javascript1/commit/c3367b7))
* **eyes-common:** add `isUrl` method to TypeUtils ([992ff17](https://github.com/applitools/eyes.sdk.javascript1/commit/992ff17))
* **eyes-common:** move methods which uses `fs` into separate FileUtils class ([cdc499d](https://github.com/applitools/eyes.sdk.javascript1/commit/cdc499d))
* **eys-common:** Add Configuration class ([783b8c5](https://github.com/applitools/eyes.sdk.javascript1/commit/783b8c5))


### BREAKING CHANGES

* **eyes-common:** `save` method was removed from MutableImage, `readImage`, `writeImage` methods were removed from ImageUtils.
