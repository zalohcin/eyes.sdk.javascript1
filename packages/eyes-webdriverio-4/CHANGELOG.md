# Change Log

## Unreleased

- Support both new and old server versions for identifying new running sessions. ([Trello](https://trello.com/c/mtSiheZ9/267-support-startsession-as-long-running-task))

## 2.12.3

- fix trying to fetch branch info from server on non github integration runs
- upload domsnapshot directly to Azure [Trello](https://trello.com/c/ZCLJo8Fy/241-upload-dom-directly-to-azure)
- fix regression in css stitching [Trello](https://trello.com/c/dp5IIoFw/235-css-stitching-regression-in-41533)
- support future long running tasks [Trello](https://trello.com/c/60Rm4xXG/240-support-future-long-running-tasks)

## 2.12.2
- branching base commit support
- make functions in runners 

## 2.12.1
- Fixed regression which broke xpath selectors when looking up the location of an element

## 2.12.0
- Added nested frame support (without CORS) for checkRegion by locator [Trello 213](https://trello.com/c/Xyyhdb5t)

## 2.11.9
- Send stitching service URL to visual grid [Trello 212](https://trello.com/c/Sqh6k2VV)

## 2.11.8
- Fixed error when performing a URL lookup on native mobile. [Trello 208](https://trello.com/c/ZPkZsyaI)

## 2.11.7
- Fixed error when getting images on Safari. Related to [Trello 99](https://trello.com/c/C0oZf2oc)

## [un versioned] - 
### Fixed
- Crop safari url bar and status bar on mobile devices (IOS). [Trello 939](https://trello.com/c/SM80YzdM)

## [2.11.2] - 2019-11-08
### Fixed
- fix css stitching for new chrome 78 (bug in chrome). [Trello 1206](https://trello.com/c/euVqe1Sv)
- Default viewportSize `null` value was overriding configuration. [Trello 1168](https://trello.com/c/yPqI3erm)

## [2.11.1] - 2019-11-05
### Added
- This CHANGELOG.
### Fixed
- Correct imports for coded regions. [Trello 1217](https://trello.com/c/GwNqDTYg) 
