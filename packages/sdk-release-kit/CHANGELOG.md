# Changelog

## Unreleased
- updated to @applitools/sdk-shared@0.8.5 (from 0.8.0)


## 0.11.0 - 2021/1/8

- add eyes-testcafe to list of supported sdks

## 0.10.9 - 2020/12/29

- fix `skipCommit` in `commitFiles`

## 0.10.6 - 2020/12/1

- switch yarnUpgrade back to `yarn upgrade` (instead of `yarn add`) -- fixes bug in updating package.json and CHANGELOG.md files
- update git isChanged so it works with files that have already been added with git -- fixes bug in that prevented changed files from being committed when using `yarn deps`
- updated to @applitools/sdk-shared@0.5.18 (from 0.1.3)
