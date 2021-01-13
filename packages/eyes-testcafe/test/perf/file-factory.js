const fs = require('fs')
const path = require('path')
const LARGE_STRING_LENGTH = 1000 * 1000 * 1

module.exports = () => {
  function createFillFile({withCharacter}) {
    fs.writeFileSync(
      path.join(__dirname, 'fixtures', `${withCharacter}.txt`),
      new Array(LARGE_STRING_LENGTH).join(withCharacter),
    )
  }
  let markup = ''
  'abcdefghij'.split('').forEach(letter => {
    createFillFile({withCharacter: letter})
    markup += `<object width="300" height="300" type="text/plain" data="${letter}.txt"></object>\n`
  })
  fs.writeFileSync(path.join(__dirname, 'fixtures', `index.html`), markup)
}
