function _getEntriesForHeading({changelogContents, targetHeading}) {
  let foundEntries = []
  let headingFound = false
  for (let entry of changelogContents.split('\n')) {
    const _entry = entry.trim()
    if (_entry !== targetHeading && _entry.includes('##')) break
    if (headingFound && _entry.length) foundEntries.push(_entry)
    if (_entry === targetHeading) headingFound = true
  }
  return foundEntries
}

function _getLatestReleaseHeading(changelogContents) {
  let latestReleaseHeading
  for (let entry of changelogContents.split('\n')) {
    const _entry = entry.trim()
    if (_entry.includes('##') && !_entry.includes('Unreleased')) {
      latestReleaseHeading = _entry
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
  if (unreleasedEntries.length)
    throw 'Found unreleased entries in the changelog. Move them into their own version entry before releasing.'
  const latestReleaseHeading = _getLatestReleaseHeading(changelogContents)
  if (latestReleaseHeading !== version)
    throw 'Matching version entry not found in the changelog. Add a entry this version before releasing.'
}

module.exports = {
  _getEntriesForHeading,
  _getLatestReleaseHeading,
  _getReleaseNumberFromHeading,
  verifyChangelog,
}
