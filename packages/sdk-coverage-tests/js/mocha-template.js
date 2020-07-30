function makeMochaTestTemplate(test) {
  const meta = Object.entries(test.meta).reduce((meta, [name, value]) => {
    if (typeof value === 'string') {
      return meta.concat(`@${value}`)
    } else if (value === true) {
      return meta.concat(`@${name}`)
    } else {
      return meta
    }
  }, [])

  return `${test.hooks.deps.join('\n')}

describe${test.disabled ? '.skip' : ''}('Coverage Tests', () => {
  ${test.hooks.vars.join('\n  ')}
  beforeEach(async () => {
    ${test.hooks.beforeEach.join('\n    ')}
  })
  afterEach(async () => {
    ${test.hooks.afterEach.join('\n    ')}
  })
  it('${test.name}${meta.length > 0 ? ` (${meta.join(' ')})` : ''}', async () => {
    ${test.commands.join('\n    ')}
  })
})`
}

module.exports = makeMochaTestTemplate
