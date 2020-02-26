function addReleaseEntryForUnreleasedItems({changelogContents, version}) {
  const unreleasedEntries = _getEntriesForHeading({
    changelogContents,
    targetHeading: '## Unreleased',
  })
  const indentationCount = unreleasedEntries[0].length - unreleasedEntries[0].trim().length
  const padding = new Array(indentationCount + 1).join(' ')
  const releaseEntry = ['', `${padding}## ${version}\n`, ...unreleasedEntries]
  const latestReleaseHeadingIndex = _getLatestReleaseHeading(changelogContents).index
  const _changelogContents = changelogContents.split('\n')
  _changelogContents.splice(latestReleaseHeadingIndex - 1, 0, ...releaseEntry)
  return _changelogContents.join('\n')
}

function _getEntriesForHeading({changelogContents, targetHeading}) {
  let foundEntries = []
  let headingFound = false
  for (let entry of changelogContents.split('\n')) {
    const _entry = entry.trim()
    if (_entry !== targetHeading && _entry.includes('##')) break
    if (headingFound && _entry.length) foundEntries.push(entry)
    if (_entry === targetHeading) headingFound = true
  }
  return foundEntries
}

function _getLatestReleaseHeading(changelogContents) {
  let latestReleaseHeading = {}
  for (let [index, entry] of changelogContents.split('\n').entries()) {
    const _entry = entry.trim()
    if (_entry.includes('##') && !_entry.includes('Unreleased')) {
      latestReleaseHeading.heading = _entry
      latestReleaseHeading.index = index
      break
    }
  }
  return latestReleaseHeading
}

function _getReleaseNumberFromHeading(heading) {
  return heading.match(/([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2})/)[0]
}

function verifyChangelog({changelogContents, version}) {
  const unreleasedEntries = _getEntriesForHeading({
    changelogContents,
    targetHeading: '## Unreleased',
  })
  if (!unreleasedEntries.length)
    throw 'No unreleased entries found in the changelog. Add some before releasing.'
  const latestReleaseNumber = _getReleaseNumberFromHeading(
    _getLatestReleaseHeading(changelogContents).heading,
  )
  if (latestReleaseNumber === version)
    throw 'Matching version entry found in the changelog. Add a new version entry before releasing.'
}

module.exports = {
  _getEntriesForHeading,
  _getLatestReleaseHeading,
  _getReleaseNumberFromHeading,
  verifyChangelog,
  updateChangelogContents: addReleaseEntryForUnreleasedItems,
}
