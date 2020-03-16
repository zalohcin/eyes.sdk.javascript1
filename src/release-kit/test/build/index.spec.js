const assert = require('assert')
const {getPathsToInternalPackages} = require('../../src/build/index')

describe('build', () => {
  describe('updatePackageJson', () => {
    it.skip('rewrites dependencies portal paths to reference packages in the build folder', () => {})
    it.skip('creates frankenstein dependencies block from dependencies dependencies', () => {})
  })
  describe('getPathsToInternalPackages', () => {
    it('returns a collection of relative file paths for just internal packages', () => {
      const deps = {
        blah: 'portal:../blah/blah',
        blahblah: 'portal:../blah/blahblah',
        externalPkg: '^1.2.3',
      }
      assert.deepStrictEqual(getPathsToInternalPackages(deps), ['../blah/blah', '../blah/blahblah'])
    })
    it('returns a collection of anchored relative paths from nested internal packages', () => {
      const deps = {
        blah: 'portal:../blah',
      }
      assert.deepStrictEqual(getPathsToInternalPackages(deps, '../../src/blahblah'), [
        '../../src/blah',
      ])
    })
  })
})
