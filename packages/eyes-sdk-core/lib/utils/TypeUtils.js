'use strict';

const BASE64_CHARS_PATTERN = /[^A-Z0-9+/=]/i;

/**
 * Collection of utility methods.
 */
class TypeUtils {
  /**
   * @param value
   * @return {boolean}
   */
  static isString(value) {
    return typeof value === 'string' || value instanceof String;
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isNumber(value) {
    return typeof value === 'number' || value instanceof Number;
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isBoolean(value) {
    return typeof value === 'boolean' || value instanceof Boolean;
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isObject(value) {
    return value != null && typeof value === 'object' && Array.isArray(value) === false;
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isPlainObject(value) {
    return TypeUtils.isObject(value) && value.constructor === Object;
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isArray(value) {
    return Array.isArray(value);
  }

  /**
   * @param value
   * @return {boolean}
   */
  static isBuffer(value) {
    return (
      value != null &&
      !!value.constructor &&
      typeof value.constructor.isBuffer === 'function' &&
      value.constructor.isBuffer(value)
    );
  }

  static isBase64(str) {
    if (!TypeUtils.isString(str)) {
      return false;
    }

    const len = str.length;
    if (!len || len % 4 !== 0 || BASE64_CHARS_PATTERN.test(str)) {
      return false;
    }

    const firstPaddingChar = str.indexOf('=');
    return (
      firstPaddingChar === -1 || firstPaddingChar === len - 1 || (firstPaddingChar === len - 2 && str[len - 1] === '=')
    );
  }
}

exports.TypeUtils = TypeUtils;
