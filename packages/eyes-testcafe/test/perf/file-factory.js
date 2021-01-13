const fs = require('fs')
const path = require('path')
const LARGE_STRING_LENGTH = 1000 * 1000 * 1

function createFillFile({withCharacter}) {
  fs.writeFileSync(
    path.join('fixtures', `${withCharacter}.txt`),
    new Array(LARGE_STRING_LENGTH).join(withCharacter),
  )
}

createFillFile({withCharacter: 'a'})
createFillFile({withCharacter: 'b'})
createFillFile({withCharacter: 'c'})
createFillFile({withCharacter: 'd'})
createFillFile({withCharacter: 'e'})
createFillFile({withCharacter: 'f'})
createFillFile({withCharacter: 'g'})
createFillFile({withCharacter: 'h'})
createFillFile({withCharacter: 'i'})
createFillFile({withCharacter: 'j'})
