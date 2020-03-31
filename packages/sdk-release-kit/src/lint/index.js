const {exec} = require('child_process')
const {promisify} = require('util')
const pexec = promisify(exec)

async function lint() {
  try {
    await pexec(`eslint . --ext .js --no-eslintrc --config ../../.eslintrc`)
  } catch (error) {
    throw new Error(error.stdout)
  }
}

module.exports = {
  lint,
}
