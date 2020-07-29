const {JSDOM, ResourceLoader} = require('jsdom');

class CustomResourceLoader extends ResourceLoader {
  async fetch(url, options) {
    if (process.env.APPLITOOLS_SHOW_LOGS) console.log('[jsdom resource]', url);
    if (/\.css$/.test(url)) {
      return Buffer.from('');
    }
    if (options.element.constructor.name === 'HTMLLinkElement' && url === 'javascript:void(0)') {
      return Buffer.from('');
    }
  }
}

function getDocNode(htmlStr) {
  const resourceLoader = new CustomResourceLoader();
  const dom = new JSDOM(htmlStr, {url: 'http://something.org/', resources: resourceLoader});
  return dom.window.document;
}

module.exports = getDocNode;
