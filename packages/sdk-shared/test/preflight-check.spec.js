const assert = require('assert')
const {checkLocalhost} = require('../src/preflight-check')

describe('preflight-check', () => {
  describe('checkLocalhost', () => {
    it('does not run on Linux', () => {
      return assert.doesNotThrow(async () => {
        await checkLocalhost(undefined, {platform: 'linux'})
      })
    })
    it('throws on Mac when uable to resolve container address', () => {
      return assert.rejects(async () => {
        await checkLocalhost('blah', {platform: 'darwin'})
      })
    })
    if (process.platform === 'darwin') {
      it('works on Mac when able to resolve container address', () => {
        return assert.doesNotReject(async () => {
          await checkLocalhost('host.docker.internal', {platform: 'darwin'})
        })
      })
    }
  })
})
