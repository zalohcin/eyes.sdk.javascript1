'use strict';
const {parse, CSSImportRule} = require('cssom');
const traverseCdt = require('./traverseCdt');
const absolutizeUrl = require('./absolutizeUrl');

function isLinkToStyleSheet(node) {
  return (
    node.nodeName &&
    node.nodeName.toUpperCase() === 'LINK' &&
    node.attributes &&
    node.attributes.find(
      attr => attr.name.toLowerCase() === 'rel' && attr.value.toLowerCase() === 'stylesheet',
    )
  );
}

function isStyleElement(node) {
  return node.nodeName && node.nodeName.toUpperCase() === 'STYLE';
}

function getHrefAttr(node) {
  const attr = node.attributes.find(attr => attr.name.toLowerCase() === 'href');
  return attr && attr.value;
}

function getCss(newText, url) {
  return `\n/** ${url} **/\n${newText}`;
}

function makeGetBundledCssFromCdt({resourceCache, logger}) {
  return function getBundledCssFromCdt(cdt, baseUrl) {
    let bundledCss = '';
    traverseCdt(cdt, node => {
      let cssText, resourceUrl;
      if (isStyleElement(node)) {
        cssText = node.childNodeIndexes.map(index => cdt[index].nodeValue).join('');
        resourceUrl = baseUrl;
      } else if (isLinkToStyleSheet(node)) {
        resourceUrl = absolutizeUrl(getHrefAttr(node), baseUrl);
        const resource = resourceCache.getValue(resourceUrl);
        if (resource) {
          if (resource.content) {
            cssText = resource.content.toString();
          } else {
            logger.log(
              `getBundledCssFromCdt: warning - ${
                resource.url
              } doesn't contain content. That means it might have been served with a different content type than text/css, possibly failed authentication.`,
            );
          }
        } else {
          logger.log(`getBundledCssFromCdt: not found link[href] at ${resourceUrl}`);
        }
      }

      if (cssText) {
        bundledCss = `${bundledCss}${getBundledCssFromCssText(
          cssText,
          resourceCache,
          resourceUrl,
        )}`;
      }
    });
    return bundledCss;
  };

  function getBundledCssFromCssText(cssText, resourceCache, resourceUrl) {
    try {
      let bundledCss = '';
      const styleSheet = parse(cssText);
      styleSheet.cssRules.forEach(rule => {
        if (rule instanceof CSSImportRule) {
          const nestedUrl = absolutizeUrl(rule.href, resourceUrl);
          const nestedResource = resourceCache.getValue(nestedUrl);
          if (nestedResource) {
            const nestedCssText = getBundledCssFromCssText(
              nestedResource.content.toString(),
              resourceCache,
              nestedUrl,
            );
            bundledCss = `${nestedCssText}${bundledCss}`;
          } else {
            logger.log(`getBundledCssFromCdt: not found nested resource at ${nestedUrl}`);
          }
        }
      });
      return `${bundledCss}${getCss(cssText, resourceUrl)}`;
    } catch (ex) {
      logger.log(`couldn't parse ${resourceUrl}`, ex);
    }
  }
}

module.exports = makeGetBundledCssFromCdt;
module.exports.getCss = getCss;
