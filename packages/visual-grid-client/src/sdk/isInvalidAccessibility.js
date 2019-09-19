'use strict';
const {TypeUtils} = require('@applitools/eyes-common');
const {AccessibilityRegionType} = require('@applitools/eyes-common');

function isInvalidAccessibility(accessibility = []) {
  const accObjects = [].concat(accessibility);
  const err = [];
  const typeMsg = `Valid accessibilityType values are: ${Object.values(AccessibilityRegionType)}`;
  for (const acc of accObjects) {
    if (!acc.accessibilityType) {
      err.push(`The region ${JSON.stringify(acc)} is missing accessibilityType.`);
    } else if (!TypeUtils.has(AccessibilityRegionType, acc.accessibilityType)) {
      err.push(
        `The region ${JSON.stringify(acc)} has an invalid accessibilityType of: ${
          acc.accessibilityType
        } `,
      );
      !err.includes(typeMsg) && err.push(typeMsg);
    }
  }
  return err.join('\n');
}

module.exports = isInvalidAccessibility;
