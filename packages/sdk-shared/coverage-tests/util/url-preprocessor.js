// This is why we can't have nice things
// https://github.com/docker/compose/issues/3800#issuecomment-496480571
function preprocessUrl(
  url,
  {isRemote = !!process.env.CVG_TESTS_REMOTE, isMac = process.platform === 'darwin'} = {},
) {
  if (isRemote && isMac) return url.replace(/:\/\/localhost/, '://host.docker.internal')
  return url
}

module.exports = preprocessUrl
