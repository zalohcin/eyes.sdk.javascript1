const {Target} = require('../index')
const initEyes = require('./initEyes')

async function runPages(
  t,
  pages,
  viewports = [
    {width: 1024, height: 768},
    {width: 600, height: 500},
  ],
) {
  let results = []
  const totalTime = new Date()
  for (const viewport of viewports) {
    console.log(`\nStarting tests for ${viewport.width}x${viewport.height}`)
    const res = await runTests(t, pages, viewport)
    results = results.concat(res)
  }

  console.log('\n')
  console.table(formatResults(results))
  console.log(`\nTotal time + ${timeSinceStr(totalTime)}`)
}

/*
 * Example:
 * pages = [
 *   { url: 'https://www.some.com/bb',    beforeCheck: eyes => eyes._scanPage() },
 *   { url: 'https://www.another.com/aa', stitchMode: 'SCROLL' }
 *   { url: 'https://www.another.com/cc', waitBeforeScreenshots: 1600, only: true, saveImages: true }
 *   { url: 'https://www.another.com/cc', skip: true}
 * ]
 * const viewports = [{width: 600, height: 500}]
 * await runTests(t, pages, viewports)
 */
async function runTests(t, pages, viewportSize) {
  let viewportStr = `${viewportSize.width}x${viewportSize.height}`
  const results = []

  const hasOnly = pages.some(p => p.only)
  for (const page of pages) {
    if ((hasOnly && !page.only) || page.skip) {
      continue
    }

    const startTime = new Date()
    const appName = page.url.match(/\/([^\/]+)$/)[1]

    try {
      console.log(`* starting test [${appName} ${viewportStr}]`)
      const res = await runTest(t, page, viewportSize, appName)
      results.push(res)
      console.log(`* test succeeded [${appName} ${viewportStr}] + ${timeSinceStr(startTime)}`)
    } catch (e) {
      console.log(`* test failed [${appName} ${viewportStr}] + ${timeSinceStr(startTime)}`)
      e.name = appName
      e.size = viewportStr
      results.push(e)
    }
  }
  return results
}

async function runTest(
  t,
  {stitchMode, waitBeforeScreenshots, beforeCheck, url, saveImages},
  viewportSize,
  appName,
) {
  await t.navigateTo(url)
  const eyes = initEyes({stitchMode, waitBeforeScreenshots, viewportSize, saveImages})
  await eyes.open(t, appName, appName)
  beforeCheck && (await beforeCheck(eyes))
  await eyes.check(appName, Target.window().fully())
  const result = await eyes.close(false)
  return result
}

function formatResults(results) {
  return results.map(r => {
    if (r.getStatus) {
      return {
        name: r.getAppName(),
        size: r.getHostDisplaySize().toString(),
        status: r.getStatus(),
        url: r.getUrl(),
      }
    } else {
      return {name: r.name, size: r.size, status: 'Error', url: r.message || JSON.stringify(r)}
    }
  })
}

function timeSinceStr(startTime) {
  const time = parseInt((new Date() - startTime) / 1000)
  var minutes = Math.floor(time / 60)
  var seconds = time - minutes * 60
  return `${minutes} min ${seconds} sec`
}

module.exports = runPages
