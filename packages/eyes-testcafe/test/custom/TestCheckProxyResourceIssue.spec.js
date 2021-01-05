// re: https://trello.com/c/HnnKL5VU/677-image-is-shown-as-blank-and-the-buttons-images-are-shown-as-squares-testcafe-hackathon-nov-2020
const {Eyes} = require('../../src/sdk')
let eyes

fixture`internal proxying of resources`.before(async () => {
  eyes = new Eyes()
})
test.skip('works with hard-coded resource URLs', async t => {
  // NOTE:
  // - resource missing in the render: hero image (e.g., an image loaded as background-image w/ url attribute)
  // -- https://eyes.applitools.com/app/test-results/00000251792962534191/00000251792962534065/steps/1?accountId=UAujt6tHnEKUivQXIz7G6A~~&mode=step-editor
  // - disableBrowserFetching doesn't help
  // - happens even on testcafe@1.8 (which worked in the old SDK)
  // - dom-snapshot finds the resource (when running on the page) & vg-cli gets a correct render
  // -- https://eyes.applitools.com/app/batches/00000251792962348464/00000251792962348324?accountId=UAujt6tHnEKUivQXIz7G6A~~
  await t.navigateTo('https://demo.applitools.com/tlcHackathonProductDetailsMasterV1.html?id=1')
  await eyes.open(t, 'internal proxying of resources', 'works with resource hard-coded URLs', {
    width: 1200,
    height: 800,
  })
  await eyes.checkWindow({
    target: 'window',
    fully: true,
  })
  await eyes.close(true)
})
