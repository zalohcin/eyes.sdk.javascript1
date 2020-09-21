const {expect} = require('chai')
const {getUnfixedDeps} = require('../../src/yarn')

describe('getUnfixedDeps', () => {
  it('returns unfixed deps', () => {
    expect(
      getUnfixedDeps({
        pkg1: '1.2.3',
      }),
    ).to.eql({})

    expect(
      getUnfixedDeps({
        pkg1: '1.2.3',
        pkg2: '^1.2.3',
      }),
    ).to.eql({pkg2: '^1.2.3'})

    expect(
      getUnfixedDeps({
        pkg1: '1.2.3',
        pkg2: '^1.2.3',
        pkg3: '1.2.3',
        pkg4: '~1.2.3',
      }),
    ).to.eql({pkg2: '^1.2.3', pkg4: '~1.2.3'})
  })
})
