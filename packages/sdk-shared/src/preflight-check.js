const dns = require('dns')

// This check is to support coverage tests when running on Mac.
// The coverage tests run inside of a container, and on Mac, "localhost" doesn't
// exist. To account for this, we preprocess the URL and switch it from localhost
// to host.docker.internal. But why do we also need this to resolve outside of
// the container? Because of tests which use a network middleware running on localhost
// (e.g., TestDisableBrowserFetching and TestVisualGridRefererHeader).
// If we can't resolve the same address outside of the container, then the network
// middleware won't be able to function, the tests will fail, and it won't be
// immediately apparent why that is.
//
// NOTE: this will be unnecessary if/when we run the tests fully inside of a container
async function checkLocalhost(
  address = 'host.docker.internal',
  {platform = process.platform} = {},
) {
  if (platform !== 'darwin') return
  return new Promise((resolve, reject) => {
    dns.lookup(address, err => {
      if (err) {
        reject({
          message: `Unable to find ${address}. You need to specify this in your /etc/hosts file`,
        })
      }
      resolve(address)
    })
  })
}

module.exports = {checkLocalhost}
