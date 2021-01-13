const fs = require('fs')
const path = require('path')
const LARGE_STRING_LENGTH = 1000 * 1000 * 1
const FILL_LETTERS = 'abcdefghij'

module.exports = () => {
  function createFillFile({withCharacter}) {
    fs.writeFileSync(
      path.join(__dirname, 'fixtures', `${withCharacter}.txt`),
      new Array(LARGE_STRING_LENGTH).join(withCharacter),
    )
  }
  let markup = ''
  FILL_LETTERS.split('').forEach(letter => {
    createFillFile({withCharacter: letter})
    markup += `<object width="300" height="300" type="text/plain" data="${letter}.txt"></object>\n`
  })
  fs.writeFileSync(path.join(__dirname, 'fixtures', `index.html`), markup)
}
