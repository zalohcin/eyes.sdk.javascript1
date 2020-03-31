function getLatestReleaseEntries(changelogContents) {
  const targetHeading = getLatestReleaseHeading(changelogContents).heading
  const entries = getEntriesForHeading({changelogContents, targetHeading})
  return entries.map(entry => entry.entry)
}

function updateChangelogContents({changelogContents, version, withDate}) {
  let mutableChangelogContents = changelogContents
  const now = new Date()
  let _version = withDate
    ? version + ` - ${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
    : version
  mutableChangelogContents = _addReleaseEntryForUnreleasedItems({
    changelogContents: mutableChangelogContents,
    version: _version,
  })
  mutableChangelogContents = _removeUnreleasedItems({changelogContents: mutableChangelogContents})
  return mutableChangelogContents
}

function _addReleaseEntryForUnreleasedItems({changelogContents, version}) {
  const unreleasedEntries = getEntriesForHeading({
    changelogContents,
    targetHeading: '## Unreleased',
  })
  const indentationCount =
    unreleasedEntries[0].entry.length - unreleasedEntries[0].entry.trim().length
  const padding = new Array(indentationCount + 1).join(' ')
  const releaseEntry = [
    '',
    `${padding}## ${version}\n`,
    ...unreleasedEntries.map(entry => entry.entry),
  ]
  const latestReleaseHeadingIndex = getLatestReleaseHeading(changelogContents).index
  const mutableChangelogContents = changelogContents.split('\n')
  mutableChangelogContents.splice(latestReleaseHeadingIndex - 1, 0, ...releaseEntry)
  return mutableChangelogContents.join('\n')
}

function _removeUnreleasedItems({changelogContents}) {
  const unreleasedEntries = getEntriesForHeading({
    changelogContents,
    targetHeading: '## Unreleased',
  })
  const mutableChangelogContents = changelogContents.split('\n')
  const entryIndexes = unreleasedEntries.map(entry => entry.index)
  entryIndexes.reverse().forEach(index => {
    mutableChangelogContents.splice(index, 1)
  })
  return mutableChangelogContents.join('\n')
}

function addUnreleasedItem({changelogContents, entry}) {
  const unreleasedEntries = getEntriesForHeading({
    changelogContents,
    targetHeading: '## Unreleased',
    includeHeading: true,
  })
  const targetIndex = unreleasedEntries[unreleasedEntries.length - 1].index + 1
  const mutableChangelogContents = changelogContents.split('\n')
  mutableChangelogContents.splice(targetIndex, 0, entry)
  return mutableChangelogContents.join('\n')
}

// returns the entries for a given heading
// each entry has an index for where it is in the changelog
function getEntriesForHeading({changelogContents, targetHeading, includeHeading}) {
  let foundEntries = []
  let headingFound = false
  for (let [index, entry] of changelogContents.split('\n').entries()) {
    const _entry = entry.trim()
    if (headingFound && _entry.includes('##')) break
    if (headingFound && _entry.length) foundEntries.push({entry, index})
    if (_entry === targetHeading) {
      if (includeHeading) foundEntries.push({entry, index})
      headingFound = true
    }
  }
  return foundEntries
}

function getLatestReleaseHeading(changelogContents) {
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

function getReleaseNumberFromHeading(heading) {
  return heading.match(/([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2})/)[0]
}

function verifyChangelog({changelogContents}) {
  const unreleasedEntries = getEntriesForHeading({
    changelogContents,
    targetHeading: '## Unreleased',
  })
  if (!unreleasedEntries.length)
    throw new Error('No unreleased entries found in the changelog. Add some before releasing.')
}

module.exports = {
  getEntriesForHeading,
  getLatestReleaseHeading,
  getReleaseNumberFromHeading,
  verifyChangelog,
  updateChangelogContents,
  getLatestReleaseEntries,
  addUnreleasedItem,
}
