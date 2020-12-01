# Changelog

## Unreleased

- switch yarnUpgrade back to `yarn upgrade` (instead of `yarn add`) -- fixes bug in updating package.json and CHANGELOG.md files
- update git isChanged so it works with files that have already been added with git -- fixes bug in that prevented changed files from being committed when using `yarn deps`
