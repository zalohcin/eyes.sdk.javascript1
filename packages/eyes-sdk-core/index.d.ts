/// <reference types="node" />
declare module "lib/utils/Enum" {
    export = Enum;
    /**
     * @template E
     * @param {string} name
     * @param {E} valuesObj
     * @return {Readonly<E>}
     */
    function Enum<E>(name: string, valuesObj: E): Readonly<E>;
}
declare module "lib/config/AccessibilityLevel" {
    export = AccessibilityLevels;
    /**
     * @typedef {string} AccessibilityLevel
     */
    /**
     * The extent in which to check the image visual accessibility level.
     */
    const AccessibilityLevels: Readonly<{
        /** Low accessibility level. */
        AA: string;
        /** Highest accessibility level. */
        AAA: string;
    }>;
    namespace AccessibilityLevels {
        export { AccessibilityLevel };
    }
    type AccessibilityLevel = string;
}
declare module "lib/config/AccessibilityGuidelinesVersion" {
    export = AccessibilityGuidelinesVersions;
    /**
     * @typedef {string} AccessibilityGuidelinesVersion
     */
    /**
     * The spec version for which to check the image visual accessibility level.
     */
    const AccessibilityGuidelinesVersions: Readonly<{
        WCAG_2_0: string;
        WCAG_2_1: string;
    }>;
    namespace AccessibilityGuidelinesVersions {
        export { AccessibilityGuidelinesVersion };
    }
    type AccessibilityGuidelinesVersion = string;
}
declare module "lib/config/AccessibilityRegionType" {
    export = AccessibilityRegionTypes;
    /**
     * @typedef {string} AccessibilityRegionType
     */
    /**
     * The type of accessibility for a region.
     */
    const AccessibilityRegionTypes: Readonly<{
        IgnoreContrast: string;
        RegularText: string;
        LargeText: string;
        BoldText: string;
        GraphicalObject: string;
    }>;
    namespace AccessibilityRegionTypes {
        export { AccessibilityRegionType };
    }
    type AccessibilityRegionType = string;
}
declare module "lib/utils/TypeUtils" {
    /**
     * Checks if `value` is `null` or `undefined`. But the `value` can be one of following: `0`, `NaN`, `false`, `""`.
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isNull(value: any): boolean;
    /**
     * Checks if `value` is NOT `null` and NOT `undefined`.
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isNotNull(value: any): boolean;
    /**
     * Checks if `value` has a type `string` or created by the `String` constructor
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isString(value: any): boolean;
    /**
     * Checks if `value` has a type `number` or created by the `Number` constructor
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isNumber(value: any): boolean;
    /**
     * Checks if `value` has a type `number` or created by the `Number` constructor and the value is integer
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isInteger(value: any): boolean;
    /**
     * Checks if `value` has a type `boolean` or created by the `Boolean` constructor
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isBoolean(value: any): boolean;
    /**
     * Checks if `value` has a type `object` and not `null`.
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isObject(value: any): boolean;
    /**
     * Checks if `value` is a plain object. An object created by either `{}`, `new Object()` or `Object.create(null)`.
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isPlainObject(value: any): boolean;
    /**
     * Checks if `value` is an array.
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isArray(value: any): boolean;
    /**
     * Checks if `value` is a Buffer.
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isBuffer(value: any): boolean;
    /**
     * Checks if `value` is a base64 string.
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isBase64(value: any): boolean;
    /**
     * Checks if `value` is a base64 string.
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isUrl(value: any): boolean;
    /**
     * Checks if `keys` is a direct property(ies) of `object`.
     *
     * @param {object} object - The object to query.
     * @param {string|string[]} keys - The key(s) to check.
     */
    export function has(object: object, keys: string | string[]): boolean;
    /**
     * Checks if `methods` is a method(s) of `object`.
     *
     * @param {object} object - The object to query.
     * @param {string|string[]} methods - The methods(s) to check.
     */
    export function hasMethod(object: object, methods: string | string[]): boolean;
    /**
     * Returns a `value` if it is !== undefined, or `defaultValue` otherwise
     *
     * @param {*} value
     * @param {*} defaultValue
     * @return {*}
     */
    export function getOrDefault(value: any, defaultValue: any): any;
    /**
     * Checks if `value` has a type `function`
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isFunction(value: any): boolean;
    /**
     * Checks if `value` is implements iterator protocol
     *
     * @param {*} value
     * @return {boolean}
     */
    export function isIterator(value: any): boolean;
}
declare module "lib/utils/DateTimeUtils" {
    /**
     * Convert a Date object to a ISO-8601 date string
     *
     * @param {Date} [date] - Date which will be converted
     * @return {string} - string formatted as ISO-8601 (yyyy-MM-dd'T'HH:mm:ss'Z')
     */
    export function toISO8601DateTime(date?: Date): string;
    /**
     * Convert a Date object to a RFC-1123 date string
     *
     * @param {Date} [date] - Date which will be converted
     * @return {string} - string formatted as RFC-1123 (E, dd MMM yyyy HH:mm:ss 'GMT')
     */
    export function toRfc1123DateTime(date?: Date): string;
    /**
     * @param {Date} [date] - Date which will be converted
     * @param {boolean} [utc=false] - If set to true, then will be used uct time instead of local
     * @return {string} - string formatted for log files (yyyy_mm_dd__HH_MM_ss_l)
     */
    export function toLogFileDateTime(date?: Date, utc?: boolean): string;
    /**
     * Creates {@link Date} instance from an ISO 8601 formatted string.
     *
     * @param {string} dateTime - An ISO 8601 formatted string.
     * @return {Date} - A {@link Date} instance representing the given date and time.
     */
    export function fromISO8601DateTime(dateTime: string): Date;
}
declare module "lib/utils/GeneralUtils" {
    /**
     * Concatenate the url to the suffixes - making sure there are no double slashes
     *
     * @param {string} url - The left side of the URL.
     * @param {...string} suffixes - The right side.
     * @return {string} - the URL
     */
    export function urlConcat(url: string, ...suffixes: string[]): string;
    /**
     * If given URL ends with '/', the method with cut it and return URL without it
     *
     * @param {string} url
     * @return {string}
     */
    export function stripTrailingSlash(url: string): string;
    /**
     * Check if an URL is absolute
     *
     * @param {string} url
     * @return {boolean} - the URL
     */
    export function isAbsoluteUrl(url: string): boolean;
    /**
     * Converts all arguments to a single string, used for logging
     *
     * @param {...*} args
     * @return {string}
     */
    export function stringify(...args: any[]): string;
    /**
     * Converts argument to string
     *
     * @param {*} arg
     * @return {string}
     */
    export function stringifySingle(arg: any): string;
    /**
     * Converts object or class to string, used within `toString` method of classes
     *
     * @param {object} object
     * @param {string[]} [exclude]
     * @return {string}
     */
    export function toString(object: object, exclude?: string[]): string;
    /**
     * Convert a class to plain object
     * Makes all private properties public (remove '_' char from prop names)
     *
     * @param {object} object
     * @param {string[]} [exclude]
     * @param {object} [rename]
     * @return {object}
     */
    export function toPlain(object: object, exclude?: string[], rename?: object): object;
    /**
     * Merge two objects x and y deeply, returning a new merged object with the elements from both x and y.
     * If an element at the same key is present for both x and y, the value from y will appear in the result.
     * Merging creates a new object, so that neither x or y are be modified.
     * @see package 'deepmerge'
     *
     * @template TFirst
     * @template TSecond
     * @param {TFirst} target
     * @param {TSecond} source
     * @return {TFirst|TSecond}
     */
    export function mergeDeep<TFirst, TSecond>(target: TFirst, source: TSecond): TFirst | TSecond;
    /**
     * Generate GUID
     *
     * @return {string}
     */
    export function guid(): string;
    /**
     * Generate random alphanumeric sequence
     *
     * @return {string}
     */
    export function randomAlphanumeric(length?: number): string;
    /**
     * Waits a specified amount of time before resolving the returned promise.
     *
     * @param {number} ms - The amount of time to sleep in milliseconds.
     * @return {Promise} - A promise which is resolved when sleep is done.
     */
    export function sleep(ms: number): Promise<any>;
    /**
     * Convert a Date object to a ISO-8601 date string
     *
     * @deprecated Use {@link DateTimeUtils.toISO8601DateTime} instead
     * @param {Date} [date] - Date which will be converted
     * @return {string} - string formatted as ISO-8601 (yyyy-MM-dd'T'HH:mm:ss'Z')
     */
    export function toISO8601DateTime(date?: Date): string;
    /**
     * Convert a Date object to a RFC-1123 date string
     *
     * @deprecated Use {@link DateTimeUtils.toRfc1123DateTime} instead
     * @param {Date} [date] - Date which will be converted
     * @return {string} - string formatted as RFC-1123 (E, dd MMM yyyy HH:mm:ss 'GMT')
     */
    export function toRfc1123DateTime(date?: Date): string;
    /**
     * @deprecated Use {@link DateTimeUtils.toLogFileDateTime} instead
     * @param {Date} [date] - Date which will be converted
     * @return {string} - string formatted as RFC-1123 (yyyy_mm_dd__HH_MM_ss_l)
     */
    export function toLogFileDateTime(date?: Date): string;
    /**
     * Creates {@link Date} instance from an ISO 8601 formatted string.
     *
     * @deprecated Use {@link DateTimeUtils.fromISO8601DateTime} instead
     * @param {string} dateTime - An ISO 8601 formatted string.
     * @return {Date} - A {@link Date} instance representing the given date and time.
     */
    export function fromISO8601DateTime(dateTime: string): Date;
    /**
     * Simple method that decode JSON Web Tokens
     *
     * @param {string} token
     * @return {object}
     */
    export function jwtDecode(token: string): object;
    /**
     * Cartesian product of arrays
     *
     * @param {...([]|Object)} arrays - Variable number of arrays of n elements
     * @return {Array<Array<[]>>} - Product of arrays as an array of X arrays of N elements,
     *   where X is the product of the input arrays' lengths
     */
    export function cartesianProduct(...arrays: ([] | any)[]): Array<Array<[]>>;
    /**
     * Get a property of the object by a path string
     *
     * @param {object} object - The object to query.
     * @param {string} path - The path of a property (example: "foo.bar.baz" ).
     * @return {*|undefined} - The value of the given property or `undefined` if the property is not exists.
     */
    export function getPropertyByPath(object: object, path: string): any | undefined;
    /**
     * Get an environment property by property name
     *
     * @param {string} propName The property name to look up
     * @param {boolean=false} isBoolean Whether or not the value should be converted to boolean type
     * @return {*|undefined} - The value of the given property or `undefined` if the property is not exists.
     */
    export function getEnvValue(propName: string, isBoolean?: boolean): any | undefined;
    /**
     * Make sure new param value is set with either backward compatible param or the new param.
     *
     * @param {...object[]} params The parameter map.
     * @param {logger} logger to log errors
     * @example
     *
     * foo({newParam, oldPram}) {
     *    ({newParam} = backwardCompatible([{oldParam}, {newParam}], logger))
     *    // now if oldParam is used we set it to oldParam and log a deprecation message.
     * }
     *
     */
    export function backwardCompatible(...args: any[]): {};
    /**
     * @param {string} str
     * @return {string}
     */
    export function cleanStringForJSON(str: string): string;
    export function isFeatureFlagOn(featureName: any): boolean;
    export function isFeatureFlagOff(featureName: any): boolean;
    /**
     * @template T
     * @param {PromiseLike<T>} promise
     *
     * @returns {PromiseLike<[any|undefined, T|undefined]>} a 2-tuple where the first element is the error if promise is rejected,
     *   or undefined if resolved,
     *   and the second value is the value resolved by the promise, or undefined if rejected
     *
     * Note: copyied @applitools/functional-commons
     */
    export function presult<T>(promise: PromiseLike<T>): PromiseLike<[any, T]>;
    export function pexec(...args: any[]): import("child_process").PromiseWithChild<{
        stdout: string;
        stderr: string;
    }> & import("child_process").PromiseWithChild<{
        stdout: Buffer;
        stderr: Buffer;
    }> & import("child_process").PromiseWithChild<{
        stdout: string;
        stderr: string;
    }> & import("child_process").PromiseWithChild<{
        stdout: string;
        stderr: string;
    }> & import("child_process").PromiseWithChild<{
        stdout: string | Buffer;
        stderr: string | Buffer;
    }>;
    export function cachify(getterFunction: any, cacheRegardlessOfArgs?: boolean): (...args: any[]) => any;
}
declare module "lib/utils/ArgumentGuard" {
    /**
     * Fails if the input parameter equals the input value.
     *
     * @param {object} param - The input parameter.
     * @param {object} value - The input value.
     * @param {string} paramName - The input parameter name.
     */
    export function notEqual(param: object, value: object, paramName: string): void;
    /**
     * Fails if the input parameter contains some special characters or punctuation
     *
     * @param {object} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     */
    export function alphanumeric(param: object, paramName: string): void;
    /**
     * Fails if the input parameter is null.
     *
     * @param {object} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     */
    export function notNull(param: object, paramName: string): void;
    /**
     * Fails if the input parameter is not null.
     *
     * @param {object} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     */
    export function isNull(param: object, paramName: string): void;
    /**
     * Fails if the input parameter string is null or empty.
     *
     * @param {object} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     */
    export function notNullOrEmpty(param: object, paramName: string): void;
    /**
     * Fails if the input integer parameter is negative.
     *
     * @param {number} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     * @param {boolean} shouldBeInteger - Whether or not, the number should be en integer
     */
    export function greaterThanOrEqualToZero(param: number, paramName: string, shouldBeInteger?: boolean): void;
    /**
     * Fails if the input integer parameter is smaller than 1.
     *
     * @param {number} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     * @param {boolean} isInteger - Whether or not, the number should be en integer
     */
    export function greaterThanZero(param: number, paramName: string, isInteger?: boolean): void;
    /**
     * Fails if the input integer parameter is equal to 0.
     *
     * @param {number} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     * @param {boolean} isInteger - Whether or not, the number should be en integer
     */
    export function notZero(param: number, paramName: string, isInteger?: boolean): void;
    /**
     * Fails if the input number is not integer
     *
     * @param {number} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
     */
    export function isInteger(param: number, paramName: string, strict?: boolean): void;
    /**
     * Fails if param is not a string.
     *
     * @param {object} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
     */
    export function isString(param: object, paramName: string, strict?: boolean): void;
    /**
     * Fails if param is not a number.
     *
     * @param {object} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
     */
    export function isNumber(param: object, paramName: string, strict?: boolean): void;
    /**
     * Fails if param is not a boolean.
     *
     * @param {object} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
     */
    export function isBoolean(param: object, paramName: string, strict?: boolean): void;
    /**
     * Fails if param is not an array.
     *
     * @param {object} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
     */
    export function isArray(param: object, paramName: string, strict?: boolean): void;
    /**
     * Fails if param is not a plain object.
     *
     * @param {object} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
     */
    export function isPlainObject(param: object, paramName: string, strict?: boolean): void;
    /**
     * Fails if param is not a buffer.
     *
     * @param {object} param - The input parameter.
     * @param {string} paramName - The input parameter name.
     * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
     */
    export function isBuffer(param: object, paramName: string, strict?: boolean): void;
    /**
     * Fails if param is not a base64 string.
     *
     * @param {object} param - The input parameter.
     */
    export function isBase64(param: object): void;
    /**
     * Fails if isValid is false.
     *
     * @param {boolean} isValid - Whether the current state is valid.
     * @param {string} errMsg - A description of the error.
     */
    export function isValidState(isValid: boolean, errMsg: string): void;
    /**
     * Fails if isValid is false.
     *
     * @param {object} param - The input parameter.
     * @param {object} type - The expected param type
     * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
     */
    export function isValidType(param: object, type: object, strict?: boolean): void;
    /**
     * Fails if isValid is false.
     *
     * @param {*} value - The input value.
     * @param {object} enumObject - The required enum object
     * @param {boolean} [strict=true] - If {@code false} then the value can be null|undefined
     */
    export function isValidEnumValue(value: any, enumObject: object, strict?: boolean): void;
    /**
     * Check if object contains all required properties
     *
     * @param {object} object - The input object.
     * @param {string|string[]} properties - The array of properties to test
     * @param {string} paramName - The input parameter name.
     */
    export function hasProperties(object: object, properties: string | string[], paramName: string): void;
}
declare module "lib/geometry/RectangleSize" {
    export = RectangleSize;
    /**
     * @typedef {{width: number, height: number}} RectangleSizeObject
     */
    /**
     * Represents a 2D size.
     */
    class RectangleSize {
        /**
         * Parses a string into a {@link RectangleSize} instance.
         *
         * @param {string} size - A string representing width and height separated by "x".
         * @return {RectangleSize} - An instance representing the input size.
         */
        static parse(size: string): RectangleSize;
        /**
         * Creates a RectangleSize instance.
         * @param {RectangleSize|RectangleSizeObject|number} varArg1 - The RectangleSize (or object) to clone from or the width of new RectangleSize.
         * @param {number} [varArg2] - The height of new RectangleSize.
         */
        constructor(varArg1: RectangleSize | RectangleSizeObject | number, varArg2?: number, ...args: any[]);
        _width: any;
        _height: any;
        /**
         * @return {boolean}
         */
        isEmpty(): boolean;
        /**
         * @return {number} - The rectangle's width.
         */
        getWidth(): number;
        /**
         * @return {number} - The rectangle's height.
         */
        getHeight(): number;
        /**
         * Indicates whether some other RectangleSize is "equal to" this one.
         *
         * @param {object|RectangleSize} obj - The reference object with which to compare.
         * @return {boolean} - A {@code true} if this object is the same as the obj argument; {@code false} otherwise.
         */
        equals(obj: object | RectangleSize): boolean;
        /**
         * Get a scaled version of the current size.
         *
         * @param {number} scaleRatio - The ratio by which to scale the results.
         * @return {RectangleSize} - A scaled copy of the current size.
         */
        scale(scaleRatio: number): RectangleSize;
        /**
         * @override
         */
        toJSON(): {
            width: any;
            height: any;
        };
        /**
         * @override
         */
        toString(): string;
    }
    namespace RectangleSize {
        export { EMPTY, RectangleSizeObject };
    }
    type RectangleSizeObject = {
        width: number;
        height: number;
    };
    var EMPTY: RectangleSize;
}
declare module "lib/geometry/Location" {
    export = Location;
    /**
     * @typedef {{x: number, y: number}} LocationObject
     */
    /**
     * A location in a two-dimensional plane.
     */
    class Location {
        /**
         * Creates a Location instance.
         * @param {Location|LocationObject|number} varArg1 - The Location (or object) to clone from or the X coordinate of new Location.
         * @param {number} [varArg2] - The Y coordinate of new Location.
         */
        constructor(varArg1: Location | LocationObject | number, varArg2?: number, ...args: any[]);
        _x: number;
        _y: number;
        /**
         * @return {number} The X coordinate of this location.
         */
        getX(): number;
        /**
         * @return {number} - The Y coordinate of this location.
         */
        getY(): number;
        /**
         * Indicates whether some other Location is "equal to" this one.
         *
         * @param {Location} obj - The reference object with which to compare.
         * @return {boolean} - A {@code true} if this object is the same as the obj argument, {@code false} otherwise.
         */
        equals(obj: Location): boolean;
        /**
         * Get a location translated by the specified amount.
         *
         * @param {number} dx - The amount to offset the x-coordinate.
         * @param {number} dy - The amount to offset the y-coordinate.
         * @return {Location} - A location translated by the specified amount.
         */
        offset(dx: number, dy: number): Location;
        /**
         *
         * @param {Location} other
         * @return {Location}
         */
        offsetNegative(other: Location): Location;
        /**
         * Get a location translated by the specified amount.
         *
         * @param {Location} amount - The amount to offset.
         * @return {Location} - A location translated by the specified amount.
         */
        offsetByLocation(amount: Location): Location;
        /**
         * Get a scaled location.
         *
         * @param {number} scaleRatio - The ratio by which to scale the results.
         * @return {Location} - A scaled copy of the current location.
         */
        scale(scaleRatio: number): Location;
        /**
         * @override
         */
        toJSON(): {
            x: number;
            y: number;
        };
        /**
         * @override
         */
        toString(): string;
        toStringForFilename(): string;
    }
    namespace Location {
        export { ZERO, LocationObject };
    }
    type LocationObject = {
        x: number;
        y: number;
    };
    var ZERO: Location;
}
declare module "lib/geometry/CoordinatesType" {
    export = CoordinatesTypes;
    /**
     * @typedef {string} CoordinatesType
     */
    const CoordinatesTypes: Readonly<{
        /**
         * The coordinates should be used "as is" on the screenshot image. Regardless of the current context.
         */
        SCREENSHOT_AS_IS: string;
        /**
         * The coordinates should be used "as is" within the current context. For example, if we're inside a frame, the
         * coordinates are "as is", but within the current frame's viewport.
         */
        CONTEXT_AS_IS: string;
        /**
         * Coordinates are relative to the context. For example, if we are in a context of a frame in a web page, then the
         * coordinates are relative to the  frame. In this case, if we want to crop an image region based on an element's
         * region, we will need to calculate their respective "as is" coordinates.
         */
        CONTEXT_RELATIVE: string;
    }>;
    namespace CoordinatesTypes {
        export { CoordinatesType };
    }
    type CoordinatesType = string;
}
declare module "lib/geometry/Region" {
    export = Region;
    /**
     * A Region in a two-dimensional plane.
     */
    class Region {
        /**
         * @param {object} object
         * @return {boolean}
         */
        static isRegionCompatible(object: object): boolean;
        /**
         * Creates a Region instance.
         * @param {Region|RegionObject|Location|number} varArg1 - The Region (or object) to clone from, the Location of new region or the left offset of new region.
         * @param {RectangleSize|number} [varArg2] - The Region size or the top offset of new region.
         * @param {CoordinatesType|number} [varArg3] - The width of new region.
         * @param {number} [varArg4] - The height of new region.
         * @param {CoordinatesType} [varArg5] - The coordinatesType of new region (protected argument).
         */
        constructor(varArg1: Region | RegionObject | Location | number, varArg2?: import("lib/geometry/RectangleSize") | number, varArg3?: CoordinatesType | number, varArg4?: number, varArg5?: CoordinatesType, ...args: any[]);
        _error: any;
        _left: any;
        _top: any;
        _width: any;
        _height: any;
        _coordinatesType: any;
        /**
         * @return {number} - The region's left offset.
         */
        getLeft(): number;
        /**
         * @param {number} value
         */
        setLeft(value: number): void;
        /**
         * @return {number} - The region's top offset.
         */
        getTop(): number;
        /**
         * @param {number} value
         */
        setTop(value: number): void;
        /**
         * @return {number} - The region's right offset.
         */
        getRight(): number;
        /**
         * @return {number} - The region's bottom offset.
         */
        getBottom(): number;
        /**
         * @return {number} - The region's width.
         */
        getWidth(): number;
        /**
         * @param {number} value
         */
        setWidth(value: number): void;
        /**
         * @return {number} - The region's height.
         */
        getHeight(): number;
        /**
         * @param {number} value
         */
        setHeight(value: number): void;
        /**
         * @return {CoordinatesType} - The region's coordinatesType.
         */
        getCoordinatesType(): CoordinatesType;
        /**
         * @param {CoordinatesType} value
         */
        setCoordinatesType(value: CoordinatesType): void;
        /**
         * @return {string}
         */
        getError(): string;
        /**
         * @param {string} value
         */
        setError(value: string): void;
        /**
         * @return {Location} - The (top,left) position of the current region.
         */
        getLocation(): Location;
        /**
         * Set the (top,left) position of the current region
         *
         * @param {Location} location - The (top,left) position to set.
         */
        setLocation(location: Location): void;
        /**
         * @return {RectangleSize} - The size of the region.
         */
        getSize(): import("lib/geometry/RectangleSize");
        /**
         * Set the (width,height) size of the current region
         *
         * @param {RectangleSize} size - The updated size of the region.
         */
        setSize(size: import("lib/geometry/RectangleSize")): void;
        /**
         * Indicates whether some other Region is "equal to" this one.
         *
         * @param {object|Region} obj - The reference object with which to compare.
         * @return {boolean} - A {@code true} if this object is the same as the obj argument; {@code false} otherwise.
         */
        equals(obj: object | Region): boolean;
        /**
         * @return {boolean} - A {@code true} if the region is empty; {@code false} otherwise.
         */
        isEmpty(): boolean;
        /**
         * @return {boolean} - A {@code true} if the region's size is 0, false otherwise.
         */
        isSizeEmpty(): boolean;
        /**
         * Get a Region translated by the specified amount.
         *
         * @param {number} dx - The amount to offset the x-coordinate.
         * @param {number} dy - The amount to offset the y-coordinate.
         * @return {Region} - A region with an offset location.
         */
        offset(dx: number, dy: number): Region;
        /**
         * @return {Location}
         */
        getMiddleOffset(): Location;
        /**
         * Get a region which is a scaled version of the current region.
         * IMPORTANT: This also scales the LOCATION(!!) of the region (not just its size).
         *
         * @param {number} scaleRatio - The ratio by which to scale the results.
         * @return {Region} - A new region which is a scaled version of the current region.
         */
        scale(scaleRatio: number): Region;
        /**
         * Returns a list of sub-regions which compose the current region.
         *
         * @param {RectangleSize} subRegionSize - The default sub-region size to use.
         * @param {boolean} [isFixedSize=false] - If {@code false}, then sub-regions might have a size which is smaller then
         *   {@code subRegionSize} (thus there will be no overlap of regions). Otherwise, all sub-regions will have the same
         * @param {number} [scrollDownAmmount=0] - If exists (double overlap) then each non-top region is scrolled up (page down)
         *   by this ammount; this is under the assumption that this mmount should be removed from the top of images.
         * @return {Region[]} - The sub-regions composing the current region. If {@code subRegionSize} is equal or
         *   greater than the current region, only a single region is returned.
         */
        getSubRegions(subRegionSize: import("lib/geometry/RectangleSize"), isFixedSize?: boolean, scrollDownAmmount?: number): Region[];
        /**
         * Check if a specified region is contained within the another region or location.
         *
         * @param {Region|Location} locationOrRegion - The region or location to check if it is contained within the current
         *   region.
         * @return {boolean} - True if the region is contained within given object, false otherwise.
         */
        contains(locationOrRegion: Region | Location): boolean;
        /**
         * Check if a region is intersected with the current region.
         *
         * @param {Region} other - The region to check intersection with.
         * @return {boolean} - True if the regions are intersected, false otherwise.
         */
        isIntersected(other: Region): boolean;
        /**
         * Replaces this region with the intersection of itself and {@code other}
         *
         * @param {Region} other - The region with which to intersect.
         */
        intersect(other: Region): void;
        /**
         * @protected
         */
        protected makeEmpty(): void;
        /**
         * @override
         */
        toJSON(): {
            error: any;
            left?: undefined;
            top?: undefined;
            width?: undefined;
            height?: undefined;
            coordinatesType?: undefined;
        } | {
            left: any;
            top: any;
            width: any;
            height: any;
            coordinatesType: any;
            error?: undefined;
        };
        toPersistedRegions(_driver: any): Promise<{
            left: any;
            top: any;
            width: any;
            height: any;
        }[]>;
        /**
         * @override
         */
        toString(): string;
    }
    namespace Region {
        export { EMPTY, CoordinatesType, RegionObject };
    }
    type CoordinatesType = string;
    const Location: typeof import("lib/geometry/Location");
    type RegionObject = {
        left: number;
        top: number;
        width: number;
        height: number;
        coordinatesType: CoordinatesType | undefined;
    };
    var EMPTY: Region;
}
declare module "lib/config/AccessibilityMatchSettings" {
    export = AccessibilityMatchSettings;
    /**
     * @typedef {import('./AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
     */
    /**
     * Encapsulates Accessibility match settings.
     */
    class AccessibilityMatchSettings {
        /**
         * @param {object} settings
         * @param {number} settings.left
         * @param {number} settings.top
         * @param {number} settings.width
         * @param {number} settings.height
         * @param {AccessibilityRegionType} [settings.type]
         */
        constructor({ left, top, width, height, type }?: {
            left: number;
            top: number;
            width: number;
            height: number;
            type: AccessibilityRegionType;
        }, ...args: any[]);
        _left: number;
        _top: number;
        _width: number;
        _height: number;
        _type: string;
        /**
         * @return {number}
         */
        getLeft(): number;
        /**
         * @param {number} value
         */
        setLeft(value: number): void;
        /**
         * @return {number}
         */
        getTop(): number;
        /**
         * @param {number} value
         */
        setTop(value: number): void;
        /**
         * @return {number}
         */
        getWidth(): number;
        /**
         * @param {number} value
         */
        setWidth(value: number): void;
        /**
         * @return {number}
         */
        getHeight(): number;
        /**
         * @param {number} value
         */
        setHeight(value: number): void;
        /**
         * @return {AccessibilityRegionType}
         */
        getType(): AccessibilityRegionType;
        /**
         * @param {AccessibilityRegionType} value
         */
        setType(value: AccessibilityRegionType): void;
        /**
         * @return {Region}
         */
        getRegion(): import("lib/geometry/Region");
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
    namespace AccessibilityMatchSettings {
        export { AccessibilityRegionType };
    }
    type AccessibilityRegionType = string;
}
declare module "lib/config/BatchInfo" {
    export = BatchInfo;
    /**
     * @typedef BatchInfoObject
     * @prop {string} [id]
     * @prop {string} [name]
     * @prop {Data|string} [startedAt]
     * @prop {string} [sequenceName]
     * @prop {boolean} [notifyOnCompletion]
     */
    /**
     * A batch of tests.
     */
    class BatchInfo {
        /**
         * Creates a new BatchInfo instance.
         * Alternatively, batch can be set via global variables `APPLITOOLS_BATCH_ID`, `APPLITOOLS_BATCH_NAME`, `APPLITOOLS_BATCH_SEQUENCE`.
         *
         * @signature `new BatchInfo()`
         *
         * @signature `new BatchInfo(batchInfo)`
         * @sigparam {BatchInfo} batchInfo - The BatchInfo instance to clone from.
         *
         * @signature `new BatchInfo(object)`
         * @sigparam {{id: (string|undefined), name: (string|undefined), startedAt: (Date|string|undefined), sequenceName: (string|undefined)}} object - The batch object to clone from.
         *
         * @signature `new BatchInfo(name, startedAt, id)`
         * @sigparam {string} name - Name of batch or {@code null} if anonymous.
         * @sigparam {Date|string} [startedAt] - Batch start time, defaults to the current time.
         * @sigparam {string} [id] - The ID of the existing batch, used to clone batch.
         *
         * @param {BatchInfo|BatchInfoObject|string} [varArg1] - The BatchInfo (or object) to clone from or the name of new batch.
         *   If no arguments given, new BatchInfo will be created with default or environment settings.
         * @param {string} [varArg2] - Batch start time, defaults to the current time.
         * @param {string} [varArg3] - ID of the batch, defaults is generated using GeneralUtils.guid().
         */
        constructor(varArg1?: BatchInfo | BatchInfoObject | string, varArg2?: string, varArg3?: string);
        _id: any;
        _isGeneratedId: boolean;
        _name: any;
        _startedAt: any;
        _sequenceName: any;
        _notifyOnCompletion: any;
        _isCompleted: any;
        /**
         * @return {string} - The id of the current batch.
         */
        getId(): string;
        getIsGeneratedId(): boolean;
        setIsGeneratedId(value: any): any;
        /**
         * Sets a unique identifier for the batch. Sessions with batch info which includes the same ID will be grouped
         * together.
         *
         * @param {string} value - The batch's ID
         * @return {this}
         */
        setId(value: string): this;
        /**
         * @return {string} - The name of the batch or {@code null} if anonymous.
         */
        getName(): string;
        /**
         * @param {string} name - The name of the batch to use.
         * @return {this}
         */
        setName(name: string): this;
        /**
         * @return {Date} - The batch start date
         */
        getStartedAt(): Date;
        /**
         * @param {string} startedAt
         * @return {this}
         */
        setStartedAt(startedAt: string): this;
        /**
         * @return {string} - The name of the sequence.
         */
        getSequenceName(): string;
        /**
         * @param {string} sequenceName - The Batch's sequence name.
         * @return {this}
         */
        setSequenceName(sequenceName: string): this;
        /**
         * @return {boolean} - Indicate whether notification should be sent on this batch completion.
         */
        getNotifyOnCompletion(): boolean;
        /**
         * @param {boolean} notifyOnCompletion - Indicate whether notification should be sent on this batch completion.
         * @return {this}
         */
        setNotifyOnCompletion(notifyOnCompletion: boolean): this;
        /**
         * @return {boolean}
         */
        getIsCompleted(): boolean;
        /**
         * @param {boolean} isCompleted
         * @return {this}
         */
        setIsCompleted(isCompleted: boolean): this;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
        _generateAndSetId(): void;
    }
    namespace BatchInfo {
        export { BatchInfoObject };
    }
    type BatchInfoObject = {
        id?: string;
        name?: string;
        startedAt?: any | string;
        sequenceName?: string;
        notifyOnCompletion?: boolean;
    };
}
declare module "lib/config/BrowserType" {
    export = BrowserTypes;
    /**
     * @typedef {string} BrowserType
     */
    const BrowserTypes: Readonly<{
        CHROME: string;
        FIREFOX: string;
        IE_11: string;
        IE_10: string;
        EDGE: string;
        EDGE_CHROMIUM: string;
        EDGE_LEGACY: string;
        SAFARI: string;
        CHROME_ONE_VERSION_BACK: string;
        CHROME_TWO_VERSIONS_BACK: string;
        FIREFOX_ONE_VERSION_BACK: string;
        FIREFOX_TWO_VERSIONS_BACK: string;
        SAFARI_ONE_VERSION_BACK: string;
        SAFARI_TWO_VERSIONS_BACK: string;
        EDGE_CHROMIUM_ONE_VERSION_BACK: string;
        EDGE_CHROMIUM_TWO_VERSIONS_BACK: string;
    }>;
    namespace BrowserTypes {
        export { BrowserType };
    }
    type BrowserType = string;
}
declare module "lib/config/PropertyData" {
    export = PropertyData;
    /**
     * @typedef {{name: string, value: string}} PropertyDataObject
     */
    /**
     * A property to sent to the server
     */
    class PropertyData {
        /**
         * @signature `new PropertyData(location)`
         * @sigparam {PropertyData} location - The PropertyData instance to clone from.
         *
         * @signature `new PropertyData(object)`
         * @sigparam {{name: string, value: string}} object - The property object to clone from.
         *
         * @signature `new PropertyData(name, value)`
         * @sigparam {string} name - The property name.
         * @sigparam {string} value - The property value.
         *
         * @param {string|PropertyDataObject|PropertyData} varArg1
         * @param {string} [varArg2]
         */
        constructor(varArg1: string | PropertyDataObject | PropertyData, varArg2?: string, ...args: any[]);
        /** @type {string} */
        _name: string;
        /** @type {string} */
        _value: string;
        /**
         * @return {string}
         */
        getName(): string;
        /**
         * @param {string} value
         */
        setName(value: string): void;
        /**
         * @return {string}
         */
        getValue(): string;
        /**
         * @param {string} value
         */
        setValue(value: string): void;
        /**
         * @override
         */
        toJSON(): {
            name: string;
            value: string;
        };
        /**
         * @override
         */
        toString(): string;
    }
    namespace PropertyData {
        export { PropertyDataObject };
    }
    type PropertyDataObject = {
        name: string;
        value: string;
    };
}
declare module "lib/config/ProxySettings" {
    export = ProxySettings;
    /**
     * @typedef {{url: string, username: (string|undefined), password: (string|undefined)}} ProxySettingsObject
     */
    /**
     * Encapsulates settings for sending Eyes communication via proxy.
     */
    class ProxySettings {
        /**
         *
         * @param {string|boolean} uri - The proxy's URI or {@code false} to completely disable proxy.
         * @param {string} [username] - The username to be sent to the proxy.
         * @param {string} [password] - The password to be sent to the proxy.
         * @param {boolean} [isHttpOnly] - If the Proxy is an HTTP only and requires https over http tunneling.
         */
        constructor(uri: string | boolean, username?: string, password?: string, isHttpOnly?: boolean);
        _isDisabled: boolean;
        _uri: string | true;
        _username: string;
        _password: string;
        _isHttpOnly: boolean;
        _url: import("url").URL;
        getUri(): string | true;
        getUsername(): string;
        getPassword(): string;
        getIsHttpOnly(): boolean;
        getIsDisabled(): boolean;
        /**
         * @return {{protocol: string, host: string, port: number, auth: {username: string, password: string}, isHttpOnly: boolean}|boolean}
         */
        toProxyObject(): {
            protocol: string;
            host: string;
            port: number;
            auth: {
                username: string;
                password: string;
            };
            isHttpOnly: boolean;
        } | boolean;
    }
    namespace ProxySettings {
        export { ProxySettingsObject };
    }
    type ProxySettingsObject = {
        url: string;
        username: (string | undefined);
        password: (string | undefined);
    };
}
declare module "lib/config/StitchMode" {
    export = StitchModes;
    /**
     * @typedef {string} StitchMode
     */
    /**
     * Represents the types of available stitch modes.
     */
    const StitchModes: Readonly<{
        /** Standard JS scrolling. */
        SCROLL: string;
        /** CSS translation based stitching. */
        CSS: string;
    }>;
    namespace StitchModes {
        export { StitchMode };
    }
    type StitchMode = string;
}
declare module "lib/config/ScreenOrientation" {
    export = ScreenOrientations;
    /**
     * @typedef {string} ScreenOrientation
     */
    /**
     * Represents the types of available stitch modes.
     */
    const ScreenOrientations: Readonly<{
        PORTRAIT: string;
        LANDSCAPE: string;
    }>;
    namespace ScreenOrientations {
        export { ScreenOrientation };
    }
    type ScreenOrientation = string;
}
declare module "lib/config/MatchLevel" {
    export = MatchLevels;
    /**
     * @typedef {string} MatchLevel
     */
    /**
     * The extent in which two images match (or are expected to match).
     */
    const MatchLevels: Readonly<{
        /** Images do not necessarily match. */
        None: string;
        /** Images have the same layout (legacy algorithm). */
        LegacyLayout: string;
        /** Images have the same layout. */
        Layout: string;
        /** Images have the same layout. */
        Layout2: string;
        /** Images have the same content. */
        Content: string;
        /** Images are nearly identical. */
        Strict: string;
        /** Images are identical. */
        Exact: string;
    }>;
    namespace MatchLevels {
        export { MatchLevel };
    }
    type MatchLevel = string;
}
declare module "lib/config/ExactMatchSettings" {
    export = ExactMatchSettings;
    /**
     * Encapsulates match settings for the a session.
     */
    class ExactMatchSettings {
        /**
         * Encapsulate threshold settings for the "Exact" match level.
         * @param settings
         * @param {number} [settings.minDiffIntensity=0] - The minimum intensity difference of pixel to be considered a change. Valid
         *   values are 0-255.
         * @param {number} [settings.minDiffWidth=0] - The minimum width of an intensity filtered pixels cluster to be considered a
         *   change. Must be >= 0.
         * @param {number} [settings.minDiffHeight=0] - The minimum height of an intensity filtered pixels cluster to be considered a
         *   change. Must be >= 0.
         * @param {number} [settings.matchThreshold=0] - The maximum percentage(!) of different pixels (after intensity, width and
         *   height filtering) which is still considered as a match. Valid values are fractions between 0-1.
         */
        constructor({ minDiffIntensity, minDiffWidth, minDiffHeight, matchThreshold }?: {
            minDiffIntensity: any;
            minDiffWidth: any;
            minDiffHeight: any;
            matchThreshold: any;
        }, ...args: any[]);
        _minDiffIntensity: any;
        _minDiffWidth: any;
        _minDiffHeight: any;
        _matchThreshold: any;
        /**
         * @return {number} - The minimum intensity difference of pixel to be considered a change.
         */
        getMinDiffIntensity(): number;
        /**
         * @param {number} value - The minimum intensity difference of pixel to be considered a change. Valid values are 0-255.
         */
        setMinDiffIntensity(value: number): void;
        /**
         * @return {number} - The minimum width of an intensity filtered pixels cluster to be considered a change.
         */
        getMinDiffWidth(): number;
        /**
         * @param {number} value - The minimum width of an intensity filtered pixels cluster to be considered a change.
         *   Must be >= 0.
         */
        setMinDiffWidth(value: number): void;
        /**
         * @return {number} - The minimum width of an intensity filtered pixels cluster to be considered a change.
         */
        getMinDiffHeight(): number;
        /**
         * @param {number} value - The minimum height of an intensity filtered pixels cluster to be considered a change. Must
         *   be >= 0.
         */
        setMinDiffHeight(value: number): void;
        /**
         * @return {number} - The maximum percentage(!) of different pixels (after intensity, width and height filtering) which
         *   is still considered as a match.
         */
        getMatchThreshold(): number;
        /**
         * @param {number} value - The maximum percentage(!) of different pixels (after intensity, width and height filtering)
         *   which is still considered as a match. Valid values are fractions between 0-1.
         */
        setMatchThreshold(value: number): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/config/ImageMatchSettings" {
    export = ImageMatchSettings;
    /**
     * Encapsulates match settings for the a session.
     */
    class ImageMatchSettings {
        /**
         * @param {MatchLevel} [matchLevel=MatchLevel.Strict] The "strictness" level to use.
         * @param {ExactMatchSettings} [exact] - Additional threshold parameters when the {@code Exact} match level is used.
         * @param {boolean} [ignoreCaret]
         * @param {boolean} [useDom]
         * @param {boolean} [enablePatterns]
         * @param {boolean} [ignoreDisplacements]
         * @param {Region[]} [ignore]
         * @param {Region[]} [layout]
         * @param {Region[]} [strict]
         * @param {Region[]} [content]
         * @param {AccessibilityMatchSettings[]} [accessibility]
         * @param {FloatingMatchSettings[]} [floating]
         * @param {AccessibilitySettings} [accessibilitySettings]
         */
        constructor(imageMatchSettings: any, ...args: any[]);
        _matchLevel: any;
        _ignoreCaret: any;
        _useDom: any;
        _enablePatterns: any;
        _ignoreDisplacements: any;
        _exact: any;
        /** @type {Region[]} */
        _ignoreRegions: any[];
        /** @type {Region[]} */
        _layoutRegions: any[];
        /** @type {Region[]} */
        _strictRegions: any[];
        /** @type {Region[]} */
        _contentRegions: any[];
        /** @type {AccessibilityMatchSettings[]} */
        _accessibilityMatchSettings: any[];
        /** @type {FloatingMatchSettings[]} */
        _floatingMatchSettings: any[];
        /**
         * @return {MatchLevel} - The match level to use.
         */
        getMatchLevel(): any;
        /**
         * @param {MatchLevel} value - The match level to use.
         */
        setMatchLevel(value: any): void;
        /**
         * @return {AccessibilitySettings} - The accessibility settings to use.
         */
        getAccessibilitySettings(): any;
        /**
         * @param {AccessibilitySettings} value - The accessibility settings to use.
         */
        setAccessibilitySettings(value: any): void;
        _accessibilitySettings: any;
        /**
         * @return {ExactMatchSettings} - The additional threshold params when the {@code Exact} match level is used, if any.
         */
        getExact(): import("lib/config/ExactMatchSettings");
        /**
         * @param {ExactMatchSettings} value - The additional threshold parameters when the {@code Exact} match level is used.
         */
        setExact(value: import("lib/config/ExactMatchSettings")): void;
        /**
         * @return {boolean} - The parameters for the "IgnoreCaret" match settings.
         */
        getIgnoreCaret(): boolean;
        /**
         * @param {boolean} value - The parameters for the "ignoreCaret" match settings.
         */
        setIgnoreCaret(value: boolean): void;
        /**
         * @return {boolean}
         */
        getUseDom(): boolean;
        /**
         * @param {boolean} value
         */
        setUseDom(value: boolean): void;
        /**
         * @return {boolean}
         */
        getEnablePatterns(): boolean;
        /**
         * @param {boolean} value
         */
        setEnablePatterns(value: boolean): void;
        /**
         * @return {boolean}
         */
        getIgnoreDisplacements(): boolean;
        /**
         * @param {boolean} value
         */
        setIgnoreDisplacements(value: boolean): void;
        /**
         * Returns the array of regions to ignore.
         * @return {Region[]} - the array of regions to ignore.
         */
        getIgnoreRegions(): any[];
        /**
         * Sets an array of regions to ignore.
         * @param {Region[]} ignoreRegions - The array of regions to ignore.
         */
        setIgnoreRegions(ignoreRegions: any[]): void;
        /**
         * Sets an array of regions to check using the Layout method.
         * @param {Region[]} layoutRegions - The array of regions to ignore.
         */
        setLayoutRegions(layoutRegions: any[]): void;
        /**
         * Returns the array of regions to check using the Layout method.
         * @return {Region[]} - the array of regions to ignore.
         */
        getLayoutRegions(): any[];
        /**
         * Returns the array of regions to check using the Strict method.
         * @return {Region[]} - the array of regions to ignore.
         */
        getStrictRegions(): any[];
        /**
         * Sets an array of regions to check using the Strict method.
         * @param {Region[]} strictRegions - The array of regions to ignore.
         */
        setStrictRegions(strictRegions: any[]): void;
        /**
         * Returns the array of regions to check using the Content method.
         * @return {Region[]} - the array of regions to ignore.
         */
        getContentRegions(): any[];
        /**
         * Sets an array of regions to check using the Content method.
         * @param {Region[]} contentRegions - The array of regions to ignore.
         */
        setContentRegions(contentRegions: any[]): void;
        /**
         * Returns an array of floating regions.
         * @return {FloatingMatchSettings[]} - an array of floating regions.
         */
        getFloatingRegions(): any[];
        /**
         * Sets an array of accessibility regions.
         * @param {AccessibilityMatchSettings[]} accessibilityMatchSettings - The array of accessibility regions.
         */
        setAccessibilityRegions(accessibilityMatchSettings: any[]): void;
        /**
         * Returns an array of accessibility regions.
         * @return {AccessibilityMatchSettings[]} - an array of accessibility regions.
         */
        getAccessibilityRegions(): any[];
        /**
         * Sets an array of floating regions.
         * @param {FloatingMatchSettings[]} floatingMatchSettings - The array of floating regions.
         */
        setFloatingRegions(floatingMatchSettings: any[]): void;
        /**
         * @override
         */
        toJSON(): any;
        _toPlain(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/config/Configuration" {
    export = Configuration;
    class Configuration {
        /**
         * @param {Configuration|object} [configuration]
         */
        constructor(configuration?: Configuration | object);
        /**
         * @private
         * @type {boolean}
         */
        private _showLogs;
        /** @type {boolean} */
        _saveDebugData: boolean;
        /** @type {string} */
        _appName: string;
        /** @type {string} */
        _testName: string;
        /** @type {string} */
        _displayName: string;
        /** @type {boolean} */
        _isDisabled: boolean;
        /** @type {number} */
        _matchTimeout: number;
        /** @type {SessionType} */
        _sessionType: any;
        /** @type {RectangleSize} */
        _viewportSize: import("lib/geometry/RectangleSize");
        /** @type {string} */
        _agentId: string;
        /** @type {string} */
        _apiKey: string;
        /** @type {string} */
        _serverUrl: string;
        /** @type {ProxySettings} */
        _proxySettings: import("lib/config/ProxySettings");
        /** @type {number} */
        _connectionTimeout: number;
        /** @type {boolean} */
        _removeSession: boolean;
        /** @type {BatchInfo} */
        _batch: import("lib/config/BatchInfo");
        /** @type {PropertyData[]} */
        _properties: import("lib/config/PropertyData")[];
        /** @type {string} */
        _baselineEnvName: string;
        /** @type {string} */
        _environmentName: string;
        /** @type {string} */
        _branchName: string;
        /** @type {string} */
        _parentBranchName: string;
        /** @type {string} */
        _baselineBranchName: string;
        /** @type {boolean} */
        _compareWithParentBranch: boolean;
        /** @type {boolean} */
        _saveFailedTests: boolean;
        /** @type {boolean} */
        _saveNewTests: boolean;
        /** @type {boolean} */
        _ignoreBaseline: boolean;
        /** @type {boolean} */
        _saveDiffs: boolean;
        /** @type {boolean} */
        _sendDom: boolean;
        /** @type {string} */
        _hostApp: string;
        /** @type {string} */
        _hostOS: string;
        /** @type {string} */
        _hostAppInfo: string;
        /** @type {string} */
        _hostOSInfo: string;
        /** @type {string} */
        _deviceInfo: string;
        /** @type {ImageMatchSettings} */
        _defaultMatchSettings: import("lib/config/ImageMatchSettings");
        /** @type {boolean} */
        _forceFullPageScreenshot: boolean;
        /** @type {number} */
        _waitBeforeScreenshots: number;
        /** @type {StitchMode} */
        _stitchMode: any;
        /** @type {boolean} */
        _hideScrollbars: boolean;
        /** @type {boolean} */
        _hideCaret: boolean;
        /** @type {number} */
        _stitchOverlap: number;
        /** @type {number} */
        _concurrentSessions: number;
        /** @type {boolean} */
        _isThrowExceptionOn: boolean;
        /** @type {RenderInfo[]} */
        _browsersInfo: RenderInfo[];
        /** @type {boolean} */
        _dontCloseBatches: boolean;
        /**
         * @return {boolean}
         */
        getShowLogs(): boolean;
        /**
         * @param {boolean} value
         * @return {this}
         */
        setShowLogs(value: boolean): this;
        /**
         * @return {boolean}
         */
        getSaveDebugData(): boolean;
        /**
         * @param {boolean} value
         * @return {this}
         */
        setSaveDebugData(value: boolean): this;
        /**
         * @return {string} - The currently set API key or {@code null} if no key is set.
         */
        getApiKey(): string;
        /**
         * Sets the API key of your applitools Eyes account.
         *
         * @param {string} value - The api key to be used.
         * @return {this}
         */
        setApiKey(value: string): this;
        /**
         * @return {string} - The URI of the eyes server.
         */
        getServerUrl(): string;
        /**
         * Sets the current server URL used by the rest client.
         *
         * @param {string} value - The URI of the rest server, or {@code null} to use the default server.
         * @return {this}
         */
        setServerUrl(value: string): this;
        /**
         * @return {ProxySettings} - The current proxy settings, or {@code undefined} if no proxy is set.
         */
        getProxy(): import("lib/config/ProxySettings");
        /**
         * Sets the proxy settings to be used by the rest client.
         *
         * @param {ProxySettings|ProxySettingsObject|string|boolean} value - The ProxySettings object or proxy url to be used.
         *   Use {@code false} to disable proxy (even if it set via env variables). Use {@code null} to reset proxy settings.
         * @return {this}
         */
        setProxy(value: import("lib/config/ProxySettings") | any | string | boolean): this;
        /**
         * @return {number} - The timeout for web requests (in milliseconds).
         */
        getConnectionTimeout(): number;
        /**
         * Sets the connect and read timeouts for web requests.
         *
         * @param {number} value - Connect/Read timeout in milliseconds. 0 equals infinity.
         * @return {this}
         */
        setConnectionTimeout(value: number): this;
        /**
         * @return {boolean} - Whether sessions are removed immediately after they are finished.
         */
        getRemoveSession(): boolean;
        /**
         * Whether sessions are removed immediately after they are finished.
         *
         * @param {boolean} value
         * @return {this}
         */
        setRemoveSession(value: boolean): this;
        /**
         * @return {boolean} - The currently compareWithParentBranch value
         */
        getCompareWithParentBranch(): boolean;
        /**
         * @param {boolean} value - New compareWithParentBranch value, default is false
         * @return {this}
         */
        setCompareWithParentBranch(value: boolean): this;
        /**
         * @return {boolean} - The currently ignoreBaseline value
         */
        getIgnoreBaseline(): boolean;
        /**
         * @param {boolean} value - New ignoreBaseline value, default is false
         * @return {this}
         */
        setIgnoreBaseline(value: boolean): this;
        /**
         * @return {boolean} - True if new tests are saved by default.
         */
        getSaveNewTests(): boolean;
        /**
         * Used for automatic save of a test run. New tests are automatically saved by default.
         *
         * @param {boolean} value - True if new tests should be saved by default. False otherwise.
         * @return {this}
         */
        setSaveNewTests(value: boolean): this;
        /**
         * @return {boolean} - True if failed tests are saved by default.
         */
        getSaveFailedTests(): boolean;
        /**
         * Set whether or not failed tests are saved by default.
         *
         * @param {boolean} value - True if failed tests should be saved by default, false otherwise.
         * @return {this}
         */
        setSaveFailedTests(value: boolean): this;
        /**
         * @return {number} - The maximum time in ms {@link #checkWindowBase(RegionProvider, string, boolean, number)} waits
         *   for a match.
         */
        getMatchTimeout(): number;
        /**
         * Sets the maximum time (in ms) a match operation tries to perform a match.
         * @param {number} value - Total number of ms to wait for a match.
         * @return {this}
         */
        setMatchTimeout(value: number): this;
        /**
         * @return {boolean} - Whether eyes is disabled.
         */
        getIsDisabled(): boolean;
        /**
         * @param {boolean} value - If true, all interactions with this API will be silently ignored.
         * @return {this}
         */
        setIsDisabled(value: boolean): this;
        /**
         * @return {BatchInfo}
         */
        getBatch(): import("lib/config/BatchInfo");
        /**
         * Sets the batch in which context future tests will run or {@code null} if tests are to run standalone.
         *
         * @param {BatchInfo|BatchInfoObject} value
         * @return {this}
         */
        setBatch(value: import("lib/config/BatchInfo") | any): this;
        /**
         * @return {PropertyData[]}
         */
        getProperties(): import("lib/config/PropertyData")[];
        /**
         * @signature `setProperties(properties)`
         * @sigparam {PropertyData[]} properties - A list of PropertyData instances
         *
         * @signature `setProperties(propertiesObj)`
         * @sigparam {PropertyDataObject[]} propertiesObj - A list of property data objects
         *
         * @param {PropertyData[]|PropertyDataObject[]} value
         * @return {this}
         */
        setProperties(value: import("lib/config/PropertyData")[] | any[]): this;
        /**
         * Adds a property to be sent to the server.
         *
         * @signature `addProperty(property)`
         * @sigparam {PropertyData|PropertyDataObject} property - The name and value are taken from the object passed
         *
         * @signature`addProperty(propertyName, propertyValue)`
         * @sigparam {string} propertyName - The name of the property
         * @sigparam {string} propertyValue - The value of the property
         *
         * @param {PropertyData|string} propertyOrName - The property name or PropertyData object.
         * @param {string} [propertyValue] - The property value.
         * @return {this}
         */
        addProperty(propertyOrName: import("lib/config/PropertyData") | string, propertyValue?: string): this;
        /**
         * @return {string}
         */
        getBranchName(): string;
        /**
         * @param {string} value
         * @return {this}
         */
        setBranchName(value: string): this;
        /**
         * @return {string}
         */
        getAgentId(): string;
        /**
         * @param {string} value
         * @return {this}
         */
        setAgentId(value: string): this;
        /**
         * @return {string}
         */
        getParentBranchName(): string;
        /**
         * @param {string} value
         * @return {this}
         */
        setParentBranchName(value: string): this;
        /**
         * @return {string}
         */
        getBaselineBranchName(): string;
        /**
         * @param {string} value
         * @return {this}
         */
        setBaselineBranchName(value: string): this;
        /**
         * @return {string}
         */
        getBaselineEnvName(): string;
        /**
         * @param {string} value
         * @return {this}
         */
        setBaselineEnvName(value: string): this;
        /**
         * @return {string}
         */
        getEnvironmentName(): string;
        /**
         * @param {string} value
         * @return {this}
         */
        setEnvironmentName(value: string): this;
        /**
         * @return {boolean}
         */
        getSaveDiffs(): boolean;
        /**
         * @param {boolean} value
         * @return {this}
         */
        setSaveDiffs(value: boolean): this;
        /**
         * @return {boolean}
         */
        getSendDom(): boolean;
        /**
         * @param {boolean} value
         * @return {this}
         */
        setSendDom(value: boolean): this;
        /**
         * @return {string} - The host OS as set by the user.
         */
        getHostApp(): string;
        /**
         * Sets the host application - overrides the one in the agent string.
         *
         * @param {string} value - The application running the AUT (e.g., Chrome).
         */
        setHostApp(value: string): this;
        /**
         * @return {string} - The host OS as set by the user.
         */
        getHostOS(): string;
        /**
         * Sets the host OS name - overrides the one in the agent string.
         *
         * @param {string} value - The host OS running the AUT.
         */
        setHostOS(value: string): this;
        /**
         * @return {string} - The host OS as set by the user.
         */
        getHostAppInfo(): string;
        /**
         * Sets the host application - overrides the one in the agent string.
         *
         * @param {string} value - The application running the AUT (e.g., Chrome).
         */
        setHostAppInfo(value: string): this;
        /**
         * @return {string} - The host OS as set by the user.
         */
        getHostOSInfo(): string;
        /**
         * Sets the host OS name - overrides the one in the agent string.
         *
         * @param {string} value - The host OS running the AUT.
         */
        setHostOSInfo(value: string): this;
        /**
         * @return {string} - The application name running the AUT.
         */
        getDeviceInfo(): string;
        /**
         * Sets the host application - overrides the one in the agent string.
         *
         * @param {string} value - The application running the AUT (e.g., Chrome).
         * @return {this}
         */
        setDeviceInfo(value: string): this;
        /**
         * @return {string}
         */
        getAppName(): string;
        /**
         * The default app name if no current name was provided. If this is {@code null} then there is no default appName.
         *
         * @param {string} value
         * @return {this}
         */
        setAppName(value: string): this;
        /**
         * @return {string}
         */
        getTestName(): string;
        /**
         * @param {string} value
         * @return {this}
         */
        setTestName(value: string): this;
        /**
         * @return {string} - The display name of the currently running test.
         */
        getDisplayName(): string;
        /**
         * @param {string} value - The display name of the currently running test.
         * @return {this}
         */
        setDisplayName(value: string): this;
        /**
         * @return {RectangleSize}
         */
        getViewportSize(): import("lib/geometry/RectangleSize");
        /**
         * @param {RectangleSize|RectangleSizeObject} value
         * @return {this}
         */
        setViewportSize(value: import("lib/geometry/RectangleSize") | any): this;
        /**
         * @return {SessionType}
         */
        getSessionType(): any;
        /**
         * @param {SessionType} value
         * @return {this}
         */
        setSessionType(value: any): this;
        /**
         * @return {ImageMatchSettings} - The match settings used for the session.
         */
        getDefaultMatchSettings(): import("lib/config/ImageMatchSettings");
        /**
         * Updates the match settings to be used for the session.
         *
         * @param {ImageMatchSettings|object} value - The match settings to be used for the session.
         * @return {this}
         */
        setDefaultMatchSettings(value: import("lib/config/ImageMatchSettings") | object): this;
        /**
         * @return {MatchLevel} - The test-wide match level.
         */
        getMatchLevel(): any;
        /**
         * The test-wide match level to use when checking application screenshot with the expected output.
         *
         * @param {MatchLevel} value - The test-wide match level to use when checking application screenshot with the
         *   expected output.
         * @return {this}
         */
        setMatchLevel(value: any): this;
        /**
         * @return {AccessibilitySettings} - The test-wide accessibility settings.
         */
        getAccessibilityValidation(): AccessibilitySettings;
        /**
         * The test-wide accessibility settings to use when checking application screenshot.
         *
         * @param {AccessibilitySettings} value - The test-wide accessibility settings to use when checking application screenshot.
         * @return {this}
         */
        setAccessibilityValidation(value: AccessibilitySettings): this;
        /**
         * @return {boolean} - The test-wide useDom to use in match requests.
         */
        getUseDom(): boolean;
        /**
         * The test-wide useDom to use.
         *
         * @param {boolean} value - The test-wide useDom to use in match requests.
         * @return {this}
         */
        setUseDom(value: boolean): this;
        /**
         * @return {boolean} - The test-wide enablePatterns to use in match requests.
         */
        getEnablePatterns(): boolean;
        /**
         * The test-wide enablePatterns to use.
         *
         * @param {boolean} value - The test-wide enablePatterns to use in match requests.
         * @return {this}
         */
        setEnablePatterns(value: boolean): this;
        /**
         * @return {boolean} - The test-wide ignoreDisplacements to use in match requests.
         */
        getIgnoreDisplacements(): boolean;
        /**
         * The test-wide ignoreDisplacements to use.
         *
         * @param {boolean} value - The test-wide ignoreDisplacements to use in match requests.
         * @return {this}
         */
        setIgnoreDisplacements(value: boolean): this;
        /**
         * @return {boolean} - Whether to ignore or the blinking caret or not when comparing images.
         */
        getIgnoreCaret(): boolean;
        /**
         * Sets the ignore blinking caret value.
         *
         * @param {boolean} value - The ignore value.
         * @return {this}
         */
        setIgnoreCaret(value: boolean): this;
        /**
         * @return {boolean} - Whether Eyes should force a full page screenshot.
         */
        getForceFullPageScreenshot(): boolean;
        /**
         * Forces a full page screenshot (by scrolling and stitching) if the browser only supports viewport screenshots).
         *
         * @param {boolean} value - Whether to force a full page screenshot or not.
         * @return {this}
         */
        setForceFullPageScreenshot(value: boolean): this;
        /**
         * @return {number} - The time to wait just before taking a screenshot.
         */
        getWaitBeforeScreenshots(): number;
        /**
         * Sets the time to wait just before taking a screenshot (e.g., to allow positioning to stabilize when performing a
         * full page stitching).
         *
         * @param {number} value - The time to wait (Milliseconds). Values smaller or equal to 0, will cause the
         *   default value to be used.
         * @return {this}
         */
        setWaitBeforeScreenshots(value: number): this;
        /**
         * @return {StitchMode} - The current stitch mode settings.
         */
        getStitchMode(): any;
        /**
         * Set the type of stitching used for full page screenshots. When the page includes fixed position header/sidebar,
         * use {@link StitchMode#CSS}. Default is {@link StitchMode#SCROLL}.
         *
         * @param {StitchMode} value - The stitch mode to set.
         * @return {this}
         */
        setStitchMode(value: any): this;
        /**
         * @return {boolean} - Whether or not scrollbars are hidden when taking screenshots.
         */
        getHideScrollbars(): boolean;
        /**
         * Hide the scrollbars when taking screenshots.
         *
         * @param {boolean} value - Whether to hide the scrollbars or not.
         * @return {this}
         */
        setHideScrollbars(value: boolean): this;
        /**
         * @return {boolean}
         */
        getHideCaret(): boolean;
        /**
         * @param {boolean} value
         * @return {this}
         */
        setHideCaret(value: boolean): this;
        /**
         * @return {number} - Returns the stitching overlap in pixels.
         */
        getStitchOverlap(): number;
        /**
         * Sets the stitch overlap in pixels.
         *
         * @param {number} value - The width (in pixels) of the overlap.
         * @return {this}
         */
        setStitchOverlap(value: number): this;
        /**
         * @return {boolean}
         */
        getDontCloseBatches(): boolean;
        /**
         * @param {boolean} value
         * @return {this}
         */
        setDontCloseBatches(value: boolean): this;
        /**
         * @return {number}
         */
        getConcurrentSessions(): number;
        /**
         * @param {number} value
         * @return {this}
         */
        setConcurrentSessions(value: number): this;
        /**
         * @return {boolean}
         */
        getIsThrowExceptionOn(): boolean;
        /**
         * @param {boolean} value
         * @return {this}
         */
        setIsThrowExceptionOn(value: boolean): this;
        /**
         * @return {RenderInfo[]|undefined}
         */
        getBrowsersInfo(): RenderInfo[] | undefined;
        /**
         * @param {RenderInfo[]} value
         * @return {this}
         */
        setBrowsersInfo(value: RenderInfo[]): this;
        /**
         * @param {...RenderInfo} browsersInfo
         * @return {this}
         */
        addBrowsers(...browsersInfo: RenderInfo[]): this;
        /**
         * @param {number|RenderInfo} widthOrBrowserInfo
         * @param {number} [height]
         * @param {BrowserType} [browserType]
         * @return {this}
         */
        addBrowser(widthOrBrowserInfo: number | RenderInfo, height?: number, browserType?: any, ...args: any[]): this;
        /**
         * @param {DeviceName} deviceName
         * @param {ScreenOrientation} [screenOrientation=ScreenOrientation.PORTRAIT]
         * @return {this}
         */
        addDeviceEmulation(deviceName: any, screenOrientation?: ScreenOrientation): this;
        /**
         * @param {Configuration|object} other
         */
        mergeConfig(other: Configuration | object): void;
        /**
         * @return {object}
         */
        toOpenEyesConfiguration(): object;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @return {Configuration}
         */
        cloneConfig(): Configuration;
    }
    namespace Configuration {
        export { AccessibilityLevel, AccessibilityGuidelinesVersion, AccessibilitySettings, DesktopBrowserInfo, EmulationInfo, ChromeEmulationInfo, IosDeviceInfo, RenderInfo };
    }
    type RenderInfo = {
        width: number;
        height: number;
        name: (any | undefined);
    } | {
        deviceName: any;
        screenOrientation: (ScreenOrientation | undefined);
    } | {
        chromeEmulationInfo: EmulationInfo;
    } | {
        iosDeviceInfo: {
            deviceName: any;
            screenOrientation: (any | undefined);
        };
    };
    type AccessibilitySettings = {
        level: AccessibilityLevel;
        guidelinesVersion: AccessibilityGuidelinesVersion;
    };
    const ScreenOrientation: Readonly<{
        PORTRAIT: string;
        LANDSCAPE: string;
    }>;
    type AccessibilityLevel = string;
    type AccessibilityGuidelinesVersion = string;
    type DesktopBrowserInfo = {
        width: number;
        height: number;
        name: (any | undefined);
    };
    type EmulationInfo = {
        deviceName: any;
        screenOrientation: (ScreenOrientation | undefined);
    };
    type ChromeEmulationInfo = {
        chromeEmulationInfo: EmulationInfo;
    };
    type IosDeviceInfo = {
        iosDeviceInfo: {
            deviceName: any;
            screenOrientation: (any | undefined);
        };
    };
}
declare module "lib/config/DeviceName" {
    export = DeviceNames;
    /**
     * @typedef {string} DeviceName
     */
    const DeviceNames: Readonly<{
        Blackberry_PlayBook: string;
        BlackBerry_Z30: string;
        Galaxy_A5: string;
        Galaxy_Note_10: string;
        Galaxy_Note_10_Plus: string;
        Galaxy_Note_2: string;
        Galaxy_Note_3: string;
        Galaxy_Note_4: string;
        Galaxy_Note_8: string;
        Galaxy_Note_9: string;
        Galaxy_S10: string;
        Galaxy_S10_Plus: string;
        Galaxy_S3: string;
        Galaxy_S5: string;
        Galaxy_S8: string;
        Galaxy_S8_Plus: string;
        Galaxy_S9: string;
        Galaxy_S9_Plus: string;
        iPad: string;
        iPad_6th_Gen: string;
        iPad_7th_Gen: string;
        iPad_Air_2: string;
        iPad_Mini: string;
        iPad_Pro: string;
        iPhone_11: string;
        iPhone_11_Pro: string;
        iPhone_11_Pro_Max: string;
        iPhone_4: string;
        iPhone_5SE: string;
        iPhone_6_7_8: string;
        iPhone_6_7_8_Plus: string;
        iPhone_X: string;
        iPhone_XR: string;
        iPhone_XS: string;
        iPhone_XS_Max: string;
        Kindle_Fire_HDX: string;
        Laptop_with_HiDPI_screen: string;
        Laptop_with_MDPI_screen: string;
        Laptop_with_touch: string;
        LG_G6: string;
        LG_Optimus_L70: string;
        Microsoft_Lumia_550: string;
        Microsoft_Lumia_950: string;
        Nexus_10: string;
        Nexus_4: string;
        Nexus_5: string;
        Nexus_5X: string;
        Nexus_6: string;
        Nexus_6P: string;
        Nexus_7: string;
        Nokia_Lumia_520: string;
        Nokia_N9: string;
        OnePlus_7T: string;
        OnePlus_7T_Pro: string;
        Pixel_2: string;
        Pixel_2_XL: string;
        Pixel_3: string;
        Pixel_3_XL: string;
        Pixel_4: string;
        Pixel_4_XL: string;
    }>;
    namespace DeviceNames {
        export { DeviceName };
    }
    type DeviceName = string;
}
declare module "lib/config/FloatingMatchSettings" {
    export = FloatingMatchSettings;
    /**
     * Encapsulates floating match settings for the a session.
     */
    class FloatingMatchSettings {
        /**
         * @param settings
         * @param {number} settings.left
         * @param {number} settings.top
         * @param {number} settings.width
         * @param {number} settings.height
         * @param {number} settings.maxUpOffset
         * @param {number} settings.maxDownOffset
         * @param {number} settings.maxLeftOffset
         * @param {number} settings.maxRightOffset
         */
        constructor({ left, top, width, height, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset, }?: {
            left: any;
            top: any;
            width: any;
            height: any;
            maxUpOffset: any;
            maxDownOffset: any;
            maxLeftOffset: any;
            maxRightOffset: any;
        }, ...args: any[]);
        _left: any;
        _top: any;
        _width: any;
        _height: any;
        _maxUpOffset: any;
        _maxDownOffset: any;
        _maxLeftOffset: any;
        _maxRightOffset: any;
        /**
         * @return {number}
         */
        getLeft(): number;
        /**
         * @param {number} value
         */
        setLeft(value: number): void;
        /**
         * @return {number}
         */
        getTop(): number;
        /**
         * @param {number} value
         */
        setTop(value: number): void;
        /**
         * @return {number}
         */
        getWidth(): number;
        /**
         * @param {number} value
         */
        setWidth(value: number): void;
        /**
         * @return {number}
         */
        getHeight(): number;
        /**
         * @param {number} value
         */
        setHeight(value: number): void;
        /**
         * @return {number}
         */
        getMaxUpOffset(): number;
        /**
         * @param {number} value
         */
        setMaxUpOffset(value: number): void;
        /**
         * @return {number}
         */
        getMaxDownOffset(): number;
        /**
         * @param {number} value
         */
        setMaxDownOffset(value: number): void;
        /**
         * @return {number}
         */
        getMaxLeftOffset(): number;
        /**
         * @param {number} value
         */
        setMaxLeftOffset(value: number): void;
        /**
         * @return {number}
         */
        getMaxRightOffset(): number;
        /**
         * @param {number} value
         */
        setMaxRightOffset(value: number): void;
        /**
         * @return {Region}
         */
        getRegion(): import("lib/geometry/Region");
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/config/SessionType" {
    export = SessionTypes;
    /**
     * @typedef {string} SessionType
     */
    /**
     * Represents the types of available stitch modes.
     */
    const SessionTypes: Readonly<{
        /** Default type of sessions. */
        SEQUENTIAL: string;
        /** A timing test session */
        PROGRESSION: string;
    }>;
    namespace SessionTypes {
        export { SessionType };
    }
    type SessionType = string;
}
declare module "lib/config/IosDeviceName" {
    export = IosDeviceNames;
    /**
     * @typedef {string} IosDeviceName
     */
    const IosDeviceNames: Readonly<{
        iPhone_11_Pro: string;
        iPhone_11_Pro_Max: string;
        iPhone_11: string;
        iPhone_XR: string;
        iPhone_XS: string;
        iPhone_X: string;
        iPhone_8: string;
        iPhone_7: string;
        iPad_Pro_3: string;
        iPad_7: string;
        iPad_Air_2: string;
    }>;
    namespace IosDeviceNames {
        export { IosDeviceName };
    }
    type IosDeviceName = string;
}
declare module "lib/config/IosScreenOrientation" {
    export = IosScreenOrientations;
    /**
     * @typedef {string} IosScreenOrientation
     */
    const IosScreenOrientations: Readonly<{
        PORTRAIT: string;
        LANDSCAPE_LEFT: string;
        LANDSCAPE_RIGHT: string;
    }>;
    namespace IosScreenOrientations {
        export { IosScreenOrientation };
    }
    type IosScreenOrientation = string;
}
declare module "lib/config/IosVersion" {
    export = IosVersions;
    /**
     * @typedef {string} IosVersion
     */
    /**
     * iOS version for visual-grid rendering
     */
    const IosVersions: Readonly<{
        Latest: string;
    }>;
    namespace IosVersions {
        export { IosVersion };
    }
    type IosVersion = string;
}
declare module "lib/debug/DebugScreenshotsProvider" {
    export = DebugScreenshotsProvider;
    /**
     * Interface for saving debug screenshots!
     * @abstract
     */
    class DebugScreenshotsProvider {
        _prefix: string;
        _path: string;
        /**
         * @return {string}
         */
        getPrefix(): string;
        /**
         * @param {string} value
         */
        setPrefix(value: string): void;
        /**
         * @return {string}
         */
        getPath(): string;
        /**
         * @param {string} value
         */
        setPath(value: string): void;
        /**
         * @abstract
         * @param {MutableImage} image
         * @param {string} suffix
         * @return {Promise}
         */
        save(_image: any, _suffix: any): Promise<any>;
    }
}
declare module "lib/utils/FileUtils" {
    /**
     * @param {Buffer} imageBuffer
     * @param {string} filename
     * @return {Promise}
     */
    export function writeFromBuffer(imageBuffer: Buffer, filename: string): Promise<any>;
    /**
     * @param {string} path
     * @return {Promise<Buffer>}
     */
    export function readToBuffer(path: string): Promise<Buffer>;
}
declare module "lib/debug/FileDebugScreenshotsProvider" {
    export = FileDebugScreenshotsProvider;
    const FileDebugScreenshotsProvider_base: typeof import("lib/debug/DebugScreenshotsProvider");
    /**
     * A debug screenshot provider for saving screenshots to file.
     */
    class FileDebugScreenshotsProvider extends FileDebugScreenshotsProvider_base {
    }
}
declare module "lib/debug/NullDebugScreenshotProvider" {
    export = NullDebugScreenshotProvider;
    const NullDebugScreenshotProvider_base: typeof import("lib/debug/DebugScreenshotsProvider");
    /**
     * TODO: rename to NullDebugScreenshotsProvider, should be renamed in other SDKs as well (come from Java)
     * A mock debug screenshot provider.
     */
    class NullDebugScreenshotProvider extends NullDebugScreenshotProvider_base {
    }
}
declare module "lib/errors/EyesError" {
    export = EyesError;
    /**
     * The base Applitools Eyes error type.
     */
    class EyesError extends Error {
        /**
         * @param {string} [message] - The error description string
         * @param {Error} [error] - Another error to inherit from
         */
        constructor(message?: string, error?: Error);
    }
}
declare module "lib/errors/CoordinatesTypeConversionError" {
    export = CoordinatesTypeConversionError;
    const CoordinatesTypeConversionError_base: typeof import("lib/errors/EyesError");
    /**
     * Encapsulates an error converting between two coordinate types.
     */
    class CoordinatesTypeConversionError extends CoordinatesTypeConversionError_base {
        /**
         * Represents an error trying to convert between two coordinate types.
         *
         * @param {CoordinatesType|string} fromOrMsg - The source coordinates type or message.
         * @param {CoordinatesType} [to] - The target coordinates type.
         */
        constructor(fromOrMsg: any | string, to?: any, ...args: any[]);
    }
}
declare module "lib/server/SessionStartInfo" {
    export = SessionStartInfo;
    /**
     * Encapsulates data required to start session using the Session API.
     */
    class SessionStartInfo {
        /**
         * @param {object} info
         * @param {string} info.agentId
         * @param {SessionType} [info.sessionType]
         * @param {string} info.appIdOrName
         * @param {string} [info.verId]
         * @param {string} info.scenarioIdOrName
         * @param {string} [info.displayName]
         * @param {BatchInfo} info.batchInfo
         * @param {string} [info.baselineEnvName]
         * @param {string} [info.environmentName]
         * @param {AppEnvironment} info.environment
         * @param {ImageMatchSettings} info.defaultMatchSettings
         * @param {string} [info.branchName]
         * @param {string} [info.parentBranchName]
         * @param {string} [info.parentBranchBaselineSavedBefore]
         * @param {string} [info.baselineBranchName]
         * @param {boolean} [info.compareWithParentBranch]
         * @param {boolean} [info.ignoreBaseline]
         * @param {boolean} [info.saveDiffs]
         * @param {boolean} [info.render]
         * @param {PropertyData[]} [info.properties]
         */
        constructor({ agentId, sessionType, appIdOrName, verId, scenarioIdOrName, displayName, batchInfo, baselineEnvName, environmentName, environment, defaultMatchSettings, branchName, parentBranchName, parentBranchBaselineSavedBefore, baselineBranchName, compareWithParentBranch, ignoreBaseline, saveDiffs, render, properties, }?: {
            agentId: string;
            sessionType: any;
            appIdOrName: string;
            verId: string;
            scenarioIdOrName: string;
            displayName: string;
            batchInfo: any;
            baselineEnvName: string;
            environmentName: string;
            environment: any;
            defaultMatchSettings: any;
            branchName: string;
            parentBranchName: string;
            parentBranchBaselineSavedBefore: string;
            baselineBranchName: string;
            compareWithParentBranch: boolean;
            ignoreBaseline: boolean;
            saveDiffs: boolean;
            render: boolean;
            properties: any[];
        });
        _agentId: string;
        _sessionType: any;
        _appIdOrName: string;
        _verId: string;
        _scenarioIdOrName: string;
        _displayName: string;
        _batchInfo: any;
        _baselineEnvName: string;
        _environmentName: string;
        _environment: any;
        _defaultMatchSettings: any;
        _branchName: string;
        _parentBranchName: string;
        _parentBranchBaselineSavedBefore: string;
        _baselineBranchName: string;
        _compareWithParentBranch: boolean;
        _ignoreBaseline: boolean;
        _saveDiffs: boolean;
        _render: boolean;
        _properties: any[];
        /**
         * @return {string}
         */
        getAgentId(): string;
        /**
         * @return {SessionType}
         */
        getSessionType(): any;
        /**
         * @return {string}
         */
        getAppIdOrName(): string;
        /**
         * @return {string}
         */
        getVerId(): string;
        /**
         * @return {string}
         */
        getScenarioIdOrName(): string;
        /**
         * @return {string}
         */
        getDisplayName(): string;
        /**
         * @return {BatchInfo}
         */
        getBatchInfo(): any;
        /**
         * @return {string}
         */
        getBaselineEnvName(): string;
        /**
         * @return {string}
         */
        getEnvironmentName(): string;
        /**
         * @return {AppEnvironment}
         */
        getEnvironment(): any;
        /**
         * @return {ImageMatchSettings}
         */
        getDefaultMatchSettings(): any;
        /**
         * @return {string}
         */
        getBranchName(): string;
        /**
         * @return {string}
         */
        getParentBranchName(): string;
        /**
         * @return {string}
         */
        getParentBranchBaselineSavedBefore(): string;
        /**
         * @return {string}
         */
        getBaselineBranchName(): string;
        /**
         * @return {boolean}
         */
        getCompareWithParentBranch(): boolean;
        /**
         * @return {boolean}
         */
        getIgnoreBaseline(): boolean;
        /**
         * @return {PropertyData[]}
         */
        getProperties(): any[];
        /**
         * @return {boolean}
         */
        getRender(): boolean;
        /**
         * @return {boolean}
         */
        getSaveDiffs(): boolean;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/errors/TestFailedError" {
    export = TestFailedError;
    const TestFailedError_base: typeof import("lib/errors/EyesError");
    /**
     * Indicates that a test did not pass (i.e., test either failed or is a new test).
     */
    class TestFailedError extends TestFailedError_base {
        /**
         * Creates a new TestFailedError instance.
         *
         * @param {TestResults} [testResults] - The results of the current test if available, {@code null} otherwise.
         * @param {string|SessionStartInfo} [messageOrSession] - The error description or SessionStartInfo with test details.
         */
        constructor(testResults?: any, messageOrSession?: string | import("lib/server/SessionStartInfo"));
        _testResults: any;
        /**
         * @return {TestResults} - The failed test results, or {@code null} if the test has not yet ended (e.g., when thrown
         *   due to {@link FailureReports#IMMEDIATE} settings).
         */
        getTestResults(): any;
    }
}
declare module "lib/errors/DiffsFoundError" {
    export = DiffsFoundError;
    const DiffsFoundError_base: typeof import("lib/errors/TestFailedError");
    /**
     * Indicates that an existing test ended, and that differences where found from the baseline.
     */
    class DiffsFoundError extends DiffsFoundError_base {
        /**
         * Creates a new DiffsFoundError instance.
         *
         * @param {TestResults} testResults - The results of the current test if available, {@code null} otherwise.
         * @param {string|SessionStartInfo} messageOrSession - The error description or SessionStartInfo with test details.
         */
        constructor(testResults: any, messageOrSession: string | import("lib/server/SessionStartInfo"));
    }
}
declare module "lib/errors/NewTestError" {
    export = NewTestError;
    const NewTestError_base: typeof import("lib/errors/TestFailedError");
    /**
     * Indicates that a new test (i.e., a test for which no baseline exists) ended.
     */
    class NewTestError extends NewTestError_base {
        /**
         * Creates a new NewTestError instance.
         *
         * @param {TestResults} testResults - The results of the current test if available, {@code null} otherwise.
         * @param {string|SessionStartInfo} messageOrSession - The error description or SessionStartInfo with test details.
         */
        constructor(testResults: any, messageOrSession: string | import("lib/server/SessionStartInfo"));
    }
}
declare module "lib/errors/OutOfBoundsError" {
    export = OutOfBoundsError;
    const OutOfBoundsError_base: typeof import("lib/errors/EyesError");
    /**
     * Applitools Eyes error indicating the a geometrical element is out of bounds (point outside a region, region outside
     * another region etc.)
     */
    class OutOfBoundsError extends OutOfBoundsError_base {
        constructor(message?: string, error?: Error);
    }
}
declare module "lib/errors/EyesDriverOperationError" {
    export = EyesDriverOperationError;
    const EyesDriverOperationError_base: typeof import("lib/errors/EyesError");
    /**
     * Encapsulates an error when trying to perform an action using WebDriver.
     */
    class EyesDriverOperationError extends EyesDriverOperationError_base {
        constructor(message?: string, error?: Error);
    }
}
declare module "lib/errors/ElementNotFoundError" {
    export = ElementNotFoundError;
    const ElementNotFoundError_base: typeof import("lib/errors/EyesError");
    /**
     * Indicates that element wasn't found
     */
    class ElementNotFoundError extends ElementNotFoundError_base {
        /**
         * Creates a new ElementNotFoundError instance.
         * @param {SupportedSelector} selector - element selector.
         */
        constructor(selector: any);
    }
}
declare module "lib/handler/PropertyHandler" {
    export = PropertyHandler;
    /**
     * Encapsulates getter/setter behavior. (e.g., set only once etc.).
     *
     * @abstract
     */
    class PropertyHandler {
        /**
         * @param {*} obj - The object to set.
         * @return {boolean} {@code true} if the object was set, {@code false} otherwise.
         */
        set(obj: any): boolean;
        /**
         * @return {*} - The object that was set. (Note that object might also be set in the constructor of an impl class).
         */
        get(): any;
    }
}
declare module "lib/handler/ReadOnlyPropertyHandler" {
    export = ReadOnlyPropertyHandler;
    const ReadOnlyPropertyHandler_base: typeof import("lib/handler/PropertyHandler");
    /**
     * A property handler for read-only properties (i.e., set always fails).
     */
    class ReadOnlyPropertyHandler extends ReadOnlyPropertyHandler_base {
        /**
         * @param {Logger} [logger]
         * @param {object} [obj] - The object to set.
         */
        constructor(logger?: any, obj?: object);
        _logger: any;
        _obj: any;
    }
}
declare module "lib/handler/SimplePropertyHandler" {
    export = SimplePropertyHandler;
    const SimplePropertyHandler_base: typeof import("lib/handler/PropertyHandler");
    /**
     * A simple implementation of {@link PropertyHandler}. Allows get/set.
     */
    class SimplePropertyHandler extends SimplePropertyHandler_base {
        /**
         * @param {object} [obj] - The object to set.
         */
        constructor(obj?: object);
        _obj: any;
    }
}
declare module "lib/utils/StreamUtils" {
    const _exports: {
        ReadableBufferStream: unknown;
        WritableBufferStream: unknown;
    };
    export = _exports;
    const ReadableBufferStream_base: typeof import("stream").Readable;
    class ReadableBufferStream extends ReadableBufferStream_base {
        /**
         * @param {Buffer} buffer - The buffer to be used as the stream's source.
         * @param {object} [options] - An "options" object to be passed to the stream constructor.
         */
        constructor(buffer: Buffer, options?: object);
        _buffer: Buffer;
    }
    const WritableBufferStream_base: typeof import("stream").Writable;
    class WritableBufferStream extends WritableBufferStream_base {
        /**
         * @param {object} [options] - An "options" object to be passed to the stream constructor.
         * @return {WritableBufferStream}
         */
        constructor(options?: object);
        _buffer: Buffer;
        /**
         * @return {boolean} {@code false} if the stream wishes for the calling code to wait for the 'drain' event to be
         *   emitted before continuing to write additional data, otherwise {@code true}.
         */
        writeInt(value: any): boolean;
        /**
         * @return {boolean} {@code false} if the stream wishes for the calling code to wait for the 'drain' event to be
         *   emitted before continuing to write additional data, otherwise {@code true}.
         */
        writeShort(value: any): boolean;
        /**
         * @return {boolean} {@code false} if the stream wishes for the calling code to wait for the 'drain' event to be
         *   emitted before continuing to write additional data, otherwise {@code true}.
         */
        writeByte(value: any): boolean;
        /**
         * @return {Buffer} - The buffer which contains the chunks written up to this point.
         */
        getBuffer(): Buffer;
        /**
         * Resets the buffer which contains the chunks written so far.
         * @return {Buffer} - The buffer which contains the chunks written up to the reset.
         */
        resetBuffer(): Buffer;
    }
}
declare module "lib/images/ImageDeltaCompressor" {
    export = ImageDeltaCompressor;
    /**
     * Provides image compression based on delta between consecutive images
     */
    class ImageDeltaCompressor {
        /**
         * Compresses a target image based on a difference from a source image.
         *
         * @param {Image|png.Image} targetData - The image we want to compress.
         * @param {Buffer} targetBuffer - The image we want to compress in its png buffer representation.
         * @param {Image|png.Image} sourceData - The baseline image by which a compression will be performed.
         * @param {number} [blockSize=10] - How many pixels per block.
         * @return {Buffer} - The compression result.
         */
        static compressByRawBlocks(targetData: (new (width?: number, height?: number) => HTMLImageElement) | any, targetBuffer: Buffer, sourceData: (new (width?: number, height?: number) => HTMLImageElement) | any, blockSize?: number): Buffer;
    }
}
declare module "lib/utils/ImageUtils" {
    /**
     * Processes a PNG buffer - returns it as parsed Image.
     *
     * @param {Buffer} buffer - Original image as PNG Buffer
     * @return {Promise<png.Image|Image>} - Decoded png image with byte buffer
     */
    export function parseImage(buffer: Buffer): Promise<import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement)>;
    /**
     * Repacks a parsed Image to a PNG buffer.
     *
     * @param {png.Image|Image} image - Parsed image as returned from parseImage
     * @return {Promise<Buffer>} - PNG buffer which can be written to file or base64 string
     */
    export function packImage(image: import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement)): Promise<Buffer>;
    /**
     * Create a new empty image of given size
     *
     * @param {number} width
     * @param {number} height
     * @return {png.Image|Image}
     */
    export function createImage(width: number, height: number): import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement);
    /**
     * Scaled a parsed image by a given factor.
     *
     * @param {png.Image|Image} image - will be modified
     * @param {number} scaleRatio - factor to multiply the image dimensions by (lower than 1 for scale down)
     * @return {Promise<png.Image|Image>}
     */
    export function scaleImage(image: import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement), scaleRatio: number): Promise<import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement)>;
    /**
     * Resize a parsed image by a given dimensions.
     *
     * @param {png.Image|Image} image - will be modified
     * @param {number} targetWidth - The width to resize the image to
     * @param {number} targetHeight - The height to resize the image to
     * @return {Promise<png.Image|Image>}
     */
    export function resizeImage(image: import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement), targetWidth: number, targetHeight: number): Promise<import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement)>;
    /**
     * Crops a parsed image - the image is changed
     *
     * @param {png.Image|Image} image
     * @param {Region} region - Region to crop
     * @return {Promise<png.Image|Image>}
     */
    export function cropImage(image: import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement), region: any): Promise<import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement)>;
    /**
     * Rotates an image clockwise by a number of degrees rounded to the nearest 90 degrees.
     *
     * @param {png.Image|Image} image - A parsed image, the image will be changed
     * @param {number} degrees - The number of degrees to rotate the image by
     * @return {Promise<png.Image|Image>}
     */
    export function rotateImage(image: import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement), degrees: number): Promise<import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement)>;
    /**
     * Copies pixels from the source image to the destination image.
     *
     * @param {png.Image|Image} dstImage - The destination image.
     * @param {{x: number, y: number}} dstPosition - The pixel which is the starting point to copy to.
     * @param {png.Image|Image} srcImage - The source image.
     * @param {{x: number, y: number}} srcPosition - The pixel from which to start copying.
     * @param {{width: number, height: number}} size - The region to be copied.
     */
    export function copyPixels(dstImage: import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement), dstPosition: {
        x: number;
        y: number;
    }, srcImage: import("png-async").Image | (new (width?: number, height?: number) => HTMLImageElement), srcPosition: {
        x: number;
        y: number;
    }, size: {
        width: number;
        height: number;
    }): void;
    /**
     * Get png size from image buffer. Don't require parsing the image
     *
     * @param {Buffer} imageBuffer
     * @return {{width: number, height: number}}
     */
    export function getImageSizeFromBuffer(imageBuffer: Buffer): {
        width: number;
        height: number;
    };
}
declare module "lib/images/MutableImage" {
    export = MutableImage;
    /**
     * A wrapper for image buffer that parses it to BMP to allow editing and extracting its dimensions
     */
    class MutableImage {
        /**
         * @param {number} width
         * @param {number} height
         * @return {MutableImage}
         */
        static newImage(width: number, height: number): MutableImage;
        /**
         * @param {Buffer|string} image - Encoded bytes of image (buffer or base64 string)
         */
        constructor(image: Buffer | string);
        /** @type {Buffer} */
        _imageBuffer: Buffer;
        /** @type {boolean} */
        _isParsed: boolean;
        /** @type {png.Image|Image} */
        _imageBmp: any | (new (width?: number, height?: number) => HTMLImageElement);
        /** @type {number} */
        _width: number;
        /** @type {number} */
        _height: number;
        /** @type {number} */
        _top: number;
        /** @type {number} */
        _left: number;
        /**
         * Coordinates represent the image's position in a larger context (if any).
         * E.g., A screenshot of the browser's viewport of a web page.
         *
         * @return {Location} - The coordinates of the image in the larger context (if any)
         */
        getCoordinates(): Location;
        /**
         * Coordinates represent the image's position in a larger context (if any).
         * E.g., A screenshot of the browser's viewport of a web page.
         *
         * @param {Location} coordinates
         */
        setCoordinates(coordinates: Location): void;
        /**
         * Size of the image. Parses the image if necessary
         *
         * @return {RectangleSize}
         */
        getSize(): import("lib/geometry/RectangleSize");
        /**
         * @return {number}
         */
        getWidth(): number;
        /**
         * @return {number}
         */
        getHeight(): number;
        /**
         * Return the image as buffer and image width and height.
         *
         * @return {Promise<{imageBuffer: Buffer, width: number, height: number}>}
         */
        asObject(): Promise<{
            imageBuffer: Buffer;
            width: number;
            height: number;
        }>;
        /**
         * Scales the image in place (used to downsize by 2 for retina display chrome bug - and tested accordingly).
         *
         * @param {number} scaleRatio
         * @return {Promise<MutableImage>}
         */
        scale(scaleRatio: number): Promise<MutableImage>;
        /**
         * Crops the image according to the given region.
         *
         * @param {Region} region
         * @return {Promise<MutableImage>}
         */
        crop(region: any): Promise<MutableImage>;
        /**
         * Crops the image according to the given region and return new image, do not override existing
         * !WARNING this method copy image and crop it. Use image.crop() when it is possible
         *
         * @param {Region} region
         * @return {Promise<MutableImage>}
         */
        getImagePart(region: any): Promise<MutableImage>;
        /**
         * Rotates an image clockwise by a number of degrees rounded to the nearest 90 degrees.
         *
         * @param {number} degrees - The number of degrees to rotate the image by
         * @return {Promise<MutableImage>}
         */
        rotate(degrees: number): Promise<MutableImage>;
        /**
         * @param {number} dx
         * @param {number} dy
         * @param {MutableImage} srcImage
         * @return {Promise}
         */
        copyRasterData(dx: number, dy: number, srcImage: MutableImage): Promise<any>;
        /**
         * @return {?Promise<Buffer>}
         */
        getImageBuffer(): Promise<Buffer> | null;
        /**
         * @return {?Promise<string>}
         */
        getImageBase64(): Promise<string> | null;
        /**
         * @return {?Promise<png.Image|Image>}
         */
        getImageData(): Promise<any | (new (width?: number, height?: number) => HTMLImageElement)> | null;
    }
    const Location: typeof import("lib/geometry/Location");
}
declare module "lib/logging/LogHandler" {
    export = LogHandler;
    /**
     * Handles log messages produces by the Eyes API.
     *
     * @abstract
     */
    class LogHandler {
        /**
         * @param {boolean} [isVerbose=false] - Whether to handle or ignore verbose log messages.
         */
        constructor(isVerbose?: boolean);
        /**
         * Whether to handle or ignore verbose log messages.
         *
         * @param {boolean} isVerbose
         */
        setIsVerbose(isVerbose: boolean): void;
        _isVerbose: boolean;
        /**
         * Whether to handle or ignore verbose log messages.
         *
         * @return {boolean} - isVerbose
         */
        getIsVerbose(): boolean;
        open(): void;
        close(): void;
        /**
         * @param {boolean} verbose
         * @param {string} logString
         */
        onMessage(verbose: boolean, logString: string): void;
    }
}
declare module "lib/logging/ConsoleLogHandler" {
    export = ConsoleLogHandler;
    const ConsoleLogHandler_base: typeof import("lib/logging/LogHandler");
    /**
     * Write log messages to the browser/node console
     */
    class ConsoleLogHandler extends ConsoleLogHandler_base {
        constructor(isVerbose?: boolean);
    }
}
declare module "lib/logging/DebugLogHandler" {
    export = DebugLogHandler;
    const DebugLogHandler_base: typeof import("lib/logging/LogHandler");
    /**
     * Write log messages to the browser/node console
     */
    class DebugLogHandler extends DebugLogHandler_base {
        /**
         * @param {boolean} [isVerbose=false] - Whether to handle or ignore verbose log messages.
         * @param {string} [appName] - The app name to use
         * @param {object} [debugInstance] - Another instance which should be extended
         */
        constructor(isVerbose?: boolean, appName?: string, debugInstance?: object);
        _debug: any;
        /**
         * @param {string} name
         * @return {DebugLogHandler}
         */
        extend(name: string): DebugLogHandler;
    }
}
declare module "lib/logging/FileLogHandler" {
    export = FileLogHandler;
    const FileLogHandler_base: typeof import("lib/logging/LogHandler");
    /**
     * Write log messages to the browser/node console
     */
    class FileLogHandler extends FileLogHandler_base {
        /**
         * @param {boolean} isVerbose - Whether to handle or ignore verbose log messages.
         * @param {string} [filename] - The file in which to save the logs.
         * @param {boolean} [append=true] - Whether to append the logs to existing file, or to overwrite the existing file.
         */
        constructor(isVerbose: boolean, filename?: string, append?: boolean);
        _filename: string;
        _append: boolean;
        _writer: import("fs").WriteStream;
    }
}
declare module "lib/utils/PerformanceUtils" {
    /**
     * @param {string} [name] - Instance name or {@code null} if don't want to store it
     * @param {boolean} [storeResults=true]
     * @return {object}
     */
    export function start(name?: string, storeResults?: boolean): object;
    /**
     * @param {string} name - Instance name
     * @param {boolean} [deleteResults=false]
     * @return {{name: string, time: number, summary: string}}
     */
    export function end(name: string, deleteResults?: boolean): {
        name: string;
        time: number;
        summary: string;
    };
    /**
     * @param {string} name - Instance name
     * @return {{name: string, time: number, summary: string}}
     */
    export function result(name: string): {
        name: string;
        time: number;
        summary: string;
    };
    /**
     * Format elapsed time by template (#m #s #ms)
     *
     * @param {number} milliseconds
     * @return {string} - formatted string
     */
    export function elapsedString(milliseconds: number): string;
}
declare module "lib/logging/NullLogHandler" {
    export = NullLogHandler;
    const NullLogHandler_base: typeof import("lib/logging/LogHandler");
    /**
     * Ignores all log messages.
     */
    class NullLogHandler extends NullLogHandler_base {
        constructor(isVerbose?: boolean);
    }
}
declare module "lib/logging/Logger" {
    export = Logger;
    /**
     * Write log messages using the provided Log Handler
     */
    class Logger {
        /**
         * @param {boolean|string} [showLogs] - Determines which log handler will be used. If set to {@code true}, then
         *   `ConsoleLogHandler` will be used, if not set or set to {@code false} then `DebugLogHandler` used.
         * @param {string} [debugAppName] - If using `DebugLogHandler` then this is the debug app name.
         */
        constructor(showLogs?: boolean | string, debugAppName?: string);
        _logHandler: import("lib/logging/ConsoleLogHandler") | import("lib/logging/DebugLogHandler");
        _sessionId: string;
        _isIncludeTime: boolean;
        /**
         * @param {string} sessionId
         */
        setSessionId(sessionId: string): void;
        /**
         * @param {boolean} isIncludeTime
         */
        setIncludeTime(isIncludeTime: boolean): void;
        /**
         * @return {LogHandler} - The currently set log handler.
         */
        getLogHandler(): any;
        /**
         * @param {LogHandler} [handler] - The log handler to set. If you want a log handler which does nothing, use
         *   {@link NullLogHandler}.
         */
        setLogHandler(handler?: any): void;
        /**
         * @param {string} name
         * @return {Logger}
         */
        extend(name: string): Logger;
        /**
         * Writes a verbose write message.
         *
         * @param {*} args
         */
        verbose(...args: any): void;
        /**
         * Writes a (non-verbose) write message.
         *
         * @param {*} args
         */
        log(...args: any): void;
        /**
         * @private
         * @return {string} - The name of the method which called the logger, if possible, or an empty string.
         */
        private _getFormattedString;
        /**
         * @private
         * @return {string} - The name of the method which called the logger, if possible, or an empty string.
         */
        private _getMethodName;
    }
}
declare module "lib/useragent/BrowserNames" {
    export = BrowserNames;
    /**
     * @typedef {string} BrowserName
     */
    const BrowserNames: Readonly<{
        Edge: string;
        IE: string;
        Firefox: string;
        Chrome: string;
        Safari: string;
        Chromium: string;
    }>;
    namespace BrowserNames {
        export { BrowserName };
    }
    type BrowserName = string;
}
declare module "lib/useragent/OSNames" {
    export = OSNames;
    /**
     * @typedef {string} OSName
     */
    const OSNames: Readonly<{
        Android: string;
        ChromeOS: string;
        IOS: string;
        Linux: string;
        Macintosh: string;
        MacOSX: string;
        Unknown: string;
        Windows: string;
    }>;
    namespace OSNames {
        export { OSName };
    }
    type OSName = string;
}
declare module "lib/useragent/UserAgent" {
    export = UserAgent;
    /**
     * Handles parsing of a user agent string
     */
    class UserAgent {
        /**
         * @param {string} userAgent - User agent string to parse
         * @param {boolean} unknowns - Whether to treat unknown products as {@code UNKNOWN} or throw an exception.
         * @return {UserAgent} - A representation of the user agent string.
         */
        static parseUserAgentString(userAgent: string, unknowns: boolean): UserAgent;
        /** @type {string} */
        _OS: string;
        /** @type {string} */
        _OSMajorVersion: string;
        /** @type {string} */
        _OSMinorVersion: string;
        /** @type {string} */
        _browser: string;
        /** @type {string} */
        _browserMajorVersion: string;
        /** @type {string} */
        _browserMinorVersion: string;
        /**
         * @return {string}
         */
        getBrowser(): string;
        /**
         * @return {string}
         */
        getBrowserMajorVersion(): string;
        /**
         * @return {string}
         */
        getBrowserMinorVersion(): string;
        /**
         * @return {string}
         */
        getOS(): string;
        /**
         * @return {string}
         */
        getOSMajorVersion(): string;
        /**
         * @return {string}
         */
        getOSMinorVersion(): string;
    }
}
declare module "lib/utils/ConfigUtils" {
    export function getConfig({ configParams, configPath, logger, }?: {
        configParams?: any[];
        configPath: any;
        logger?: import("lib/logging/Logger");
    }): {};
    /**
     * @param {string} camelCaseStr
     * @return {string}
     */
    export function toEnvVarName(camelCaseStr: string): string;
}
declare module "lib/utils/deserializeDomSnapshotResult" {
    export = deserializeDomSnapshotResult;
    function deserializeDomSnapshotResult(domSnapshotResult: any): any;
}
declare module "lib/DomCapture" {
    export = DomCapture;
    /**
     * @ignore
     */
    class DomCapture {
        /**
         * @param {Logger} logger - A Logger instance.
         * @param {EyesWrappedDriver} driver
         * @param {PositionProvider} [positionProvider]
         * @param {DomCaptureReturnType} [returnType]
         * @param {string} [script]
         * @return {Promise<string|object>}
         */
        static getFullWindowDom(logger: any, driver: any, positionProvider?: any, returnType?: {
            OBJECT: string;
            STRING: string;
        }, script?: string): Promise<string | object>;
        /**
         * @param {Logger} logger
         * @param {EyesWrappedDriver} driver
         */
        constructor(logger: any, driver: any, script: any);
        _logger: any;
        _driver: any;
        _customScript: any;
        isInternetExplorer(): Promise<boolean>;
        isEdgeClassic(): Promise<boolean>;
        needsIEScript(): Promise<boolean>;
        /**
         * @return {Promise<string>}
         */
        getWindowDom(): Promise<string>;
        /**
         * @param {string} script
         * @param {string} url
         * @return {Promise<string>}
         */
        getFrameDom(script: string, url: string): Promise<string>;
        getLocation(): Promise<any>;
        /**
         * @param {string|string[]} xpaths
         * @return {Promise<number>}
         * @private
         */
        private _switchToFrame;
        /**
         * @private
         * @return {Promise<number>}
         */
        private _switchToParentFrame;
        /**
         * @param {string} baseUri
         * @param {string} href
         * @param {number} [retriesCount=1]
         * @return {Promise<{href: string, css: string}>}
         * @private
         */
        private _downloadCss;
        getDriver(): any;
    }
    namespace DomCapture {
        export { DomCaptureReturnType };
    }
    namespace DomCaptureReturnType {
        export const OBJECT: string;
        export const STRING: string;
    }
}
declare module "lib/capture/AppOutputProvider" {
    export = AppOutputProvider;
    /**
     * Encapsulates a callback which returns an application output.
     *
     * @ignore
     * @abstract
     */
    class AppOutputProvider {
        /**
         * @param {Region} region
         * @param {EyesScreenshot} lastScreenshot
         * @param {CheckSettings} checkSettings
         * @return {Promise<AppOutputWithScreenshot>}
         */
        getAppOutput(region: any, lastScreenshot: any, checkSettings: any): Promise<any>;
    }
}
declare module "lib/capture/AppOutputWithScreenshot" {
    export = AppOutputWithScreenshot;
    /**
     * A container for a AppOutput along with the screenshot used for creating it.
     * (We specifically avoid inheritance so we don't have to deal with serialization issues).
     *
     * @ignore
     */
    class AppOutputWithScreenshot {
        /**
         * @param {AppOutput} appOutput
         * @param {EyesScreenshot} screenshot
         */
        constructor(appOutput: any, screenshot: any);
        _appOutput: any;
        _screenshot: any;
        /**
         * @return {AppOutput}
         */
        getAppOutput(): any;
        /**
         * @return {EyesScreenshot}
         */
        getScreenshot(): any;
    }
}
declare module "lib/capture/EyesScreenshot" {
    export = EyesScreenshot;
    /**
     * Base class for handling screenshots.
     *
     * @abstract
     */
    class EyesScreenshot {
        /**
         * @param {MutableImage} image
         */
        constructor(image: any);
        _image: any;
        /**
         * @return {MutableImage} - the screenshot image.
         */
        getImage(): any;
        /**
         * Returns a part of the screenshot based on the given region.
         *
         * @abstract
         * @param {Region} region - The region for which we should get the sub screenshot.
         * @param {boolean} throwIfClipped - Throw an EyesException if the region is not fully contained in the screenshot.
         * @return {Promise<EyesScreenshot>} - A screenshot instance containing the given region.
         */
        getSubScreenshot(region: import("lib/geometry/Region"), throwIfClipped: boolean): Promise<EyesScreenshot>;
        /**
         * Converts a location's coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
         *
         * @abstract
         * @param {Location} location - The location which coordinates needs to be converted.
         * @param {CoordinatesType} from - The current coordinates type for {@code location}.
         * @param {CoordinatesType} to - The target coordinates type for {@code location}.
         * @return {Location} - A new location which is the transformation of {@code location} to the {@code to} type.
         */
        convertLocation(location: Location, from: any, to: any): Location;
        /**
         * Calculates the location in the screenshot of the location given as parameter.
         *
         * @abstract
         * @param {Location} location - The location as coordinates inside the current frame.
         * @param {CoordinatesType} coordinatesType - The coordinates type of {@code location}.
         * @return {Location} - The corresponding location inside the screenshot, in screenshot as-is coordinates type.
         * @throws OutOfBoundsError If the location is not inside the frame's region in the screenshot.
         */
        getLocationInScreenshot(location: Location, coordinatesType: any): Location;
        /**
         * Get the intersection of the given region with the screenshot.
         * @abstract
         * @param {Region} region - The region to intersect.
         * @param {CoordinatesType} coordinatesType - The coordinates type of {@code region}.
         * @return {Region} - The intersected region, in {@code resultCoordinatesType} coordinates.
         */
        getIntersectedRegion(region: import("lib/geometry/Region"), coordinatesType: any): import("lib/geometry/Region");
        /**
         * Converts a region's location coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
         *
         * @param {Region} region - The region which location's coordinates needs to be converted.
         * @param {CoordinatesType} from - The current coordinates type for {@code region}.
         * @param {CoordinatesType} to - The target coordinates type for {@code region}.
         * @return {Region} - A new region which is the transformation of {@code region} to the {@code to} coordinates type.
         */
        convertRegionLocation(region: import("lib/geometry/Region"), from: any, to: any): import("lib/geometry/Region");
    }
}
declare module "lib/frames/FrameChain" {
    export = FrameChain;
    /**
     * @typedef {import('../logging/Logger')} Logger
     * @typedef {import('../geometry/Location')} Location
     * @typedef {import('../geometry/RectangleSize')} RectangleSize
     */
    class FrameChain {
        /**
         * Equality check for two frame chains
         * @param {FrameChain} leftFrameChain - frame chain to be compared
         * @param {FrameChain} rightFrameChain - frame chain to be compared
         * @return {Promise<boolean>} true if both objects represent the same frame chain, false otherwise
         */
        static equals(leftFrameChain: FrameChain, rightFrameChain: FrameChain): Promise<boolean>;
        /**
         * @param {Logger} logger - logger instance
         * @param {FrameChain} other - frame chain from which the current frame chain will be created
         */
        constructor(logger: Logger, other: FrameChain);
        _logger: import("lib/logging/Logger");
        _frames: any;
        /**
         * @return {number} number of frames in the chain
         */
        get size(): number;
        /**
         * @return {boolean} true if frame chain is empty, false otherwise
         */
        get isEmpty(): boolean;
        /**
         * @return {Frame} first frame context (the first frame in the chain)
         */
        get first(): any;
        /**
         * @return {Frame} current frame context (the last frame in the chain)
         */
        get current(): any;
        /**
         * @param {number} index - index of needed frame
         * @return {Frame} frame by index in array
         */
        frameAt(index: number): any;
        /**
         * Removes all frames in the frame chain
         */
        clear(): void;
        /**
         * @return {FrameChain} cloned frame chain
         */
        clone(): FrameChain;
        /**
         * Removes the last inserted frame element. Practically means we switched
         * back to the parent of the current frame
         * @return {?Frame} removed frame
         */
        pop(): any;
        /**
         * Appends a frame to the frame chain
         * @param {Frame} frame - frame to be added
         */
        push(frame: any): any;
        /**
         * @return {Location} location of the current frame in the page
         */
        getCurrentFrameOffset(): Location;
        /**
         * @return {Location} location of the current frame related to the viewport
         */
        getCurrentFrameLocationInViewport(): Location;
        /**
         * @return {RectangleSize} effective size of current frame
         */
        getCurrentFrameEffectiveSize(): RectangleSize;
        getCurrentFrameEffectiveRect(): import("lib/geometry/Region");
        [Symbol.iterator](): any;
    }
    namespace FrameChain {
        export { Logger, Location, RectangleSize };
    }
    const Location: typeof import("lib/geometry/Location");
    const RectangleSize: typeof import("lib/geometry/RectangleSize");
    type Logger = import("lib/logging/Logger");
    type Location = import("lib/geometry/Location");
    type RectangleSize = import("lib/geometry/RectangleSize");
}
declare module "lib/EyesJsSnippets" {
    export const GET_VIEWPORT_SIZE: string;
    export const GET_CONTENT_ENTIRE_SIZE: "\n  var scrollWidth = document.documentElement.scrollWidth;\n  var bodyScrollWidth = document.body.scrollWidth;\n  var totalWidth = Math.max(scrollWidth, bodyScrollWidth);\n  var clientHeight = document.documentElement.clientHeight;\n  var bodyClientHeight = document.body.clientHeight;\n  var scrollHeight = document.documentElement.scrollHeight;\n  var bodyScrollHeight = document.body.scrollHeight;\n  var maxDocElementHeight = Math.max(clientHeight, scrollHeight);\n  var maxBodyHeight = Math.max(bodyClientHeight, bodyScrollHeight);\n  var totalHeight = Math.max(maxDocElementHeight, maxBodyHeight);\n  return [totalWidth, totalHeight];\n";
    export const GET_ELEMENT_ENTIRE_SIZE: "\n  var element = arguments[0];\n  return [\n    Math.max(element.clientWidth, element.scrollWidth),\n    Math.max(element.clientHeight, element.scrollHeight)\n  ];\n";
    export const GET_ELEMENT_RECT: string;
    export const GET_ELEMENT_CLIENT_RECT: string;
    export const GET_ELEMENT_CSS_PROPERTIES: "\n  var properties = arguments[0];\n  var element = arguments[1];\n  var computedStyle = window.getComputedStyle(element, null);\n  return computedStyle\n    ? properties.map(function(property) { return computedStyle.getPropertyValue(property); })\n    : [];\n";
    export const GET_ELEMENT_PROPERTIES: "\n  var properties = arguments[0];\n  var element = arguments[1];\n  return properties.map(function(property) { return element[property]; });\n";
    export const GET_INNER_OFFSETS: string;
    export const GET_SCROLL_POSITION: "\n  var element = arguments[0];\n  if (element) return [element.scrollLeft, element.scrollTop];\n  else {\n    var doc = document.documentElement;\n    return [\n      window.scrollX || ((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)),\n      window.scrollY || ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0))\n    ];\n  }\n";
    export const SCROLL_TO: "\n  var offset = arguments[0];\n  var element = arguments[1] || document.documentElement;\n  if (element.scrollTo) {\n    element.scrollTo(offset.x, offset.y);\n  } else {\n    element.scrollTop = offset.x;\n    element.scrollLeft = offset.y;\n  }\n  return [element.scrollLeft, element.scrollTop];\n";
    export const GET_TRANSFORMS: string;
    export function SET_TRANSFORMS(transforms: any): string;
    export function TRANSLATE_TO(x: any, y: any): string;
    export const IS_SCROLLABLE: "\n  var element = arguments[0] || document.documentElement;\n  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight\n";
    export const GET_SCROLL_ROOT_ELEMENT: "\n  return document.documentElement;\n";
    export const MARK_SCROLL_ROOT_ELEMENT: "\n  var element =  arguments[0] || document.documentElement;\n  element.setAttribute(\"data-applitools-scroll\", \"true\");\n";
    export const GET_OVERFLOW: "\n  var el = arguments[0];\n  return el.style.overflow;\n";
    export function SET_OVERFLOW_AND_RETURN_ORIGIN_VALUE(overflow: any): string;
    export const BLUR_ELEMENT: "\n  var activeElement = arguments[0] || document.activeElement;\n  if (activeElement) activeElement.blur();\n  return activeElement;\n";
    export const FOCUS_ELEMENT: "\n  var activeElement = arguments[0];\n  if (activeElement) activeElement.focus();\n";
    export const GET_ELEMENT_XPATH: string;
    export const GET_ELEMENT_ABSOLUTE_XPATH: string;
    export const GET_CURRENT_CONTEXT_INFO: string;
    export const GET_FRAME_BY_NAME_OR_ID: "\n  var nameOrId = arguments[0];\n  try {\n    return document.querySelector('iframe[name=\"' + nameOrId + '\"],iframe#' + nameOrId);\n  } catch (err) {\n    return null;\n  }\n";
    export const GET_FRAMES: "\n  var frames = document.querySelectorAll('frame, iframe');\n  return Array.prototype.map.call(frames, function(frameElement) {\n    return {\n      isCORS: !frameElement.contentDocument,\n      element: frameElement,\n      src: frameElement.src\n    };\n  });\n";
    export const GET_DOCUMENT_ELEMENT: "\n  return document.documentElement\n";
}
declare module "lib/wrappers/EyesWrappedElement" {
    export = EyesWrappedElement;
    /**
     * @typedef {import('../logging/Logger')} Logger
     * @typedef {import('../geometry/Region')} Region
     * @typedef {import('../geometry/Location')} Location
     * @typedef {import('../geometry/RectangleSize')} RectangleSize
     * @typedef {import('./EyesWrappedDriver')} EyesWrappedDriver
     */
    /**
     * Compatible element type
     * @typedef SupportedElement
     * @prop {?}
     */
    /**
     * Supported selector type
     * @typedef SupportedSelector
     * @prop {?}
     */
    /**
     * Unwrapped element supported by framework
     * @typedef UnwrappedElement
     * @prop {?}
     */
    /**
     * Cross SDK selector
     * @typedef EyesSelector
     * @prop {'css'|'xpath'} type
     * @prop {string} selector
     */
    /**
     * The object which implements the lowest-level functions to work with element
     * @typedef SpecsWrappedElement
     * @prop {(element) => boolean} isCompatible - return true if the value is an element, false otherwise
     * @prop {(selector) => boolean} isSelector - return true if the value is a valid selector, false otherwise
     * @prop {(selector: EyesSelector) => SupportedSelector} toSupportedSelector - translate cross SDK selector to SDK specific selector
     * @prop {(selector: SupportedSelector) => EyesSelector} toEyesSelector - translate SDK specific selector to cross SDK selector
     * @prop {(element: UnwrappedElement) => Promise<string>} extractId - extract id from the unwrapped element
     * @prop {(element: SupportedElement) => UnwrappedElement} [extractElement] - extract an element from the supported element
     * @prop {(element: SupportedElement) => SupportedSelector} [extractSelector] - extract an element from the supported element
     * @prop {(result) => boolean} [isStaleElementReferenceResult] - check if is a stale element reference result
     */
    class EyesWrappedElement {
        /**
         * @param {SpecsWrappedElement} SpecsWrappedElement - specifications for the specific framework
         * @return {EyesWrappedElement} specialized version of this class
         */
        static specialize(SpecsWrappedElement: SpecsWrappedElement): EyesWrappedElement;
        /** @type {SpecsWrappedElement} */
        static get specs(): SpecsWrappedElement;
        /**
         * Create partial wrapped element object from the element, this object need to be initialized before use
         * @param {SupportedElement} element - supported element object
         * @return {EyesWrappedElement} partially wrapped object
         */
        static fromElement(element: SupportedElement): EyesWrappedElement;
        /**
         * Create partial wrapped element object from the selector, this object need to be initialized before use
         * @param {SupportedSelector} selector - any kind of supported selector
         * @return {EyesWrappedElement} partially wrapped object
         */
        static fromSelector(selector: SupportedSelector): EyesWrappedElement;
        /**
         * Check if object could be wrapped with this class
         * @param {*} element - object to check compatibility
         * @return {boolean} true if object could be wrapped with this class, otherwise false
         */
        static isCompatible(element: any): boolean;
        /**
         * Check if passed selector is supported by current implementation
         * @param {*} selector
         * @return {boolean} true if selector is supported and could be passed in the {@link EyesWrappedElement.fromSelector} implementation
         */
        static isSelector(selector: any): boolean;
        /**
         * Translate cross SDK selector to SDK specific selector
         * @param {EyesSelector} selector
         * @return {SupportedSelector} translated SDK specific selector object
         */
        static toSupportedSelector(selector: EyesSelector): SupportedSelector;
        /**
         * Translate SDK specific selector to cross SDK selector
         * @param {SupportedSelector} selector
         * @return {EyesSelector} translated cross SDK selector object
         */
        static toEyesSelector(selector: SupportedSelector): EyesSelector;
        /**
         * Extract element ID from this class instance or unwrapped element object
         * @param {EyesWrappedElement|UnwrappedElement} element - element to extract ID
         * @return {Promise<string>} if extraction is succeed returns ID of provided element, otherwise null
         */
        static extractId(element: EyesWrappedElement | UnwrappedElement): Promise<string>;
        /**
         * Compare two elements, these elements could be an instances of this class or compatible objects
         * @param {EyesWrappedElement|UnwrappedElement} leftElement - element to compare
         * @param {EyesWrappedElement|UnwrappedElement} rightElement - element to compare
         * @return {Promise<boolean>} true if elements are equal, false otherwise
         */
        static equals(leftElement: EyesWrappedElement | UnwrappedElement, rightElement: EyesWrappedElement | UnwrappedElement): Promise<boolean>;
        /**
         * Construct a wrapped element instance. An element could be created partially, which means without drive instance,
         * Only using an element object or selector.
         * Partially created elements should be initialized by calling `EyesWrappedDriver#init` method before use.
         * @param {Logger} [logger] - logger instance
         * @param {EyesWrappedDriver} [driver] - parent driver instance
         * @param {SupportedElement} [element] - supported element object to wrap
         * @param {SupportedSelector} [selector] - universal selector object or any kind of supported selector
         */
        constructor(logger?: Logger, driver?: EyesWrappedDriver, element?: SupportedElement, selector?: SupportedSelector);
        /** @type {SpecsWrappedElement} */
        get specs(): SpecsWrappedElement;
        _element: UnwrappedElement;
        _selector: SupportedSelector;
        _logger: import("lib/logging/Logger");
        _driver: import("lib/wrappers/EyesWrappedDriver");
        /**
         * ID of the wrapped element
         * @type {Promise<string>}
         */
        get elementId(): Promise<string>;
        /**
         * Selector of the wrapped element
         * @type {SupportedSelector}
         */
        get selector(): SupportedSelector;
        /**
         * Unwrapped element
         * @type {UnwrappedElement}
         */
        get unwrapped(): UnwrappedElement;
        /**
         * Equality check for two elements
         * @param {EyesWrappedDriver|UnwrappedElement} otherElement - element to compare
         * @return {Promise<boolean>} true if elements are equal, false otherwise
         */
        equals(otherFrame: any): Promise<boolean>;
        /**
         * Initialize element created from {@link SupportedElement} or {@link SupportedSelector}
         * or other kind of supported selector
         * @param {EyesWrappedDriver} driver - instance of {@link EyesWrappedDriver} implementation
         * @return {Promise<this>} initialized element
         */
        init(driver: EyesWrappedDriver): Promise<this>;
        /**
         * Returns element rect related to context
         * @return {Promise<Region>} rect of the element
         */
        getRect(): Promise<Region>;
        /**
         * Returns element client rect (element rect without borders) related to context
         * @return {Promise<Region>} rect of the element
         */
        getClientRect(): Promise<Region>;
        /**
         * Returns element's size
         * @return {Promise<RectangleSize>} size of the element
         */
        getSize(): Promise<RectangleSize>;
        /**
         * Returns element's location related to context
         * @return {Promise<Location>} location of the element
         */
        getLocation(): Promise<Location>;
        /**
         * Returns computed values for specified css properties
         * @param  {...string} properties - names of css properties
         * @return {Promise<string[]|string>} returns array of css values if multiple properties were specified,
         *  otherwise returns string
         */
        getCssProperty(...properties: string[]): Promise<string[] | string>;
        /**
         * Returns values for specified element's properties
         * @param  {...string} properties - names of element properties
         * @return {Promise<*[]|*>} returns array of values if multiple properties were specified,
         *  otherwise returns value
         */
        getProperty(...properties: string[]): Promise<any[] | any>;
        /**
         * Set overflow `hidden` in element's style attribute
         * @return {Promise<?string>}
         */
        hideScrollbars(): Promise<string | null>;
        _originalOverflow: string;
        /**
         * Set original overflow in element's style attribute
         * @return {Promise<void>}
         */
        restoreScrollbars(): Promise<void>;
        /**
         * Save current element position for future restoration
         * @param {PositionProvider} - position provider which is implementing specific algorithm
         * @return {Promise<PositionMemento>} current position
         */
        preservePosition(positionProvider: any): Promise<any>;
        _positionMemento: any;
        /**
         * Restore previously saved position
         * @param {PositionProvider} - position provider which is implementing specific algorithm
         * @return {Promise<PositionMemento>} current position
         */
        restorePosition(positionProvider: any): Promise<any>;
        /**
         * Refresh an element reference with a specified element or try to refresh it by selector if so
         * @param {UnwrappedElement} [freshElement] - element to update replace internal element reference
         * @return {boolean} true if element was successfully refreshed, otherwise false
         */
        refresh(freshElement?: UnwrappedElement): boolean;
        /**
         * Wrap an operation on the element and handle stale element reference if such happened during operation
         * @param {Function} operation - operation on the element
         * @return {Promise<*>} promise which resolve whatever an operation will resolve
         */
        withRefresh(operation: Function): Promise<any>;
    }
    namespace EyesWrappedElement {
        export { Logger, Region, Location, RectangleSize, EyesWrappedDriver, SupportedElement, SupportedSelector, UnwrappedElement, EyesSelector, SpecsWrappedElement };
    }
    /**
     * The object which implements the lowest-level functions to work with element
     */
    type SpecsWrappedElement = {
        /**
         * - return true if the value is an element, false otherwise
         */
        isCompatible: (element: any) => boolean;
        /**
         * - return true if the value is a valid selector, false otherwise
         */
        isSelector: (selector: any) => boolean;
        /**
         * - translate cross SDK selector to SDK specific selector
         */
        toSupportedSelector: (selector: EyesSelector) => SupportedSelector;
        /**
         * - translate SDK specific selector to cross SDK selector
         */
        toEyesSelector: (selector: SupportedSelector) => EyesSelector;
        /**
         * - extract id from the unwrapped element
         */
        extractId: (element: UnwrappedElement) => Promise<string>;
        /**
         * - extract an element from the supported element
         */
        extractElement?: (element: SupportedElement) => UnwrappedElement;
        /**
         * - extract an element from the supported element
         */
        extractSelector?: (element: SupportedElement) => SupportedSelector;
        /**
         * - check if is a stale element reference result
         */
        isStaleElementReferenceResult?: (result: any) => boolean;
    };
    /**
     * Unwrapped element supported by framework
     */
    type UnwrappedElement = {
        "": unknown;
    };
    /**
     * Supported selector type
     */
    type SupportedSelector = {
        "": unknown;
    };
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type Region = import("lib/geometry/Region");
    type RectangleSize = import("lib/geometry/RectangleSize");
    type Location = import("lib/geometry/Location");
    /**
     * Compatible element type
     */
    type SupportedElement = {
        "": unknown;
    };
    /**
     * Cross SDK selector
     */
    type EyesSelector = {
        type: 'css' | 'xpath';
        selector: string;
    };
    type Logger = import("lib/logging/Logger");
}
declare module "lib/wrappers/EyesJsExecutor" {
    export = EyesJsExecutor;
    /**
     * @typedef {import('../logging/Logger')} Logger
     * @typedef {import('./EyesWrappedDriver')} EyesWrappedDriver
     */
    /**
     * The object which implements the lowest-level functions to work with element finder
     * @typedef SpecsJsExecutor
     * @prop {(driver: UnwrappedDriver, script: string|Function, ...args) => Promise<*>} executeScript - execute script and return result
     * @prop {(driver: UnwrappedDriver, ms: number) => Promise<void>} sleep - makes the driver sleep for the given amount of time in ms
     */
    class EyesJsExecutor {
        /**
         * @param {SpecsJsExecutor} SpecsJsExecutor - specifications for the specific framework
         * @return {EyesJsExecutor} specialized version of this class
         */
        static specialize(SpecsJsExecutor: SpecsJsExecutor): EyesJsExecutor;
        /** @type {SpecsJsExecutor} */
        static get specs(): SpecsJsExecutor;
        /**
         * Construct js executor instance
         * @param {Logger} logger - logger instance
         * @param {EyesWrappedDriver} driver - wrapped driver instance
         */
        constructor(logger: Logger, driver: EyesWrappedDriver);
        /** @type {SpecsJsExecutor} */
        get specs(): SpecsJsExecutor;
        _logger: import("lib/logging/Logger");
        _driver: import("lib/wrappers/EyesWrappedDriver");
        /**
         * Schedules a command to execute JavaScript in the context of the currently selected frame or window. The script
         * fragment will be executed as the body of an anonymous function. If the script is provided as a function object,
         * that function will be converted to a string for injection into the target window.
         *
         * @param {!(string|Function)} script - script to execute
         * @param {...*} args - arguments to pass to the script
         * @return {Promise<*>} promise that will resolve to the scripts return value
         */
        executeScript(script: (string | Function), ...args: any[]): Promise<any>;
        /**
         * Schedules a command to make the driver sleep for the given amount of time
         * @param {number} ms - amount of time, in milliseconds, to sleep
         * @return {Promise<void>} promise that will be resolved when the sleep has finished
         */
        sleep(ms: number): Promise<void>;
    }
    namespace EyesJsExecutor {
        export { Logger, EyesWrappedDriver, SpecsJsExecutor };
    }
    /**
     * The object which implements the lowest-level functions to work with element finder
     */
    type SpecsJsExecutor = {
        /**
         * - execute script and return result
         */
        executeScript: (driver: any, script: string | Function, ...args: any[]) => Promise<any>;
        /**
         * - makes the driver sleep for the given amount of time in ms
         */
        sleep: (driver: any, ms: number) => Promise<void>;
    };
    type Logger = import("lib/logging/Logger");
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
}
declare module "lib/wrappers/EyesElementFinder" {
    export = EyesElementFinder;
    /**
     * @typedef {import('../logging/Logger')} Logger
     * @typedef {import('./EyesWrappedDriver')} EyesWrappedDriver
     * @typedef {import('./EyesWrappedDriver').UnwrappedDriver} UnwrappedDriver
     * @typedef {import('./EyesWrappedElement')} EyesWrappedElement
     * @typedef {import('./EyesWrappedElement').SupportedElement} SupportedElement
     * @typedef {import('./EyesWrappedElement').EyesSelector} EyesSelector
     * @typedef {import('./EyesWrappedElement').SupportedSelector} SupportedSelector
     */
    /**
     * The object which implements the lowest-level functions to work with element finder
     * @typedef SpecsElementFinder
     * @prop {(driver: UnwrappedDriver, selector: SupportedSelector) => EyesWrappedElement} findElement - return found element
     * @prop {(driver: UnwrappedDriver, selector: SupportedSelector) => EyesWrappedElement} findElements - return found elements
     * @prop {(logger: Logger, driver: EyesWrappedDriver, element: SupportedElement, selector: SupportedSelector) => EyesWrappedElement} createElement - return wrapped element instance
     * @prop {(selector: EyesSelector) => SupportedSelector} toSupportedSelector - translate cross SDK selector to SDK specific selector
     * @prop {(selector: SupportedSelector) => EyesSelector} toEyesSelector - translate SDK specific selector to cross SDK selector
     */
    class EyesElementFinder {
        /**
         * @param {SpecsElementFinder} SpecsElementFinder - specifications for the specific framework
         * @return {EyesElementFinder} specialized version of this class
         */
        static specialize(SpecsElementFinder: SpecsElementFinder): EyesElementFinder;
        /** @type {SpecsElementFinder} */
        static get specs(): SpecsElementFinder;
        /**
         * Construct an element finder instance
         * @param {Logger} logger - logger instance
         * @param {EyesWrappedDriver} driver - wrapped driver instance
         */
        constructor(logger: Logger, driver: EyesWrappedDriver);
        /** @type {SpecsElementFinder} */
        get specs(): SpecsElementFinder;
        _logger: import("lib/logging/Logger");
        _driver: import("lib/wrappers/EyesWrappedDriver");
        /**
         * Returns first founded element
         * @param {SupportedSelector} selector - selector supported by current implementation
         * @return {Promise<EyesWrappedElement>}
         */
        findElement(selector: SupportedSelector): Promise<EyesWrappedElement>;
        /**
         * Returns all founded element
         * @param {SupportedSelector} selector - selector supported by current implementation
         * @return {Promise<EyesWrappedElement[]>}
         */
        findElements(selector: SupportedSelector): Promise<EyesWrappedElement[]>;
    }
    namespace EyesElementFinder {
        export { Logger, EyesWrappedDriver, UnwrappedDriver, EyesWrappedElement, SupportedElement, EyesSelector, SupportedSelector, SpecsElementFinder };
    }
    /**
     * The object which implements the lowest-level functions to work with element finder
     */
    type SpecsElementFinder = {
        /**
         * - return found element
         */
        findElement: (driver: UnwrappedDriver, selector: SupportedSelector) => EyesWrappedElement;
        /**
         * - return found elements
         */
        findElements: (driver: UnwrappedDriver, selector: SupportedSelector) => EyesWrappedElement;
        /**
         * - return wrapped element instance
         */
        createElement: (logger: Logger, driver: EyesWrappedDriver, element: SupportedElement, selector: SupportedSelector) => EyesWrappedElement;
        /**
         * - translate cross SDK selector to SDK specific selector
         */
        toSupportedSelector: (selector: EyesSelector) => SupportedSelector;
        /**
         * - translate SDK specific selector to cross SDK selector
         */
        toEyesSelector: (selector: SupportedSelector) => EyesSelector;
    };
    type SupportedSelector = {
        "": any;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type Logger = import("lib/logging/Logger");
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type UnwrappedDriver = {
        "": any;
    };
    type SupportedElement = {
        "": any;
    };
    type EyesSelector = {
        type: "xpath" | "css";
        selector: string;
    };
}
declare module "lib/wrappers/EyesDriverController" {
    export = EyesDriverController;
    /**
     * @typedef {import('./EyesWrappedDriver')} EyesWrappedDriver
     * @typedef {import('./EyesWrappedDriver').UnwrappedDriver} UnwrappedDriver
     */
    /**
     * The object which implements the lowest-level functions to work with element finder
     * @typedef SpecsDriverController
     * @prop {(driver: UnwrappedDriver) => Promise<{x: number, y: number}>} getWindowLocation - return location of the window on the screen
     * @prop {(driver: UnwrappedDriver, location: {x: number, y: number}) => Promise<void>} setWindowLocation - set location of the window on the screen
     * @prop {(driver: UnwrappedDriver) => Promise<{width: number, height: number}>} getWindowSize - return size of the window
     * @prop {(driver: UnwrappedDriver, location: {width: number, height: number}) => Promise<void>} setWindowSize - set size of the window
     * @prop {(driver: UnwrappedDriver) => Promise<'landscape'|'portrait'>} getOrientation - return string which represents screen orientation
     * @prop {(driver: UnwrappedDriver) => Promise<boolean>} isMobile - true if a mobile device, false otherwise
     * @prop {(driver: UnwrappedDriver) => Promise<boolean>} isAndroid - true if an Android device, false otherwise
     * @prop {(driver: UnwrappedDriver) => Promise<boolean>} isIOS - true if an iOS device, false otherwise
     * @prop {(driver: UnwrappedDriver) => Promise<boolean>} isNative - true if a native app, false otherwise
     * @prop {(driver: UnwrappedDriver) => Promise<string>} getPlatformVersion - return version of the device's platform
     * @prop {(driver: UnwrappedDriver) => Promise<string>} getSessionId - return id of the running session
     * @prop {(driver: UnwrappedDriver) => Promise<string|Buffer>} takeScreenshot - return screenshot of the viewport
     * @prop {(driver: UnwrappedDriver) => Promise<string>} getTitle - return page title
     * @prop {(driver: UnwrappedDriver) => Promise<string>} getSource - return current url
     * @prop {(driver: UnwrappedDriver, url: string) => Promise<void>} visit - redirect to the specified url
     */
    class EyesDriverController {
        /**
         * @param {SpecsDriverController} SpecsDriverController - specifications for the specific framework
         * @return {EyesDriverController} specialized version of this class
         */
        static specialize(SpecsDriverController: SpecsDriverController): EyesDriverController;
        /** @type {SpecsDriverController} */
        static get specs(): SpecsDriverController;
        /**
         * Construct a driver controller instance
         * @param {Logger} logger - logger instance
         * @param {EyesWrappedDriver} driver - wrapped driver instance
         */
        constructor(logger: any, driver: EyesWrappedDriver);
        /** @type {SpecsDriverController} */
        get specs(): SpecsDriverController;
        _logger: any;
        _driver: import("lib/wrappers/EyesWrappedDriver");
        /**
         * Get window location
         * @return {Promise<Location>} windows location
         */
        getWindowLocation(): Promise<Location>;
        /**
         * Set window location
         * @param {Location} location - required  windows location
         * @returns {Promise<void>}
         */
        setWindowLocation(location: Location): Promise<void>;
        /**
         * Get window size
         * @return {Promise<RectangleSize>} windows size
         */
        getWindowSize(): Promise<import("lib/geometry/RectangleSize")>;
        /**
         * Set window size
         * @param {RectangleSize} size - required windows size
         * @returns {Promise<void>}
         */
        setWindowSize(size: import("lib/geometry/RectangleSize")): Promise<void>;
        /**
         * Take screenshot of the current viewport
         * @return {Promise<MutableImage>} image of screenshot
         */
        takeScreenshot(): Promise<import("lib/images/MutableImage")>;
        /**
         * Check if running in landscape orientation
         * @return {Promise<boolean>} true if landscape orientation detected, false otherwise
         */
        isLandscapeOrientation(): Promise<boolean>;
        /**
         * Check if running in mobile device
         * @return {Promise<boolean>} true if mobile, false otherwise
         */
        isMobile(): Promise<boolean>;
        /**
         * Check if running in mobile device with native context
         * @return {Promise<boolean>} true if native, false otherwise
         */
        isNative(): Promise<boolean>;
        /**
         * Get mobile OS if detected
         * @return {Promise<?string>} mobile OS if detected, null otherwise
         */
        getMobileOS(): Promise<string | null>;
        /**
         * Get browser name
         * @return {Promise<?string>} browser name if detected, null otherwise
         */
        getBrowserName(): Promise<string | null>;
        /**
         * Get browser version
         * @return {Promise<?string>} browser version if detected, null otherwise
         */
        getBrowserVersion(): Promise<string | null>;
        /**
         * Get AUT session ID
         * @return {Promise<string>} AUT session ID
         */
        getAUTSessionId(): Promise<string>;
        /**
         * Get user agent
         * @return {Promise<string>} user agent
         */
        getUserAgent(): Promise<string>;
        /**
         * Get current page title
         * @return {Promise<string>} current page title
         */
        getTitle(): Promise<string>;
        /**
         * Get current page url
         * @return {Promise<string>} current page url
         */
        getSource(): Promise<string>;
    }
    namespace EyesDriverController {
        export { EyesWrappedDriver, UnwrappedDriver, SpecsDriverController };
    }
    /**
     * The object which implements the lowest-level functions to work with element finder
     */
    type SpecsDriverController = {
        /**
         * - return location of the window on the screen
         */
        getWindowLocation: (driver: UnwrappedDriver) => Promise<{
            x: number;
            y: number;
        }>;
        /**
         * - set location of the window on the screen
         */
        setWindowLocation: (driver: UnwrappedDriver, location: {
            x: number;
            y: number;
        }) => Promise<void>;
        /**
         * - return size of the window
         */
        getWindowSize: (driver: UnwrappedDriver) => Promise<{
            width: number;
            height: number;
        }>;
        /**
         * - set size of the window
         */
        setWindowSize: (driver: UnwrappedDriver, location: {
            width: number;
            height: number;
        }) => Promise<void>;
        /**
         * - return string which represents screen orientation
         */
        getOrientation: (driver: UnwrappedDriver) => Promise<'landscape' | 'portrait'>;
        /**
         * - true if a mobile device, false otherwise
         */
        isMobile: (driver: UnwrappedDriver) => Promise<boolean>;
        /**
         * - true if an Android device, false otherwise
         */
        isAndroid: (driver: UnwrappedDriver) => Promise<boolean>;
        /**
         * - true if an iOS device, false otherwise
         */
        isIOS: (driver: UnwrappedDriver) => Promise<boolean>;
        /**
         * - true if a native app, false otherwise
         */
        isNative: (driver: UnwrappedDriver) => Promise<boolean>;
        /**
         * - return version of the device's platform
         */
        getPlatformVersion: (driver: UnwrappedDriver) => Promise<string>;
        /**
         * - return id of the running session
         */
        getSessionId: (driver: UnwrappedDriver) => Promise<string>;
        /**
         * - return screenshot of the viewport
         */
        takeScreenshot: (driver: UnwrappedDriver) => Promise<string | Buffer>;
        /**
         * - return page title
         */
        getTitle: (driver: UnwrappedDriver) => Promise<string>;
        /**
         * - return current url
         */
        getSource: (driver: UnwrappedDriver) => Promise<string>;
        /**
         * - redirect to the specified url
         */
        visit: (driver: UnwrappedDriver, url: string) => Promise<void>;
    };
    const Location: typeof import("lib/geometry/Location");
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type UnwrappedDriver = {
        "": any;
    };
}
declare module "lib/wrappers/EyesWrappedDriver" {
    export = EyesWrappedDriver;
    /**
     * @typedef {import('../logging/Logger')} Logger
     * @typedef {import('./EyesJsExecutor').SpecsJsExecutor} SpecsJsExecutor
     * @typedef {import('./EyesBrowsingContext').SpecsBrowsingContext} SpecsBrowsingContext
     * @typedef {import('./EyesElementFinder').SpecsElementFinder} SpecsElementFinder
     * @typedef {import('./EyesDriverController').SpecsDriverController} SpecsDriverController
     */
    /**
     * @typedef UnwrappedDriver
     * @prop {?}
     */
    /**
     * @typedef DriverOverrides
     * @prop {(reference) => Promise<*>} switchToFrame
     * @prop {() => Promise<*>} switchToParentFrame
     * @prop {(url: string) => Promise<*>} visit
     *
     */
    /**
     * @typedef {SpecsJsExecutor & SpecsBrowsingContext & SpecsElementFinder & SpecsDriverController} SpecsWrappedDriver
     */
    class EyesWrappedDriver {
        /**
         * @param {SpecsWrappedDriver} SpecsWrappedDriver - specifications for the specific framework
         * @return {EyesWrappedDriver} specialized version of this class
         */
        static specialize(SpecsWrappedDriver: SpecsWrappedDriver, overrides: any): EyesWrappedDriver;
        /** @type {Object<string, Function>} */
        static get overrides(): {
            [x: string]: Function;
        };
        /** @type {SpecsWrappedDriver} */
        static get specs(): import("lib/wrappers/EyesJsExecutor").SpecsJsExecutor & import("lib/wrappers/EyesBrowsingContext").SpecsBrowsingContext & import("lib/wrappers/EyesElementFinder").SpecsElementFinder & import("lib/wrappers/EyesDriverController").SpecsDriverController;
        /** @type {EyesJsExecutor} */
        static get JsExecutor(): import("lib/wrappers/EyesJsExecutor");
        /** @type {EyesBrowsingContext} */
        static get BrowsingContext(): import("lib/wrappers/EyesBrowsingContext");
        /** @type {EyesElementFinder} */
        static get ElementFinder(): import("lib/wrappers/EyesElementFinder");
        /** @type {EyesDriverController} */
        static get DriverController(): import("lib/wrappers/EyesDriverController");
        /**
         * Construct wrapped driver instance and initialize all of helpers interfaces
         * @param {Logger} logger - logger instance
         * @param {UnwrappedDriver} driver - specific driver object for the framework
         */
        constructor(logger: Logger, driver: UnwrappedDriver);
        /** @type {Object<string, Function>} */
        get overrides(): {
            [x: string]: Function;
        };
        /** @type {SpecsWrappedDriver} */
        get specs(): import("lib/wrappers/EyesJsExecutor").SpecsJsExecutor & import("lib/wrappers/EyesBrowsingContext").SpecsBrowsingContext & import("lib/wrappers/EyesElementFinder").SpecsElementFinder & import("lib/wrappers/EyesDriverController").SpecsDriverController;
        /** @type {EyesJsExecutor} */
        get JsExecutor(): import("lib/wrappers/EyesJsExecutor");
        /** @type {EyesBrowsingContext} */
        get BrowsingContext(): import("lib/wrappers/EyesBrowsingContext");
        /** @type {EyesElementFinder} */
        get ElementFinder(): import("lib/wrappers/EyesElementFinder");
        /** @type {EyesDriverController} */
        get DriverController(): import("lib/wrappers/EyesDriverController");
        _logger: import("lib/logging/Logger");
        _driver: any;
        _executor: any;
        _finder: any;
        _context: any;
        _controller: any;
        _proxy: EyesWrappedDriver;
        /**
         * Unwrapped driver for specific SDK
         * @type {UnwrappedDriver}
         */
        get unwrapped(): UnwrappedDriver;
        /**
         * Implementation of JavaScript executor interface for specific SDK
         * @type {EyesJsExecutor}
         */
        get executor(): import("lib/wrappers/EyesJsExecutor");
        /**
         * Implementation of browsing context switcher interface for specific SDK
         * @type {EyesBrowsingContext}
         */
        get context(): import("lib/wrappers/EyesBrowsingContext");
        /**
         * Implementation of element finder interface for specific SDK
         * @type {EyesElementFinder}
         */
        get finder(): import("lib/wrappers/EyesElementFinder");
        /**
         * Implementation of driver controller interface for specific SDK
         * @type {EyesDriverController}
         */
        get controller(): import("lib/wrappers/EyesDriverController");
    }
    namespace EyesWrappedDriver {
        export { Logger, SpecsJsExecutor, SpecsBrowsingContext, SpecsElementFinder, SpecsDriverController, UnwrappedDriver, DriverOverrides, SpecsWrappedDriver };
    }
    type UnwrappedDriver = {
        "": unknown;
    };
    type SpecsWrappedDriver = import("lib/wrappers/EyesJsExecutor").SpecsJsExecutor & import("lib/wrappers/EyesBrowsingContext").SpecsBrowsingContext & import("lib/wrappers/EyesElementFinder").SpecsElementFinder & import("lib/wrappers/EyesDriverController").SpecsDriverController;
    type Logger = import("lib/logging/Logger");
    type SpecsJsExecutor = {
        /**
         * - execute script and return result
         */
        executeScript: (driver: any, script: TimerHandler, ...args: any[]) => Promise<any>;
        /**
         * - makes the driver sleep for the given amount of time in ms
         */
        sleep: (driver: any, ms: number) => Promise<void>;
    };
    type SpecsBrowsingContext = {
        /**
         * - return true if two frames are equal, false otherwise
         */
        isEqualFrames: (leftFrame: string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame"), rightFrame: string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame")) => Promise<boolean>;
        /**
         * - return new frame reference
         */
        createFrameReference: (reference: string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame")) => import("lib/frames/Frame");
        /**
         * - switch to frame specified with a reference
         */
        switchToFrame: (driver: any, reference: string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame")) => void;
        /**
         * - switch to parent frame
         */
        switchToParentFrame: (driver: any) => void;
    };
    type SpecsElementFinder = {
        /**
         * - return found element
         */
        findElement: (driver: UnwrappedDriver, selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector) => import("lib/wrappers/EyesWrappedElement");
        /**
         * - return found elements
         */
        findElements: (driver: UnwrappedDriver, selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector) => import("lib/wrappers/EyesWrappedElement");
        /**
         * - return wrapped element instance
         */
        createElement: (logger: import("lib/logging/Logger"), driver: EyesWrappedDriver, element: import("lib/wrappers/EyesWrappedElement").SupportedElement, selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector) => import("lib/wrappers/EyesWrappedElement");
        /**
         * - translate cross SDK selector to SDK specific selector
         */
        toSupportedSelector: (selector: import("lib/wrappers/EyesWrappedElement").EyesSelector) => import("lib/wrappers/EyesWrappedElement").SupportedSelector;
        /**
         * - translate SDK specific selector to cross SDK selector
         */
        toEyesSelector: (selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector) => import("lib/wrappers/EyesWrappedElement").EyesSelector;
    };
    type SpecsDriverController = {
        /**
         * - return location of the window on the screen
         */
        getWindowLocation: (driver: UnwrappedDriver) => Promise<{
            x: number;
            y: number;
        }>;
        /**
         * - set location of the window on the screen
         */
        setWindowLocation: (driver: UnwrappedDriver, location: {
            x: number;
            y: number;
        }) => Promise<void>;
        /**
         * - return size of the window
         */
        getWindowSize: (driver: UnwrappedDriver) => Promise<{
            width: number;
            height: number;
        }>;
        /**
         * - set size of the window
         */
        setWindowSize: (driver: UnwrappedDriver, location: {
            width: number;
            height: number;
        }) => Promise<void>;
        /**
         * - return string which represents screen orientation
         */
        getOrientation: (driver: UnwrappedDriver) => Promise<"landscape" | "portrait">;
        /**
         * - true if a mobile device, false otherwise
         */
        isMobile: (driver: UnwrappedDriver) => Promise<boolean>;
        /**
         * - true if an Android device, false otherwise
         */
        isAndroid: (driver: UnwrappedDriver) => Promise<boolean>;
        /**
         * - true if an iOS device, false otherwise
         */
        isIOS: (driver: UnwrappedDriver) => Promise<boolean>;
        /**
         * - true if a native app, false otherwise
         */
        isNative: (driver: UnwrappedDriver) => Promise<boolean>;
        /**
         * - return version of the device's platform
         */
        getPlatformVersion: (driver: UnwrappedDriver) => Promise<string>;
        /**
         * - return id of the running session
         */
        getSessionId: (driver: UnwrappedDriver) => Promise<string>;
        /**
         * - return screenshot of the viewport
         */
        takeScreenshot: (driver: UnwrappedDriver) => Promise<string | Buffer>;
        /**
         * - return page title
         */
        getTitle: (driver: UnwrappedDriver) => Promise<string>;
        /**
         * - return current url
         */
        getSource: (driver: UnwrappedDriver) => Promise<string>;
        /**
         * - redirect to the specified url
         */
        visit: (driver: UnwrappedDriver, url: string) => Promise<void>;
    };
    type DriverOverrides = {
        switchToFrame: (reference: any) => Promise<any>;
        switchToParentFrame: () => Promise<any>;
        visit: (url: string) => Promise<any>;
    };
}
declare module "lib/frames/Frame" {
    export = Frame;
    /**
     * @typedef {import('../logging/Logger')} Logger
     * @typedef {import('../geometry/Location')} Location
     * @typedef {import('../geometry/RectangleSize')} RectangleSize
     * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
     * @typedef {import('../wrappers/EyesWrappedElement').SupportedElement} SupportedElement
     * @typedef {import('../wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
     * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
     */
    /**
     * Reference to the frame, index of the frame in the current context, name or id of the element,
     * framework element object, {@link EyesWrappedElement} implementation object
     * @typedef {number|string|SupportedSelector|SupportedElement|EyesWrappedElement|Frame} FrameReference
     */
    /**
     * @typedef SpecsFrame
     * @prop {(selector) => boolean} isSelector - return true if the value is a valid selector, false otherwise
     * @prop {(element) => boolean} isCompatibleElement - return true if the value is an element, false otherwise
     * @prop {(leftElement: SupportedElement|EyesWrappedElement, rightElement: SupportedElement|EyesWrappedElement) => Promise<boolean>} isEqualElements - return true if elements are equal, false otherwise
     * @prop {(logger: Logger, driver: EyesWrappedDriver, element: SupportedElement, selector: SupportedSelector) => EyesWrappedElement} createElement - return wrapped element instance
     */
    /**
     * Encapsulates a frame/iframe. This is a generic type class,
     * and it's actual type is determined by the element used by the user in
     * order to switch into the frame.
     */
    class Frame {
        /**
         * @param {SpecsFrame} SpecsFrame
         * @return {Frame} specialized version of this class
         */
        static specialize(SpecsFrame: SpecsFrame): Frame;
        /** @type {SpecsFrame} */
        static get specs(): SpecsFrame;
        /**
         * Construct frame reference object which could be later initialized to the full frame object
         * @param {FrameReference} reference - reference to the frame on its parent context
         * @param {EyesWrappedElement} scrollRootElement - scroll root element
         * @return {Frame} frame reference object
         */
        static fromReference(reference: FrameReference, scrollRootElement: EyesWrappedElement): Frame;
        /**
         * Check value for belonging to the {@link FrameReference} type
         * @param {*} reference - value to check if is it a reference
         * @return {boolean} true if value is a valid reference, otherwise false
         */
        static isReference(reference: any): boolean;
        /**
         * Equality check for two frame objects or frame elements
         * @param {Frame|EyesWrappedDriver} leftFrame - frame object or frame element
         * @param {Frame|EyesWrappedDriver} rightFrame - frame object or frame element
         * @return {Promise<boolean>} true if frames are described the same frame element, otherwise false
         */
        static equals(leftFrame: Frame | EyesWrappedDriver, rightFrame: Frame | EyesWrappedDriver): Promise<boolean>;
        /**
         * Create frame from components
         * @param {Logger} logger - logger instance
         * @param {EyesWrappedDriver} driver - wrapped driver
         * @param {Object} frame - frame components
         * @param {EyesWrappedElement} frame.element - frame element, used as a element to switch into the frame
         * @param {Location} frame.location - location of the frame within the current frame
         * @param {RectangleSize} frame.size - frame element size (i.e., the size of the frame on the screen, not the internal document size)
         * @param {RectangleSize} frame.innerSize - frame element inner size (i.e., the size of the frame actual size, without borders)
         * @param {Location} frame.parentScrollLocation - scroll location of the frame
         * @param {EyesWrappedElement} frame.scrollRootElement - scroll root element
         */
        constructor(logger: Logger, driver: EyesWrappedDriver, frame: {
            element: EyesWrappedElement;
            location: Location;
            size: RectangleSize;
            innerSize: RectangleSize;
            parentScrollLocation: Location;
            scrollRootElement: EyesWrappedElement;
        });
        /** @type {SpecsFrame} */
        get specs(): SpecsFrame;
        _reference: {
            element: EyesWrappedElement;
            location: Location;
            size: RectangleSize;
            innerSize: RectangleSize;
            parentScrollLocation: Location;
            scrollRootElement: EyesWrappedElement;
        };
        _element: import("lib/wrappers/EyesWrappedElement");
        _location: import("lib/geometry/Location");
        _size: import("lib/geometry/RectangleSize");
        _innerSize: import("lib/geometry/RectangleSize");
        _parentScrollLocation: import("lib/geometry/Location");
        _scrollRootElement: import("lib/wrappers/EyesWrappedElement");
        _driver: import("lib/wrappers/EyesWrappedDriver");
        _logger: import("lib/logging/Logger");
        /**
         * @return {EyesWrappedElement}
         */
        get element(): import("lib/wrappers/EyesWrappedElement");
        /**
         * @return {Location}
         */
        get location(): import("lib/geometry/Location");
        /**
         * @return {RectangleSize}
         */
        get size(): import("lib/geometry/RectangleSize");
        /**
         * @return {RectangleSize}
         */
        get innerSize(): import("lib/geometry/RectangleSize");
        /**
         * @return {Location}
         */
        get parentScrollLocation(): import("lib/geometry/Location");
        /**
         * @param {!EyesWrappedElement} scrollRootElement
         */
        set scrollRootElement(arg: import("lib/wrappers/EyesWrappedElement"));
        /**
         * @return {EyesWrappedElement}
         */
        get scrollRootElement(): import("lib/wrappers/EyesWrappedElement");
        /**
         * Create reference from current frame object
         * @return {Frame} frame reference object
         */
        toReference(): Frame;
        /**
         * Equality check for two frame objects or frame elements
         * @param {Frame|EyesWrappedDriver} otherFrame - frame object or frame element
         * @return {Promise<boolean>} true if frames are described the same frame element, otherwise false
         */
        equals(otherFrame: Frame | EyesWrappedDriver): Promise<boolean>;
        /**
         * Initialize frame reference by finding frame element and calculate metrics
         * @param {Logger} logger - logger instance
         * @param {EyesWrappedDriver} driver - wrapped driver targeted on parent context
         * @return {this} initialized frame object
         */
        init(logger: Logger, driver: EyesWrappedDriver, parentFrame: any): this;
        /**
         * Recalculate frame object metrics. Driver should be targeted on a parent context
         * @return {this} this frame object
         */
        refresh(parentFrame: any): this;
        /**
         * @return {Promise<void>}
         */
        hideScrollbars(): Promise<void>;
        /**
         * @return {Promise<void>}
         */
        restoreScrollbars(): Promise<void>;
        /**
         * @param {positionProvider} positionProvider
         * @return {Promise<void>}
         */
        preservePosition(positionProvider: any): Promise<void>;
        /**
         * @param {positionProvider} positionProvider
         * @return {Promise<void>}
         */
        restorePosition(positionProvider: any): Promise<void>;
    }
    namespace Frame {
        export { Logger, Location, RectangleSize, EyesWrappedElement, SupportedElement, SupportedSelector, EyesWrappedDriver, FrameReference, SpecsFrame };
    }
    type SpecsFrame = {
        /**
         * - return true if the value is a valid selector, false otherwise
         */
        isSelector: (selector: any) => boolean;
        /**
         * - return true if the value is an element, false otherwise
         */
        isCompatibleElement: (element: any) => boolean;
        /**
         * - return true if elements are equal, false otherwise
         */
        isEqualElements: (leftElement: SupportedElement | EyesWrappedElement, rightElement: SupportedElement | EyesWrappedElement) => Promise<boolean>;
        /**
         * - return wrapped element instance
         */
        createElement: (logger: Logger, driver: EyesWrappedDriver, element: SupportedElement, selector: SupportedSelector) => EyesWrappedElement;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    const Location: typeof import("lib/geometry/Location");
    const RectangleSize: typeof import("lib/geometry/RectangleSize");
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type Logger = import("lib/logging/Logger");
    /**
     * Reference to the frame, index of the frame in the current context, name or id of the element,
     * framework element object, {@link EyesWrappedElement} implementation object
     */
    type FrameReference = string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame");
    type Location = import("lib/geometry/Location");
    type RectangleSize = import("lib/geometry/RectangleSize");
    type SupportedElement = {
        "": any;
    };
    type SupportedSelector = {
        "": any;
    };
}
declare module "lib/wrappers/EyesBrowsingContext" {
    export = EyesBrowsingContext;
    /**
     * @typedef {import('../logging/Logger')} Logger
     * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
     * @typedef {import('../wrappers/EyesWrappedDriver').unwrapped} UnwrappedDriver
     * @typedef {import('../frames/Frame').FrameReference} FrameReference
     * @typedef {import('../frames/Frame')} Frame
     */
    /**
     * The object which implements the lowest-level functions to work with browsing context
     * @typedef SpecsBrowsingContext
     * @prop {(leftFrame: FrameReference, rightFrame: FrameReference) => Promise<boolean>} isEqualFrames - return true if two frames are equal, false otherwise
     * @prop {(reference: FrameReference) => Frame} createFrameReference - return new frame reference
     * @prop {(driver: UnwrappedDriver, reference: FrameReference) => void} switchToFrame - switch to frame specified with a reference
     * @prop {(driver: UnwrappedDriver) => void} switchToParentFrame - switch to parent frame
     */
    class EyesBrowsingContext {
        /**
         * @param {SpecsBrowsingContext} SpecsBrowsingContext - specifications for the specific framework
         * @return {EyesBrowsingContext} specialized version of this class
         */
        static specialize(SpecsBrowsingContext: SpecsBrowsingContext): EyesBrowsingContext;
        /** @type {SpecsBrowsingContext} */
        static get specs(): SpecsBrowsingContext;
        /**
         * Construct browsing context instance
         * @param {Logger} logger - logger instance
         * @param {EyesWrappedDriver} driver - parent driver instance
         */
        constructor(logger: Logger, driver: EyesWrappedDriver);
        /** @type {SpecsBrowsingContext} */
        get specs(): SpecsBrowsingContext;
        _logger: import("lib/logging/Logger");
        _driver: import("lib/wrappers/EyesWrappedDriver");
        _topContext: import("lib/frames/Frame");
        _frameChain: import("lib/frames/FrameChain");
        /**
         * Representation of the top-level context
         * @type {Frame}
         */
        get topContext(): import("lib/frames/Frame");
        /**
         * Copy of the current frame chain
         * @type {FrameChain}
         */
        get frameChain(): import("lib/frames/FrameChain");
        /**
         * Clear current frame chain
         */
        reset(): void;
        /**
         * Switch to the child (frame) context by reference
         * @param {FrameReference} reference - reference to the frame
         * @return {Promise<void>}
         */
        frame(reference: FrameReference): Promise<void>;
        /**
         * Switch to the top level context
         * @return {Promise<void>}
         */
        frameDefault(): Promise<void>;
        /**
         * Switch to the parent context
         * @param {number} [elevation=1] - elevation level
         * @return {Promise<void>}
         */
        frameParent(elevation?: number): Promise<void>;
        /**
         * Switch to the specified frame path from the top level
         * @param {Iterable<FrameReference>} path
         * @return {Promise<void>}
         */
        frames(path: Iterable<FrameReference>): Promise<void>;
        /**
         * Append the specified frame path to the current context
         * @param {Iterable<FrameReference>} path
         * @return {Promise<void>}
         */
        framesAppend(path: Iterable<FrameReference>): Promise<void>;
        /**
         * Refresh frame chain from the real driver target context
         * @return {Promise<*>}
         */
        framesRefresh(): Promise<any>;
        /**
         * Perform an operation in the browsing context with required frame chain and return it back after operation is finished
         * @param {Iterable<FrameReference>} path
         * @param {Function} operation
         * @return {Promise<any>} promise which resolve whatever an operation will resolve
         */
        framesSwitchAndReturn(framePath: any, operation: Function): Promise<any>;
        /**
         * Perform an operation in the browsing context with appended frame chain and return it back after operation is finished
         * @param {Iterable<FrameReference>} path
         * @param {Function} operation
         * @return {Promise<any>} promise which resolve whatever an operation will resolve
         */
        framesAppendAndReturn(framePath: any, operation: Function): Promise<any>;
    }
    namespace EyesBrowsingContext {
        export { Logger, EyesWrappedDriver, UnwrappedDriver, FrameReference, Frame, SpecsBrowsingContext };
    }
    /**
     * The object which implements the lowest-level functions to work with browsing context
     */
    type SpecsBrowsingContext = {
        /**
         * - return true if two frames are equal, false otherwise
         */
        isEqualFrames: (leftFrame: FrameReference, rightFrame: FrameReference) => Promise<boolean>;
        /**
         * - return new frame reference
         */
        createFrameReference: (reference: FrameReference) => Frame;
        /**
         * - switch to frame specified with a reference
         */
        switchToFrame: (driver: any, reference: FrameReference) => void;
        /**
         * - switch to parent frame
         */
        switchToParentFrame: (driver: any) => void;
    };
    type FrameReference = string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame");
    type Logger = import("lib/logging/Logger");
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type UnwrappedDriver = any;
    type Frame = import("lib/frames/Frame");
}
declare module "lib/positioning/PositionProvider" {
    export = PositionProvider;
    /**
     * Encapsulates page/element positioning.
     *
     * @abstract
     */
    class PositionProvider {
        /**
         * @return {Promise<Location>} - The current position, or {@code null} if position is not available.
         */
        getCurrentPosition(): Promise<Location>;
        /**
         * Go to the specified location.
         *
         * @param {Location} location - The position to set.
         * @return {Promise<Location>}
         */
        setPosition(location: Location): Promise<Location>;
        /**
         * @return {Promise<RectangleSize>} - The entire size of the container which the position is relative to.
         */
        getEntireSize(): Promise<any>;
        /**
         * Get the current state of the position provider. This is different from {@link #getCurrentPosition()} in
         * that the state of the position provider might include other model than just the coordinates.
         * For example a CSS translation based position provider (in WebDriver based SDKs), might save the
         * entire "transform" style value as its state.
         *
         * @return {Promise<PositionMemento>} The current state of the position provider, which can later be restored by
         *   passing it as a parameter to {@link #restoreState}.
         */
        getState(): Promise<any>;
        /**
         * Restores the state of the position provider to the state provided as a parameter.
         *
         * @param {PositionMemento} state - The state to restore to.
         * @return {Promise}
         */
        restoreState(state: any): Promise<any>;
        /**
         * @return {*}
         */
        getScrolledElement(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/EyesUtils" {
    export type Logger = import("lib/logging/Logger");
    export type EyesBrowsingContext = import("lib/wrappers/EyesBrowsingContext");
    export type EyesDriverController = import("lib/wrappers/EyesDriverController");
    export type EyesElementFinder = import("lib/wrappers/EyesElementFinder");
    export type EyesJsExecutor = import("lib/wrappers/EyesJsExecutor");
    export type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    export type UnwrappedElement = {
        "": any;
    };
    export type SupportedSelector = {
        "": any;
    };
    export type PositionProvider = import("lib/positioning/PositionProvider");
    export type ContextInfo = {
        /**
         * - is root context
         */
        isRoot: boolean;
        /**
         * - is cors context related to the parent
         */
        isCORS: boolean;
        /**
         * - context document element
         */
        document: UnwrappedElement;
        /**
         * - xpath to the frame element related to the parent context
         *
         * Extract information about relations between current context and its parent
         */
        frameSelector: string;
    };
    export type FrameInfo = {
        /**
         * - is cors frame related to the current context
         */
        isCORS: boolean;
        /**
         * - frame element
         */
        element: UnwrappedElement;
        /**
         * - xpath to the frame element related to the parent context
         *
         * Find by context information
         */
        selector: string;
    };
    /**
     * @typedef {import('./logging/Logger')} Logger
     * @typedef {import('./wrappers/EyesBrowsingContext')} EyesBrowsingContext
     * @typedef {import('./wrappers/EyesDriverController')} EyesDriverController
     * @typedef {import('./wrappers/EyesElementFinder')} EyesElementFinder
     * @typedef {import('./wrappers/EyesJsExecutor')} EyesJsExecutor
     * @typedef {import('./wrappers/EyesWrappedElement')} EyesWrappedElement
     * @typedef {import('./wrappers/EyesWrappedElement').UnwrappedElement} UnwrappedElement
     * @typedef {import('./wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
     * @typedef {import('./positioning/PositionProvider')} PositionProvider
     */
    /**
     * Returns viewport size of current context
     * @param {Logger} _logger - logger instance
     * @param {Object} driver
     * @param {EyesJsExecutor} driver.executor - js executor
     * @return {RectangleSize} viewport size
     */
    export function getViewportSize(_logger: Logger, { executor }: {
        executor: EyesJsExecutor;
    }): import("lib/geometry/RectangleSize");
    /**
     * Set viewport size of the window
     * @param {Logger} logger - logger instance
     * @param {Object} driver
     * @param {EyesDriverController} driver.controller - driver controller
     * @param {EyesJsExecutor} driver.executor - js executor
     * @param {EyesBrowsingContext} driver.context - browsing context
     * @param {RectangleSize} requiredViewportSize - required viewport size to set
     */
    export function setViewportSize(logger: Logger, { controller, executor, context }: {
        controller: EyesDriverController;
        executor: EyesJsExecutor;
        context: EyesBrowsingContext;
    }, requiredViewportSize: import("lib/geometry/RectangleSize")): Promise<any>;
    /**
     * Get top-level context viewport region, where location of the region is top-level scroll position
     * @param {Logger} logger - logger instance
     * @param {Object} driver
     * @param {EyesDriverController} driver.controller - driver controller
     * @param {EyesJsExecutor} driver.executor - js executor
     * @param {EyesBrowsingContext} driver.context - browsing context
     * @return {Region} top-level context region
     */
    export function getTopContextViewportRect(logger: Logger, { controller, executor, context }: {
        controller: EyesDriverController;
        executor: EyesJsExecutor;
        context: EyesBrowsingContext;
    }): import("lib/geometry/Region");
    /**
     * Get top-level context viewport size with fallback to the window size if fail to extract top-level context viewport size
     * @param {Logger} logger - logger instance
     * @param {Object} driver
     * @param {EyesDriverController} driver.controller - driver controller
     * @param {EyesJsExecutor} driver.executor - js executor
     * @param {EyesBrowsingContext} driver.context - browsing context
     * @return {Region} top-level context size
     */
    export function getTopContextViewportSize(logger: Logger, { controller, context, executor }: {
        controller: EyesDriverController;
        executor: EyesJsExecutor;
        context: EyesBrowsingContext;
    }): import("lib/geometry/Region");
    /**
     * Get current context content size
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @return {Region} current context content size
     */
    export function getCurrentFrameContentEntireSize(_logger: Logger, executor: EyesJsExecutor): import("lib/geometry/Region");
    /**
     * Get content size of the specified element
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} element - element to get size
     * @returns {Promise<Region>} element content size
     */
    export function getElementEntireSize(_logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<import("lib/geometry/Region")>;
    /**
     * Get element client rect relative to the current context
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} element - element to get client rect
     * @return {Promise<Region>} element client rect
     */
    export function getElementClientRect(_logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<import("lib/geometry/Region")>;
    /**
     * Get element rect relative to the current context
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} element - element to get rect
     * @return {Promise<Region>} element rect
     */
    export function getElementRect(_logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<import("lib/geometry/Region")>;
    /**
     * Extract values of specified properties for specified element
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {string[]} properties - names of properties to extract
     * @param {EyesWrappedElement|UnwrappedElement} element - element to extract properties
     * @return {*[]} extracted values
     */
    export function getElementProperties(_logger: Logger, executor: EyesJsExecutor, properties: string[], element: EyesWrappedElement | UnwrappedElement): any[];
    /**
     * Extract css values of specified css properties for specified element
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {string[]} properties - names of css properties to extract
     * @param {EyesWrappedElement|UnwrappedElement} element - element to extract css properties
     * @return {string[]} extracted css values
     */
    export function getElementCssProperties(_logger: Logger, executor: EyesJsExecutor, properties: string[], element: EyesWrappedElement | UnwrappedElement): string[];
    /**
     * Get device pixel ratio
     * @param {Logger} _logger - logger instance
     * @param {Object} driver
     * @param {EyesJsExecutor} driver.executor - js executor
     * @return {Promise<number>} device pixel ratio
     */
    export function getDevicePixelRatio(_logger: Logger, { executor }: {
        executor: EyesJsExecutor;
    }): Promise<number>;
    /**
     * Get mobile device pixel ratio
     * @param {Logger} _logger - logger instance
     * @param {Object} driver
     * @param {EyesDriverController} driver.controller - driver controller
     * @return {Promise<number>} mobile device pixel ratio
     */
    export function getMobilePixelRatio(_logger: Logger, { controller }: {
        controller: EyesDriverController;
    }, viewportSize: any): Promise<number>;
    export function getInnerOffsets(_logger: any, executor: any, element: any): Promise<import("lib/geometry/Location")>;
    /**
     * Get top-level context scroll position
     * @param {Logger} logger - logger instance
     * @param {Object} driver
     * @param {EyesJsExecutor} driver.executor - js executor
     * @param {EyesBrowsingContext} driver.context - browsing context
     * @return {Promise<Location>} top-level context scroll position
     */
    export function getTopContextScrollLocation(logger: Logger, { context, executor }: {
        executor: EyesJsExecutor;
        context: EyesBrowsingContext;
    }): Promise<Location>;
    /**
     * Get current context scroll position of the specified element or default scrolling element
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} [element] - element to extract scroll position
     * @return {Promise<Location>} scroll position
     */
    export function getScrollLocation(_logger: Logger, executor: EyesJsExecutor, element?: EyesWrappedElement | UnwrappedElement): Promise<Location>;
    /**
     * Set current context scroll position for the specified element or default scrolling element
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {Location} location - required scroll position
     * @param {EyesWrappedElement|UnwrappedElement} [element] - element to set scroll position
     * @return {Promise<Location>} actual scroll position after set
     */
    export function scrollTo(_logger: Logger, executor: EyesJsExecutor, location: Location, element?: EyesWrappedElement | UnwrappedElement): Promise<Location>;
    /**
     * Get transforms of the specified element or default scrolling element
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} [element] - element to extract transforms
     * @return {Promise<Object>} element transforms
     */
    export function getTransforms(_logger: Logger, executor: EyesJsExecutor, element?: EyesWrappedElement | UnwrappedElement): Promise<any>;
    /**
     * Set transforms for the specified element or default scrolling element
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {Object} transforms - collection of transforms to set
     * @param {EyesWrappedElement|UnwrappedElement} [element] - element to set transforms
     */
    export function setTransforms(_logger: Logger, executor: EyesJsExecutor, transforms: any, element?: EyesWrappedElement | UnwrappedElement): Promise<any>;
    /**
     * Get translate position of the specified element or default scrolling element
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} [element] - element to extract translate position
     * @return {Promise<Location>} translate position
     */
    export function getTranslateLocation(_logger: Logger, executor: EyesJsExecutor, element?: EyesWrappedElement | UnwrappedElement): Promise<Location>;
    /**
     * Set translate position of the specified element or default scrolling element
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {Location} location - required translate position
     * @param {EyesWrappedElement|UnwrappedElement} [element] - element to set translate position
     * @return {Promise<Location>} actual translate position after set
     */
    export function translateTo(_logger: Logger, executor: EyesJsExecutor, location: Location, element?: EyesWrappedElement | UnwrappedElement): Promise<Location>;
    /**
     * Check if the specified element or default scrolling element is scrollable
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} [element] - element to check
     * @return {Promise<boolean>} true if element is scrollable, false otherwise
     */
    export function isScrollable(_logger: Logger, executor: EyesJsExecutor, element?: EyesWrappedElement | UnwrappedElement): Promise<boolean>;
    /**
     * Get default scroll root element for current context
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @return {Promise<UnwrappedElement>} default scroll root element
     */
    export function getScrollRootElement(_logger: Logger, executor: EyesJsExecutor): Promise<UnwrappedElement>;
    /**
     * Mark the specified element or default scrolling element with `data-applitools-scroll`
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} [element] - element to mark
     */
    export function markScrollRootElement(_logger: Logger, executor: EyesJsExecutor, element?: EyesWrappedElement | UnwrappedElement): Promise<any>;
    /**
     * Get overflow style property of the specified element
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} element - element to get overflow
     * @return {Promise<string?>} overflow value
     */
    export function getOverflow(_logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<string | null>;
    /**
     * Set overflow style property of the specified element
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} element - element to set overflow
     * @return {Promise<string?>} original overflow value before set
     */
    export function setOverflow(_logger: Logger, executor: EyesJsExecutor, overflow: any, element: EyesWrappedElement | UnwrappedElement): Promise<string | null>;
    /**
     * Blur the specified element or current active element
     * @param {Logger} logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} [element] - element to blur
     * @return {Promise<UnwrappedElement?>} actually blurred element if there is any
     */
    export function blurElement(logger: Logger, executor: EyesJsExecutor, element?: EyesWrappedElement | UnwrappedElement): Promise<UnwrappedElement | null>;
    /**
     * Focus the specified element
     * @param {Logger} logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} element - element to focus
     */
    export function focusElement(logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<any>;
    /**
     * Get element xpath selector related to the current context
     * @param {Logger} logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} element - element to calculate xpath
     * @return {Promise<string>} xpath selector
     */
    export function getElementXpath(logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<string>;
    /**
     * Get element absolute xpath selector related to the top-level context
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {EyesWrappedElement|UnwrappedElement} element - element to calculate xpath
     * @return {Promise<string>} xpath selector
     */
    export function getElementAbsoluteXpath(_logger: Logger, executor: EyesJsExecutor, element: EyesWrappedElement | UnwrappedElement): Promise<string>;
    /**
     * Translate element selector to the persisted regions
     * @param {Logger} logger - logger instance
     * @param {Object} driver
     * @param {EyesElementFinder} driver.finder - element finder
     * @param {EyesJsExecutor} driver.executor - js executor
     * @param {SupportedSelector} selector - element selector
     * @return {Promise<{type: string, selector: string}[]>} persisted regions for selector
     */
    export function locatorToPersistedRegions(logger: Logger, { finder, executor }: {
        finder: EyesElementFinder;
        executor: EyesJsExecutor;
    }, selector: SupportedSelector): Promise<{
        type: string;
        selector: string;
    }[]>;
    /**
     * Ensure provided region is visible as much as possible
     * @param {Logger} logger - logger instance
     * @param {Object} driver
     * @param {EyesDriverController} driver.controller - driver controller
     * @param {EyesBrowsingContext} driver.context - browsing context
     * @param {EyesJsExecutor} driver.executor - js executor
     * @param {PositionProvider} positionProvider - position provider
     * @param {Promise<Region>} region - region to ensure visible
     */
    export function ensureRegionVisible(logger: Logger, { controller, context, executor }: {
        controller: EyesDriverController;
        context: EyesBrowsingContext;
        executor: EyesJsExecutor;
    }, positionProvider: PositionProvider, region: Promise<import("lib/geometry/Region")>): Promise<Location | import("lib/geometry/Location")>;
    /**
     * Ensure provided region is visible as much as possible
     * @param {Logger} _logger - logger instance
     * @param {EyesBrowsingContext} context - browsing context
     * @param {PositionProvider} positionProvider - position provider
     * @param {Location} [offset=Location.ZERO] - offset from the top-left frame's corner
     * @return {Promise<Location>} remaining offset to the frame
     */
    export function ensureFrameVisible(_logger: Logger, context: EyesBrowsingContext, positionProvider: PositionProvider, offset?: Location): Promise<Location>;
    /**
     * @typedef ContextInfo
     * @prop {boolean} isRoot - is root context
     * @prop {boolean} isCORS - is cors context related to the parent
     * @prop {UnwrappedElement} document - context document element
     * @prop {string} frameSelector - xpath to the frame element related to the parent context
     *
     * Extract information about relations between current context and its parent
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @return {Promise<ContextInfo>} frame info
     */
    export function getCurrentContextInfo(_logger: Logger, executor: EyesJsExecutor): Promise<ContextInfo>;
    /**
     * Get frame element by name or id
     * @param {Logger} _logger - logger instance
     * @param {EyesJsExecutor} executor - js executor
     * @param {string} nameOrId - name or id of the element
     * @return {UnwrappedElement} frame element
     */
    export function getFrameByNameOrId(_logger: Logger, executor: EyesJsExecutor, nameOrId: string): UnwrappedElement;
    /**
     * @typedef FrameInfo
     * @prop {boolean} isCORS - is cors frame related to the current context
     * @prop {UnwrappedElement} element - frame element
     * @prop {string} selector - xpath to the frame element related to the parent context
     *
     * Find by context information
     * @param {Logger} _logger - logger instance
     * @param {Object} driver
     * @param {EyesBrowsingContext} driver.context - browsing context
     * @param {EyesJsExecutor} driver.executor - js executor
     * @param {ContextInfo} contextInfo - target context info
     * @param {(left: UnwrappedElement, right: UnwrappedElement) => Promise<boolean>} comparator - check if two document elements are equal
     * @return {Promise<Frame>} frame
     */
    export function findFrameByContext(_logger: Logger, { executor, context }: {
        context: EyesBrowsingContext;
        executor: EyesJsExecutor;
    }, contextInfo: ContextInfo, comparator: (left: UnwrappedElement, right: UnwrappedElement) => Promise<boolean>): Promise<any>;
}
declare module "lib/capture/EyesScreenshotNew" {
    export = EyesScreenshot;
    /**
     * Class for handling screenshots.
     */
    class EyesScreenshot {
        /**
         * Detect screenshot type of image
         * @param {MutableImage} image - actual screenshot image
         * @param {Eyes} eyes - eyes instance used to get the screenshot
         * @return {Promise<ScreenshotType>}
         */
        static getScreenshotType(image: MutableImage, eyes: any): Promise<ScreenshotType>;
        /**
         * Creates a frame(!) window screenshot
         * @param {Logger} logger - logger instance
         * @param {Eyes} eyes - eyes instance used to get the screenshot
         * @param {MutableImage} image - actual screenshot image
         * @param {RectangleSize} entireFrameSize - full internal size of the frame
         * @return {Promise<EyesScreenshot>}
         */
        static fromFrameSize(logger: Logger, eyes: any, image: MutableImage, entireFrameSize: import("lib/geometry/RectangleSize")): Promise<EyesScreenshot>;
        /**
         * Creates a frame(!) window screenshot from screenshot type and location
         * @param {Logger} logger - Logger instance
         * @param {Eyes} eyes - eyes instance used to get the screenshot
         * @param {MutableImage} image - actual screenshot image
         * @param {ScreenshotType} [screenshotType] - screenshot's type (e.g., viewport/full page)
         * @param {Location} [frameLocationInScreenshot] - current frame's location in the screenshot
         * @return {Promise<EyesScreenshot>}
         */
        static fromScreenshotType(logger: Logger, eyes: any, image: MutableImage, screenshotType?: ScreenshotType, frameLocationInScreenshot?: Location): Promise<EyesScreenshot>;
        /**
         * !WARNING! After creating new instance of EyesScreenshot, it should be initialized by calling
         * to init or initFromFrameSize method
         * @param {Logger} logger - logger instance
         * @param {Eyes} eyes - web eyes used to get the screenshot
         * @param {MutableImage} image - actual screenshot image
         */
        constructor(logger: Logger, eyes: any, image: MutableImage);
        _logger: import("lib/logging/Logger");
        _image: import("lib/images/MutableImage");
        _eyes: any;
        /** @type {FrameChain} */
        _frameChain: import("lib/frames/FrameChain");
        /** @type {ScreenshotType} */
        _screenshotType: ScreenshotType;
        /** @type {Location} */
        _currentFrameScrollPosition: Location;
        /**
         * The top/left coordinates of the frame window(!) relative to the top/left
         * of the screenshot. Used for calculations, so can also be outside(!) the screenshot.
         * @type {Location}
         */
        _frameLocationInScreenshot: Location;
        /** @type {RectangleSize} */
        _frameSize: import("lib/geometry/RectangleSize");
        /**
         * The top/left coordinates of the frame window(!) relative to the top/left
         * of the screenshot. Used for calculations, so can also be outside(!) the screenshot.
         * @type {Region}
         */
        _frameRect: import("lib/geometry/Region");
        /**
         * Creates a frame(!) window screenshot.
         * @param {RectangleSize} entireFrameSize - full internal size of the frame
         * @return {Promise<EyesScreenshot>}
         */
        initFromFrameSize(entireFrameSize: import("lib/geometry/RectangleSize")): Promise<EyesScreenshot>;
        /**
         * @param {ScreenshotType} [screenshotType] - screenshot's type (e.g., viewport/full page)
         * @param {Location} [frameLocationInScreenshot] - current frame's location in the screenshot
         * @return {Promise<EyesScreenshot>}
         */
        init(screenshotType?: ScreenshotType, frameLocationInScreenshot?: Location): Promise<EyesScreenshot>;
        /**
         * @return {MutableImage} - screenshot image
         */
        getImage(): MutableImage;
        /**
         * @return {Region} - region of the frame which is available in the screenshot, in screenshot coordinates
         */
        getFrameWindow(): import("lib/geometry/Region");
        /**
         * @return {FrameChain} - copy of the frame chain which was available when the screenshot was created
         */
        getFrameChain(): import("lib/frames/FrameChain");
        /**
         * @param {Location} location
         * @param {CoordinatesType} coordinatesType
         * @return {Location}
         */
        getLocationInScreenshot(location: Location, coordinatesType: any): Location;
        _location: Location;
        /**
         * @param {Region} region
         * @param {CoordinatesType} resultCoordinatesType
         * @return {Region}
         */
        getIntersectedRegion(region: import("lib/geometry/Region"), resultCoordinatesType: any): import("lib/geometry/Region");
        /**
         * @param {Region} region - region which location's coordinates needs to be converted.
         * @param {CoordinatesType} from - current coordinates type for {@code region}.
         * @param {CoordinatesType} to - target coordinates type for {@code region}.
         * @return {Region} new region which is the transformation of {@code region} to the {@code to} coordinates type.
         */
        convertRegionLocation(region: import("lib/geometry/Region"), from: any, to: any): import("lib/geometry/Region");
        /**
         * Converts a location's coordinates with the {@code from} coordinates type to the {@code to} coordinates type.
         * @param {Location} location - location which coordinates needs to be converted.
         * @param {CoordinatesType} from - current coordinates type for {@code location}.
         * @param {CoordinatesType} to - target coordinates type for {@code location}.
         * @return {Location} new location which is the transformation of {@code location} to the {@code to} coordinates type.
         */
        convertLocation(location: Location, from: any, to: any): Location;
        /**
         * Gets the elements region in the screenshot.
         * @param {EyesWrappedElement} element - element which region we want to intersect.
         * @return {Promise<Region>} intersected region, in {@code SCREENSHOT_AS_IS} coordinates type.
         */
        getIntersectedRegionFromElement(element: EyesWrappedElement): Promise<import("lib/geometry/Region")>;
        /**
         * Returns a part of the screenshot based on the given region.
         * @param {Region} region - region for which we should get the sub screenshot.
         * @param {Boolean} throwIfClipped - throw an EyesException if the region is not fully contained in the screenshot.
         * @return {Promise<EyesScreenshot>} screenshot instance containing the given region.
         */
        getSubScreenshot(region: import("lib/geometry/Region"), throwIfClipped: boolean): Promise<EyesScreenshot>;
    }
    namespace EyesScreenshot {
        export { ScreenshotTypes, Logger, MutableImage, EyesWrappedElement, ScreenshotType };
    }
    type ScreenshotType = number;
    const Location: typeof import("lib/geometry/Location");
    type MutableImage = import("lib/images/MutableImage");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type Logger = import("lib/logging/Logger");
    /**
     * @typedef {import('../logging/Logger')} Logger
     * @typedef {import('../images/MutableImage')} MutableImage
     * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
     */
    /**
     * @typedef {number} ScreenshotType
     */
    const ScreenshotTypes: Readonly<any>;
}
declare module "lib/capture/EyesScreenshotFactory" {
    export = EyesScreenshotFactory;
    /**
     * Encapsulates the instantiation of an {@link EyesScreenshot}
     */
    class EyesScreenshotFactory {
        constructor(logger: any, eyes: any);
        _logger: any;
        _eyes: any;
        makeScreenshot(image: any): Promise<import("lib/capture/EyesScreenshotNew")>;
    }
}
declare module "lib/capture/EyesSimpleScreenshot" {
    export = EyesSimpleScreenshot;
    const EyesSimpleScreenshot_base: typeof import("lib/capture/EyesScreenshot");
    /**
     * Encapsulates a screenshot taken by the images SDK.
     */
    class EyesSimpleScreenshot extends EyesSimpleScreenshot_base {
        /**
         * @param {MutableImage} image - The screenshot image.
         * @param {Location} [location] - The top/left coordinates of the screenshot in context relative coordinates type.
         */
        constructor(image: any, location?: Location);
        _bounds: import("lib/geometry/Region");
        /**
         * Get size of screenshot
         *
         * @return {RectangleSize}
         */
        getSize(): import("lib/geometry/RectangleSize");
    }
}
declare module "lib/capture/EyesSimpleScreenshotFactory" {
    export = EyesSimpleScreenshotFactory;
    const EyesSimpleScreenshotFactory_base: typeof import("lib/capture/EyesScreenshotFactory");
    /**
     * Encapsulates the instantiation of an EyesSimpleScreenshot.
     *
     * @ignore
     */
    class EyesSimpleScreenshotFactory extends EyesSimpleScreenshotFactory_base {
        constructor(logger: any, eyes: any);
    }
}
declare module "lib/cropping/CutProvider" {
    export = CutProvider;
    /**
     * Encapsulates cutting logic.
     * @interface
     */
    class CutProvider {
        /**
         * @param {MutableImage} image - The image to cut.
         * @return {Promise<MutableImage>} - A new cut image.
         */
        cut(image: any): Promise<any>;
        /**
         * Get a scaled version of the cut provider.
         *
         * @param {number} scaleRatio - The ratio by which to scale the current cut parameters.
         * @return {CutProvider} - A new scale cut provider instance.
         */
        scale(scaleRatio: number): CutProvider;
    }
}
declare module "lib/cropping/UnscaledFixedCutProvider" {
    export = UnscaledFixedCutProvider;
    const UnscaledFixedCutProvider_base: typeof import("lib/cropping/CutProvider");
    class UnscaledFixedCutProvider extends UnscaledFixedCutProvider_base {
        /**
         * @param {number} header - The header to cut in pixels.
         * @param {number} footer - The footer to cut in pixels.
         * @param {number} left - The left to cut in pixels.
         * @param {number} right - The right to cut in pixels.
         */
        constructor(header: number, footer: number, left: number, right: number);
        _header: number;
        _footer: number;
        _left: number;
        _right: number;
    }
}
declare module "lib/cropping/NullCutProvider" {
    export = NullCutProvider;
    const NullCutProvider_base: typeof import("lib/cropping/UnscaledFixedCutProvider");
    class NullCutProvider extends NullCutProvider_base {
    }
}
declare module "lib/positioning/RegionPositionCompensation" {
    export = RegionPositionCompensation;
    /**
     * @ignore
     * @abstract
     */
    class RegionPositionCompensation {
        /**
         * @param {Region} region
         * @param {number} pixelRatio
         * @return {Region}
         */
        compensateRegionPosition(region: any, pixelRatio: number): any;
    }
}
declare module "lib/positioning/NullRegionPositionCompensation" {
    export = NullRegionPositionCompensation;
    const NullRegionPositionCompensation_base: typeof import("lib/positioning/RegionPositionCompensation");
    /**
     * @ignore
     */
    class NullRegionPositionCompensation extends NullRegionPositionCompensation_base {
    }
}
declare module "lib/capture/FullPageCaptureAlgorithm" {
    export = FullPageCaptureAlgorithm;
    /**
     * @ignore
     */
    class FullPageCaptureAlgorithm {
        /**
         * @param {Logger} logger
         * @param {RegionPositionCompensation} regionPositionCompensation
         * @param {number} waitBeforeScreenshots
         * @param {DebugScreenshotsProvider} debugScreenshotsProvider
         * @param {EyesScreenshotFactory} screenshotFactory
         * @param {PositionProvider} originProvider
         * @param {ScaleProviderFactory} scaleProviderFactory
         * @param {CutProvider} cutProvider
         * @param {number} stitchingOverlap
         * @param {ImageProvider} imageProvider
         * @param {boolean} isDoubleOverlap
         */
        constructor(logger: any, regionPositionCompensation: any, waitBeforeScreenshots: number, debugScreenshotsProvider: any, screenshotFactory: any, originProvider: any, scaleProviderFactory: any, cutProvider: any, stitchingOverlap: number, imageProvider: any, isDoubleOverlap: boolean);
        _logger: any;
        _waitBeforeScreenshots: number;
        _debugScreenshotsProvider: any;
        _screenshotFactory: any;
        _originProvider: any;
        _scaleProviderFactory: any;
        _cutProvider: any;
        _stitchingOverlap: number;
        _imageProvider: any;
        _isDoubleOverlap: boolean;
        _regionPositionCompensation: any;
        /**
         * @private
         * @param {MutableImage} image
         * @param {Region} region
         * @param {string} name
         * @return {Promise}
         */
        private _saveDebugScreenshotPart;
        /**
         * Returns a stitching of a region.
         *
         * @param {Region} region - The region to stitch. If {@code Region.EMPTY}, the entire image will be stitched.
         * @param {Region} fullArea - The wanted area of the resulting image. If unknown, pass in {@code null} or {@code RectangleSize.EMPTY}.
         * @param {PositionProvider} positionProvider - A provider of the scrolling implementation.
         * @return {Promise<MutableImage>} - An image which represents the stitched region.
         */
        getStitchedRegion(region: import("lib/geometry/Region"), fullArea: import("lib/geometry/Region"), positionProvider: any): Promise<import("lib/images/MutableImage")>;
        /**
         * @param {Region} region
         * @param {MutableImage} image
         * @param {number} pixelRatio
         * @return {Promise<Region>}
         */
        _getRegionInScreenshot(region: import("lib/geometry/Region"), image: import("lib/images/MutableImage"), pixelRatio: number): Promise<import("lib/geometry/Region")>;
    }
}
declare module "lib/capture/ImageProvider" {
    export = ImageProvider;
    /**
     * Encapsulates image retrieval.
     *
     * @abstract
     */
    class ImageProvider {
        /**
         * @return {Promise<MutableImage>}
         */
        getImage(): Promise<any>;
    }
}
declare module "lib/capture/TakesScreenshotImageProvider" {
    export = TakesScreenshotImageProvider;
    const TakesScreenshotImageProvider_base: typeof import("lib/capture/ImageProvider");
    /**
     * An image provider based on WebDriver's interface.
     */
    class TakesScreenshotImageProvider extends TakesScreenshotImageProvider_base {
        /**
         * @param {Logger} logger A Logger instance.
         * @param {ImageRotation} rotation
         * @param {EyesWrappedDriver} driver
         */
        constructor(logger: any, driver: any, rotation: any);
        _logger: any;
        _driver: any;
        _rotation: any;
        set rotation(arg: any);
    }
}
declare module "lib/capture/FirefoxScreenshotImageProvider" {
    export = FirefoxScreenshotImageProvider;
    const FirefoxScreenshotImageProvider_base: typeof import("lib/capture/ImageProvider");
    /**
     * This class is needed because in certain versions of firefox, a frame screenshot only brings the frame viewport.
     * To solve this issue, we create an image with the full size of the browser viewport and place the frame image
     * on it in the appropriate place.
     */
    class FirefoxScreenshotImageProvider extends FirefoxScreenshotImageProvider_base {
        /**
         * @param {Logger} logger
         * @param {EyesWrappedDriver} driver
         * @param {ImageRotation} rotation
         * @param {Eyes} eyes
         */
        constructor(logger: any, driver: any, rotation: any, eyes: any);
        _logger: any;
        _driver: any;
        _rotation: any;
        _eyes: any;
        set rotation(arg: any);
    }
}
declare module "lib/capture/SafariScreenshotImageProvider" {
    export = SafariScreenshotImageProvider;
    const SafariScreenshotImageProvider_base: typeof import("lib/capture/ImageProvider");
    class SafariScreenshotImageProvider extends SafariScreenshotImageProvider_base {
        /**
         * @param {Logger} logger A Logger instance.
         * @param {EyesWrappedDriver} driver
         * @param {Eyes} eyes
         * @param {UserAgent} userAgent
         */
        constructor(logger: any, driver: any, rotation: any, eyes: any, userAgent: any);
        _logger: any;
        _driver: any;
        _rotation: any;
        _eyes: any;
        _userAgent: any;
        set rotation(arg: any);
    }
}
declare module "lib/capture/ImageProviderFactory" {
    export = ImageProviderFactory;
    class ImageProviderFactory {
        /**
         * @param {Logger} logger
         * @param {EyesWrappedDriver} driver
         * @param {ImageRotation} rotation
         * @param {Eyes} eyes
         * @param {UserAgent} userAgent
         * @return {ImageProvider}
         */
        static getImageProvider(logger: any, driver: any, rotation: any, eyes: any, userAgent: any): any;
    }
}
declare module "lib/capture/CorsIframeHandles" {
    export var CorsIframeHandles: Readonly<{
        /** We should REMOVE the SRC attribute of the iframe */
        BLANK: string;
        /** Not to do anything */
        KEEP: string;
        SNAPSHOT: string;
    }>;
    export type CorsIframeHandle = string;
}
declare module "lib/capture/CorsIframeHandler" {
    export = CorsIframeHandler;
    class CorsIframeHandler {
        /**
         * @param {object} json
         * @param {string} origin
         */
        static blankCorsIframeSrc(json: object, origin: string): void;
        /**
         * @param {object[]} cdt
         * @param {object[]} frames
         * @return {object[]}
         */
        static blankCorsIframeSrcOfCdt(cdt: object[], frames: object[]): object[];
    }
}
declare module "lib/cropping/FixedCutProvider" {
    export = FixedCutProvider;
    const FixedCutProvider_base: typeof import("lib/cropping/CutProvider");
    class FixedCutProvider extends FixedCutProvider_base {
        /**
         * @param {number} header - The header to cut in pixels.
         * @param {number} footer - The footer to cut in pixels.
         * @param {number} left - The left to cut in pixels.
         * @param {number} right - The right to cut in pixels.
         */
        constructor(header: number, footer: number, left: number, right: number);
        _header: number;
        _footer: number;
        _left: number;
        _right: number;
    }
}
declare module "lib/events/SessionEventHandler" {
    export = SessionEventHandler;
    /**
     * The base class for session event handler. Specific implementations should use this class as abstract.
     *
     * @abstract
     */
    class SessionEventHandler {
        /**
         * Called when the data gathering for creating a session phase had started.
         *
         * @return {Promise}
         */
        initStarted(): Promise<any>;
        /**
         * Called when the data gathering phase had ended.
         *
         * @return {Promise}
         */
        initEnded(): Promise<any>;
        /**
         * Called when setting the size of the application window is about to start.
         *
         * @param {RectangleSize} sizeToSet - an object with 'width' and 'height' properties.
         * @return {Promise}
         */
        setSizeWillStart(sizeToSet: any): Promise<any>;
        /**
         * Called 'set size' operation has ended (either failed/success).
         *
         * @return {Promise}
         */
        setSizeEnded(): Promise<any>;
        /**
         * Called after a session had started.
         *
         * @param {string} autSessionId - The AUT session ID.
         * @return {Promise}
         */
        testStarted(autSessionId: string): Promise<any>;
        /**
         * Called after a session had ended.
         *
         * @param {string} autSessionId - The AUT session ID.
         * @param {TestResults} testResults - The test results.
         * @return {Promise}
         */
        testEnded(autSessionId: string, testResults: any): Promise<any>;
        /**
         * Called before a new validation will be started.
         *
         * @param {string} autSessionId - The AUT session ID.
         * @param {ValidationInfo} validationInfo - The validation parameters.
         * @return {Promise}
         */
        validationWillStart(autSessionId: string, validationInfo: any): Promise<any>;
        /**
         * Called when a validation had ended.
         *
         * @param {string} autSessionId - The AUT session ID.
         * @param {number} validationId - The ID of the validation which had ended.
         * @param {ValidationResult} validationResult - The validation results.
         * @return {Promise}
         */
        validationEnded(autSessionId: string, validationId: number, validationResult: any): Promise<any>;
    }
}
declare module "lib/events/RemoteSessionEventHandler" {
    export = RemoteSessionEventHandler;
    const RemoteSessionEventHandler_base: typeof import("lib/events/SessionEventHandler");
    class RemoteSessionEventHandler extends RemoteSessionEventHandler_base {
        constructor(serverUrl: any, accessKey: any);
        _autSessionId: any;
        _serverUrl: any;
        _httpOptions: {
            strictSSL: boolean;
            baseUrl: string;
            json: boolean;
            params: {
                accessKey: any;
            };
            timeout: number;
        };
        /**
         * @param {number} value
         */
        setTimeout(value: number): void;
        /**
         * @return {number}
         */
        getTimeout(): number;
        /**
         * @param {string} value
         */
        setServerUrl(value: string): void;
        /**
         * @return {string}
         */
        getServerUrl(): string;
        /**
         * @param {string} value
         */
        setAccessKey(value: string): void;
        /**
         * @return {string}
         */
        getAccessKey(): string;
    }
}
declare module "lib/events/ValidationInfo" {
    export = ValidationInfo;
    /**
     * Encapsulates the information for the validation about to execute.
     */
    class ValidationInfo {
        /**
         * @param {number} [validationId]
         * @param {string} [tag]
         */
        constructor(validationId?: number, tag?: string);
        _validationId: number;
        _tag: string;
        /**
         * @param {number} value
         */
        setValidationId(value: number): void;
        /**
         * @return {number}
         */
        getValidationId(): number;
        /**
         * @param {string} value
         */
        setTag(value: string): void;
        /**
         * @return {string}
         */
        getTag(): string;
        /**
         * @override
         */
        toJSON(): any;
    }
}
declare module "lib/events/ValidationResult" {
    export = ValidationResult;
    /**
     * Encapsulates the information for the validation about to execute.
     */
    class ValidationResult {
        /**
         * @param {boolean} [asExpected]
         */
        constructor(asExpected?: boolean);
        _asExpected: boolean;
        /**
         * @param {boolean} value
         */
        setAsExpected(value: boolean): void;
        /**
         * @return {boolean}
         */
        getAsExpected(): boolean;
    }
}
declare module "lib/fluent/GetSelector" {
    export = GetSelector;
    /**
     * @ignore
     */
    class GetSelector {
        /**
         * @param {string} [selector]
         */
        constructor(selector?: string);
        _selector: string;
        /**
         * @param {EyesWrappedDriver} driver
         * @return {Promise<string>}
         */
        getSelector(eyes: any): Promise<string>;
    }
}
declare module "lib/fluent/GetRegion" {
    export = GetRegion;
    const GetRegion_base: typeof import("lib/fluent/GetSelector");
    /**
     * @ignore
     * @abstract
     */
    class GetRegion extends GetRegion_base {
        /**
         * @param {EyesWrappedDriver} driver
         * @param {EyesScreenshot} screenshot
         * @return {Promise<Region[]>}
         */
        getRegion(eyesBase: any, screenshot: any): Promise<any[]>;
    }
}
declare module "lib/fluent/IgnoreRegionByRectangle" {
    export = IgnoreRegionByRectangle;
    const IgnoreRegionByRectangle_base: typeof import("lib/fluent/GetRegion");
    /**
     * @ignore
     */
    class IgnoreRegionByRectangle extends IgnoreRegionByRectangle_base {
        /**
         * @param {Region} region
         */
        constructor(region: any);
        _region: any;
        toPersistedRegions(_driver: any): Promise<any[]>;
    }
}
declare module "lib/fluent/GetFloatingRegion" {
    export = GetFloatingRegion;
    /**
     * @ignore
     * @abstract
     */
    class GetFloatingRegion {
        /**
         * @param {EyesWrappedDriver} driver
         * @param {EyesScreenshot} screenshot
         * @return {Promise<FloatingMatchSettings[]>}
         */
        getRegion(driver: any, screenshot: any): Promise<any[]>;
    }
}
declare module "lib/fluent/FloatingRegionByRectangle" {
    export = FloatingRegionByRectangle;
    const FloatingRegionByRectangle_base: typeof import("lib/fluent/GetFloatingRegion");
    /**
     * @ignore
     */
    class FloatingRegionByRectangle extends FloatingRegionByRectangle_base {
        /**
         * @param {Region} rect
         * @param {number} maxUpOffset
         * @param {number} maxDownOffset
         * @param {number} maxLeftOffset
         * @param {number} maxRightOffset
         */
        constructor(rect: any, maxUpOffset: number, maxDownOffset: number, maxLeftOffset: number, maxRightOffset: number);
        _rect: any;
        _maxUpOffset: number;
        _maxDownOffset: number;
        _maxLeftOffset: number;
        _maxRightOffset: number;
        toPersistedRegions(_driver: any): Promise<{
            left: any;
            top: any;
            width: any;
            height: any;
            maxUpOffset: number;
            maxDownOffset: number;
            maxLeftOffset: number;
            maxRightOffset: number;
        }[]>;
    }
}
declare module "lib/fluent/GetAccessibilityRegion" {
    export = GetAccessibilityRegion;
    /**
     * @ignore
     * @abstract
     */
    class GetAccessibilityRegion {
        /**
         * @param {EyesWrappedDriver} driver
         * @param {EyesScreenshot} screenshot
         * @return {Promise<AccessibilityMatchSettings[]>}
         */
        getRegion(eyesBase: any, screenshot: any): Promise<any[]>;
    }
}
declare module "lib/fluent/AccessibilityRegionByRectangle" {
    export = AccessibilityRegionByRectangle;
    const AccessibilityRegionByRectangle_base: typeof import("lib/fluent/GetAccessibilityRegion");
    /**
     * @typedef {import('../config/AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
     */
    class AccessibilityRegionByRectangle extends AccessibilityRegionByRectangle_base {
        /**
         * @param {Region} rect
         * @param {AccessibilityRegionType} [type]
         */
        constructor(rect: any, type?: AccessibilityRegionType);
        _rect: any;
        _type: string;
        toPersistedRegions(): Promise<{
            left: any;
            top: any;
            width: any;
            height: any;
            accessibilityType: string;
        }[]>;
    }
    namespace AccessibilityRegionByRectangle {
        export { AccessibilityRegionType };
    }
    type AccessibilityRegionType = string;
}
declare module "lib/fluent/CheckSettings" {
    export = CheckSettings;
    /**
     * The Match settings object to use in the various Eyes.Check methods.
     */
    class CheckSettings {
        /**
         * @param {?number} [timeout=-1]
         * @param {Region|RegionObject} [region]
         */
        constructor(timeout?: number | null, region?: import("lib/geometry/Region") | any);
        /** @type {boolean} */
        _sendDom: boolean;
        /** @type {MatchLevel} */
        _matchLevel: any;
        /** @type {AccessibilityLevel} */
        _accessibilityLevel: any;
        /** @type {boolean} */
        _useDom: boolean;
        /** @type {boolean} */
        _enablePatterns: boolean;
        /** @type {boolean} */
        _ignoreDisplacements: boolean;
        /** @type {boolean} */
        _ignoreCaret: boolean;
        /** @type {boolean} */
        _stitchContent: boolean;
        /** @type {string} */
        _renderId: string;
        _timeout: number;
        _targetRegion: import("lib/geometry/Region");
        _ignoreRegions: any[];
        _layoutRegions: any[];
        _strictRegions: any[];
        _contentRegions: any[];
        _floatingRegions: any[];
        _accessibilityRegions: any[];
        /**
         * A setter for the checkpoint name.
         *
         * @param {string} name - A name by which to identify the checkpoint.
         * @return {this} - This instance of the settings object.
         */
        withName(name: string): this;
        _name: string;
        /**
         * @ignore
         * @return {string}
         */
        getName(): string;
        /**
         * Defines whether to send the document DOM or not.
         *
         * @param {boolean} [sendDom=true] - When {@code true} sends the DOM to the server (the default).
         * @return {this} - This instance of the settings object.
         */
        sendDom(sendDom?: boolean): this;
        /**
         * @ignore
         * @return {boolean}
         */
        getSendDom(): boolean;
        /**
         * Set the render ID of the screenshot.
         *
         * @package
         * @param {string} renderId - The render ID to use.
         * @return {this} - This instance of the settings object.
         */
        renderId(renderId: string): this;
        /**
         * @ignore
         * @return {string}
         */
        getRenderId(): string;
        /**
         * Shortcut to set the match level to {@code MatchLevel.LAYOUT}.
         *
         * @return {this} - This instance of the settings object.
         */
        layout(): this;
        /**
         * Shortcut to set the match level to {@code MatchLevel.EXACT}.
         *
         * @return {this} - This instance of the settings object.
         */
        exact(): this;
        /**
         * Shortcut to set the match level to {@code MatchLevel.STRICT}.
         *
         * @return {this} - This instance of the settings object.
         */
        strict(): this;
        /**
         * Shortcut to set the match level to {@code MatchLevel.CONTENT}.
         *
         * @return {this} - This instance of the settings object.
         */
        content(): this;
        /**
         * Set the match level by which to compare the screenshot.
         *
         * @param {MatchLevel} matchLevel - The match level to use.
         * @return {this} - This instance of the settings object.
         */
        matchLevel(matchLevel: any): this;
        /**
         * @ignore
         * @return {MatchLevel}
         */
        getMatchLevel(): any;
        /**
         * Defines if to detect and ignore a blinking caret in the screenshot.
         *
         * @param {boolean} [ignoreCaret=true] - Whether or not to detect and ignore a blinking caret in the screenshot.
         * @return {this} - This instance of the settings object.
         */
        ignoreCaret(ignoreCaret?: boolean): this;
        /**
         * @ignore
         * @return {boolean}
         */
        getIgnoreCaret(): boolean;
        /**
         * Defines that the screenshot will contain the entire element or region, even if it's outside the view.
         *
         * @param {boolean} [fully=true]
         * @return {this} - This instance of the settings object.
         */
        fully(fully?: boolean): this;
        /**
         * @param {boolean} [stitchContent=true]
         * @return {this}
         */
        stitchContent(stitchContent?: boolean): this;
        /**
         * @ignore
         * @return {boolean}
         */
        getStitchContent(): boolean;
        /**
         * Defines useDom for enabling the match algorithm to use dom.
         *
         * @param {boolean} [useDom=true]
         * @return {this} - This instance of the settings object.
         */
        useDom(useDom?: boolean): this;
        /**
         * @ignore
         * @return {boolean}
         */
        getUseDom(): boolean;
        /**
         * Enabling the match algorithms for pattern detection
         *
         * @param {boolean} [enablePatterns=true]
         * @return {this} - This instance of the settings object.
         */
        enablePatterns(enablePatterns?: boolean): this;
        /**
         * @ignore
         * @return {boolean}
         */
        getEnablePatterns(): boolean;
        /**
         * @param {boolean} [ignoreDisplacements=true]
         * @return {this} - This instance of the settings object.
         */
        ignoreDisplacements(ignoreDisplacements?: boolean): this;
        /**
         * @ignore
         * @return {boolean}
         */
        getIgnoreDisplacements(): boolean;
        /**
         * Defines the timeout to use when acquiring and comparing screenshots.
         *
         * @param {number} timeoutMilliseconds - The timeout to use in milliseconds.
         * @return {this} - This instance of the settings object.
         */
        timeout(timeoutMilliseconds?: number): this;
        /**
         * @ignore
         * @return {number}
         */
        getTimeout(): number;
        /**
         * @protected
         * @param {Region|RegionObject} region
         */
        protected updateTargetRegion(region: import("lib/geometry/Region") | any): void;
        /**
         * @ignore
         * @return {Region}
         */
        getTargetRegion(): import("lib/geometry/Region");
        /**
         * @protected
         * @param {GetRegion|Region|RegionObject} region
         * @return {GetRegion}
         */
        protected _regionToRegionProvider(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region") | any): import("lib/fluent/GetRegion");
        _getTargetType(): "window" | "region";
        /**
         * Adds a region to ignore.
         *
         * @override
         * @param {GetRegion|Region|By|String|EyesWebElement|Object} region The region or region container to ignore when validating the screenshot.
         * @return {CheckSettings} This instance of the settings object.
         */
        ignore(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region") | any | string | any | any): CheckSettings;
        /**
         * Adds a region to ignore.
         *
         * @override
         * @param {GetRegion|Region|By|String|EyesWebElement|Object} region The region or region container to ignore when validating the screenshot.
         * @return {CheckSettings} This instance of the settings object.
         */
        ignoreRegion(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region") | any | string | any | any): CheckSettings;
        /**
         * Adds one or more ignore regions.
         *
         * @param {...(GetRegion|Region)} regions - A region to ignore when validating the screenshot.
         * @return {this} - This instance of the settings object.
         */
        ignores(...regions: (import("lib/fluent/GetRegion") | import("lib/geometry/Region"))[]): this;
        /**
         * Adds one or more ignore regions.
         *
         * @param {...(GetRegion|Region)} regions - A region to ignore when validating the screenshot.
         * @return {this} - This instance of the settings object.
         */
        ignoreRegions(...regions: (import("lib/fluent/GetRegion") | import("lib/geometry/Region"))[]): this;
        /**
         * Adds a layout region.
         * @param {GetRegion|Region} region - A region to match using the Layout method.
         * @return {this} - This instance of the settings object.
         */
        layoutRegion(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region")): this;
        /**
         * Adds one or more layout regions.
         * @param {...(GetRegion|Region)} regions - A region to match using the Layout method.
         * @return {this} - This instance of the settings object.
         */
        layoutRegions(...regions: (import("lib/fluent/GetRegion") | import("lib/geometry/Region"))[]): this;
        /**
         * Adds a strict regions.
         * @param {GetRegion|Region} region - A region to match using the Strict method.
         * @return {this} - This instance of the settings object.
         */
        strictRegion(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region")): this;
        /**
         * Adds one or more strict regions.
         * @param {...(GetRegion|Region)} regions - A region to match using the Strict method.
         * @return {this} - This instance of the settings object.
         */
        strictRegions(...regions: (import("lib/fluent/GetRegion") | import("lib/geometry/Region"))[]): this;
        /**
         * Adds a content region.
         * @param {GetRegion|Region} region - A region to match using the Content method.
         * @return {this} - This instance of the settings object.
         */
        contentRegion(region: import("lib/fluent/GetRegion") | import("lib/geometry/Region")): this;
        /**
         * Adds one or more content regions.
         * @param {...(GetRegion|Region)} regions - A region to match using the Content method.
         * @return {this} - This instance of the settings object.
         */
        contentRegions(...regions: (import("lib/fluent/GetRegion") | import("lib/geometry/Region"))[]): this;
        /**
         * Adds a floating region. A floating region is a a region that can be placed within the boundaries of a bigger
         * region.
         *
         * @param {GetFloatingRegion|Region|FloatingMatchSettings} region - The content rectangle or region
         *   container
         * @param {number} [maxUpOffset] - How much the content can move up.
         * @param {number} [maxDownOffset] - How much the content can move down.
         * @param {number} [maxLeftOffset] - How much the content can move to the left.
         * @param {number} [maxRightOffset] - How much the content can move to the right.
         * @return {this} - This instance of the settings object.
         */
        floating(region: import("lib/fluent/GetFloatingRegion") | import("lib/geometry/Region") | import("lib/config/FloatingMatchSettings"), maxUpOffset?: number, maxDownOffset?: number, maxLeftOffset?: number, maxRightOffset?: number): this;
        /**
         * Adds a floating region. A floating region is a a region that can be placed within the boundaries of a bigger
         * region.
         *
         * @param {GetFloatingRegion|Region|FloatingMatchSettings} region - The content rectangle or region
         *   container
         * @param {number} [maxUpOffset] - How much the content can move up.
         * @param {number} [maxDownOffset] - How much the content can move down.
         * @param {number} [maxLeftOffset] - How much the content can move to the left.
         * @param {number} [maxRightOffset] - How much the content can move to the right.
         * @return {this} - This instance of the settings object.
         */
        floatingRegion(region: import("lib/fluent/GetFloatingRegion") | import("lib/geometry/Region") | import("lib/config/FloatingMatchSettings"), maxUpOffset?: number, maxDownOffset?: number, maxLeftOffset?: number, maxRightOffset?: number): this;
        /**
         * Adds one or more floating regions. A floating region is a a region that can be placed within the boundaries of a
         * bigger region.
         *
         * @param {number} maxOffset - How much each of the content rectangles can move in any direction.
         * @param {...Region} regionsOrContainers - One or more content rectangles or region containers
         * @return {this} - This instance of the settings object.
         */
        floatings(maxOffset: number, ...regions: any[]): this;
        /**
         * Adds one or more floating regions. A floating region is a a region that can be placed within the boundaries of a
         * bigger region.
         *
         * @param {number} maxOffset - How much each of the content rectangles can move in any direction.
         * @param {...Region} regionsOrContainers - One or more content rectangles or region containers
         * @return {this} - This instance of the settings object.
         */
        floatingRegions(maxOffset: number, ...regions: any[]): this;
        /**
         * Adds an accessibility region. An accessibility region is a region that has an accessibility type.
         *
         * @param {GetAccessibilityRegion|Region|AccessibilityMatchSettings} region - The content rectangle or
         *   region container
         * @param {AccessibilityRegionType} regionType - Type of accessibility.
         * @return {this} - This instance of the settings object.
         */
        accessibilityRegion(region: import("lib/fluent/GetAccessibilityRegion") | import("lib/geometry/Region") | import("lib/config/AccessibilityMatchSettings"), regionType: any): this;
        accessibility(region: any, regionType: any): CheckSettings;
        /**
         * @ignore
         * @return {GetRegion[]}
         */
        getIgnoreRegions(): import("lib/fluent/GetRegion")[];
        /**
         * @ignore
         * @return {GetRegion[]}
         */
        getStrictRegions(): import("lib/fluent/GetRegion")[];
        /**
         * @ignore
         * @return {GetRegion[]}
         */
        getLayoutRegions(): import("lib/fluent/GetRegion")[];
        /**
         * @ignore
         * @return {GetRegion[]}
         */
        getContentRegions(): import("lib/fluent/GetRegion")[];
        /**
         * @ignore
         * @return {GetFloatingRegion[]}
         */
        getFloatingRegions(): import("lib/fluent/GetFloatingRegion")[];
        /**
         * @ignore
         * @return {GetAccessibilityRegion[]}
         */
        getAccessibilityRegions(): import("lib/fluent/GetAccessibilityRegion")[];
        /**
         * @override
         */
        toString(): string;
        toCheckWindowConfiguration(eyesWebDriver: any): Promise<{
            target: string;
            fully: boolean;
            tag: string;
            scriptHooks: any;
            sendDom: boolean;
            matchLevel: any;
            ignore: any[];
            floating: any[];
            strict: any[];
            layout: any[];
            content: any[];
            accessibility: any[];
        }>;
        _getPersistedRegions(eyesWebDriver: any): Promise<{
            ignore: any[];
            floating: any[];
            strict: any[];
            layout: any[];
            content: any[];
            accessibility: any[];
        }>;
    }
}
declare module "lib/fluent/TargetRegionByElement" {
    export = TargetRegionByElement;
    const TargetRegionByElement_base: typeof import("lib/fluent/GetSelector");
    /**
     * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
     * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
     */
    class TargetRegionByElement extends TargetRegionByElement_base {
        /**
         * @param {EyesWrappedElement} element
         */
        constructor(element: EyesWrappedElement);
        _element: import("lib/wrappers/EyesWrappedElement");
        /**
         * @param {EyesWrappedDriver} driver
         * @return {Promise<PersistedRegions[]>}
         */
        toPersistedRegions(driver: EyesWrappedDriver): Promise<any[]>;
    }
    namespace TargetRegionByElement {
        export { EyesWrappedElement, EyesWrappedDriver };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
}
declare module "lib/FailureReports" {
    /**
     * Determines how detected failures are reported.
     */
    export type FailureReports = number;
    export namespace FailureReports {
        export const IMMEDIATE: string;
        export const ON_CLOSE: string;
    }
}
declare module "lib/match/MatchResult" {
    export = MatchResult;
    /**
     * The result of a window match by the agent.
     */
    class MatchResult {
        /**
         * @param {object} result
         * @param {boolean} [result.asExpected]
         * @param {number} [result.windowId]
         */
        constructor({ asExpected, windowId }?: {
            asExpected: boolean;
            windowId: number;
        });
        _asExpected: boolean;
        _windowId: number;
        /**
         * @return {boolean}
         */
        getAsExpected(): boolean;
        /**
         * @param {boolean} value
         */
        setAsExpected(value: boolean): void;
        /**
         * @return {number}
         */
        getWindowId(): number;
        /**
         * @param {number} value
         */
        setWindowId(value: number): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/positioning/RegionProvider" {
    export = RegionProvider;
    /**
     * Encapsulates a getRegion "callback" and how the region's coordinates should be used.
     */
    class RegionProvider {
        /**
         * @param {Region} [region]
         */
        constructor(region?: any);
        _region: any;
        /**
         * @return {Promise<Region>} - A region with "as is" viewport coordinates.
         */
        getRegion(): Promise<any>;
    }
}
declare module "lib/positioning/NullRegionProvider" {
    export = NullRegionProvider;
    const NullRegionProvider_base: typeof import("lib/positioning/RegionProvider");
    class NullRegionProvider extends NullRegionProvider_base {
    }
}
declare module "lib/scaling/ScaleProvider" {
    export = ScaleProvider;
    /**
     * Encapsulates scaling logic.
     *
     * @abstract
     */
    class ScaleProvider {
        /**
         * @return {number} - The ratio by which an image will be scaled.
         */
        getScaleRatio(): number;
    }
}
declare module "lib/scaling/FixedScaleProvider" {
    export = FixedScaleProvider;
    const FixedScaleProvider_base: typeof import("lib/scaling/ScaleProvider");
    class FixedScaleProvider extends FixedScaleProvider_base {
        /**
         * @param {number} scaleRatio - The scale ratio to use.
         */
        constructor(scaleRatio: number);
        _scaleRatio: number;
    }
}
declare module "lib/scaling/NullScaleProvider" {
    export = NullScaleProvider;
    const NullScaleProvider_base: typeof import("lib/scaling/FixedScaleProvider");
    /**
     * A scale provider which does nothing.
     */
    class NullScaleProvider extends NullScaleProvider_base {
    }
}
declare module "lib/scaling/ScaleProviderFactory" {
    export = ScaleProviderFactory;
    /**
     * @ignore
     */
    class ScaleProviderFactory {
        /**
         * Abstraction for instantiating scale providers.
         *
         * @param {PropertyHandler} scaleProviderHandler - A handler to update once a {@link ScaleProvider} instance is created.
         */
        constructor(scaleProviderHandler: any);
        _scaleProviderHandler: any;
        /**
         * The main API for this factory.
         *
         * @param {number} imageToScaleWidth - The width of the image to scale. This parameter CAN be by class implementing the
         *   factory, but this is not mandatory.
         * @return {ScaleProvider} - A {@link ScaleProvider} instance.
         */
        getScaleProvider(imageToScaleWidth: number): any;
        /**
         * The implementation of getting/creating the scale provider, should be implemented by child classes.
         *
         * @param {number} imageToScaleWidth - The width of the image to scale. This parameter CAN be by class implementing the
         *   factory, but this is not mandatory.
         * @return {ScaleProvider} - The scale provider to be used.
         */
        getScaleProviderImpl(_imageToScaleWidth: any): any;
    }
}
declare module "lib/scaling/ScaleProviderIdentityFactory" {
    export = ScaleProviderIdentityFactory;
    const ScaleProviderIdentityFactory_base: typeof import("lib/scaling/ScaleProviderFactory");
    /**
     * Factory implementation which simply returns the scale provider it is given as an argument.
     *
     * @ignore
     */
    class ScaleProviderIdentityFactory extends ScaleProviderIdentityFactory_base {
        /**
         * @param {ScaleProvider} scaleProvider - The {@link ScaleProvider}
         * @param {PropertyHandler} scaleProviderHandler - A handler to update once a {@link ScaleProvider} instance is created.
         */
        constructor(scaleProvider: any, scaleProviderHandler: any);
        _scaleProvider: any;
    }
}
declare module "lib/scaling/ContextBasedScaleProvider" {
    export = ContextBasedScaleProvider;
    const ContextBasedScaleProvider_base: typeof import("lib/scaling/ScaleProvider");
    /**
     * Scale provider which determines the scale ratio according to the context.
     */
    class ContextBasedScaleProvider extends ContextBasedScaleProvider_base {
        /**
         * @param {Logger} logger
         * @param {RectangleSize} topLevelContextEntireSize - The total size of the top level context. E.g., for selenium this
         *   would be the document size of the top level frame.
         * @param {RectangleSize} viewportSize - The viewport size.
         * @param {number} devicePixelRatio - The device pixel ratio of the platform on which the application is running.
         * @param {boolean} isMobileDevice
         */
        constructor(logger: any, topLevelContextEntireSize: any, viewportSize: any, devicePixelRatio: number, isMobileDevice: boolean);
        /** @type {Logger} */
        _logger: any;
        /** @type {RectangleSize} */
        _topLevelContextEntireSize: any;
        /** @type {RectangleSize} */
        _viewportSize: any;
        /** @type {number} */
        _devicePixelRatio: number;
        /** @type {boolean} */
        _isMobileDevice: boolean;
        /** @type {number} */
        _scaleRatio: number;
        /**
         * Set the scale ratio based on the given image.
         *
         * @param {number} imageToScaleWidth - The width of the image to scale, used for calculating the scale ratio.
         */
        updateScaleRatio(imageToScaleWidth: number): void;
    }
}
declare module "lib/scaling/ContextBasedScaleProviderFactory" {
    export = ContextBasedScaleProviderFactory;
    const ContextBasedScaleProviderFactory_base: typeof import("lib/scaling/ScaleProviderFactory");
    /**
     * Factory implementation for creating {@link ContextBasedScaleProvider} instances.
     *
     * @ignore
     */
    class ContextBasedScaleProviderFactory extends ContextBasedScaleProviderFactory_base {
        /**
         * @param {Logger} logger
         * @param {RectangleSize} topLevelContextEntireSize - The total size of the top level context. E.g., for selenium this
         *   would be the document size of the top level frame.
         * @param {RectangleSize} viewportSize - The viewport size.
         * @param {number} devicePixelRatio - The device pixel ratio of the platform on which the application is running.
         * @param {boolean} isMobileDevice
         * @param {PropertyHandler} scaleProviderHandler
         */
        constructor(logger: any, topLevelContextEntireSize: any, viewportSize: any, devicePixelRatio: number, isMobileDevice: boolean, scaleProviderHandler: any);
        _logger: any;
        _topLevelContextEntireSize: any;
        _viewportSize: any;
        _devicePixelRatio: number;
        _isMobileDevice: boolean;
    }
}
declare module "lib/scaling/FixedScaleProviderFactory" {
    export = FixedScaleProviderFactory;
    const FixedScaleProviderFactory_base: typeof import("lib/scaling/ScaleProviderFactory");
    /**
     * @ignore
     */
    class FixedScaleProviderFactory extends FixedScaleProviderFactory_base {
        /**
         * @param {number} scaleRatio - The scale ratio to use.
         * @param {PropertyHandler} scaleProviderHandler
         */
        constructor(scaleRatio: number, scaleProviderHandler: any);
        _fixedScaleProvider: import("lib/scaling/FixedScaleProvider");
    }
}
declare module "lib/positioning/FirefoxRegionPositionCompensation" {
    export = FirefoxRegionPositionCompensation;
    const FirefoxRegionPositionCompensation_base: typeof import("lib/positioning/RegionPositionCompensation");
    class FirefoxRegionPositionCompensation extends FirefoxRegionPositionCompensation_base {
        /**
         * @param {Eyes} eyes
         * @param {Logger} logger
         */
        constructor(eyes: any, logger: any);
        _eyes: any;
        _logger: any;
    }
}
declare module "lib/positioning/SafariRegionPositionCompensation" {
    export = SafariRegionPositionCompensation;
    const SafariRegionPositionCompensation_base: typeof import("lib/positioning/RegionPositionCompensation");
    class SafariRegionPositionCompensation extends SafariRegionPositionCompensation_base {
    }
}
declare module "lib/positioning/RegionPositionCompensationFactory" {
    export = RegionPositionCompensationFactory;
    class RegionPositionCompensationFactory {
        /**
         * @param {UserAgent} userAgent
         * @param {Eyes} eyes
         * @param {Logger} logger
         * @return {RegionPositionCompensation}
         */
        static getRegionPositionCompensation(userAgent: any, eyes: any, logger: any): any;
    }
}
declare module "lib/positioning/PositionMemento" {
    export = PositionMemento;
    /**
     * Encapsulates state for {@link PositionProvider} instances
     */
    class PositionMemento {
        /**
         * @param {Object} state
         * @param {Object} state.transforms - current transforms to be saved.
         *  The keys are the style keys from which each of the transforms were taken
         * @param {Location} state.position - current location to be saved
         */
        constructor({ transforms, position }?: {
            transforms: any;
            position: Location;
        });
        _transforms: any;
        _position: import("lib/geometry/Location");
        /**
         * @return {Object} saved transforms.
         *  The keys are the style keys from which each of the transforms were taken
         */
        get transforms(): any;
        /**
         * @return {Location} saved position
         */
        get position(): Location;
    }
    const Location_2: typeof import("lib/geometry/Location");
}
declare module "lib/positioning/CssTranslatePositionProvider" {
    export = CssTranslatePositionProvider;
    const CssTranslatePositionProvider_base: typeof import("lib/positioning/PositionProvider");
    /**
     * @typedef {import('../geometry/RectangleSize').RectangleSize} RectangleSize
     * @typedef {import('../wrappers/EyesJsExecutor')} EyesJsExecutor
     * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
     */
    /**
     * A {@link PositionProvider} which is based on CSS translates. This is
     * useful when we want to stitch a page which contains fixed position elements.
     */
    class CssTranslatePositionProvider extends CssTranslatePositionProvider_base {
        /**
         * @param {Logger} logger - logger instance
         * @param {EyesJsExecutor} executor - js executor
         * @param {EyesWrappedElement} [scrollRootElement] - if scrolling element is not provided, default scrolling element will be used
         */
        constructor(logger: any, executor: EyesJsExecutor, scrollRootElement?: EyesWrappedElement);
        _logger: any;
        _executor: import("lib/wrappers/EyesJsExecutor");
        _scrollRootElement: import("lib/wrappers/EyesWrappedElement");
        /**
         * @return {EyesWrappedElement} scroll root element
         */
        get scrollRootElement(): import("lib/wrappers/EyesWrappedElement");
        /**
         * Add "data-applitools-scroll" attribute to the scrolling element
         */
        markScrollRootElement(): Promise<void>;
    }
    namespace CssTranslatePositionProvider {
        export { RectangleSize, EyesJsExecutor, EyesWrappedElement };
    }
    type EyesJsExecutor = import("lib/wrappers/EyesJsExecutor");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type RectangleSize = any;
}
declare module "lib/positioning/ScrollPositionProvider" {
    export = ScrollPositionProvider;
    const ScrollPositionProvider_base: typeof import("lib/positioning/PositionProvider");
    /**
     * A {@link PositionProvider} which is based on Scroll
     */
    class ScrollPositionProvider extends ScrollPositionProvider_base {
        /**
         * @param {Logger} logger - logger instance
         * @param {EyesJsExecutor} executor - js executor
         * @param {EyesWrappedElement} [scrollRootElement] - if scrolling element is not provided, default scrolling element will be used
         */
        constructor(logger: any, executor: any, scrollRootElement?: any);
        _logger: any;
        _executor: any;
        _scrollRootElement: any;
        /**
         * @return {EyesWrappedElement} scroll root element
         */
        get scrollRootElement(): any;
        /**
         * Add "data-applitools-scroll" attribute to the scrolling element
         */
        markScrollRootElement(): Promise<void>;
    }
}
declare module "lib/positioning/CssTranslateElementPositionProvider" {
    export = CssTranslateElementPositionProvider;
    const CssTranslateElementPositionProvider_base: typeof import("lib/positioning/PositionProvider");
    /**
     * @typedef {import('../geometry/RectangleSize').RectangleSize} RectangleSize
     * @typedef {import('../wrappers/EyesJsExecutor')} EyesJsExecutor
     * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
     */
    /**
     * A {@link PositionProvider} which is based on CSS translates. This is
     * useful when we want to stitch a page which contains fixed position elements.
     */
    class CssTranslateElementPositionProvider extends CssTranslateElementPositionProvider_base {
        /**
         * @param {Logger} logger - logger instance
         * @param {EyesJsExecutor} executor - js executor
         * @param {EyesWrappedElement} element - scrolling element
         */
        constructor(logger: any, executor: EyesJsExecutor, element: EyesWrappedElement);
        _logger: any;
        _executor: import("lib/wrappers/EyesJsExecutor");
        _element: import("lib/wrappers/EyesWrappedElement");
        /**
         * @return {EyesWrappedElement} scroll root element
         */
        get scrollRootElement(): import("lib/wrappers/EyesWrappedElement");
        /**
         * Add "data-applitools-scroll" attribute to the scrolling element
         */
        markScrollRootElement(): Promise<void>;
    }
    namespace CssTranslateElementPositionProvider {
        export { RectangleSize, EyesJsExecutor, EyesWrappedElement };
    }
    type EyesJsExecutor = import("lib/wrappers/EyesJsExecutor");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type RectangleSize = any;
}
declare module "lib/positioning/ScrollElementPositionProvider" {
    export = ScrollElementPositionProvider;
    const ScrollElementPositionProvider_base: typeof import("lib/positioning/PositionProvider");
    /**
     * @typedef {import('../geometry/RectangleSize').RectangleSize} RectangleSize
     * @typedef {import('../wrappers/EyesJsExecutor')} EyesJsExecutor
     * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
     */
    /**
     * A {@link PositionProvider} which is based on Scroll
     */
    class ScrollElementPositionProvider extends ScrollElementPositionProvider_base {
        /**
         * @param {Logger} logger - logger instance
         * @param {EyesJsExecutor} executor - js executor
         * @param {EyesWrappedElement} element - scrolling element
         */
        constructor(logger: any, executor: EyesJsExecutor, element: EyesWrappedElement);
        _logger: any;
        _executor: import("lib/wrappers/EyesJsExecutor");
        _element: import("lib/wrappers/EyesWrappedElement");
        /**
         * @return {EyesWrappedElement} scroll root element
         */
        get scrollRootElement(): import("lib/wrappers/EyesWrappedElement");
        /**
         * Add "data-applitools-scroll" attribute to the scrolling element
         */
        markScrollRootElement(): Promise<void>;
    }
    namespace ScrollElementPositionProvider {
        export { RectangleSize, EyesJsExecutor, EyesWrappedElement };
    }
    type EyesJsExecutor = import("lib/wrappers/EyesJsExecutor");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type RectangleSize = any;
}
declare module "lib/TestResultsStatus" {
    export = TestResultsStatuses;
    /**
     * @typedef {string} TestResultsStatus
     */
    const TestResultsStatuses: Readonly<{
        Passed: string;
        Unresolved: string;
        Failed: string;
    }>;
    namespace TestResultsStatuses {
        export { TestResultsStatus };
    }
    type TestResultsStatus = string;
}
declare module "lib/runner/TestResultContainer" {
    export = TestResultContainer;
    class TestResultContainer {
        /**
         * @param {TestResults} [testResults]
         * @param {Error} [exception]
         */
        constructor(testResults?: any, exception?: Error);
        _testResults: any;
        _exception: Error;
        /**
         * @return {TestResults}
         */
        getTestResults(): any;
        /**
         * @return {Error}
         */
        getException(): Error;
        /**
         * @override
         * @return {string}
         */
        toString(): string;
    }
}
declare module "lib/runner/TestResultsSummary" {
    export = TestResultsSummary;
    /**
     * @implements {Iterable<TestResultContainer>}
     */
    class TestResultsSummary implements Iterable<import("lib/runner/TestResultContainer")> {
        /**
         * @param {(TestResults|Error|TestResultContainer)[]} allResults
         */
        constructor(allResults: (any | Error | import("lib/runner/TestResultContainer"))[]);
        _passed: number;
        _unresolved: number;
        _failed: number;
        _exceptions: number;
        _mismatches: number;
        _missing: number;
        _matches: number;
        _allResults: any[];
        /**
         * @return {IterableIterator<TestResultContainer>} Iterator to go over the TestResultContainers in the chain.
         */
        [Symbol.iterator](): IterableIterator<import("lib/runner/TestResultContainer")>;
        /**
         * @return {TestResultContainer[]}
         */
        getAllResults(): import("lib/runner/TestResultContainer")[];
        /**
         * @return {string}
         */
        toString(): string;
    }
}
declare module "lib/runner/EyesRunner" {
    export = EyesRunner;
    class EyesRunner {
        /** @type {Eyes[]} */
        _eyesInstances: any[];
        /** @type {TestResults[]} */
        _allTestResult: any[];
        _getBatchInfo: (...args: any[]) => any;
        attachEyes(eyes: any, serverConnector: any): void;
        getBatchInfoWithCache(batchId: any): Promise<any>;
        /**
         * @param {boolean} [throwEx=true]
         * @return {Promise<TestResultsSummary>}
         */
        getAllTestResults(throwEx?: boolean): Promise<import("lib/runner/TestResultsSummary")>;
        _awaitAllClosePromises(): Promise<void>;
        /**
         * @protected
         * @return {Promise<void>}
         */
        protected _closeAllBatches(): Promise<void>;
    }
}
declare module "lib/runner/ClassicRunner" {
    export = ClassicRunner;
    const ClassicRunner_base: typeof import("lib/runner/EyesRunner");
    class ClassicRunner extends ClassicRunner_base {
        _getRenderingInfo: (...args: any[]) => any;
        getRenderingInfoWithCache(): Promise<any>;
    }
}
declare module "lib/positioning/ImageRotation" {
    export = ImageRotation;
    /**
     * Encapsulates rotation data for images.
     */
    class ImageRotation {
        /**
         * @param {int} rotation The degrees by which to rotate.
         */
        constructor(rotation: any);
        _rotation: any;
        /**
         * @return {int} The degrees by which to rotate.
         */
        getRotation(): any;
    }
}
declare module "lib/match/AppOutput" {
    export = AppOutput;
    /**
     * An application output (title, image, etc).
     *
     * @ignore
     */
    class AppOutput {
        /**
         * @param {object} output
         * @param {string} output.title - The title of the screen of the application being captured.
         * @param {Buffer} [output.screenshot] - Base64 encoding of the screenshot's bytes (the byte can be in either in compressed
         *   or uncompressed form)
         * @param {string} [output.screenshotUrl] - The URL that points to the screenshot
         * @param {string} [output.domUrl] - URL that points to a dom capture of the provided screenshot
         * @param {Location} [output.imageLocation] - Location of the provided screenshot relative to the logical full-page
         *   screenshot (e.g. in checkRegion)
         */
        constructor({ title, screenshot, screenshotUrl, domUrl, imageLocation }?: {
            title: string;
            screenshot: Buffer;
            screenshotUrl: string;
            domUrl: string;
            imageLocation: Location;
        }, ...args: any[]);
        _title: string;
        _screenshot64: Buffer;
        _screenshotUrl: string;
        _domUrl: string;
        _imageLocation: Location;
        /**
         * @return {string}
         */
        getTitle(): string;
        /**
         * @param {string} value
         */
        setTitle(value: string): void;
        /**
         * @return {Buffer}
         */
        getScreenshot64(): Buffer;
        /**
         * @param {Buffer} value
         */
        setScreenshot64(value: Buffer): void;
        /**
         * @return {string}
         */
        getScreenshotUrl(): string;
        /**
         * @param {string} value
         */
        setScreenshotUrl(value: string): void;
        /**
         * @return {string}
         */
        getDomUrl(): string;
        /**
         * @param {string} value
         */
        setDomUrl(value: string): void;
        /**
         * @return {Location}
         */
        getImageLocation(): Location;
        /**
         * @param {Location} value
         */
        setImageLocation(value: Location): void;
        /**
         * @override
         */
        toJSON(): {
            title: string;
        };
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/positioning/InvalidPositionProvider" {
    export = InvalidPositionProvider;
    const InvalidPositionProvider_base: typeof import("lib/positioning/PositionProvider");
    /**
     * An implementation of {@link PositionProvider} which throws an exception for every method. Can be used as a
     * placeholder until an actual implementation is set.
     */
    class InvalidPositionProvider extends InvalidPositionProvider_base {
    }
}
declare module "lib/triggers/Trigger" {
    export = Trigger;
    /**
     * Encapsulates image retrieval.
     *
     * @abstract
     */
    class Trigger {
        /**
         * @return {Trigger.TriggerType}
         */
        getTriggerType(): Trigger.TriggerType;
    }
    namespace Trigger {
        export namespace TriggerType {
            export const Unknown: string;
            export const Mouse: string;
            export const Text: string;
            export const Keyboard: string;
        }
        export type TriggerType = string;
    }
}
declare module "lib/triggers/TextTrigger" {
    export = TextTrigger;
    const TextTrigger_base: typeof import("lib/triggers/Trigger");
    /**
     * Encapsulates a text input by the user.
     */
    class TextTrigger extends TextTrigger_base {
        /**
         *
         * @param {Region} control
         * @param {string} text
         */
        constructor(control: any, text: string);
        _text: string;
        _control: any;
        /**
         * @return {string}
         */
        getText(): string;
        /**
         * @return {Region}
         */
        getControl(): any;
    }
}
declare module "lib/triggers/MouseTrigger" {
    export = MouseTrigger;
    const MouseTrigger_base: typeof import("lib/triggers/Trigger");
    /**
     * Encapsulates a text input by the user.
     */
    class MouseTrigger extends MouseTrigger_base {
        /**
         * @param {MouseTrigger.MouseAction} mouseAction
         * @param {Region} control
         * @param {Location} location
         */
        constructor(mouseAction: MouseTrigger.MouseAction, control: any, location: Location);
        _mouseAction: string;
        _control: any;
        _location: Location;
        /**
         * @return {MouseTrigger.MouseAction}
         */
        getMouseAction(): MouseTrigger.MouseAction;
        /**
         * @return {Region}
         */
        getControl(): any;
        /**
         * @return {Location}
         */
        getLocation(): Location;
    }
    namespace MouseTrigger {
        export namespace MouseAction {
            export const None: string;
            export const Click: string;
            export const RightClick: string;
            export const DoubleClick: string;
            export const Move: string;
            export const Down: string;
            export const Up: string;
        }
        export type MouseAction = string;
    }
}
declare module "lib/match/MatchWindowData" {
    export = MatchWindowData;
    /**
     * Encapsulates the data to be sent to the agent on a "matchWindow" command.
     */
    class MatchWindowData {
        /**
         * @param data
         * @param {Trigger[]} data.userInputs - A list of triggers between the previous matchWindow call and the current matchWindow
         *   call. Can be array of size 0, but MUST NOT be null.
         * @param {AppOutput} data.appOutput - The appOutput for the current matchWindow call.
         * @param {string} data.tag - The tag of the window to be matched.
         * @param {boolean} [data.ignoreMismatch]
         * @param {Options} [data.options]
         */
        constructor({ userInputs, appOutput, tag, ignoreMismatch, options }?: {
            userInputs: any;
            appOutput: any;
            tag: any;
            ignoreMismatch: any;
            options: any;
        }, ...args: any[]);
        _userInputs: any;
        _appOutput: any;
        _tag: any;
        _ignoreMismatch: any;
        _options: any;
        /**
         * @return {Trigger[]}
         */
        getUserInputs(): any[];
        /**
         * @return {AppOutput}
         */
        getAppOutput(): any;
        /**
         * @return {string}
         */
        getTag(): string;
        /**
         * @return {?boolean}
         */
        getIgnoreMismatch(): boolean | null;
        /**
         * @return {?Options}
         */
        getOptions(): any;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/events/SessionEventHandlers" {
    export = SessionEventHandlers;
    const SessionEventHandlers_base: typeof import("lib/events/SessionEventHandler");
    class SessionEventHandlers extends SessionEventHandlers_base {
        /** @type {SessionEventHandler[]} */
        _eventHandlers: import("lib/events/SessionEventHandler")[];
        /**
         * @param {SessionEventHandler} handler
         */
        addEventHandler(handler: import("lib/events/SessionEventHandler")): void;
        /**
         * @param {SessionEventHandler} handler
         */
        removeEventHandler(handler: import("lib/events/SessionEventHandler")): void;
        clearEventHandlers(): void;
    }
}
declare module "lib/TestResults" {
    export = TestResults;
    /**
     * @typedef SessionAccessibilityStatus
     * @prop {AccessibilityLevel} level - accessibility level.
     * @prop {AccessibilityGuidelinesVersion} version - accessibility guidelines version.
     * @prop {AccessibilityStatus} status - test accessibility status.
     */
    /**
     * Eyes test results.
     */
    class TestResults {
        /**
         * @param results
         * @param {string} [results.id]
         * @param {string} [results.name]
         * @param {string} [results.secretToken]
         * @param {TestResultsStatus} [results.status]
         * @param {string} [results.appName]
         * @param {string} [results.batchName]
         * @param {string} [results.batchId]
         * @param {string} [results.branchName]
         * @param {string} [results.hostOS]
         * @param {string} [results.hostApp]
         * @param {RectangleSize|object} [results.hostDisplaySize]
         * @param {SessionAccessibilityStatus} [results.accessibilityStatus]
         * @param {Date|string} [results.startedAt]
         * @param {number} [results.duration]
         * @param {boolean} [results.isNew]
         * @param {boolean} [results.isDifferent]
         * @param {boolean} [results.isAborted]
         * @param {SessionUrls|object} [results.appUrls]
         * @param {SessionUrls|object} [results.apiUrls]
         * @param {StepInfo[]|object[]} [results.stepsInfo]
         * @param {number} [results.steps]
         * @param {number} [results.matches]
         * @param {number} [results.mismatches]
         * @param {number} [results.missing]
         * @param {number} [results.exactMatches]
         * @param {number} [results.strictMatches]
         * @param {number} [results.contentMatches]
         * @param {number} [results.layoutMatches]
         * @param {number} [results.noneMatches]
         * @param {string} [results.url]
         */
        constructor({ id, name, secretToken, status, appName, batchName, batchId, branchName, hostOS, hostApp, hostDisplaySize, startedAt, duration, isNew, isDifferent, isAborted, appUrls, apiUrls, stepsInfo, steps, matches, mismatches, missing, exactMatches, strictMatches, contentMatches, layoutMatches, noneMatches, url, accessibilityStatus, }?: {
            id: any;
            name: any;
            secretToken: any;
            status: any;
            appName: any;
            batchName: any;
            batchId: any;
            branchName: any;
            hostOS: any;
            hostApp: any;
            hostDisplaySize: any;
            startedAt: any;
            duration: any;
            isNew: any;
            isDifferent: any;
            isAborted: any;
            appUrls: any;
            apiUrls: any;
            stepsInfo: any;
            steps: any;
            matches: any;
            mismatches: any;
            missing: any;
            exactMatches: any;
            strictMatches: any;
            contentMatches: any;
            layoutMatches: any;
            noneMatches: any;
            url: any;
            accessibilityStatus: any;
        });
        _id: any;
        _name: any;
        _secretToken: any;
        _status: any;
        _appName: any;
        _batchName: any;
        _batchId: any;
        _branchName: any;
        _hostOS: any;
        _hostApp: any;
        _hostDisplaySize: any;
        _startedAt: any;
        _duration: any;
        _isNew: any;
        _isDifferent: any;
        _isAborted: any;
        _appUrls: any;
        _apiUrls: any;
        _stepsInfo: any;
        _steps: any;
        _matches: any;
        _mismatches: any;
        _missing: any;
        _exactMatches: any;
        _strictMatches: any;
        _contentMatches: any;
        _layoutMatches: any;
        _noneMatches: any;
        _url: any;
        _accessibilityStatus: any;
        /** @type {ServerConnector} */
        _serverConnector: any;
        /**
         * @return {string}
         */
        getId(): string;
        /**
         * @param {string} value
         */
        setId(value: string): void;
        /**
         * @return {string}
         */
        getName(): string;
        /**
         * @param {string} value
         */
        setName(value: string): void;
        /**
         * @return {string}
         */
        getSecretToken(): string;
        /**
         * @param {string} value
         */
        setSecretToken(value: string): void;
        /**
         * @return {TestResultsStatus}
         */
        getStatus(): TestResultsStatus;
        /**
         * @param {TestResultsStatus} value
         */
        setStatus(value: TestResultsStatus): void;
        /**
         * @return {string}
         */
        getAppName(): string;
        /**
         * @param {string} value
         */
        setAppName(value: string): void;
        /**
         * @return {string}
         */
        getBatchName(): string;
        /**
         * @param {string} value
         */
        setBatchName(value: string): void;
        /**
         * @return {string}
         */
        getBatchId(): string;
        /**
         * @param {string} value
         */
        setBatchId(value: string): void;
        /**
         * @return {string}
         */
        getBranchName(): string;
        /**
         * @param {string} value
         */
        setBranchName(value: string): void;
        /**
         * @return {string}
         */
        getHostOS(): string;
        /**
         * @param {string} value
         */
        setHostOS(value: string): void;
        /**
         * @return {string}
         */
        getHostApp(): string;
        /**
         * @param {string} value
         */
        setHostApp(value: string): void;
        /**
         * @return {RectangleSize}
         */
        getHostDisplaySize(): import("lib/geometry/RectangleSize");
        /**
         * @param {RectangleSize} value
         */
        setHostDisplaySize(value: import("lib/geometry/RectangleSize")): void;
        /**
         * @return {SessionAccessibilityStatus}
         */
        getAccessibilityStatus(): SessionAccessibilityStatus;
        /**
         * @param {SessionAccessibilityStatus} value
         */
        setAccessibilityStatus(value: SessionAccessibilityStatus): void;
        /**
         * @return {Date}
         */
        getStartedAt(): Date;
        /**
         * @param {Date} value
         */
        setStartedAt(value: Date): void;
        /**
         * @return {number}
         */
        getDuration(): number;
        /**
         * @param {number} value
         */
        setDuration(value: number): void;
        /**
         * @return {boolean} - Whether or not this is a new test.
         */
        getIsNew(): boolean;
        /**
         * @param {boolean} value - Whether or not this test has an existing baseline.
         */
        setIsNew(value: boolean): void;
        /**
         * @return {boolean}
         */
        getIsDifferent(): boolean;
        /**
         * @param {boolean} value
         */
        setIsDifferent(value: boolean): void;
        /**
         * @return {boolean}
         */
        getIsAborted(): boolean;
        /**
         * @param {boolean} value
         */
        setIsAborted(value: boolean): void;
        /**
         * @return {SessionUrls}
         */
        getAppUrls(): SessionUrls;
        /**
         * @param {SessionUrls} value
         */
        setAppUrls(value: SessionUrls): void;
        /**
         * @return {SessionUrls}
         */
        getApiUrls(): SessionUrls;
        /**
         * @param {SessionUrls} value
         */
        setApiUrls(value: SessionUrls): void;
        /**
         * @return {StepInfo[]}
         */
        getStepsInfo(): StepInfo[];
        /**
         * @param {StepInfo[]} value
         */
        setStepsInfo(value: StepInfo[]): void;
        /**
         * @return {number} - The total number of test steps.
         */
        getSteps(): number;
        /**
         * @param {number} value - The number of visual checkpoints in the test.
         */
        setSteps(value: number): void;
        /**
         * @return {number} - The total number of test steps that matched the baseline.
         */
        getMatches(): number;
        /**
         * @param {number} value - The number of visual matches in the test.
         */
        setMatches(value: number): void;
        /**
         * @return {number} - The total number of test steps that did not match the baseline.
         */
        getMismatches(): number;
        /**
         * @param {number} value - The number of mismatches in the test.
         */
        setMismatches(value: number): void;
        /**
         * @return {number} - The total number of baseline test steps that were missing in the test.
         */
        getMissing(): number;
        /**
         * @param {number} value - The number of visual checkpoints that were available in the baseline but were not found
         *   in the current test.
         */
        setMissing(value: number): void;
        /**
         * @return {number} - The total number of test steps that exactly matched the baseline.
         */
        getExactMatches(): number;
        /**
         * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Exact}
         */
        setExactMatches(value: number): void;
        /**
         * @return {number} - The total number of test steps that strictly matched the baseline.
         */
        getStrictMatches(): number;
        /**
         * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Strict}
         */
        setStrictMatches(value: number): void;
        /**
         * @return {number} - The total number of test steps that matched the baseline by content.
         */
        getContentMatches(): number;
        /**
         * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Content}
         */
        setContentMatches(value: number): void;
        /**
         * @return {number} - The total number of test steps that matched the baseline by layout.
         */
        getLayoutMatches(): number;
        /**
         * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#Layout}
         */
        setLayoutMatches(value: number): void;
        /**
         * @return {number} - The total number of test steps that matched the baseline without performing any comparison.
         */
        getNoneMatches(): number;
        /**
         * @param {number} value - The number of matches performed with match level set to {@link MatchLevel#None}
         */
        setNoneMatches(value: number): void;
        /**
         * @return {string} - The URL where test results can be viewed.
         */
        getUrl(): string;
        /**
         * @param {string} value - The URL of the test results.
         */
        setUrl(value: string): void;
        /**
         * @return {boolean} - Whether or not this test passed.
         */
        isPassed(): boolean;
        /**
         * @param {ServerConnector} serverConnector
         */
        setServerConnector(serverConnector: any): void;
        /**
         * @return {Promise}
         */
        deleteSession(): Promise<any>;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
    namespace TestResults {
        export { TestResultsStatus, SessionAccessibilityStatus };
    }
    type TestResultsStatus = string;
    type SessionAccessibilityStatus = {
        /**
         * - accessibility level.
         */
        level: any;
        /**
         * - accessibility guidelines version.
         */
        version: any;
        /**
         * - test accessibility status.
         */
        status: any;
    };
    /**
     * @typedef {import('./TestResultsStatus').TestResultsStatus} TestResultsStatus
     */
    class SessionUrls {
        /**
         * @param data
         * @param {string} data.batch
         * @param {string} data.session
         */
        constructor({ batch, session }?: {
            batch: any;
            session: any;
        });
        _batch: any;
        _session: any;
        /**
         * @return {string}
         */
        getBatch(): string;
        /**
         * @param {string} value
         */
        setBatch(value: string): void;
        /**
         * @return {string}
         */
        getSession(): string;
        /**
         * @param {string} value
         */
        setSession(value: string): void;
        /**
         * @override
         */
        toJSON(): any;
    }
    class StepInfo {
        /**
         * @param info
         * @param {string} info.name
         * @param {boolean} info.isDifferent
         * @param {boolean} info.hasBaselineImage
         * @param {boolean} info.hasCurrentImage
         * @param {AppUrls|object} info.appUrls
         * @param {ApiUrls|object} info.apiUrls
         * @param {string[]} [info.renderId]
         */
        constructor({ name, isDifferent, hasBaselineImage, hasCurrentImage, appUrls, apiUrls, renderId, }?: {
            name: any;
            isDifferent: any;
            hasBaselineImage: any;
            hasCurrentImage: any;
            appUrls: any;
            apiUrls: any;
            renderId: any;
        });
        _name: any;
        _isDifferent: any;
        _hasBaselineImage: any;
        _hasCurrentImage: any;
        _appUrls: any;
        _apiUrls: any;
        _renderId: any;
        /**
         * @return {string}
         */
        getName(): string;
        /**
         * @param {string} value
         */
        setName(value: string): void;
        /**
         * @return {boolean}
         */
        getIsDifferent(): boolean;
        /**
         * @param {boolean} value
         */
        setIsDifferent(value: boolean): void;
        /**
         * @return {boolean}
         */
        getHasBaselineImage(): boolean;
        /**
         * @param {boolean} value
         */
        setHasBaselineImage(value: boolean): void;
        /**
         * @return {boolean}
         */
        getHasCurrentImage(): boolean;
        /**
         * @param {boolean} value
         */
        setHasCurrentImage(value: boolean): void;
        /**
         * @return {AppUrls}
         */
        getAppUrls(): AppUrls;
        /**
         * @param {AppUrls} value
         */
        setAppUrls(value: AppUrls): void;
        /**
         * @return {ApiUrls}
         */
        getApiUrls(): ApiUrls;
        /**
         * @param {ApiUrls} value
         */
        setApiUrls(value: ApiUrls): void;
        /**
         * @return {string} value
         */
        getRenderId(): string;
        /**
         * @param {string} value
         */
        setRenderId(value: string): void;
        /**
         * @override
         */
        toJSON(): any;
    }
    class AppUrls {
        /**
         * @param data
         * @param {string} data.step
         * @param {string} data.stepEditor
         */
        constructor({ step, stepEditor }?: {
            step: any;
            stepEditor: any;
        });
        _step: any;
        _stepEditor: any;
        /**
         * @return {string}
         */
        getStep(): string;
        /**
         * @param {string} value
         */
        setStep(value: string): void;
        /**
         * @return {string}
         */
        getStepEditor(): string;
        /**
         * @param {string} value
         */
        setStepEditor(value: string): void;
        /**
         * @override
         */
        toJSON(): any;
    }
    class ApiUrls {
        /**
         * @param data
         * @param {string} data.baselineImage
         * @param {string} data.currentImage
         * @param {string} data.checkpointImage
         * @param {string} data.checkpointImageThumbnail
         * @param {string} data.diffImage
         */
        constructor({ baselineImage, currentImage, checkpointImage, checkpointImageThumbnail, diffImage, }?: {
            baselineImage: any;
            currentImage: any;
            checkpointImage: any;
            checkpointImageThumbnail: any;
            diffImage: any;
        });
        _baselineImage: any;
        _currentImage: any;
        _checkpointImage: any;
        _checkpointImageThumbnail: any;
        _diffImage: any;
        /**
         * @return {string}
         */
        getBaselineImage(): string;
        /**
         * @param {string} value
         */
        setBaselineImage(value: string): void;
        /**
         * @return {string}
         */
        getCurrentImage(): string;
        /**
         * @param {string} value
         */
        setCurrentImage(value: string): void;
        /**
         * @return {string}
         */
        getCheckpointImage(): string;
        /**
         * @param {string} value
         */
        setCheckpointImage(value: string): void;
        /**
         * @return {string}
         */
        getCheckpointImageThumbnail(): string;
        /**
         * @param {string} value
         */
        setCheckpointImageThumbnail(value: string): void;
        /**
         * @return {string}
         */
        getDiffImage(): string;
        /**
         * @param {string} value
         */
        setDiffImage(value: string): void;
        /**
         * @override
         */
        toJSON(): any;
    }
}
declare module "lib/server/RenderingInfo" {
    export = RenderingInfo;
    class RenderingInfo {
        /**
         * @param info
         * @param {string} info.serviceUrl
         * @param {string} info.accessToken
         * @param {string} info.resultsUrl
         */
        constructor({ serviceUrl, accessToken, resultsUrl, stitchingServiceUrl }?: {
            serviceUrl: any;
            accessToken: any;
            resultsUrl: any;
            stitchingServiceUrl: any;
        });
        _serviceUrl: any;
        _accessToken: any;
        _resultsUrl: any;
        _stitchingServiceUrl: any;
        /**
         * @return {string}
         */
        getServiceUrl(): string;
        /**
         * @param {string} value
         */
        setServiceUrl(value: string): void;
        /**
         * @return {string}
         */
        getAccessToken(): string;
        /**
         * @param {string} value
         */
        setAccessToken(value: string): void;
        /**
         * @return {string}
         */
        getResultsUrl(): string;
        /**
         * @param {string} value
         */
        setResultsUrl(value: string): void;
        /**
         * @return {{sub: string, exp: number, iss: string}}
         */
        getDecodedAccessToken(): {
            sub: string;
            exp: number;
            iss: string;
        };
        _payload: any;
        /**
         * @return {string}
         */
        getStitchingServiceUrl(): string;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/server/RunningSession" {
    export = RunningSession;
    /**
     * Encapsulates data for the session currently running in the agent.
     */
    class RunningSession {
        /**
         * @param session
         * @param {string} session.id
         * @param {string} session.sessionId
         * @param {string} session.batchId
         * @param {string} session.baselineId
         * @param {string} session.url
         * @param {RenderingInfo|object} session.renderingInfo
         */
        constructor({ id, sessionId, batchId, baselineId, url, renderingInfo, isNew }?: {
            id: any;
            sessionId: any;
            batchId: any;
            baselineId: any;
            url: any;
            renderingInfo: any;
            isNew: any;
        });
        _id: any;
        _sessionId: any;
        _batchId: any;
        _baselineId: any;
        _url: any;
        _renderingInfo: any;
        _isNew: any;
        /**
         * @return {string}
         */
        getId(): string;
        /**
         * @param {string} value
         */
        setId(value: string): void;
        /**
         * @return {string}
         */
        getSessionId(): string;
        /**
         * @param {string} value
         */
        setSessionId(value: string): void;
        /**
         * @return {string}
         */
        getBatchId(): string;
        /**
         * @param {string} value
         */
        setBatchId(value: string): void;
        /**
         * @return {string}
         */
        getBaselineId(): string;
        /**
         * @param {string} value
         */
        setBaselineId(value: string): void;
        /**
         * @return {string}
         */
        getUrl(): string;
        /**
         * @param {string} value
         */
        setUrl(value: string): void;
        /**
         * @return {RenderingInfo}
         */
        getRenderingInfo(): any;
        /**
         * @param {RenderingInfo} value
         */
        setRenderingInfo(value: any): void;
        /**
         * @return {boolean}
         */
        getIsNew(): boolean;
        /**
         * @param {boolean} value
         */
        setIsNew(value: boolean): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/server/requestHelpers" {
    export function configAxiosProxy({ axiosConfig, proxy, logger }: {
        axiosConfig: any;
        proxy: any;
        logger: any;
    }): any;
    export function configureAxios({ axiosConfig, configuration, agentId, logger }: {
        axiosConfig: any;
        configuration: any;
        agentId: any;
        logger: any;
    }): void;
    export function delayRequest({ axiosConfig, logger }: {
        axiosConfig: any;
        logger: any;
    }): Promise<void>;
    export function handleRequestResponse({ response, axios, logger }: {
        response: any;
        axios: any;
        logger: any;
    }): Promise<any>;
    export function handleRequestError({ err, axios, logger }: {
        err: any;
        axios: any;
        logger: any;
    }): Promise<any>;
}
declare module "lib/renderer/RunningRender" {
    export = RunningRender;
    /**
     * Encapsulates data for the render currently running in the client.
     */
    class RunningRender {
        /**
         * @param data
         * @param {string} data.renderId
         * @param {string} data.jobId
         * @param {RenderStatus} data.renderStatus
         * @param {string[]} data.needMoreResources
         * @param {boolean} data.needMoreDom
         */
        constructor({ renderId, jobId, renderStatus, needMoreResources, needMoreDom }?: {
            renderId: any;
            jobId: any;
            renderStatus: any;
            needMoreResources: any;
            needMoreDom: any;
        });
        _renderId: any;
        _jobId: any;
        _renderStatus: any;
        _needMoreResources: any;
        _needMoreDom: any;
        /**
         * @return {string}
         */
        getRenderId(): string;
        /**
         * @param {string} value
         */
        setRenderId(value: string): void;
        /**
         * @return {string}
         */
        getJobId(): string;
        /**
         * @param {string} value
         */
        setJobId(value: string): void;
        /**
         * @return {RenderStatus}
         */
        getRenderStatus(): any;
        /**
         * @param {RenderStatus} value
         */
        setRenderStatus(value: any): void;
        /**
         * @return {string[]}
         */
        getNeedMoreResources(): string[];
        /**
         * @param {string[]} value
         */
        setNeedMoreResources(value: string[]): void;
        /**
         * @return {boolean}
         */
        getNeedMoreDom(): boolean;
        /**
         * @param {boolean} value
         */
        setNeedMoreDom(value: boolean): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/renderer/RenderStatusResults" {
    export = RenderStatusResults;
    /**
     * Encapsulates data for the render currently running in the client.
     */
    class RenderStatusResults {
        /**
         * @param {RenderStatus} status
         * @param {string} imageLocation
         * @param {string} domLocation
         * @param {string} error
         * @param {string} os
         * @param {string} userAgent
         * @param {RectangleSize|object} deviceSize
         * @param {Region[]||object[]} selectorRegions
         */
        constructor({ status, imageLocation, domLocation, error, os, userAgent, deviceSize, selectorRegions, }?: any);
        _status: any;
        _imageLocation: any;
        _domLocation: any;
        _error: any;
        _os: any;
        _userAgent: any;
        _deviceSize: any;
        _selectorRegions: any;
        /**
         * @return {boolean}
         */
        isEmpty(): boolean;
        /**
         * @return {RenderStatus}
         */
        getStatus(): any;
        /**
         * @param {RenderStatus} value
         */
        setStatus(value: any): void;
        /**
         * @return {string}
         */
        getImageLocation(): string;
        /**
         * @param {string} value
         */
        setImageLocation(value: string): void;
        /**
         * @return {string}
         */
        getDomLocation(): string;
        /**
         * @param {string} value
         */
        setDomLocation(value: string): void;
        /**
         * @return {string}
         */
        getError(): string;
        /**
         * @param {string} value
         */
        setError(value: string): void;
        /**
         * @return {string}
         */
        getOS(): string;
        /**
         * @param {string} value
         */
        setOS(value: string): void;
        /**
         * @return {string}
         */
        getUserAgent(): string;
        /**
         * @param {string} value
         */
        setUserAgent(value: string): void;
        /**
         * @return {RectangleSize}
         */
        getDeviceSize(): import("lib/geometry/RectangleSize");
        /**
         * @param {RectangleSize} value
         */
        setDeviceSize(value: import("lib/geometry/RectangleSize")): void;
        /**
         * @return {Region[]}
         */
        getSelectorRegions(): import("lib/geometry/Region")[];
        /**
         * @param {Region[]} value
         */
        setSelectorRegions(value: import("lib/geometry/Region")[]): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/server/ServerConnector" {
    export = ServerConnector;
    /**
     * Provides an API for communication with the Applitools server.
     */
    class ServerConnector {
        /**
         * @param {Logger} logger
         * @param {Configuration} configuration
         */
        constructor({ logger, configuration, getAgentId }: any);
        _logger: any;
        _configuration: any;
        /** @type {RenderingInfo} */
        _renderingInfo: import("lib/server/RenderingInfo");
        _axios: any;
        /**
         * @return {RenderingInfo}
         */
        getRenderingInfo(): import("lib/server/RenderingInfo");
        /**
         * @param {RenderingInfo} renderingInfo
         */
        setRenderingInfo(renderingInfo: import("lib/server/RenderingInfo")): void;
        /**
         * Starts a new running session in the agent. Based on the given parameters, this running session will either be
         * linked to an existing session, or to a completely new session.
         *
         * @param {SessionStartInfo} sessionStartInfo - The start parameters for the session.
         * @return {Promise<RunningSession>} - RunningSession object which represents the current running session
         */
        startSession(sessionStartInfo: any): Promise<import("lib/server/RunningSession")>;
        /**
         * Stops the running session.
         *
         * @param {RunningSession} runningSession - The running session to be stopped.
         * @param {boolean} isAborted
         * @param {boolean} save
         * @return {Promise<TestResults>} - TestResults object for the stopped running session
         */
        stopSession(runningSession: import("lib/server/RunningSession"), isAborted: boolean, save: boolean): Promise<any>;
        /**
         * Stops the running batch sessions.
         *
         * @param {string} batchId - The batchId to be stopped.
         * @return {Promise<void>}
         */
        deleteBatchSessions(batchId: string): Promise<void>;
        /**
         * Deletes the given test result
         *
         * @param {TestResults} testResults - The session to delete by test results.
         * @return {Promise}
         */
        deleteSession(testResults: any): Promise<any>;
        uploadScreenshot(id: any, screenshot: any): Promise<string>;
        /**
         * Matches the current window (held by the WebDriver) to the expected window.
         *
         * @param {RunningSession} runningSession - The current agent's running session.
         * @param {MatchWindowData} matchWindowData - Encapsulation of a capture taken from the application.
         * @return {Promise<MatchResult>} - The results of the window matching.
         */
        matchWindow(runningSession: import("lib/server/RunningSession"), matchWindowData: any): Promise<import("lib/match/MatchResult")>;
        /**
         * Matches the current window in single request.
         *
         * @param {MatchSingleWindowData} matchSingleWindowData - Encapsulation of a capture taken from the application.
         * @return {Promise<TestResults>} - The results of the window matching.
         */
        matchSingleWindow(matchSingleWindowData: any): Promise<any>;
        /**
         * Replaces an actual image in the current running session.
         *
         * @param {RunningSession} runningSession - The current agent's running session.
         * @param {number} stepIndex - The zero based index of the step in which to replace the actual image.
         * @param {MatchWindowData} matchWindowData - Encapsulation of a capture taken from the application.
         * @return {Promise<MatchResult>} - The results of the window matching.
         */
        replaceWindow(runningSession: import("lib/server/RunningSession"), stepIndex: number, matchWindowData: any): Promise<import("lib/match/MatchResult")>;
        /**
         * Initiate a rendering using RenderingGrid API
         *
         * @return {Promise<RenderingInfo>} - The results of the render request
         */
        renderInfo(): Promise<import("lib/server/RenderingInfo")>;
        batchInfo(batchId: any): Promise<any>;
        /**
         * Initiate a rendering using RenderingGrid API
         *
         * @param {RenderRequest[]|RenderRequest} renderRequest - The current agent's running session.
         * @return {Promise<RunningRender[]|RunningRender>} - The results of the render request
         */
        render(renderRequest: any[] | any): Promise<import("lib/renderer/RunningRender")[] | import("lib/renderer/RunningRender")>;
        /**
         * Check if resource exists on the server
         *
         * @param {RunningRender} runningRender - The running render (for second request only)
         * @param {RGridResource} resource - The resource to use
         * @return {Promise<boolean>} - Whether resource exists on the server or not
         */
        renderCheckResource(runningRender: import("lib/renderer/RunningRender"), resource: any): Promise<boolean>;
        /**
         * Upload resource to the server
         *
         * @param {RunningRender} runningRender - The running render (for second request only)
         * @param {RGridResource} resource - The resource to upload
         * @return {Promise<boolean>} - True if resource was uploaded
         */
        renderPutResource(runningRender: import("lib/renderer/RunningRender"), resource: any): Promise<boolean>;
        /**
         * Get the rendering status for current render
         *
         * @param {RunningRender} runningRender - The running render
         * @param {boolean} [delayBeforeRequest=false] - If {@code true}, then the request will be delayed
         * @return {Promise<RenderStatusResults>} - The render's status
         */
        renderStatus(runningRender: import("lib/renderer/RunningRender"), delayBeforeRequest?: boolean): Promise<import("lib/renderer/RenderStatusResults")>;
        /**
         * Get the rendering status for current render
         *
         * @param {string[]|string} renderId - The running renderId
         * @param {boolean} [delayBeforeRequest=false] - If {@code true}, then the request will be delayed
         * @return {Promise<RenderStatusResults[]|RenderStatusResults>} - The render's status
         */
        renderStatusById(renderId: string[] | string, delayBeforeRequest?: boolean): Promise<import("lib/renderer/RenderStatusResults")[] | import("lib/renderer/RenderStatusResults")>;
        /**
         * @param {string} domJson
         * @return {Promise<string>}
         */
        postDomSnapshot(id: any, domJson: string): Promise<string>;
        getUserAgents(): Promise<any>;
    }
}
declare module "lib/AppEnvironment" {
    export = AppEnvironment;
    /**
     * The environment in which the application under test is executing.
     */
    class AppEnvironment {
        /**
         * Creates a new AppEnvironment instance.
         *
         * @param {string} inferred
         * @return {AppEnvironment}
         */
        static fromInferred(inferred: string): AppEnvironment;
        /**
         * Creates a new AppEnvironment instance.
         * @param data
         * @param {string} [data.os]
         * @param {string} [data.hostingApp]
         * @param {RectangleSize} [data.displaySize]
         * @param {string} [data.deviceInfo]
         * @param {string} [data.osInfo]
         * @param {string} [data.hostingAppInfo]
         */
        constructor({ os, hostingApp, displaySize, deviceInfo, osInfo, hostingAppInfo }?: {
            os: any;
            hostingApp: any;
            displaySize: any;
            deviceInfo: any;
            osInfo: any;
            hostingAppInfo: any;
        });
        _os: any;
        _hostingApp: any;
        _displaySize: any;
        _deviceInfo: any;
        _osInfo: any;
        _hostingAppInfo: any;
        /** @type {string} */
        _inferred: string;
        /**
         * Gets the information inferred from the execution environment or {@code null} if no information could be inferred.
         *
         * @return {string}
         */
        geInferred(): string;
        /**
         * Sets the inferred environment information.
         *
         * @param {string} value
         */
        setInferred(value: string): void;
        /**
         * Gets the OS hosting the application under test or {@code null} if unknown.
         *
         * @return {string}
         */
        getOs(): string;
        /**
         * Sets the OS hosting the application under test or {@code null} if unknown.
         *
         * @param {string} value
         */
        setOs(value: string): void;
        /**
         * Gets the application hosting the application under test or {@code null} if unknown.
         *
         * @return {string}
         */
        getHostingApp(): string;
        /**
         * Sets the application hosting the application under test or {@code null} if unknown.
         *
         * @param {string} value
         */
        setHostingApp(value: string): void;
        /**
         * Gets the display size of the application or {@code null} if unknown.
         *
         * @return {RectangleSize}
         */
        getDisplaySize(): import("lib/geometry/RectangleSize");
        /**
         * Sets the display size of the application or {@code null} if unknown.
         *
         * @param {RectangleSize} value
         */
        setDisplaySize(value: import("lib/geometry/RectangleSize")): void;
        /**
         * Gets the OS hosting the application under test or {@code null} if unknown. (not part of test signature)
         *
         * @return {string}
         */
        getOsInfo(): string;
        /**
         * Sets the OS hosting the application under test or {@code null} if unknown. (not part of test signature)
         *
         * @param {string} value
         */
        setOsInfo(value: string): void;
        /**
         * Gets the application hosting the application under test or {@code null} if unknown. (not part of test signature)
         *
         * @return {string}
         */
        getHostingAppInfo(): string;
        /**
         * Sets the application hosting the application under test or {@code null} if unknown. (not part of test signature)
         *
         * @param {string} value
         */
        setHostingAppInfo(value: string): void;
        /**
         * Gets the device info (not part of test signature)
         *
         * @return {string}
         */
        getDeviceInfo(): string;
        /**
         * Sets the device info (not part of test signature)
         *
         * @param {string} value
         */
        setDeviceInfo(value: string): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/match/ImageMatchOptions" {
    export = ImageMatchOptions;
    /**
     * Encapsulates the "Options" section of the MatchExpectedOutput body data.
     */
    class ImageMatchOptions {
        /**
         * @param options
         * @param {string} options.name - The tag of the window to be matched.
         * @param {string} options.renderId - The render ID of the screenshot to match.
         * @param {Trigger[]} options.userInputs - A list of triggers between the previous matchWindow call and the current matchWindow
         *   call. Can be array of size 0, but MUST NOT be null.
         * @param {boolean} options.ignoreMismatch - Tells the server whether or not to store a mismatch for the current window as
         *   window in the session.
         * @param {boolean} options.ignoreMatch - Tells the server whether or not to store a match for the current window as window in
         *   the session.
         * @param {boolean} options.forceMismatch - Forces the server to skip the comparison process and mark the current window as a
         *   mismatch.
         * @param {boolean} options.forceMatch - Forces the server to skip the comparison process and mark the current window as a
         *   match.
         * @param {ImageMatchSettings} options.imageMatchSettings - Settings specifying how the server should compare the image.
         * @param {string} options.source
         */
        constructor({ name, renderId, userInputs, ignoreMismatch, ignoreMatch, forceMismatch, forceMatch, imageMatchSettings, source, }?: {
            name: any;
            renderId: any;
            userInputs: any;
            ignoreMismatch: any;
            ignoreMatch: any;
            forceMismatch: any;
            forceMatch: any;
            imageMatchSettings: any;
            source: any;
        }, ...args: any[]);
        _name: any;
        _renderId: any;
        _userInputs: any;
        _ignoreMismatch: any;
        _ignoreMatch: any;
        _forceMismatch: any;
        _forceMatch: any;
        _imageMatchSettings: any;
        _source: any;
        /**
         * @return {string}
         */
        getName(): string;
        /**
         * @return {string}
         */
        getRenderId(): string;
        /**
         * @return {Trigger[]}
         */
        getUserInputs(): any[];
        /**
         * @return {boolean}
         */
        getIgnoreMismatch(): boolean;
        /**
         * @return {boolean}
         */
        getIgnoreMatch(): boolean;
        /**
         * @return {boolean}
         */
        getForceMismatch(): boolean;
        /**
         * @return {boolean}
         */
        getForceMatch(): boolean;
        /**
         * @return {ImageMatchSettings}
         */
        getImageMatchSettings(): any;
        /**
         * @return {string}
         */
        getSource(): string;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/MatchWindowTask" {
    export = MatchWindowTask;
    /**
     * Handles matching of output with the expected output (including retry and 'ignore mismatch' when needed).
     *
     * @ignore
     */
    class MatchWindowTask {
        /**
         * @param {Logger} logger - A logger instance.
         * @param {ServerConnector} serverConnector - Our gateway to the agent
         * @param {RunningSession} runningSession - The running session in which we should match the window
         * @param {number} retryTimeout - The default total time to retry matching (ms).
         * @param {EyesBase} eyes - The eyes object.
         * @param {AppOutputProvider} [appOutputProvider] - A callback for getting the application output when performing match.
         */
        constructor(logger: any, serverConnector: any, runningSession: any, retryTimeout: number, eyes: any, appOutputProvider?: any);
        _logger: any;
        _serverConnector: any;
        _runningSession: any;
        _defaultRetryTimeout: number;
        _eyes: any;
        _appOutputProvider: any;
        /** @type {MatchResult} */ _matchResult: any;
        /** @type {EyesScreenshot} */ _lastScreenshot: any;
        /** @type {Region} */ _lastScreenshotBounds: import("lib/geometry/Region");
        /**
         * Creates the match model and calls the server connector matchWindow method.
         *
         * @param {Trigger[]} userInputs - The user inputs related to the current appOutput.
         * @param {AppOutputWithScreenshot} appOutput - The application output to be matched.
         * @param {string} name - Optional tag to be associated with the match (can be {@code null}).
         * @param {string} renderId - Optional render ID to be associated with the match (can be {@code null}).
         * @param {boolean} ignoreMismatch - Whether to instruct the server to ignore the match attempt in case of a mismatch.
         * @param {ImageMatchSettings} imageMatchSettings - The settings to use.
         * @param {string} source
         * @return {Promise<MatchResult>} - The match result.
         */
        performMatch(userInputs: any[], appOutput: any, name: string, renderId: string, ignoreMismatch: boolean, imageMatchSettings: import("lib/config/ImageMatchSettings"), source: string): Promise<any>;
        /**
         * @param {GetRegion[]|GetFloatingRegion[]|GetAccessibilityRegion[]} regionProviders
         * @param {EyesScreenshot} screenshot
         * @return {Promise<Region[]|FloatingMatchSettings[]|AccessibilityMatchSettings[]>}
         */
        _getTotalRegions(regionProviders: any[] | any[] | any[], screenshot: any): Promise<import("lib/geometry/Region")[] | any[] | any[]>;
        /**
         * @param {CheckSettings} checkSettings
         * @param {ImageMatchSettings} imageMatchSettings
         * @param {EyesScreenshot} screenshot
         * @return {Promise}
         */
        _collectRegions(checkSettings: any, imageMatchSettings: import("lib/config/ImageMatchSettings"), screenshot: any): Promise<any>;
        /**
         * Build match settings by merging the check settings and the default match settings.
         * @param {CheckSettings} checkSettings - the settings to match the image by.
         * @param {EyesScreenshot} screenshot - the Screenshot wrapper object.
         * @return {ImageMatchSettings} - Merged match settings.
         */
        createImageMatchSettings(checkSettings: any, screenshot: any): import("lib/config/ImageMatchSettings");
        /**
         * Repeatedly obtains an application snapshot and matches it with the next expected output, until a match is found or
         *   the timeout expires.
         *
         * @param {Trigger[]} userInputs - User input preceding this match.
         * @param {Region} region - Window region to capture.
         * @param {string} tag - Optional tag to be associated with the match (can be {@code null}).
         * @param {boolean} shouldRunOnceOnTimeout - Force a single match attempt at the end of the match timeout.
         * @param {boolean} ignoreMismatch - Whether to instruct the server to ignore the match attempt in case of a mismatch.
         * @param {CheckSettings} checkSettings - The internal settings to use.
         * @param {number} [retryTimeout] - The amount of time to retry matching in milliseconds or a negative value to use the
         *   default retry timeout.
         * @param {string} [source]
         * @return {Promise<MatchResult>} - Returns the results of the match
         */
        matchWindow(userInputs: any[], region: import("lib/geometry/Region"), tag: string, shouldRunOnceOnTimeout: boolean, ignoreMismatch: boolean, checkSettings: any, retryTimeout?: number, source?: string): Promise<any>;
        /**
         * @private
         * @param {Trigger[]} userInputs
         * @param {Region} region
         * @param {string} tag
         * @param {boolean} shouldRunOnceOnTimeout
         * @param {boolean} ignoreMismatch
         * @param {CheckSettings} checkSettings
         * @param {number} retryTimeout
         * @param {string} source
         * @return {Promise<EyesScreenshot>}
         */
        private _takeScreenshot;
        /**
         * @protected
         * @param {Trigger[]} userInputs
         * @param {Region} region
         * @param {string} tag
         * @param {boolean} ignoreMismatch
         * @param {CheckSettings} checkSettings
         * @param {number} retryTimeout
         * @param {string} source
         * @return {Promise<EyesScreenshot>}
         */
        protected _retryTakingScreenshot(userInputs: any[], region: import("lib/geometry/Region"), tag: string, ignoreMismatch: boolean, checkSettings: any, retryTimeout: number, source: string): Promise<any>;
        /**
         * @protected
         * @param {Trigger[]} userInputs
         * @param {Region} region
         * @param {string} tag
         * @param {boolean} ignoreMismatch
         * @param {CheckSettings} checkSettings
         * @param {number} retryTimeout
         * @param {number} retry
         * @param {number} start
         * @param {EyesScreenshot} [screenshot]
         * @param {string} [source]
         * @return {Promise<EyesScreenshot>}
         */
        protected _takingScreenshotLoop(userInputs: any[], region: import("lib/geometry/Region"), tag: string, ignoreMismatch: boolean, checkSettings: any, retryTimeout: number, retry: number, start: number, screenshot?: any, source?: string): Promise<any>;
        /**
         * @protected
         * @param {Trigger[]} userInputs
         * @param {Region} region
         * @param {string} tag
         * @param {boolean} ignoreMismatch
         * @param {CheckSettings} checkSettings
         * @param {string} source
         * @return {Promise<EyesScreenshot>}
         */
        protected _tryTakeScreenshot(userInputs: any[], region: import("lib/geometry/Region"), tag: string, ignoreMismatch: boolean, checkSettings: any, source: string): Promise<any>;
        /**
         * @private
         * @param {EyesScreenshot} screenshot
         */
        private _updateLastScreenshot;
        /**
         * @private
         * @param {Region} region
         */
        private _updateBounds;
        /**
         * @return {EyesScreenshot}
         */
        getLastScreenshot(): any;
        /**
         * @return {Region}
         */
        getLastScreenshotBounds(): import("lib/geometry/Region");
    }
    namespace MatchWindowTask {
        export { MATCH_INTERVAL };
    }
    const MATCH_INTERVAL: 500;
}
declare module "lib/match/MatchSingleWindowData" {
    export = MatchSingleWindowData;
    const MatchSingleWindowData_base: typeof import("lib/match/MatchWindowData");
    /**
     * Encapsulates the data to be sent to the agent on a "matchWindow" command.
     *
     * @ignore
     */
    class MatchSingleWindowData extends MatchSingleWindowData_base {
        /**
         * @param {SessionStartInfo} startInfo - The start parameters for the session.
         * @param {Trigger[]} userInputs - A list of triggers between the previous matchWindow call and the current matchWindow
         *   call. Can be array of size 0, but MUST NOT be null.
         * @param {AppOutput} appOutput - The appOutput for the current matchWindow call.
         * @param {string} tag - The tag of the window to be matched.
         * @param {boolean} [ignoreMismatch]
         * @param {Options} [options]
         */
        constructor({ startInfo, userInputs, appOutput, tag, ignoreMismatch, options }?: any, ...args: any[]);
        _startInfo: any;
        _updateBaseline: boolean;
        _updateBaselineIfDifferent: boolean;
        _updateBaselineIfNew: boolean;
        _removeSession: boolean;
        _removeSessionIfMatching: boolean;
        /** @type {string} */
        _agentId: string;
        /**
         * @return {SessionStartInfo}
         */
        getStartInfo(): any;
        /**
         * @param {SessionStartInfo} startInfo
         */
        setStartInfo(startInfo: any): void;
        /**
         * @return {boolean}
         */
        getUpdateBaseline(): boolean;
        /**
         * @param {boolean} updateBaseline
         */
        setUpdateBaseline(updateBaseline: boolean): void;
        /**
         * @return {boolean}
         */
        getUpdateBaselineIfDifferent(): boolean;
        /**
         * @param {boolean} updateBaselineIfDifferent
         */
        setUpdateBaselineIfDifferent(updateBaselineIfDifferent: boolean): void;
        /**
         * @return {boolean}
         */
        getUpdateBaselineIfNew(): boolean;
        /**
         * @param {boolean} updateBaselineIfNew
         */
        setUpdateBaselineIfNew(updateBaselineIfNew: boolean): void;
        /**
         * @return {boolean}
         */
        getRemoveSession(): boolean;
        /**
         * @param {boolean} removeSession
         */
        setRemoveSession(removeSession: boolean): void;
        /**
         * @return {boolean}
         */
        getRemoveSessionIfMatching(): boolean;
        /**
         * @param {boolean} removeSessionIfMatching
         */
        setRemoveSessionIfMatching(removeSessionIfMatching: boolean): void;
        /**
         * @return {string}
         */
        getAgentId(): string;
        /**
         * @param {string} agentId
         */
        setAgentId(agentId: string): void;
    }
}
declare module "lib/MatchSingleWindowTask" {
    export = MatchSingleWindowTask;
    const MatchSingleWindowTask_base: typeof import("lib/MatchWindowTask");
    /**
     * Handles matching of output with the expected output (including retry and 'ignore mismatch' when needed).
     *
     * @ignore
     */
    class MatchSingleWindowTask extends MatchSingleWindowTask_base {
        /**
         * @param {Logger} logger - A logger instance.
         * @param {ServerConnector} serverConnector - Our gateway to the agent
         * @param {number} retryTimeout - The default total time to retry matching (ms).
         * @param {EyesBase} eyes - The eyes object.
         * @param {AppOutputProvider} appOutputProvider - A callback for getting the application output when performing match.
         * @param {SessionStartInfo} startInfo - The start parameters for the session.
         * @param {boolean} saveNewTests - Used for automatic save of a test run. New tests are automatically saved by default.
         */
        constructor(logger: any, serverConnector: any, retryTimeout: number, eyes: any, appOutputProvider: any, startInfo: any, saveNewTests: boolean);
        /** @type {SessionStartInfo} */ _startInfo: any;
        /** @type {boolean} */ _saveNewTests: boolean;
    }
}
declare module "lib/getScmInfo" {
    const _exports: (...args: any[]) => any;
    export = _exports;
}
declare module "lib/EyesBase" {
    export = EyesBase;
    /**
     * Core/Base class for Eyes - to allow code reuse for different SDKs (images, selenium, etc).
     */
    class EyesBase {
        /**
         * @private
         * @param {RegionProvider} regionProvider
         * @param {string} tag
         * @param {boolean} ignoreMismatch
         * @param {CheckSettings} checkSettings
         * @param {EyesBase} self
         * @param {boolean} [skipStartingSession=false]
         * @param {string} [source]
         * @return {Promise<MatchResult>}
         */
        private static matchWindow;
        /**
         * Creates a new {@code EyesBase}instance that interacts with the Eyes Server at the specified url.
         *
         * @param {?string} [serverUrl] - The Eyes server URL.
         * @param {?boolean} [isDisabled=false] - Will be checked <b>before</b> any argument validation. If true, all method
         *   will immediately return without performing any action.
         * @param {Configuration} [configuration]
         */
        constructor(serverUrl?: string | null, isDisabled?: boolean | null, configuration?: import("lib/config/Configuration"));
        /** @var {Logger} */
        _logger: import("lib/logging/Logger");
        /** @var {Configuration} */
        _configuration: import("lib/config/Configuration");
        /** @type {ServerConnector} */
        _serverConnector: import("lib/server/ServerConnector");
        _userInputs: any[];
        /** @type {FailureReports} */
        _failureReports: typeof import("lib/FailureReports");
        /** @type {number} */
        _validationId: number;
        /** @type {SessionEventHandlers} */
        _sessionEventHandlers: import("lib/events/SessionEventHandlers");
        /** @type {MatchWindowTask} */ _matchWindowTask: import("lib/MatchWindowTask");
        /** @type {RunningSession} */ _runningSession: any;
        /** @type {SessionStartInfo} */ _sessionStartInfo: import("lib/server/SessionStartInfo");
        /** @type {boolean} */ _shouldMatchWindowRunOnceOnTimeout: boolean;
        /** @type {boolean} */ _isViewportSizeSet: boolean;
        /** @type {boolean} */ _isOpen: boolean;
        /** @type {boolean} */ _isVisualGrid: boolean;
        /** @type {boolean} */ _useImageDeltaCompression: boolean;
        /** @type {boolean} */ _render: boolean;
        /**
         * Will be set for separately for each test.
         * @type {string}
         */
        _currentAppName: string;
        /**
         * The session ID of webdriver instance
         * @type {string}
         */
        _autSessionId: string;
        /**
         * @return {Logger}
         */
        getLogger(): import("lib/logging/Logger");
        /**
         * Sets a handler of log messages generated by this API.
         *
         * @param {LogHandler} logHandler - Handles log messages generated by this API.
         */
        setLogHandler(logHandler: any): void;
        /**
         * @return {LogHandler} - The currently set log handler.
         */
        getLogHandler(): any;
        /**
         * @param {...string} args
         */
        log(...args: string[]): void;
        /**
         * @return {Configuration}
         */
        getConfiguration(): import("lib/config/Configuration");
        /**
         * @param {Configuration|object} configuration
         */
        setConfiguration(configuration: import("lib/config/Configuration") | object): void;
        /**
         * Sets the user given agent id of the SDK.
         *
         * @param {string} agentId - The agent ID to set.
         */
        setAgentId(agentId: string): void;
        /**
         * @return {string} - The user given agent id of the SDK.
         */
        getAgentId(): string;
        /**
         * Sets the API key of your Applitools Eyes account.
         *
         * @param {string} apiKey - The api key to be used.
         */
        setApiKey(apiKey: string): void;
        /**
         * @return {string} - The currently set API key or {@code null} if no key is set.
         */
        getApiKey(): string;
        /**
         * Sets the current server URL used by the rest client.
         *
         * @param {string} serverUrl - The URI of the rest server, or {@code null} to use the default server.
         */
        setServerUrl(serverUrl: string): void;
        /**
         * @return {string} - The URI of the eyes server.
         */
        getServerUrl(): string;
        /**
         * Sets the proxy settings to be used for all requests to Eyes server.
         * Alternatively, proxy can be set via global variables `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`.
         *
         * @signature `setProxy(proxySettings)`
         * @sigparam {ProxySettings} proxySettings - The ProxySettings instance to use.
         *
         * @signature `setProxy(isEnabled)`
         * @sigparam {boolean} isEnabled - You can pass {@code false} to completely disable proxy.
         *
         * @signature `setProxy(url, username, password)`
         * @sigparam {string} url - The proxy url to be used.
         * @sigparam {string} [username] - The proxy username to be used.
         * @sigparam {string} [password] - The proxy password to be used.
         *
         * @param {?(ProxySettings|boolean|string)} varArg - The ProxySettings object or proxy url to be used.
         *  Use {@code false} to disable proxy (even if it set via env variables). Use {@code null} to reset proxy settings.
         * @param {string} [username] - The proxy username to be used.
         * @param {string} [password] - The proxy password to be used.
         */
        setProxy(varArg: (any | boolean | string) | null, username?: string, password?: string): void;
        /**
         * @return {ProxySettings} - current proxy settings used by the server connector, or {@code null} if no proxy is set.
         */
        getProxy(): any;
        /**
         * @return {number} - The timeout for web requests (in milliseconds).
         */
        getConnectionTimeout(): number;
        /**
         * Sets the connect and read timeouts for web requests.
         *
         * @param {number} connectionTimeout - Connect/Read timeout in milliseconds. 0 equals infinity.
         */
        setConnectionTimeout(connectionTimeout: number): void;
        /**
         * Whether sessions are removed immediately after they are finished.
         *
         * @param {boolean} removeSession
         */
        setRemoveSession(removeSession: boolean): void;
        /**
         * @return {boolean} - Whether sessions are removed immediately after they are finished.
         */
        getRemoveSession(): boolean;
        /**
         * @param {boolean} isDisabled - If true, all interactions with this API will be silently ignored.
         */
        setIsDisabled(isDisabled: boolean): void;
        /**
         * @return {boolean} - Whether eyes is disabled.
         */
        getIsDisabled(): boolean;
        /**
         * @return {string} - The host OS as set by the user.
         */
        getHostApp(): string;
        /**
         * Sets the host application - overrides the one in the agent string.
         *
         * @param {string} value - The application running the AUT (e.g., Chrome).
         */
        setHostApp(value: string): void;
        /**
         * @return {string} - The host OS as set by the user.
         */
        getHostOS(): string;
        /**
         * Sets the host OS name - overrides the one in the agent string.
         *
         * @param {string} value - The host OS running the AUT.
         */
        setHostOS(value: string): void;
        /**
         * @return {string} - The host OS as set by the user.
         */
        getHostAppInfo(): string;
        /**
         * Sets the host application - overrides the one in the agent string.
         *
         * @param {string} value - The application running the AUT (e.g., Chrome).
         */
        setHostAppInfo(value: string): void;
        /**
         * @return {string} - The host OS as set by the user.
         */
        getHostOSInfo(): string;
        /**
         * Sets the host OS name - overrides the one in the agent string.
         *
         * @param {string} value - The host OS running the AUT.
         */
        setHostOSInfo(value: string): void;
        /**
         * @return {string} - The application name running the AUT.
         */
        getDeviceInfo(): string;
        /**
         * Sets the host application - overrides the one in the agent string.
         *
         * @param {string} value - The application running the AUT (e.g., Chrome).
         */
        setDeviceInfo(value: string): void;
        /**
         * @param {string} appName - The name of the application under test.
         */
        setAppName(appName: string): void;
        /**
         * @return {string} - The name of the application under test.
         */
        getAppName(): string;
        /**
         * @return {string} - The name of the application under test.
         */
        getAppName(): string;
        /**
         * Sets the branch in which the baseline for subsequent test runs resides. If the branch does not already exist it
         * will be created under the specified parent branch (see {@link #setParentBranchName}). Changes to the baseline
         * or model of a branch do not propagate to other branches.
         *
         * @param {string} branchName - Branch name or {@code null} to specify the default branch.
         */
        setBranchName(branchName: string): void;
        /**
         * @return {string} - The current branch name.
         */
        getBranchName(): string;
        /**
         * Sets the branch under which new branches are created.
         *
         * @param {string} parentBranchName - Branch name or {@code null} to specify the default branch.
         */
        setParentBranchName(parentBranchName: string): void;
        /**
         * @return {string} - The name of the current parent branch under which new branches will be created.
         */
        getParentBranchName(): string;
        /**
         * Sets the baseline branch under which new branches are created.
         *
         * @param {string} baselineBranchName - Branch name or {@code null} to specify the default branch.
         */
        setBaselineBranchName(baselineBranchName: string): void;
        /**
         * @return {string} - The name of the baseline branch
         */
        getBaselineBranchName(): string;
        /**
         * Sets the maximum time (in ms) a match operation tries to perform a match.
         * @param {number} ms - Total number of ms to wait for a match.
         */
        setMatchTimeout(ms: number): void;
        /**
         * @return {number} - The maximum time in ms {@link #checkWindowBase(RegionProvider, string, boolean, number)} waits
         *   for a match.
         */
        getMatchTimeout(): number;
        /**
         * Set whether or not new tests are saved by default.
         *
         * @param {boolean} saveNewTests - True if new tests should be saved by default. False otherwise.
         */
        setSaveNewTests(saveNewTests: boolean): void;
        /**
         * @return {boolean} - True if new tests are saved by default.
         */
        getSaveNewTests(): boolean;
        /**
         * Set whether or not failed tests are saved by default.
         *
         * @param {boolean} saveFailedTests - True if failed tests should be saved by default, false otherwise.
         */
        setSaveFailedTests(saveFailedTests: boolean): void;
        /**
         * @return {boolean} - True if failed tests are saved by default.
         */
        getSaveFailedTests(): boolean;
        /**
         * Sets the batch in which context future tests will run or {@code null} if tests are to run standalone.
         *
         * @param {BatchInfo|BatchInfoObject|string} batchOrName - The batch name or batch object
         * @param {string} [batchId] - ID of the batch, should be generated using GeneralUtils.guid()
         * @param {string} [startedAt] - Start date of the batch, can be created as new Date().toUTCString()
         */
        setBatch(batchOrName: any | any | string, batchId?: string, startedAt?: string, ...args: any[]): void;
        /**
         * @return {BatchInfo} - The currently set batch info.
         */
        getBatch(): any;
        /**
         * Adds a property to be sent to the server.
         *
         * @param {string} name - The property name.
         * @param {string} value - The property value.
         */
        addProperty(name: string, value: string): this;
        /**
         * Clears the list of custom properties.
         */
        clearProperties(): void;
        /**
         * Automatically save differences as a baseline.
         *
         * @param {boolean} saveDiffs - Sets whether to automatically save differences as baseline.
         */
        setSaveDiffs(saveDiffs: boolean): void;
        /**
         * @return {boolean} - whether to automatically save differences as baseline.
         */
        getSaveDiffs(): boolean;
        /**
         * @param {boolean} sendDom
         */
        setSendDom(sendDom: boolean): void;
        /**
         * @return {boolean}
         */
        getSendDom(): boolean;
        /**
         * @param {boolean} compareWithParentBranch - New compareWithParentBranch value, default is false
         */
        setCompareWithParentBranch(compareWithParentBranch: boolean): void;
        /**
         * @deprecated Use {@link #getCompareWithParentBranch()} instead
         * @return {boolean} - The currently compareWithParentBranch value
         */
        isCompareWithParentBranch(): boolean;
        /**
         * @return {boolean} - The currently compareWithParentBranch value
         */
        getCompareWithParentBranch(): boolean;
        /**
         * @param {boolean} ignoreBaseline - New ignoreBaseline value, default is false
         */
        setIgnoreBaseline(ignoreBaseline: boolean): void;
        /**
         * @deprecated Use {@link #getIgnoreBaseline()} instead
         * @return {boolean} - The currently ignoreBaseline value
         */
        isIgnoreBaseline(): boolean;
        /**
         * @return {boolean} - The currently ignoreBaseline value
         */
        getIgnoreBaseline(): boolean;
        /**
         * @deprecated Only available for backward compatibility. See {@link #setBaselineEnvName(string)}.
         * @param {string} baselineName - If specified, determines the baseline to compare with and disables automatic baseline
         *   inference.
         */
        setBaselineName(baselineName: string): void;
        /**
         * @deprecated Only available for backward compatibility. See {@link #getBaselineEnvName()}.
         * @return {string} - The baseline name, if it was specified.
         */
        getBaselineName(): string;
        /**
         * If not {@code null}, determines the name of the environment of the baseline.
         *
         * @param {string} baselineEnvName - The name of the baseline's environment.
         */
        setBaselineEnvName(baselineEnvName: string): void;
        /**
         * If not {@code null}, determines the name of the environment of the baseline.
         *
         * @return {string} - The name of the baseline's environment, or {@code null} if no such name was set.
         */
        getBaselineEnvName(): string;
        /**
         * If not {@code null} specifies a name for the environment in which the application under test is running.
         *
         * @deprecated use {@link setEnvironmentName} instead
         * @param {string} envName - The name of the environment of the baseline.
         */
        setEnvName(envName: string): void;
        /**
         * If not {@code null} specifies a name for the environment in which the application under test is running.
         *
         * @param {string} envName - The name of the environment of the baseline.
         */
        setEnvironmentName(envName: string): void;
        /**
         * If not {@code null} specifies a name for the environment in which the application under test is running.
         *
         * @return {string} - The name of the environment of the baseline, or {@code null} if no such name was set.
         */
        getEnvName(): string;
        /**
         * @param {string} testName - The name of the currently running test.
         */
        setTestName(testName: string): void;
        /**
         * @return {?string} - The name of the currently running test.
         */
        getTestName(): string | null;
        /**
         * @param {string} displayName - The display name of the currently running test.
         */
        setDisplayName(displayName: string): void;
        /**
         * @return {?string} - The display name of the currently running test.
         */
        getDisplayName(): string | null;
        /**
         * @return {ImageMatchSettings} - The match settings used for the session.
         */
        getDefaultMatchSettings(): any;
        /**
         * Updates the match settings to be used for the session.
         *
         * @param {ImageMatchSettings} defaultMatchSettings - The match settings to be used for the session.
         */
        setDefaultMatchSettings(defaultMatchSettings: any): void;
        /**
         * The test-wide match level to use when checking application screenshot with the expected output.
         *
         * @param {MatchLevel} matchLevel - The test-wide match level to use when checking application screenshot with the
         *   expected output.
         */
        setMatchLevel(matchLevel: any): void;
        /**
         * @return {MatchLevel} - The test-wide match level.
         */
        getMatchLevel(): any;
        /**
         * The test-wide useDom to use.
         *
         * @param {boolean} useDom - The test-wide useDom to use in match requests.
         */
        setUseDom(useDom: boolean): void;
        /**
         * @return {boolean} - The test-wide useDom to use in match requests.
         */
        getUseDom(): boolean;
        /**
         * The test-wide enablePatterns to use.
         *
         * @param {boolean} enablePatterns - The test-wide enablePatterns to use in match requests.
         */
        setEnablePatterns(enablePatterns: boolean): void;
        /**
         * @return {boolean} - The test-wide enablePatterns to use in match requests.
         */
        getEnablePatterns(): boolean;
        /**
         * The test-wide ignoreDisplacements to use.
         *
         * @param {boolean} ignoreDisplacements - The test-wide ignoreDisplacements to use in match requests.
         */
        setIgnoreDisplacements(ignoreDisplacements: boolean): void;
        /**
         * @return {boolean} - The test-wide ignoreDisplacements to use in match requests.
         */
        getIgnoreDisplacements(): boolean;
        /**
         * Sets the ignore blinking caret value.
         *
         * @param {boolean} value - The ignore value.
         */
        setIgnoreCaret(value: boolean): void;
        /**
         * @return {boolean} - Whether to ignore or the blinking caret or not when comparing images.
         */
        getIgnoreCaret(): boolean;
        /**
         * @param {boolean} [hardReset=false] - If false, init providers only if they're not initialized.
         * @private
         */
        private _initProviders;
        _scaleProviderHandler: any;
        _cutProviderHandler: any;
        _positionProviderHandler: any;
        _viewportSizeHandler: any;
        _debugScreenshotsProvider: any;
        getAndSaveRenderingInfo(): void;
        _getAndSaveBatchInfoFromServer(_batchId: any): void;
        _getScmMergeBaseTime(branchName: any, parentBranchName: any): Promise<any>;
        handleScmMergeBaseTime(): Promise<any>;
        /**
         * @param {RenderingInfo} renderingInfo
         */
        setRenderingInfo(renderingInfo: any): void;
        /**
         * Clears the user inputs list.
         *
         * @protected
         */
        protected clearUserInputs(): void;
        /**
         * @protected
         * @return {Trigger[]} - User inputs collected between {@code checkWindowBase} invocations.
         */
        protected getUserInputs(): any[];
        /**
         * @param {FailureReports} failureReports - Use one of the values in FailureReports.
         */
        setFailureReports(failureReports: typeof import("lib/FailureReports")): void;
        /**
         * @return {FailureReports} - The failure reports setting.
         */
        getFailureReports(): typeof import("lib/FailureReports");
        /**
         * @return {string} - The full agent id composed of both the base agent id and the user given agent id.
         */
        getFullAgentId(): string;
        /**
         * @return {boolean} - Whether a session is open.
         */
        getIsOpen(): boolean;
        /**
         * Manually set the the sizes to cut from an image before it's validated.
         *
         * @param {CutProvider} [cutProvider] - the provider doing the cut.
         */
        setCutProvider(cutProvider?: any): void;
        /**
         * Manually set the the sizes to cut from an image before it's validated.
         *
         * @param {CutProvider} [cutProvider] - the provider doing the cut.
         */
        setImageCut(cutProvider?: any): void;
        /**
         * @return {boolean}
         */
        getIsCutProviderExplicitlySet(): boolean;
        /**
         * Manually set the scale ratio for the images being validated.
         *
         * @param {number} [scaleRatio=1] - The scale ratio to use, or {@code null} to reset back to automatic scaling.
         */
        setScaleRatio(scaleRatio?: number): void;
        /**
         * @return {number} - The ratio used to scale the images being validated.
         */
        getScaleRatio(): number;
        /**
         * @param {boolean} value - If true, createSession request will return renderingInfo properties
         */
        setRender(value: boolean): void;
        /**
         * @return {boolean}
         */
        getRender(): boolean;
        /**
         * @param {boolean} saveDebugScreenshots - If true, will save all screenshots to local directory.
         */
        setSaveDebugScreenshots(saveDebugScreenshots: boolean): void;
        /**
         * @return {boolean}
         */
        getSaveDebugScreenshots(): boolean;
        /**
         * @param {string} pathToSave - Path where you want to save the debug screenshots.
         */
        setDebugScreenshotsPath(pathToSave: string): void;
        /**
         * @return {string} - The path where you want to save the debug screenshots.
         */
        getDebugScreenshotsPath(): string;
        /**
         * @param {string} prefix - The prefix for the screenshots' names.
         */
        setDebugScreenshotsPrefix(prefix: string): void;
        /**
         * @return {string} - The prefix for the screenshots' names.
         */
        getDebugScreenshotsPrefix(): string;
        /**
         * @param {DebugScreenshotsProvider} debugScreenshotsProvider
         */
        setDebugScreenshotsProvider(debugScreenshotsProvider: any): void;
        /**
         * @return {DebugScreenshotsProvider}
         */
        getDebugScreenshotsProvider(): any;
        /**
         * Ends the currently running test.
         *
         * @param {boolean} [throwEx=true] - If true, then the returned promise will 'reject' for failed/aborted tests.
         * @return {Promise<TestResults>} - A promise which resolves/rejects (depending on the value of 'throwEx') to the test
         *   results.
         */
        close(throwEx?: boolean): Promise<import("lib/TestResults")>;
        _lastScreenshot: any;
        /**
         * If a test is running, aborts it. Otherwise, does nothing.
         *
         * @alias abort
         * @return {Promise<?TestResults>} - A promise which resolves to the test results.
         */
        abortIfNotClosed(): Promise<import("lib/TestResults") | null>;
        /**
         * If a test is running, aborts it. Otherwise, does nothing.
         *
         * @return {Promise<?TestResults>} - A promise which resolves to the test results.
         */
        abort(): Promise<import("lib/TestResults") | null>;
        /**
         * @return {PositionProvider} - The currently set position provider.
         */
        getPositionProvider(): any;
        /**
         * @param {PositionProvider} positionProvider - The position provider to be used.
         */
        setPositionProvider(positionProvider: any): void;
        /**
         * Takes a snapshot of the application under test and matches it with the expected output.
         *
         * @protected
         * @param {RegionProvider} regionProvider - Returns the region to check or empty region to check the entire window.
         * @param {string} [tag=''] - An optional tag to be associated with the snapshot.
         * @param {boolean} [ignoreMismatch=false] - Whether to ignore this check if a mismatch is found.
         * @param {CheckSettings} [checkSettings] - The settings to use.
         * @param {string} [source] - The tested source page.
         * @return {Promise<MatchResult>} - The result of matching the output with the expected output.
         * @throws DiffsFoundError - Thrown if a mismatch is detected and immediate failure reports are enabled.
         */
        protected checkWindowBase(regionProvider: any, tag?: string, ignoreMismatch?: boolean, checkSettings?: import("lib/fluent/CheckSettings"), source?: string): Promise<import("lib/match/MatchResult")>;
        /**
         * Takes a snapshot of the application under test and matches it with the expected output.
         *
         * @protected
         * @param {RegionProvider} regionProvider - Returns the region to check or empty rectangle to check the entire window.
         * @param {string} [tag=''] - An optional tag to be associated with the snapshot.
         * @param {boolean} [ignoreMismatch=false] - Whether to ignore this check if a mismatch is found.
         * @param {CheckSettings} [checkSettings] - The settings to use.
         * @return {Promise<TestResults>} - The result of matching the output with the expected output.
         */
        protected checkSingleWindowBase(regionProvider: any, tag?: string, ignoreMismatch?: boolean, checkSettings?: import("lib/fluent/CheckSettings")): Promise<import("lib/TestResults")>;
        /**
         * @protected
         * @return {Promise}
         */
        protected beforeMatchWindow(): Promise<any>;
        /**
         * @protected
         * @return {Promise}
         */
        protected afterMatchWindow(): Promise<any>;
        /**
         * @protected
         * @return {Promise<?string>}
         */
        protected tryCaptureDom(): Promise<string | null>;
        /**
         * @protected
         * @return {Promise<?string>}
         */
        protected getOrigin(): Promise<string | null>;
        /**
         * Replaces an actual image in the current running session.
         *
         * @param {number} stepIndex - The zero based index of the step in which to replace the actual image.
         * @param {Buffer} screenshot - The PNG bytes of the updated screenshot.
         * @param {string} [tag] - The updated tag for the step.
         * @param {string} [title] - The updated title for the step.
         * @param {Trigger[]} [userInputs] - The updated userInputs for the step.
         * @return {Promise<MatchResult>} - A promise which resolves when replacing is done, or rejects on error.
         */
        replaceWindow(stepIndex: number, screenshot: Buffer, tag?: string, title?: string, userInputs?: any[]): Promise<import("lib/match/MatchResult")>;
        /**
         * @private
         * @param {string} domJson
         * @return {Promise<?string>}
         */
        private _tryPostDomSnapshot;
        /**
         * @private
         * @param {string} tag
         * @param {MatchResult} result
         */
        private _validateResult;
        /**
         * Starts a test.
         *
         * @protected
         * @param {string} appName - The name of the application under test.
         * @param {string} testName - The test name.
         * @param {RectangleSize|RectangleSizeObject} [viewportSize] - The client's viewport size (i.e., the
         *   visible part of the document's body) or {@code null} to allow any viewport size.
         * @param {SessionType} [sessionType=SessionType.SEQUENTIAL] - The type of test (e.g., Progression for timing tests),
         *   or {@code null} to use the default.
         * @param {skipStartingSession} [skipStartingSession=false] - If {@code true} skip starting the session.
         * @return {Promise}
         */
        protected openBase(appName: string, testName: string, viewportSize?: import("lib/geometry/RectangleSize") | any, sessionType?: any, skipStartingSession?: any): Promise<any>;
        _renderingInfoPromise: void;
        _scmMergeBaseTimePromise: Promise<any>;
        /**
         * @protected
         * @return {Promise}
         */
        protected beforeOpen(): Promise<any>;
        /**
         * @protected
         * @return {Promise}
         */
        protected afterOpen(): Promise<any>;
        /**
         * @private
         * @return {Promise}
         */
        private _ensureRunningSession;
        /**
         * @private
         */
        private _validateApiKey;
        /**
         * @private
         */
        private _logOpenBase;
        /**
         * @private
         * @return {Promise}
         */
        private _validateSessionOpen;
        /**
         * Define the viewport size as {@code size} without doing any actual action on the
         *
         * @param {RectangleSize} explicitViewportSize - The size of the viewport. {@code null} disables the explicit size.
         */
        setExplicitViewportSize(explicitViewportSize: import("lib/geometry/RectangleSize")): void;
        /**
         * Adds a trigger to the current list of user inputs.
         *
         * @protected
         * @param {Trigger} trigger - The trigger to add to the user inputs list.
         */
        protected addUserInput(trigger: any): void;
        /**
         * Adds a text trigger.
         *
         * @protected
         * @param {Region} control - The control's position relative to the window.
         * @param {string} text - The trigger's text.
         */
        protected addTextTriggerBase(control: import("lib/geometry/Region"), text: string): void;
        /**
         * Adds a mouse trigger.
         *
         * @protected
         * @param {MouseTrigger.MouseAction} action - Mouse action.
         * @param {Region} control - The control on which the trigger is activated (location is relative to the window).
         * @param {Location} cursor - The cursor's position relative to the control.
         */
        protected addMouseTriggerBase(action: string, control: import("lib/geometry/Region"), cursor: Location): void;
        setAppEnvironment(hostOS: any, hostApp: any): void;
        /**
         * Application environment is the environment (e.g., the host OS) which runs the application under test.
         *
         * @protected
         * @return {Promise<AppEnvironment>} - The current application environment.
         */
        protected getAppEnvironment(): Promise<import("lib/AppEnvironment")>;
        /**
         * Start eyes session on the eyes server.
         *
         * @protected
         * @return {Promise}
         */
        protected startSession(): Promise<any>;
        /**
         * @package
         * @return {Promise}
         */
        closeBatch(): Promise<any>;
        getUserSetBatchId(): any;
        _getSetBatchId(): any;
        /**
         * @private
         * @return {Promise}
         */
        private _ensureViewportSize;
        /**
         * @private
         * @param {Region} region - The region of the screenshot which will be set in the application output.
         * @param {EyesScreenshot} lastScreenshot - Previous application screenshot (for compression) or `null` if not
         *   available.
         * @param {CheckSettings} checkSettings - The check settings object of the current test.
         * @return {Promise<AppOutputWithScreenshot>} - The updated app output and screenshot.
         */
        private _getAppOutputWithScreenshot;
        /**
         * @return {SessionEventHandlers}
         */
        getSessionEventHandlers(): import("lib/events/SessionEventHandlers");
        /**
         * @param {SessionEventHandler} eventHandler
         */
        addSessionEventHandler(eventHandler: any): void;
        /**
         * @param {SessionEventHandler} eventHandler
         */
        removeSessionEventHandler(eventHandler: any): void;
        clearSessionEventHandlers(): void;
        /**
         * @return {RunningSession} - An object containing data about the currently running session.
         */
        getRunningSession(): any;
        /**
         * @protected
         * @abstract
         * @return {string} - The base agent id of the SDK.
         */
        protected getBaseAgentId(): string;
        /**
         * Get the session id.
         *
         * @protected
         * @return {Promise<?string>} - A promise which resolves to the webdriver's session ID.
         */
        protected getAUTSessionId(): Promise<string | null>;
        /**
         * @protected
         * @abstract
         * @return {Promise<RectangleSize>} - The viewport size of the AUT.
         */
        protected getViewportSize(): Promise<import("lib/geometry/RectangleSize")>;
        /**
         * @protected
         * @abstract
         * @param {RectangleSize} size - The required viewport size.
         * @return {Promise}
         */
        protected setViewportSize(_size: any): Promise<any>;
        /**
         * The inferred string is in the format "source:info" where source is either "useragent" or "pos".
         * Information associated with a "useragent" source is a valid browser user agent string. Information associated with
         * a "pos" source is a string of the format "process-name;os-name" where "process-name" is the name of the main
         * module of the executed process and "os-name" is the OS name.
         *
         * @protected
         * @abstract
         * @return {Promise<string>} - The inferred environment string or {@code null} if none is available.
         */
        protected getInferredEnvironment(): Promise<string>;
        /**
         * An updated screenshot.
         *
         * @protected
         * @abstract
         * @return {Promise<EyesScreenshot>}
         */
        protected getScreenshot(): Promise<any>;
        /**
         * An updated screenshot.
         *
         * @protected
         * @return {Promise<?string>}
         */
        protected getScreenshotUrl(): Promise<string | null>;
        /**
         * The current title of of the AUT.
         *
         * @protected
         * @abstract
         * @return {Promise<string>}
         */
        protected getTitle(): Promise<string>;
        /**
         * A url pointing to a DOM capture of the AUT at the time of screenshot
         *
         * @protected
         * @return {Promise<?string>}
         */
        protected getDomUrl(): Promise<string | null>;
        /**
         * The location of the image relative to the logical full page image, when cropping an image e.g. with checkRegion
         *
         * @protected
         * @return {Promise<?Location>}
         */
        protected getImageLocation(): Promise<Location>;
        /**
         * @return {boolean}
         */
        isVisualGrid(): boolean;
        /**
         * @ignore
         * @param {boolean} isVisualGrid
         */
        setIsVisualGrid(isVisualGrid: boolean): void;
    }
}
declare module "lib/EyesCore" {
    export = EyesCore;
    const EyesCore_base: typeof import("lib/EyesBase");
    /**
     * @typedef {import('./wrappers/EyesWrappedDriver')} EyesWrappedDriver
     * @typedef {import('./wrappers/EyesWrappedElement')} EyesWrappedElement
     * @typedef {import('./wrappers/EyesWrappedElement').SupportedElement} SupportedElement
     * @typedef {import('./wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
     * @typedef {import('./frames/Frame').FrameReference} FrameReference
     */
    class EyesCore extends EyesCore_base {
        constructor(serverUrl?: string, isDisabled?: boolean, configuration?: import("lib/config/Configuration"));
        /**
         * Takes a snapshot of the application under test and matches it with the expected output.
         * @param {string} [tag] - An optional tag to be associated with the snapshot.
         * @param {number} [matchTimeout] - The amount of time to retry matching (Milliseconds).
         * @param {boolean} [stitchContent=false] - If {@code true}, stitch the internal content of the window.
         * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
         */
        checkWindow(tag?: string, matchTimeout?: number, stitchContent?: boolean): Promise<any>;
        /**
         * Matches the frame given as parameter, by switching into the frame and using stitching to get an image of the frame.
         * @param {FrameReference} element - The element which is the frame to switch to.
         * @param {number} [matchTimeout] - The amount of time to retry matching (milliseconds).
         * @param {string} [tag] - An optional tag to be associated with the match.
         * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
         */
        checkFrame(element: FrameReference, matchTimeout?: number, tag?: string): Promise<any>;
        /**
         * Takes a snapshot of the application under test and matches a specific element with the expected region output.
         * @param {EyesWrappedElement|SupportedElement} element - The element to check.
         * @param {?number} [matchTimeout] - The amount of time to retry matching (milliseconds).
         * @param {string} [tag] - An optional tag to be associated with the match.
         * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
         */
        checkElement(element: EyesWrappedElement | SupportedElement, matchTimeout?: number | null, tag?: string): Promise<any>;
        /**
         * Takes a snapshot of the application under test and matches a specific element with the expected region output.
         * @param {SupportedSelector} locator - The element to check.
         * @param {?number} [matchTimeout] - The amount of time to retry matching (milliseconds).
         * @param {string} [tag] - An optional tag to be associated with the match.
         * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
         */
        checkElementBy(locator: SupportedSelector, matchTimeout?: number | null, tag?: string): Promise<any>;
        /**
         * Visually validates a region in the screenshot.
         * @param {Region} region - The region to validate (in screenshot coordinates).
         * @param {string} [tag] - An optional tag to be associated with the screenshot.
         * @param {number} [matchTimeout] - The amount of time to retry matching.
         * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
         */
        checkRegion(region: import("lib/geometry/Region"), tag?: string, matchTimeout?: number): Promise<any>;
        /**
         * Visually validates a region in the screenshot.
         *
         * @param {EyesWrappedElement|SupportedElement} element - The element defining the region to validate.
         * @param {string} [tag] - An optional tag to be associated with the screenshot.
         * @param {number} [matchTimeout] - The amount of time to retry matching.
         * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
         */
        checkRegionByElement(element: EyesWrappedElement | SupportedElement, tag?: string, matchTimeout?: number): Promise<any>;
        /**
         * Visually validates a region in the screenshot.
         *
         * @param {SupportedSelector} by - The selector used for finding the region to validate.
         * @param {string} [tag] - An optional tag to be associated with the screenshot.
         * @param {number} [matchTimeout] - The amount of time to retry matching.
         * @param {boolean} [stitchContent] - If {@code true}, stitch the internal content of the region (i.e., perform
         *   {@link #checkElement(By, number, string)} on the region.
         * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
         */
        checkRegionBy(by: SupportedSelector, tag?: string, matchTimeout?: number, stitchContent?: boolean): Promise<any>;
        /**
         * Switches into the given frame, takes a snapshot of the application under test and matches a region specified by
         * the given selector.
         * @param {FrameReference} frameReference - The name or id of the frame to switch to.
         * @param {SupportedSelector} locator - A Selector specifying the region to check.
         * @param {?number} [matchTimeout] - The amount of time to retry matching. (Milliseconds)
         * @param {string} [tag] - An optional tag to be associated with the snapshot.
         * @param {boolean} [stitchContent] - If {@code true}, stitch the internal content of the region (i.e., perform
         *   {@link #checkElement(By, number, string)} on the region.
         * @return {Promise<MatchResult>} - A promise which is resolved when the validation is finished.
         */
        checkRegionInFrame(frameReference: FrameReference, locator: SupportedSelector, matchTimeout?: number | null, tag?: string, stitchContent?: boolean): Promise<any>;
        /**
         * @return {Promise}
         */
        closeAsync(): Promise<any>;
        /**
         * @return {Promise}
         */
        abortAsync(): Promise<any>;
        /**
         * Adds a mouse trigger.
         * @param {MouseTrigger.MouseAction} action  Mouse action.
         * @param {Region} control The control on which the trigger is activated (context relative coordinates).
         * @param {Location} cursor  The cursor's position relative to the control.
         */
        addMouseTrigger(action: any, control: import("lib/geometry/Region"), cursor: Location): Promise<void>;
        /**
         * Adds a mouse trigger.
         * @param {MouseTrigger.MouseAction} action  Mouse action.
         * @param {EyesWrappedElement} element The element on which the click was called.
         * @return {Promise}
         */
        addMouseTriggerForElement(action: any, element: EyesWrappedElement): Promise<any>;
        /**
         * Adds a keyboard trigger.
         * @param {Region} control The control on which the trigger is activated (context relative coordinates).
         * @param {String} text  The trigger's text.
         */
        addTextTrigger(control: import("lib/geometry/Region"), text: string): Promise<void>;
        /**
         * Adds a keyboard trigger.
         * @param {EyesWrappedElement} element The element for which we sent keys.
         * @param {String} text  The trigger's text.
         * @return {Promise}
         */
        addTextTriggerForElement(element: EyesWrappedElement, text: string): Promise<any>;
        _dontGetTitle: boolean;
        /**
         * @return {?EyesWrappedDriver}
         */
        getDriver(): EyesWrappedDriver | null;
        getRemoteWebDriver(): any;
        /**
         * Get jsExecutor
         * @return {EyesJsExecutor}
         */
        get jsExecutor(): any;
        /**
         * @return {EyesRunner}
         */
        getRunner(): any;
        /**
         * @return {number} The device pixel ratio, or {@link #UNKNOWN_DEVICE_PIXEL_RATIO} if the DPR is not known yet or if it wasn't possible to extract it.
         */
        getDevicePixelRatio(): number;
        /**
         * @return {Region}
         */
        getRegionToCheck(): import("lib/geometry/Region");
        /**
         * @param {Region} regionToCheck
         */
        setRegionToCheck(regionToCheck: import("lib/geometry/Region")): void;
        _regionToCheck: import("lib/geometry/Region");
        /**
         * @return {boolean}
         */
        shouldStitchContent(): boolean;
        /**
         * @param {EyesWrappedElement|SupportedElement|SupportedSelector} element
         */
        setScrollRootElement(scrollRootElement: any): void;
        _scrollRootElement: any;
        /**
         * @return {Promise<(EyesWrappedElement|SupportedElement|SupportedSelector)?>}
         */
        getScrollRootElement(): Promise<(EyesWrappedElement | SupportedElement | SupportedSelector) | null>;
        /**
         * @param {ImageRotation} rotation - The image rotation data.
         */
        setRotation(rotation: import("lib/positioning/ImageRotation")): void;
        _rotation: import("lib/positioning/ImageRotation");
        /**
         * @return {ImageRotation} - The image rotation data.
         */
        getRotation(): import("lib/positioning/ImageRotation");
        /**
         * Set the image rotation degrees.
         * @param {number} degrees - The amount of degrees to set the rotation to.
         * @deprecated use {@link setRotation} instead
         */
        setForcedImageRotation(degrees: number): void;
        /**
         * Get the rotation degrees.
         * @return {number} - The rotation degrees.
         * @deprecated use {@link getRotation} instead
         */
        getForcedImageRotation(): number;
        /**
         * @param {string} domUrl
         */
        setDomUrl(domUrl: string): void;
        _domUrl: string;
        /**
         * @param {CorsIframeHandle} corsIframeHandle
         */
        setCorsIframeHandle(corsIframeHandle: any): void;
        _corsIframeHandle: any;
        /**
         * @return {CorsIframeHandle}
         */
        getCorsIframeHandle(): any;
        /**
         * @return {boolean}
         */
        getHideCaret(): boolean;
        /**
         * @param {boolean} hideCaret
         */
        setHideCaret(hideCaret: boolean): void;
        /**
         * Forces a full page screenshot (by scrolling and stitching) if the browser only supports viewport screenshots).
         *
         * @param {boolean} shouldForce - Whether to force a full page screenshot or not.
         */
        setForceFullPageScreenshot(shouldForce: boolean): void;
        /**
         * @return {boolean} - Whether Eyes should force a full page screenshot.
         */
        getForceFullPageScreenshot(): boolean;
        /**
         * Sets the time to wait just before taking a screenshot (e.g., to allow positioning to stabilize when performing a
         * full page stitching).
         *
         * @param {number} waitBeforeScreenshots - The time to wait (Milliseconds). Values smaller or equal to 0, will cause the
         *   default value to be used.
         */
        setWaitBeforeScreenshots(waitBeforeScreenshots: number): void;
        /**
         * @return {number} - The time to wait just before taking a screenshot.
         */
        getWaitBeforeScreenshots(): number;
        /**
         * Hide the scrollbars when taking screenshots.
         *
         * @param {boolean} shouldHide - Whether to hide the scrollbars or not.
         */
        setHideScrollbars(shouldHide: boolean): void;
        /**
         * @return {boolean} - Whether or not scrollbars are hidden when taking screenshots.
         */
        getHideScrollbars(): boolean;
        /**
         * Set the type of stitching used for full page screenshots. When the page includes fixed position header/sidebar,
         * use {@link StitchMode#CSS}. Default is {@link StitchMode#SCROLL}.
         *
         * @param {StitchMode} mode - The stitch mode to set.
         */
        setStitchMode(mode: any): void;
        /**
         * @return {StitchMode} - The current stitch mode settings.
         */
        getStitchMode(): any;
        /**
         * Sets the stitching overlap in pixels.
         *
         * @param {number} stitchOverlap - The width (in pixels) of the overlap.
         */
        setStitchOverlap(stitchOverlap: number): void;
        /**
         * @return {number} - Returns the stitching overlap in pixels.
         */
        getStitchOverlap(): number;
    }
    namespace EyesCore {
        export { EyesWrappedDriver, EyesWrappedElement, SupportedElement, SupportedSelector, FrameReference };
    }
    type FrameReference = string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type SupportedElement = {
        "": any;
    };
    type SupportedSelector = {
        "": any;
    };
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
}
declare module "lib/EyesClassic" {
    export = EyesClassic;
    const EyesClassic_base: typeof import("lib/EyesCore");
    class EyesClassic extends EyesClassic_base {
        /**
         * Create a specialized version of this class
         * @param {Object} implementations - implementations of related classes
         * @param {string} implementations.agentId - base agent id
         * @param {EyesWrappedDriver} implementations.WrappedDriver - implementation for {@link EyesWrappedDriver}
         * @param {EyesWrappedElement} implementations.WrappedElement - implementation for {@link EyesWrappedElement}
         * @param {DriverCheckSettings} implementations.CheckSettings - specialized version of {@link DriverCheckSettings}
         * @return {typeof EyesClassic} specialized version of this class
         */
        static specialize({ agentId, WrappedDriver, WrappedElement, CheckSettings }: {
            agentId: string;
            WrappedDriver: EyesWrappedDriver;
            WrappedElement: EyesWrappedElement;
            CheckSettings: DriverCheckSettings;
        }): typeof EyesClassic;
        /**
         * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
         * @param {string|boolean|VisualGridRunner} [serverUrl=EyesBase.getDefaultServerUrl()] - Eyes server URL
         * @param {boolean} [isDisabled=false] - set to true to disable Applitools Eyes and use the webdriver directly
         * @param {ClassicRunner} [runner=new ClassicRunner()] - runner related to the wanted Eyes implementation
         */
        constructor(serverUrl?: string | boolean | any, isDisabled?: boolean, runner?: import("lib/runner/ClassicRunner"));
        _runner: import("lib/runner/ClassicRunner");
        /** @type {EyesWrappedDriver} */
        _driver: EyesWrappedDriver;
        /** @type {EyesJsExecutor} */
        _executor: EyesJsExecutor;
        /** @type {EyesElementFinder} */
        _finder: EyesElementFinder;
        /** @type {EyesBrowsingContext} */
        _context: EyesBrowsingContext;
        /** @type {EyesDriverController} */
        _controller: EyesDriverController;
        _imageRotationDegrees: number;
        _automaticRotation: boolean;
        /** @type {boolean} */
        _isLandscape: boolean;
        /** @type {boolean} */
        _checkFullFrameOrElement: boolean;
        /** @type {String} */
        _originalDefaultContentOverflow: string;
        /** @type {String} */
        _originalFrameOverflow: string;
        /** @type {String} */
        _originalOverflow: string;
        /** @type {ImageProvider} */
        _imageProvider: any;
        /** @type {RegionPositionCompensation} */
        _regionPositionCompensation: any;
        /** @type {number} */
        _devicePixelRatio: number;
        /** @type {PositionProvider} */
        _targetPositionProvider: any;
        /** @type {Region} */
        _effectiveViewport: import("lib/geometry/Region");
        /** @type {EyesScreenshotFactory} */
        _screenshotFactory: import("lib/capture/EyesScreenshotFactory");
        /** @type {Promise<void>} */
        _closePromise: Promise<void>;
        /**
         * @param {Object} driver - driver object for the specific framework
         * @param {String} [appName] - application name
         * @param {String} [testName] - test name
         * @param {RectangleSize|{width: number, height: number}} [viewportSize] - viewport size
         * @param {SessionType} [sessionType] - type of test (e.g.,  standard test / visual performance test).
         * @returns {Promise<EyesWrappedDriver>}
         */
        open(driver: any, appName?: string, testName?: string, viewportSize?: import("lib/geometry/RectangleSize") | {
            width: number;
            height: number;
        }, sessionType?: any): Promise<EyesWrappedDriver>;
        _userAgent: import("lib/useragent/UserAgent");
        /**
         * @param {string|DriverCheckSettings} [nameOrCheckSettings] - name of the test case
         * @param {DriverCheckSettings} [checkSettings] - check settings for the described test case
         * @returns {Promise<MatchResult>}
         */
        check(nameOrCheckSettings?: string | DriverCheckSettings, checkSettings?: DriverCheckSettings): Promise<import("lib/match/MatchResult")>;
        _checkSettings: import("lib/fluent/DriverCheckSettings");
        /**
         * @private
         * @param {DriverCheckSettings} checkSettings - check settings for the described test case
         * @param {AsyncFunction} operation - check operation
         * @return {Promise<MatchResult>}
         */
        private _checkPrepare;
        _stitchContent: boolean;
        /**
         * @private
         * @param {DriverCheckSettings} checkSettings - check settings for the described test case
         * @param {Region} targetRegion - region to check
         * @return {Promise<MatchResult>}
         */
        private _checkRegion;
        /**
         * @param {DriverCheckSettings} checkSettings - check settings for the described test case
         * @param {Region} targetRegion - region to check
         * @return {Promise<MatchResult>}
         */
        _checkFullRegion(checkSettings: DriverCheckSettings, targetRegion: import("lib/geometry/Region")): Promise<import("lib/match/MatchResult")>;
        _shouldCheckFullRegion: boolean;
        _regionFullArea: import("lib/geometry/Region");
        /**
         * @private
         * @param {DriverCheckSettings} checkSettings - check settings for the described test case
         * @param {EyesWrappedElement} targetElement - element to check
         * @return {Promise<MatchResult>}
         */
        private _checkElement;
        /**
         * @private
         * @param {DriverCheckSettings} checkSettings - check settings for the described test case
         * @param {EyesWrappedElement} targetElement - element to check
         * @return {Promise<MatchResult>}
         */
        private _checkFullElement;
        /**
         * @private
         * @param {DriverCheckSettings} checkSettings - check settings for the described test case
         * @return {Promise<MatchResult>}
         */
        private _checkFrame;
        /**
         * @private
         * @param {DriverCheckSettings} checkSettings - check settings for the described test case
         * @return {Promise<MatchResult>}
         */
        private _checkFullFrame;
        /**
         * @private
         * @param {EyesWrappedElement} scrollRootElement - scroll root element
         * @return {PositionProvider}
         */
        private _createPositionProvider;
        /**
         * Create a full region screenshot
         * @return {Promise<EyesScreenshot>}
         */
        _getFullRegionScreenshot(): Promise<import("lib/capture/EyesScreenshotNew")>;
        /**
         * Create a full page screenshot
         * @return {Promise<EyesScreenshot>}
         */
        _getFullPageScreenshot(): Promise<import("lib/capture/EyesScreenshotNew")>;
        /**
         * Create a viewport page screenshot
         * @return {Promise<EyesScreenshot>}
         */
        _getViewportScreenshot(): Promise<import("lib/capture/EyesScreenshotNew")>;
        /**
         * @private
         * @return {Promise<ScaleProviderFactory>}
         */
        private _updateScalingParams;
        /**
         * @private
         * @return {Promise<ScaleProviderFactory>}
         */
        private _getScaleProviderFactory;
        /**
         * Set the failure report.
         * @param {FailureReports} mode Use one of the values in FailureReports.
         */
        setFailureReport(mode: typeof import("lib/FailureReports")): void;
        _failureReportOverridden: boolean;
        /**
         * @param {By} locator
         * @returns {Region}
         */
        getRegionByLocator(locator: any): import("lib/geometry/Region");
    }
    namespace EyesClassic {
        export { EyesWrappedDriver, EyesWrappedElement, EyesBrowsingContext, EyesElementFinder, EyesDriverController, EyesJsExecutor, DriverCheckSettings };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type EyesJsExecutor = import("lib/wrappers/EyesJsExecutor");
    type EyesElementFinder = import("lib/wrappers/EyesElementFinder");
    type EyesBrowsingContext = import("lib/wrappers/EyesBrowsingContext");
    type EyesDriverController = import("lib/wrappers/EyesDriverController");
    type DriverCheckSettings = import("lib/fluent/DriverCheckSettings");
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
}
declare module "lib/fluent/IgnoreRegionBySelector" {
    export = IgnoreRegionBySelector;
    const IgnoreRegionBySelector_base: typeof import("lib/fluent/GetRegion");
    /**
     * @typedef {import('../wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
     * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
     * @typedef {import('../EyesClassic')} EyesClassic
     *
     * @typedef PersistedRegions
     * @prop {string} type - selector type (css or xpath)
     * @prop {string} selector - selector itself
     */
    class IgnoreRegionBySelector extends IgnoreRegionBySelector_base {
        /**
         * @param {SupportedSelector} selector
         */
        constructor(selector: SupportedSelector);
        /**
         * @param {EyesWrappedDriver} driver
         * @return {Promise<PersistedRegions[]>}
         */
        toPersistedRegions(driver: EyesWrappedDriver): Promise<PersistedRegions[]>;
    }
    namespace IgnoreRegionBySelector {
        export { SupportedSelector, EyesWrappedDriver, EyesClassic, PersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type PersistedRegions = {
        /**
         * - selector type (css or xpath)
         */
        type: string;
        /**
         * - selector itself
         */
        selector: string;
    };
    type SupportedSelector = {
        "": any;
    };
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/IgnoreRegionByElement" {
    export = IgnoreRegionByElement;
    const IgnoreRegionByElement_base: typeof import("lib/fluent/GetRegion");
    /**
     * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
     * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
     * @typedef {import('../EyesClassic')} EyesClassic
     *
     * @typedef PersistedRegions
     * @prop {string} type - selector type (css or xpath)
     * @prop {string} selector - selector itself
     */
    class IgnoreRegionByElement extends IgnoreRegionByElement_base {
        /**
         * @param {EyesWrappedElement} element
         */
        constructor(element: EyesWrappedElement);
        _element: import("lib/wrappers/EyesWrappedElement");
        /**
         * @param {EyesWrappedDriver} driver
         * @return {Promise<PersistedRegions[]>}
         */
        toPersistedRegions(driver: EyesWrappedDriver): Promise<PersistedRegions[]>;
    }
    namespace IgnoreRegionByElement {
        export { EyesWrappedElement, EyesWrappedDriver, EyesClassic, PersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type PersistedRegions = {
        /**
         * - selector type (css or xpath)
         */
        type: string;
        /**
         * - selector itself
         */
        selector: string;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/FloatingRegionBySelector" {
    export = FloatingRegionBySelector;
    const FloatingRegionBySelector_base: typeof import("lib/fluent/GetFloatingRegion");
    /**
     * @typedef {import('../wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
     * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
     * @typedef {import('../EyesClassic')} EyesClassic
     *
     * @typedef FloatingPersistedRegions
     * @prop {string} type - selector type (css or xpath)
     * @prop {string} selector - selector itself
     * @prop {number} maxUpOffset - up offset
     * @prop {number} maxDownOffset - down offset
     * @prop {number} maxLeftOffset - left offset
     * @prop {number} maxRightOffset - right offset
     */
    class FloatingRegionBySelector extends FloatingRegionBySelector_base {
        /**
         * @param {SupportedSelector} regionSelector
         * @param {number} maxUpOffset
         * @param {number} maxDownOffset
         * @param {number} maxLeftOffset
         * @param {number} maxRightOffset
         */
        constructor(regionSelector: SupportedSelector, maxUpOffset: number, maxDownOffset: number, maxLeftOffset: number, maxRightOffset: number);
        _selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector;
        _maxUpOffset: number;
        _maxDownOffset: number;
        _maxLeftOffset: number;
        _maxRightOffset: number;
        /**
         * @param {EyesWrappedDriver} driver
         * @return {Promise<FloatingPersistedRegions[]>}
         */
        toPersistedRegions(driver: EyesWrappedDriver): Promise<FloatingPersistedRegions[]>;
    }
    namespace FloatingRegionBySelector {
        export { SupportedSelector, EyesWrappedDriver, EyesClassic, FloatingPersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type FloatingPersistedRegions = {
        /**
         * - selector type (css or xpath)
         */
        type: string;
        /**
         * - selector itself
         */
        selector: string;
        /**
         * - up offset
         */
        maxUpOffset: number;
        /**
         * - down offset
         */
        maxDownOffset: number;
        /**
         * - left offset
         */
        maxLeftOffset: number;
        /**
         * - right offset
         */
        maxRightOffset: number;
    };
    type SupportedSelector = {
        "": any;
    };
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/FloatingRegionByElement" {
    export = FloatingRegionByElement;
    const FloatingRegionByElement_base: typeof import("lib/fluent/GetFloatingRegion");
    /**
     * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
     * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
     * @typedef {import('../EyesClassic')} EyesClassic
     *
     * @typedef FloatingPersistedRegions
     * @prop {string} type - selector type (css or xpath)
     * @prop {string} selector - selector itself
     * @prop {number} maxUpOffset - up offset
     * @prop {number} maxDownOffset - down offset
     * @prop {number} maxLeftOffset - left offset
     * @prop {number} maxRightOffset - right offset
     */
    class FloatingRegionByElement extends FloatingRegionByElement_base {
        /**
         * @param {EyesWrappedElement} element
         * @param {number} maxUpOffset
         * @param {number} maxDownOffset
         * @param {number} maxLeftOffset
         * @param {number} maxRightOffset
         */
        constructor(element: EyesWrappedElement, maxUpOffset: number, maxDownOffset: number, maxLeftOffset: number, maxRightOffset: number);
        _element: import("lib/wrappers/EyesWrappedElement");
        _maxUpOffset: number;
        _maxDownOffset: number;
        _maxLeftOffset: number;
        _maxRightOffset: number;
        /**
         * @param {EyesWrappedDriver} driver
         * @return {Promise<FloatingPersistedRegions[]>}
         */
        toPersistedRegions(driver: EyesWrappedDriver): Promise<FloatingPersistedRegions[]>;
    }
    namespace FloatingRegionByElement {
        export { EyesWrappedElement, EyesWrappedDriver, EyesClassic, FloatingPersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type FloatingPersistedRegions = {
        /**
         * - selector type (css or xpath)
         */
        type: string;
        /**
         * - selector itself
         */
        selector: string;
        /**
         * - up offset
         */
        maxUpOffset: number;
        /**
         * - down offset
         */
        maxDownOffset: number;
        /**
         * - left offset
         */
        maxLeftOffset: number;
        /**
         * - right offset
         */
        maxRightOffset: number;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/AccessibilityRegionBySelector" {
    export = AccessibilityRegionBySelector;
    const AccessibilityRegionBySelector_base: typeof import("lib/fluent/GetAccessibilityRegion");
    /**
     * @typedef {import('../config/AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
     * @typedef {import('../wrappers/EyesWrappedElement').SupportedSelector} SupportedSelector
     * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
     * @typedef {import('../EyesClassic')} EyesClassic
     *
     * @typedef AccessibilityPersistedRegions
     * @prop {string} type - selector type (css or xpath)
     * @prop {string} selector - selector itself
     * @prop {AccessibilityRegionType} accessibilityType - accessibility region type
     */
    class AccessibilityRegionBySelector extends AccessibilityRegionBySelector_base {
        /**
         * @param {SupportedSelector} selector
         * @param {AccessibilityRegionType} regionType
         */
        constructor(selector: SupportedSelector, regionType: AccessibilityRegionType);
        _selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector;
        _regionType: string;
        /**
         * @param {EyesWrappedDriver} driver
         * @return {Promise<AccessibilityPersistedRegions[]>}
         */
        toPersistedRegions(driver: EyesWrappedDriver): Promise<AccessibilityPersistedRegions[]>;
    }
    namespace AccessibilityRegionBySelector {
        export { AccessibilityRegionType, SupportedSelector, EyesWrappedDriver, EyesClassic, AccessibilityPersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type AccessibilityPersistedRegions = {
        /**
         * - selector type (css or xpath)
         */
        type: string;
        /**
         * - selector itself
         */
        selector: string;
        /**
         * - accessibility region type
         */
        accessibilityType: AccessibilityRegionType;
    };
    type SupportedSelector = {
        "": any;
    };
    type AccessibilityRegionType = string;
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/AccessibilityRegionByElement" {
    export = AccessibilityRegionByElement;
    const AccessibilityRegionByElement_base: typeof import("lib/fluent/GetAccessibilityRegion");
    /**
     * @typedef {import('../config/AccessibilityRegionType').AccessibilityRegionType} AccessibilityRegionType
     * @typedef {import('../wrappers/EyesWrappedElement')} EyesWrappedElement
     * @typedef {import('../wrappers/EyesWrappedDriver')} EyesWrappedDriver
     * @typedef {import('../EyesClassic')} EyesClassic
     *
     * @typedef AccessibilityPersistedRegions
     * @prop {string} type - selector type (css or xpath)
     * @prop {string} selector - selector itself
     * @prop {AccessibilityRegionType} accessibilityType - accessibility region type
     */
    class AccessibilityRegionByElement extends AccessibilityRegionByElement_base {
        /**
         * @param {EyesWrappedElement} element
         * @param {AccessibilityRegionType} regionType
         */
        constructor(element: EyesWrappedElement, regionType: AccessibilityRegionType);
        _element: import("lib/wrappers/EyesWrappedElement");
        _regionType: string;
        /**
         * @param {EyesWrappedDriver} driver
         * @return {Promise<AccessibilityPersistedRegions[]>}
         */
        toPersistedRegions(driver: EyesWrappedDriver): Promise<AccessibilityPersistedRegions[]>;
    }
    namespace AccessibilityRegionByElement {
        export { AccessibilityRegionType, EyesWrappedElement, EyesWrappedDriver, EyesClassic, AccessibilityPersistedRegions };
    }
    type EyesWrappedDriver = import("lib/wrappers/EyesWrappedDriver");
    type AccessibilityPersistedRegions = {
        /**
         * - selector type (css or xpath)
         */
        type: string;
        /**
         * - selector itself
         */
        selector: string;
        /**
         * - accessibility region type
         */
        accessibilityType: AccessibilityRegionType;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type AccessibilityRegionType = string;
    type EyesClassic = import("lib/EyesClassic");
}
declare module "lib/fluent/DriverCheckSettings" {
    export = DriverCheckSettings;
    const DriverCheckSettings_base: typeof import("lib/fluent/CheckSettings");
    class DriverCheckSettings extends DriverCheckSettings_base {
        /**
         * @param {SpecsCheckSettings} SpecsCheckSettings
         * @return {DriverCheckSettings} specialized version of this class
         */
        static specialize(SpecsCheckSettings: SpecsCheckSettings): DriverCheckSettings;
        /** @type {SpecsCheckSettings} */
        static get specs(): SpecsCheckSettings;
        /**
         * Create check settings from an object
         * @param {PlainCheckSettings} object
         * @return {DriverCheckSettings} check settings instance
         */
        static from(object: PlainCheckSettings): DriverCheckSettings;
        /**
         * Create check settings without target
         * @return {DriverCheckSettings} check settings object
         */
        static window(): DriverCheckSettings;
        /**
         * Create check settings with bound region and frame
         * @param {RegionReference} region
         * @param {FrameReference} [frame]
         * @return {DriverCheckSettings} check settings object
         */
        static region(region: RegionReference, frame?: FrameReference): DriverCheckSettings;
        /**
         * Create check settings with bound frame
         * @param {FrameReference} frame
         * @return {DriverCheckSettings} check settings object
         */
        static frame(frame: FrameReference): DriverCheckSettings;
        /**
         * Create check settings with bound region and/or frame
         * @param {RegionReference} [region]
         * @param {FrameReference} [frame]
         */
        constructor(checkSettings: any);
        /** @type {SpecsCheckSettings} */
        get specs(): SpecsCheckSettings;
        /** @type {EyesWrappedElement} */
        _targetElement: EyesWrappedElement;
        /** @type {Frame[]} */
        _frameChain: Frame[];
        /** @type {Object<string, string>} */
        _scriptHooks: {
            [x: string]: string;
        };
        /**
         * @param {RegionReference} region
         * @returns {this}
         */
        region(region: RegionReference): this;
        /**
         * @param {FrameReference} frame - the frame to switch to
         * @returns {this}
         */
        frame(frameReference: any): this;
        /**
         * @param {SupportedSelector|SupportedElement|EyesWrappedElement} element
         * @return {this}
         */
        scrollRootElement(element: SupportedSelector | SupportedElement | EyesWrappedElement): this;
        _scrollRootElement: import("lib/wrappers/EyesWrappedElement");
        /**
         * @ignore
         * @return {Promise<EyesWrappedElement>}
         */
        getScrollRootElement(): Promise<EyesWrappedElement>;
        /**
         * @return {?TargetRegionByElement}
         */
        getTargetProvider(): import("lib/fluent/TargetRegionByElement") | null;
        /**
         * @return {EyesWrappedElement}
         */
        get targetElement(): import("lib/wrappers/EyesWrappedElement");
        /**
         * @return {Frame[]}
         */
        getFrameChain(): Frame[];
        /**
         * @return {Frame[]}
         */
        get frameChain(): import("lib/frames/Frame")[];
        /**
         * @param {string} name
         * @param {string} script
         * @return {this}
         */
        hook(name: string, script: string): this;
        /**
         * @deprecated
         * @param {String} hook
         * @return {this}
         */
        webHook(hook: string): this;
        /**
         * @param {String} hook
         * @return {this}
         */
        beforeRenderScreenshotHook(hook: string): this;
        /**
         * @ignore
         * @return {Map<string, string>}
         */
        getScriptHooks(): Map<string, string>;
    }
    namespace DriverCheckSettings {
        export { EyesWrappedElement, SupportedElement, SupportedSelector, Frame, FrameReference, ExtendedFrameReference, RegionReference, ElementReference, FloatingRegionReference, AccessibilityRegionReference, SpecsCheckSettings, PlainCheckSettings };
    }
    type SpecsCheckSettings = {
        /**
         * - return true if the value is a valid selector, false otherwise
         */
        isSelector: (selector: any) => boolean;
        /**
         * - return true if the value is an element, false otherwise
         */
        isCompatibleElement: (element: any) => boolean;
        /**
         * - return partially created element
         */
        createElementFromSelector: (selector: SupportedSelector) => EyesWrappedElement;
        /**
         * - return partially created element
         */
        createElementFromElement: (element: SupportedElement) => EyesWrappedElement;
        /**
         * - return true if the value is a frame reference, false otherwise
         */
        isFrameReference: (reference: any) => boolean;
        /**
         * - return frame reference
         */
        createFrameReference: (reference: FrameReference) => Frame;
    };
    type EyesWrappedElement = import("lib/wrappers/EyesWrappedElement");
    type Frame = import("lib/frames/Frame");
    /**
     * Reference to the region
     */
    type RegionReference = import("lib/geometry/Region") | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement");
    type SupportedSelector = {
        "": any;
    };
    type SupportedElement = {
        "": any;
    };
    type PlainCheckSettings = {
        name?: string;
        matchLevel?: any;
        timeout?: number;
        sendDom?: boolean;
        useDom?: boolean;
        enablePatterns?: boolean;
        ignoreDisplacements?: boolean;
        ignoreCaret?: boolean;
        isFully?: boolean;
        renderId?: string;
        hooks?: {
            [key: string]: string;
        };
        region?: RegionReference;
        frames?: (FrameReference | ExtendedFrameReference)[];
        scrollRootElement?: ElementReference;
        ignoreRegions?: RegionReference[];
        layoutRegion?: RegionReference[];
        strictRegions?: RegionReference[];
        contentRegions?: RegionReference[];
        floatingRegions?: (FloatingRegionReference | RegionReference)[];
        accessibilityRegions?: (AccessibilityRegionReference | RegionReference)[];
    };
    type FrameReference = string | number | import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement") | import("lib/frames/Frame");
    type ExtendedFrameReference = {
        scrollRootElement?: ElementReference;
        frame: FrameReference;
    };
    type ElementReference = import("lib/wrappers/EyesWrappedElement").SupportedSelector | import("lib/wrappers/EyesWrappedElement").SupportedElement | import("lib/wrappers/EyesWrappedElement");
    type FloatingRegionReference = {
        region: RegionReference;
        /**
         * - how much the content can move up
         */
        maxUpOffset?: number;
        /**
         * - how much the content can move down
         */
        maxDownOffset?: number;
        /**
         * - how much the content can move to the left
         */
        maxLeftOffset?: number;
        /**
         * - how much the content can move to the right
         */
        maxRightOffset?: number;
    };
    type AccessibilityRegionReference = {
        region: RegionReference;
        type?: any;
    };
}
declare module "lib/EyesJsBrowserUtils" {
    export = EyesJsBrowserUtils;
    /**
     * Handles browser related functionality.
     *
     * @ignore
     */
    class EyesJsBrowserUtils {
        /**
         * Sets the overflow of the current context's document element.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @param {?string} value - The overflow value to set.
         * @param {WebElement} [rootElement]
         * @return {Promise<string>} - The previous value of overflow (could be {@code null} if undefined).
         */
        static setOverflow(executor: any, value: string | null, rootElement?: any): Promise<string>;
        /**
         * Hides the scrollbars of the current context's document element.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @param {number} stabilizationTimeout - The amount of time to wait for the "hide scrollbars" action to take effect
         *   (Milliseconds). Zero/negative values are ignored.
         * @param {WebElement} [scrollbarsRoot]
         * @return {Promise<string>} - The previous value of the overflow property (could be {@code null}).
         */
        static hideScrollbars(executor: any, stabilizationTimeout: number, scrollbarsRoot?: any): Promise<string>;
        /**
         * Gets the current scroll position.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @return {Promise<Location>} - The current scroll position of the current frame.
         */
        static getCurrentScrollPosition(executor: any): Promise<Location>;
        /**
         * Gets the element xpath.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @param {WebElement} element - The element.
         */
        static getElementXpath(executor: any, element: any): Promise<any>;
        /**
         * Sets the scroll position of the current frame.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @param {Location} location - Location to scroll to
         * @return {Promise} - A promise which resolves after the action is performed and timeout passed.
         */
        static setCurrentScrollPosition(executor: any, location: Location): Promise<any>;
        /**
         * Scrolls current frame to its bottom right.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @return {Promise} - A promise which resolves after the action is performed and timeout passed.
         */
        static scrollToBottomRight(executor: any): Promise<any>;
        /**
         * Get the entire page size.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @return {Promise<RectangleSize>} - A promise which resolves to an object containing the width/height of the page.
         */
        static getCurrentFrameContentEntireSize(executor: any): Promise<import("lib/geometry/RectangleSize")>;
        /**
         * Get the entire page size.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @return {Promise<RectangleSize>} - A promise which resolves to an object containing the width/height of the page.
         */
        static getOverflowAwareContentEntireSize(executor: any): Promise<import("lib/geometry/RectangleSize")>;
        /**
         * Tries to get the viewport size using Javascript. If fails, gets the entire browser window size!
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @return {Promise<RectangleSize>} - The viewport size.
         */
        static getViewportSize(executor: any): Promise<import("lib/geometry/RectangleSize")>;
        /**
         * Gets the device pixel ratio.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @return {Promise<number>} - A promise which resolves to the device pixel ratio (float type).
         */
        static getDevicePixelRatio(executor: any): Promise<number>;
        /**
         * Get the current transform of page.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @return {Promise<Map<string, string>>} - A promise which resolves to the current transform value.
         */
        static getCurrentTransform(executor: any): Promise<Map<string, string>>;
        /**
         * Sets transforms for document.documentElement according to the given map of style keys and values.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @param {Map<string, string>} transforms - The transforms to set. Keys are used as style keys and values are the
         *   values for those styles.
         * @return {Promise}
         */
        static setTransforms(executor: any, transforms: Map<string, string>): Promise<any>;
        /**
         * Set the given transform to document.documentElement for all style keys defined in {@link JS_TRANSFORM_KEYS}
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @param {string} transform - The transform to set.
         * @return {Promise} - A promise which resolves to the previous transform once the updated transform is set.
         */
        static setTransform(executor: any, transform: string): Promise<any>;
        /**
         * Translates the current documentElement to the given position.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @param {Location} position - The position to translate to.
         * @return {Promise} - A promise which resolves to the previous transform when the scroll is executed.
         */
        static translateTo(executor: any, position: Location): Promise<any>;
        /**
         * Scroll to the bottom of the page and then scroll to the top.
         *
         * @param {EyesJsExecutor} executor - The executor to use.
         * @param {number} [scrollAmmount = 500] - How mutch scrolling to do in each step.
         * @param {number} [timeInterval = 300] - Milliseconds netween each scroll.
         * @return {Promise} - A promise which resolves once the scrolling is complete.
         */
        static scrollPage(executor: any, scrollAmmount?: number, timeInterval?: number): Promise<any>;
    }
}
declare module "lib/fluent/locatorToPersistedRegions" {
    export = locatorToPersistedRegions;
    function locatorToPersistedRegions(locator: any, driver: any): Promise<{
        type: string;
        selector: any;
    }[]>;
}
declare module "lib/match/MatchWindowDataWithScreenshot" {
    export = MatchWindowDataWithScreenshot;
    /**
     * A container for a MatchWindowData along with the screenshot used for creating it. (We specifically avoid inheritance
     * so we don't have to deal with serialization issues).
     *
     * @ignore
     */
    class MatchWindowDataWithScreenshot {
        /**
         * @param {MatchWindowData} matchWindowData
         * @param {EyesScreenshot} screenshot
         */
        constructor({ matchWindowData, screenshot }?: any, ...args: any[]);
        _matchWindowData: any;
        _screenshot: any;
        /**
         * @return {MatchWindowData}
         */
        getMatchWindowData(): any;
        /**
         * @return {EyesScreenshot}
         */
        getScreenshot(): any;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/metadata/ImageMatchSettings" {
    export = ImageMatchSettings;
    class ImageMatchSettings {
        /**
         * @param {MatchLevel|string} matchLevel
         * @param {number} ignoreCaret
         * @param {Region[]|object[]} ignore
         * @param {Region[]|object[]} strict
         * @param {Region[]|object[]} content
         * @param {Region[]|object[]} layout
         * @param {FloatingMatchSettings[]|object[]} floating
         *
         * @param {number} splitTopHeight
         * @param {number} splitBottomHeight
         * @param {number} scale
         * @param {number} remainder
         */
        constructor({ matchLevel, ignore, strict, content, layout, floating, splitTopHeight, splitBottomHeight, ignoreCaret, scale, remainder, }?: any | string);
        _matchLevel: any;
        _ignore: any;
        _strict: any;
        _content: any;
        _layout: any;
        _floating: any;
        _splitTopHeight: any;
        _splitBottomHeight: any;
        _ignoreCaret: any;
        _scale: any;
        _remainder: any;
        /**
         * @return {MatchLevel}
         */
        getMatchLevel(): any;
        /**
         * @param {MatchLevel} value
         */
        setMatchLevel(value: any): void;
        /**
         * @return {Region[]}
         */
        getIgnore(): import("lib/geometry/Region")[];
        /**
         * @param {Region[]} value
         */
        setIgnore(value: import("lib/geometry/Region")[]): void;
        /**
         * @return {Region[]}
         */
        getStrict(): import("lib/geometry/Region")[];
        /**
         * @param {Region[]} value
         */
        setStrict(value: import("lib/geometry/Region")[]): void;
        /**
         * @return {Region[]}
         */
        getContent(): import("lib/geometry/Region")[];
        /**
         * @param {Region[]} value
         */
        setContent(value: import("lib/geometry/Region")[]): void;
        /**
         * @return {Region[]}
         */
        getLayout(): import("lib/geometry/Region")[];
        /**
         * @param {Region[]} value
         */
        setLayout(value: import("lib/geometry/Region")[]): void;
        /**
         * @return {FloatingMatchSettings[]}
         */
        getFloating(): import("lib/config/FloatingMatchSettings")[];
        /**
         * @param {FloatingMatchSettings[]} value
         */
        setFloating(value: import("lib/config/FloatingMatchSettings")[]): void;
        /**
         * @return {number}
         */
        getSplitTopHeight(): number;
        /**
         * @param {number} value
         */
        setSplitTopHeight(value: number): void;
        /**
         * @return {number}
         */
        getSplitBottomHeight(): number;
        /**
         * @param {number} value
         */
        setSplitBottomHeight(value: number): void;
        /**
         * @return {boolean}
         */
        getIgnoreCaret(): boolean;
        /**
         * @param {boolean} value
         */
        setIgnoreCaret(value: boolean): void;
        /**
         * @return {number}
         */
        getScale(): number;
        /**
         * @param {number} value
         */
        setScale(value: number): void;
        /**
         * @return {number}
         */
        getRemainder(): number;
        /**
         * @param {number} value
         */
        setRemainder(value: number): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/metadata/Image" {
    export = Image;
    class Image {
        /**
         * @param data
         * @param {string} data.id
         * @param {RectangleSize|object} data.size
         * @param {boolean} data.hasDom
         */
        constructor({ id, size, hasDom }?: {
            id: any;
            size: any;
            hasDom: any;
        });
        _id: any;
        _size: any;
        _hasDom: any;
        /**
         * @return {string}
         */
        getId(): string;
        /**
         * @param {string} value
         */
        setId(value: string): void;
        /**
         * @return {RectangleSize}
         */
        getSize(): import("lib/geometry/RectangleSize");
        /**
         * @param {RectangleSize} value
         */
        setSize(value: import("lib/geometry/RectangleSize")): void;
        /**
         * @return {boolean}
         */
        getHasDom(): boolean;
        /**
         * @param {boolean} value
         */
        setHasDom(value: boolean): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/metadata/ActualAppOutput" {
    export = ActualAppOutput;
    class ActualAppOutput {
        /**
         * @param output
         * @param {Image|object} output.image
         * @param {Image|object} output.thumbprint
         * @param {ImageMatchSettings|object} output.imageMatchSettings
         * @param {boolean} output.ignoreExpectedOutputSettings
         * @param {boolean} output.isMatching
         * @param {boolean} output.areImagesMatching
         * @param {Date|string} output.occurredAt
         * @param {object[]} output.userInputs
         * @param {string} output.windowTitle
         * @param {string} output.tag
         * @param {boolean} output.isPrimary
         */
        constructor({ image, thumbprint, imageMatchSettings, ignoreExpectedOutputSettings, isMatching, areImagesMatching, occurredAt, userInputs, windowTitle, tag, isPrimary, }?: {
            image: any;
            thumbprint: any;
            imageMatchSettings: any;
            ignoreExpectedOutputSettings: any;
            isMatching: any;
            areImagesMatching: any;
            occurredAt: any;
            userInputs: any;
            windowTitle: any;
            tag: any;
            isPrimary: any;
        });
        _image: any;
        _thumbprint: any;
        _imageMatchSettings: any;
        _ignoreExpectedOutputSettings: any;
        _isMatching: any;
        _areImagesMatching: any;
        _occurredAt: any;
        _userInputs: any;
        _windowTitle: any;
        _tag: any;
        _isPrimary: any;
        /**
         * @return {Image}
         */
        getImage(): import("lib/metadata/Image");
        /**
         * @param {Image} value
         */
        setImage(value: import("lib/metadata/Image")): void;
        /**
         * @return {Image}
         */
        getThumbprint(): import("lib/metadata/Image");
        /**
         * @param {Image} value
         */
        setThumbprint(value: import("lib/metadata/Image")): void;
        /**
         * @return {ImageMatchSettings}
         */
        getImageMatchSettings(): import("lib/metadata/ImageMatchSettings");
        /**
         * @param {ImageMatchSettings} value
         */
        setImageMatchSettings(value: import("lib/metadata/ImageMatchSettings")): void;
        /**
         * @return {boolean}
         */
        getIgnoreExpectedOutputSettings(): boolean;
        /**
         * @param {boolean} value
         */
        setIgnoreExpectedOutputSettings(value: boolean): void;
        /**
         * @return {boolean}
         */
        getIsMatching(): boolean;
        /**
         * @param {boolean} value
         */
        setIsMatching(value: boolean): void;
        /**
         * @return {boolean}
         */
        getAreImagesMatching(): boolean;
        /**
         * @param {boolean} value
         */
        setAreImagesMatching(value: boolean): void;
        /**
         * @return {Date}
         */
        getOccurredAt(): Date;
        /**
         * @param {Date} value
         */
        setOccurredAt(value: Date): void;
        /**
         * @return {object[]}
         */
        getUserInputs(): object[];
        /**
         * @param {object[]} value
         */
        setUserInputs(value: object[]): void;
        /**
         * @return {string}
         */
        getWindowTitle(): string;
        /**
         * @param {string} value
         */
        setWindowTitle(value: string): void;
        /**
         * @return {string}
         */
        getTag(): string;
        /**
         * @param {string} value
         */
        setTag(value: string): void;
        /**
         * @return {boolean}
         */
        getIsPrimary(): boolean;
        /**
         * @param {boolean} value
         */
        setIsPrimary(value: boolean): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/metadata/Annotations" {
    export = Annotations;
    class Annotations {
        /**
         * @param regions
         * @param {FloatingMatchSettings[]|object[]} regions.floating
         * @param {Region[]|object[]} regions.ignore
         * @param {Region[]|object[]} regions.strict
         * @param {Region[]|object[]} regions.content
         * @param {Region[]|object[]} regions.layout
         */
        constructor({ floating, ignore, strict, content, layout }?: {
            floating: any;
            ignore: any;
            strict: any;
            content: any;
            layout: any;
        });
        _floating: any;
        _ignore: any;
        _strict: any;
        _content: any;
        _layout: any;
        /**
         * @return {FloatingMatchSettings[]}
         */
        getFloating(): import("lib/config/FloatingMatchSettings")[];
        /**
         * @param {FloatingMatchSettings[]} value
         */
        setFloating(value: import("lib/config/FloatingMatchSettings")[]): void;
        /**
         * @return {Region[]}
         */
        getIgnore(): import("lib/geometry/Region")[];
        /**
         * @param {Region[]} value
         */
        setIgnore(value: import("lib/geometry/Region")[]): void;
        /**
         * @return {Region[]}
         */
        getStrict(): import("lib/geometry/Region")[];
        /**
         * @param {Region[]} value
         */
        setStrict(value: import("lib/geometry/Region")[]): void;
        /**
         * @return {Region[]}
         */
        getContent(): import("lib/geometry/Region")[];
        /**
         * @param {Region[]} value
         */
        setContent(value: import("lib/geometry/Region")[]): void;
        /**
         * @return {Region[]}
         */
        getLayout(): import("lib/geometry/Region")[];
        /**
         * @param {Region[]} value
         */
        setLayout(value: import("lib/geometry/Region")[]): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/metadata/BatchInfo" {
    export = BatchInfo;
    class BatchInfo {
        /**
         * @param info
         * @param {string} info.id
         * @param {string} info.name
         * @param {Date|string} info.startedAt
         */
        constructor({ id, name, startedAt }?: {
            id: any;
            name: any;
            startedAt: any;
        });
        _id: any;
        _name: any;
        _startedAt: any;
        /**
         * @return {string}
         */
        getId(): string;
        /**
         * @param {string} value
         */
        setId(value: string): void;
        /**
         * @return {string}
         */
        getName(): string;
        /**
         * @param {string} value
         */
        setName(value: string): void;
        /**
         * @return {Date}
         */
        getStartedAt(): Date;
        /**
         * @param {Date} value
         */
        setStartedAt(value: Date): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/metadata/Branch" {
    export = Branch;
    class Branch {
        /**
         * @param data
         * @param {string} data.id
         * @param {string} data.name
         * @param {boolean} data.isDeleted
         * @param {object} data.updateInfo - TODO: add typed `updateInfo`
         */
        constructor({ id, name, isDeleted, updateInfo }?: {
            id: any;
            name: any;
            isDeleted: any;
            updateInfo: any;
        });
        _id: any;
        _name: any;
        _isDeleted: any;
        _updateInfo: any;
        /**
         * @return {string}
         */
        getId(): string;
        /**
         * @param {string} value
         */
        setId(value: string): void;
        /**
         * @return {string}
         */
        getName(): string;
        /**
         * @param {string} value
         */
        setName(value: string): void;
        /**
         * @return {boolean}
         */
        getIsDeleted(): boolean;
        /**
         * @param {boolean} value
         */
        setIsDeleted(value: boolean): void;
        /**
         * @return {object}
         */
        getUpdateInfo(): object;
        /**
         * @param {object} value
         */
        setUpdateInfo(value: object): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/metadata/ExpectedAppOutput" {
    export = ExpectedAppOutput;
    class ExpectedAppOutput {
        /**
         * @param output
         * @param {string} output.tag
         * @param {Image|object} output.image
         * @param {Image|object} output.thumbprint
         * @param {Date|string} output.occurredAt
         * @param {Annotations|object} output.annotations
         */
        constructor({ tag, image, thumbprint, occurredAt, annotations }?: {
            tag: any;
            image: any;
            thumbprint: any;
            occurredAt: any;
            annotations: any;
        });
        _tag: any;
        _image: any;
        _thumbprint: any;
        _occurredAt: any;
        _annotations: any;
        /**
         * @return {string}
         */
        getTag(): string;
        /**
         * @param {string} value
         */
        setTag(value: string): void;
        /**
         * @return {Image}
         */
        getImage(): import("lib/metadata/Image");
        /**
         * @param {Image} value
         */
        setImage(value: import("lib/metadata/Image")): void;
        /**
         * @return {Image}
         */
        getThumbprint(): import("lib/metadata/Image");
        /**
         * @param {Image} value
         */
        setThumbprint(value: import("lib/metadata/Image")): void;
        /**
         * @return {Date}
         */
        getOccurredAt(): Date;
        /**
         * @param {Date} value
         */
        setOccurredAt(value: Date): void;
        /**
         * @return {Annotations}
         */
        getAnnotations(): import("lib/metadata/Annotations");
        /**
         * @param {Annotations} value
         */
        setAnnotations(value: import("lib/metadata/Annotations")): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/metadata/StartInfo" {
    export = StartInfo;
    class StartInfo {
        /**
         * @param info
         * @param {string} info.sessionType
         * @param {boolean} info.isTransient
         * @param {boolean} info.ignoreBaseline
         * @param {string} info.appIdOrName
         * @param {boolean} info.compareWithParentBranch
         * @param {string} info.scenarioIdOrName
         * @param {string} info.displayName
         * @param {BatchInfo|object} info.batchInfo
         * @param {AppEnvironment|object} info.environment
         * @param {MatchLevel|string} info.matchLevel
         * @param {ImageMatchSettings|object} info.defaultMatchSettings
         * @param {string} info.agentId
         * @param {object[]} info.properties
         * @param {boolean} info.render
         */
        constructor({ sessionType, isTransient, ignoreBaseline, appIdOrName, compareWithParentBranch, scenarioIdOrName, displayName, batchInfo, environment, matchLevel, defaultMatchSettings, agentId, properties, render, }?: {
            sessionType: any;
            isTransient: any;
            ignoreBaseline: any;
            appIdOrName: any;
            compareWithParentBranch: any;
            scenarioIdOrName: any;
            displayName: any;
            batchInfo: any;
            environment: any;
            matchLevel: any;
            defaultMatchSettings: any;
            agentId: any;
            properties: any;
            render: any;
        });
        _sessionType: any;
        _isTransient: any;
        _ignoreBaseline: any;
        _appIdOrName: any;
        _compareWithParentBranch: any;
        _scenarioIdOrName: any;
        _displayName: any;
        _batchInfo: any;
        _environment: any;
        _matchLevel: any;
        _defaultMatchSettings: any;
        _agentId: any;
        _properties: any;
        _render: any;
        /**
         * @return {string}
         */
        getSessionType(): string;
        /**
         * @param {string} value
         */
        setSessionType(value: string): void;
        /**
         * @return {boolean}
         */
        getIsTransient(): boolean;
        /**
         * @param {boolean} value
         */
        setIsTransient(value: boolean): void;
        /**
         * @return {boolean}
         */
        getIgnoreBaseline(): boolean;
        /**
         * @param {boolean} value
         */
        setIgnoreBaseline(value: boolean): void;
        /**
         * @return {string}
         */
        getAppIdOrName(): string;
        /**
         * @param {string} value
         */
        setAppIdOrName(value: string): void;
        /**
         * @return {boolean}
         */
        getCompareWithParentBranch(): boolean;
        /**
         * @param {boolean} value
         */
        setCompareWithParentBranch(value: boolean): void;
        /**
         * @return {string}
         */
        getScenarioIdOrName(): string;
        /**
         * @param {string} value
         */
        setScenarioIdOrName(value: string): void;
        /**
         * @return {string}
         */
        getDisplayName(): string;
        /**
         * @param {string} value
         */
        setDisplayName(value: string): void;
        /**
         * @return {BatchInfo}
         */
        getBatchInfo(): import("lib/metadata/BatchInfo");
        /**
         * @param {BatchInfo} value
         */
        setBatchInfo(value: import("lib/metadata/BatchInfo")): void;
        /**
         * @return {AppEnvironment}
         */
        getEnvironment(): import("lib/AppEnvironment");
        /**
         * @param {AppEnvironment} value
         */
        setEnvironment(value: import("lib/AppEnvironment")): void;
        /**
         * @return {string}
         */
        getMatchLevel(): string;
        /**
         * @param {string} value
         */
        setMatchLevel(value: string): void;
        /**
         * @return {ImageMatchSettings}
         */
        getDefaultMatchSettings(): import("lib/metadata/ImageMatchSettings");
        /**
         * @param {ImageMatchSettings} value
         */
        setDefaultMatchSettings(value: import("lib/metadata/ImageMatchSettings")): void;
        /**
         * @return {string}
         */
        getAgentId(): string;
        /**
         * @param {string} value
         */
        setAgentId(value: string): void;
        /**
         * @return {object[]}
         */
        getProperties(): object[];
        /**
         * @param {object[]} value
         */
        setProperties(value: object[]): void;
        /**
         * @return {boolean}
         */
        getRender(): boolean;
        /**
         * @param {boolean} value
         */
        setRender(value: boolean): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/metadata/SessionResults" {
    export = SessionResults;
    class SessionResults {
        /**
         * @param data
         * @param {string} data.id
         * @param {number} data.revision
         * @param {string} data.runningSessionId
         * @param {boolean} data.isAborted
         * @param {boolean} data.isStarred
         * @param {StartInfo|object} data.startInfo
         * @param {string} data.batchId
         * @param {string} data.secretToken
         * @param {string} data.state
         * @param {string} data.status
         * @param {string} data.isDefaultStatus
         * @param {string} data.startedAt
         * @param {number} data.duration
         * @param {boolean} data.isDifferent
         * @param {AppEnvironment|object} data.env
         * @param {Branch|object} data.branch
         * @param {ExpectedAppOutput[]|object[]} data.expectedAppOutput
         * @param {ActualAppOutput[]|object[]} data.actualAppOutput
         * @param {string} data.baselineId
         * @param {string} data.baselineRevId
         * @param {string} data.scenarioId
         * @param {string} data.scenarioName
         * @param {string} data.appId
         * @param {string} data.baselineModelId
         * @param {string} data.baselineEnvId
         * @param {AppEnvironment|object} data.baselineEnv
         * @param {string} data.appName
         * @param {string} data.baselineBranchName
         * @param {boolean} data.isNew
         */
        constructor({ id, revision, runningSessionId, isAborted, isStarred, startInfo, batchId, secretToken, state, status, isDefaultStatus, startedAt, duration, isDifferent, env, branch, expectedAppOutput, actualAppOutput, baselineId, baselineRevId, scenarioId, scenarioName, appId, baselineModelId, baselineEnvId, baselineEnv, appName, baselineBranchName, isNew, }?: {
            id: any;
            revision: any;
            runningSessionId: any;
            isAborted: any;
            isStarred: any;
            startInfo: any;
            batchId: any;
            secretToken: any;
            state: any;
            status: any;
            isDefaultStatus: any;
            startedAt: any;
            duration: any;
            isDifferent: any;
            env: any;
            branch: any;
            expectedAppOutput: any;
            actualAppOutput: any;
            baselineId: any;
            baselineRevId: any;
            scenarioId: any;
            scenarioName: any;
            appId: any;
            baselineModelId: any;
            baselineEnvId: any;
            baselineEnv: any;
            appName: any;
            baselineBranchName: any;
            isNew: any;
        });
        _id: any;
        _revision: any;
        _runningSessionId: any;
        _isAborted: any;
        _isStarred: any;
        _startInfo: any;
        _batchId: any;
        _secretToken: any;
        _state: any;
        _status: any;
        _isDefaultStatus: any;
        _startedAt: any;
        _duration: any;
        _isDifferent: any;
        _env: any;
        _branch: any;
        _expectedAppOutput: any;
        _actualAppOutput: any;
        _baselineId: any;
        _baselineRevId: any;
        _scenarioId: any;
        _scenarioName: any;
        _appId: any;
        _baselineModelId: any;
        _baselineEnvId: any;
        _baselineEnv: any;
        _appName: any;
        _baselineBranchName: any;
        _isNew: any;
        /**
         * @return {string}
         */
        getId(): string;
        /**
         * @param {string} value
         */
        setId(value: string): void;
        /**
         * @return {number}
         */
        getRevision(): number;
        /**
         * @param {number} value
         */
        setRevision(value: number): void;
        /**
         * @return {string}
         */
        getRunningSessionId(): string;
        /**
         * @param {string} value
         */
        setRunningSessionId(value: string): void;
        /**
         * @return {boolean}
         */
        getIsAborted(): boolean;
        /**
         * @param {boolean} value
         */
        setIsAborted(value: boolean): void;
        /**
         * @return {boolean}
         */
        getIsStarred(): boolean;
        /**
         * @param {boolean} value
         */
        setIsStarred(value: boolean): void;
        /**
         * @return {StartInfo}
         */
        getStartInfo(): import("lib/metadata/StartInfo");
        /**
         * @param {StartInfo} value
         */
        setStartInfo(value: import("lib/metadata/StartInfo")): void;
        /**
         * @return {string}
         */
        getBatchId(): string;
        /**
         * @param {string} value
         */
        setBatchId(value: string): void;
        /**
         * @return {string}
         */
        getSecretToken(): string;
        /**
         * @param {string} value
         */
        setSecretToken(value: string): void;
        /**
         * @return {string}
         */
        getState(): string;
        /**
         * @param {string} value
         */
        setState(value: string): void;
        /**
         * @return {string}
         */
        getStatus(): string;
        /**
         * @param {string} value
         */
        setStatus(value: string): void;
        /**
         * @return {boolean}
         */
        getIsDefaultStatus(): boolean;
        /**
         * @param {boolean} value
         */
        setIsDefaultStatus(value: boolean): void;
        /**
         * @return {string}
         */
        getStartedAt(): string;
        /**
         * @param {string} value
         */
        setStartedAt(value: string): void;
        /**
         * @return {number}
         */
        getDuration(): number;
        /**
         * @param {number} value
         */
        setDuration(value: number): void;
        /**
         * @return {boolean}
         */
        getIsDifferent(): boolean;
        /**
         * @param {boolean} value
         */
        setIsDifferent(value: boolean): void;
        /**
         * @return {AppEnvironment}
         */
        getEnv(): import("lib/AppEnvironment");
        /**
         * @param {AppEnvironment} value
         */
        setEnv(value: import("lib/AppEnvironment")): void;
        /**
         * @return {Branch}
         */
        getBranch(): import("lib/metadata/Branch");
        /**
         * @param {Branch} value
         */
        setBranch(value: import("lib/metadata/Branch")): void;
        /**
         * @return {ExpectedAppOutput[]}
         */
        getExpectedAppOutput(): import("lib/metadata/ExpectedAppOutput")[];
        /**
         * @param {ExpectedAppOutput[]} value
         */
        setExpectedAppOutput(value: import("lib/metadata/ExpectedAppOutput")[]): void;
        /**
         * @return {ActualAppOutput[]}
         */
        getActualAppOutput(): import("lib/metadata/ActualAppOutput")[];
        /**
         * @param {ActualAppOutput[]} value
         */
        setActualAppOutput(value: import("lib/metadata/ActualAppOutput")[]): void;
        /**
         * @return {string}
         */
        getBaselineId(): string;
        /**
         * @param {string} value
         */
        setBaselineId(value: string): void;
        /**
         * @return {string}
         */
        getBaselineRevId(): string;
        /**
         * @param {string} value
         */
        setBaselineRevId(value: string): void;
        /**
         * @return {string}
         */
        getScenarioId(): string;
        /**
         * @param {string} value
         */
        setScenarioId(value: string): void;
        /**
         * @return {string}
         */
        getScenarioName(): string;
        /**
         * @param {string} value
         */
        setScenarioName(value: string): void;
        /**
         * @return {string}
         */
        getAppId(): string;
        /**
         * @param {string} value
         */
        setAppId(value: string): void;
        /**
         * @return {string}
         */
        getBaselineModelId(): string;
        /**
         * @param {string} value
         */
        setBaselineModelId(value: string): void;
        /**
         * @return {string}
         */
        getBaselineEnvId(): string;
        /**
         * @param {string} value
         */
        setBaselineEnvId(value: string): void;
        /**
         * @return {AppEnvironment}
         */
        getBaselineEnv(): import("lib/AppEnvironment");
        /**
         * @param {AppEnvironment} value
         */
        setBaselineEnv(value: import("lib/AppEnvironment")): void;
        /**
         * @return {string}
         */
        getAppName(): string;
        /**
         * @param {string} value
         */
        setAppName(value: string): void;
        /**
         * @return {string}
         */
        getBaselineBranchName(): string;
        /**
         * @param {string} value
         */
        setBaselineBranchName(value: string): void;
        /**
         * @return {boolean}
         */
        getIsNew(): boolean;
        /**
         * @param {boolean} value
         */
        setIsNew(value: boolean): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/renderer/EmulationDevice" {
    export = EmulationDevice;
    class EmulationDevice {
        /**
         * @param data
         * @param {number} data.width
         * @param {number} data.height
         * @param {string} data.deviceScaleFactor
         * @param {string} data.mobile
         */
        constructor({ width, height, deviceScaleFactor, mobile }?: {
            width: any;
            height: any;
            deviceScaleFactor: any;
            mobile: any;
        });
        _width: any;
        _height: any;
        _deviceScaleFactor: any;
        _mobile: any;
        /**
         * @return {number}
         */
        getWidth(): number;
        /**
         * @param {number} value
         */
        setWidth(value: number): void;
        /**
         * @return {number}
         */
        getHeight(): number;
        /**
         * @param {number} value
         */
        setHeight(value: number): void;
        /**
         * @return {string}
         */
        getDeviceScaleFactor(): string;
        /**
         * @param {string} value
         */
        setDeviceScaleFactor(value: string): void;
        /**
         * @return {string}
         */
        getMobile(): string;
        /**
         * @param {string} value
         */
        setMobile(value: string): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/renderer/EmulationInfo" {
    export = EmulationInfo;
    class EmulationInfo {
        /**
         * @param info
         * @param {EmulationDevice|object} info.device
         * @param {string} info.deviceName
         * @param {ScreenOrientation} info.screenOrientation
         */
        constructor({ device, deviceName, screenOrientation }?: {
            device: any;
            deviceName: any;
            screenOrientation: any;
        });
        _device: any;
        _deviceName: any;
        _screenOrientation: any;
        /**
         * @return {EmulationDevice}
         */
        getDevice(): import("lib/renderer/EmulationDevice");
        /**
         * @param {EmulationDevice} value
         */
        setDevice(value: import("lib/renderer/EmulationDevice")): void;
        /**
         * @return {string}
         */
        getDeviceName(): string;
        /**
         * @param {string} value
         */
        setDeviceName(value: string): void;
        /**
         * @return {ScreenOrientation}
         */
        getScreenOrientation(): ScreenOrientation;
        /**
         * @param {ScreenOrientation} value
         */
        setScreenOrientation(value: ScreenOrientation): void;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/renderer/RenderInfo" {
    export = RenderInfo;
    /**
     * @typedef {{iosDeviceInfo: {deviceName: IosDevieName, screenOrientation: (IosScreenOrientation|undefined)})}} IosDeviceInfo
     */
    class RenderInfo {
        /**
         * @param {RectangleSize} size
         * @param {string} [sizeMode='full-page'] supported values [viewport|full-page]
         * @return {RenderInfo}
         */
        static fromRectangleSize(size: any, sizeMode?: string): RenderInfo;
        /**
         * @param info
         * @param {number} info.width
         * @param {number} info.height
         * @param {string} info.sizeMode
         * @param {string} info.selector
         * @param {Region|object} info.region
         * @param {EmulationInfo|object} info.emulationInfo
         * @param {IosDeviceInfo} info.iosDeviceInfo
         */
        constructor({ width, height, sizeMode, selector, region, emulationInfo, iosDeviceInfo }?: {
            width: any;
            height: any;
            sizeMode: any;
            selector: any;
            region: any;
            emulationInfo: any;
            iosDeviceInfo: any;
        });
        _width: any;
        _height: any;
        _sizeMode: any;
        _selector: any;
        _region: any;
        _emulationInfo: any;
        _iosDeviceInfo: any;
        /**
         * @return {number}
         */
        getWidth(): number;
        /**
         * @param {number} value
         */
        setWidth(value: number): void;
        /**
         * @return {number}
         */
        getHeight(): number;
        /**
         * @param {number} value
         */
        setHeight(value: number): void;
        /**
         * @return {string}
         */
        getSizeMode(): string;
        /**
         * @param {string} value
         */
        setSizeMode(value: string): void;
        /**
         * @return {string}
         */
        getSelector(): string;
        /**
         * @param {string} value
         */
        setSelector(value: string): void;
        /**
         * @return {Region}
         */
        getRegion(): import("lib/geometry/Region");
        /**
         * @param {Region} value
         */
        setRegion(value: import("lib/geometry/Region")): void;
        /**
         * @return {EmulationInfo}
         */
        getEmulationInfo(): import("lib/renderer/EmulationInfo");
        /**
         * @param {EmulationInfo} value
         */
        setEmulationInfo(value: import("lib/renderer/EmulationInfo")): void;
        getIosDeviceInfo(): any;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
    namespace RenderInfo {
        export { IosDeviceInfo };
    }
    type IosDeviceInfo = {
        iosDeviceInfo: {
            deviceName: any;
            screenOrientation: (any | undefined);
        };
    };
}
declare module "lib/renderer/RenderRequest" {
    export = RenderRequest;
    /**
     * Encapsulates data required to start render using the RenderingGrid API.
     */
    class RenderRequest {
        /**
         * @param request
         * @param {string} request.webhook
         * @param {string} request.url
         * @param {RGridDom} request.dom
         * @param {RGridResource[]} request.resources
         * @param {RenderInfo} [request.renderInfo]
         * @param {string} [request.platform]
         * @param {string} [request.browserName]
         * @param {Object} [request.scriptHooks]
         * @param {string[]} request.selectorsToFindRegionsFor
         * @param {boolean} request.sendDom
         * @param {string} request.renderId
         * @param {string} request.agentId
         */
        constructor({ webhook, stitchingService, url, dom, resources, renderInfo, platform, browserName, scriptHooks, selectorsToFindRegionsFor, sendDom, renderId, agentId, }?: {
            webhook: any;
            stitchingService: any;
            url: any;
            dom: any;
            resources: any;
            renderInfo: any;
            platform: any;
            browserName: any;
            scriptHooks: any;
            selectorsToFindRegionsFor: any;
            sendDom: any;
            renderId: any;
            agentId: any;
        });
        _webhook: any;
        _stitchingService: any;
        _url: any;
        _dom: any;
        _resources: any;
        _renderInfo: any;
        _platform: any;
        _browserName: any;
        _renderId: any;
        _scriptHooks: any;
        _selectorsToFindRegionsFor: any;
        _sendDom: any;
        _agentId: any;
        /**
         * @return {string}
         */
        getWebhook(): string;
        /**
         * @return {string}
         */
        getStitchingService(): string;
        /**
         * @return {string}
         */
        getUrl(): string;
        /**
         * @return {RGridDom}
         */
        getDom(): any;
        /**
         * @return {RGridResource[]}
         */
        getResources(): any[];
        /**
         * @return {RenderInfo}
         */
        getRenderInfo(): any;
        /**
         * @return {string}
         */
        getPlatform(): string;
        /**
         * @return {string}
         */
        getBrowserName(): string;
        /**
         * @return {string}
         */
        getRenderId(): string;
        /**
         * @return {string}
         */
        getAgentId(): string;
        /**
         * @param {string} value
         */
        setAgentId(value: string): void;
        /**
         * @param {string} value
         */
        setRenderId(value: string): void;
        /**
         * @return {string}
         */
        getScriptHooks(): string;
        /**
         * @param {string} value
         */
        setScriptHooks(value: string): void;
        /**
         * @return {string[]}
         */
        getSelectorsToFindRegionsFor(): string[];
        /**
         * @param {string[]} value
         */
        setSelectorsToFindRegionsFor(value: string[]): void;
        /**
         * @return {boolean}
         */
        getSendDom(): boolean;
        /**
         * @param {boolean} value
         */
        setSendDom(value: boolean): void;
        /**
         * @override
         */
        toJSON(): {
            webhook: any;
            stitchingService: any;
            url: any;
            dom: any;
            resources: {};
        };
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/renderer/RenderStatus" {
    export = RenderStatus;
    namespace RenderStatus {
        export { RenderStatus };
    }
    type RenderStatus = string;
}
declare module "lib/renderer/RGridResource" {
    export = RGridResource;
    class RGridResource {
        /**
         * @param data
         * @param {string} [data.url]
         * @param {string} [data.contentType]
         * @param {Buffer} [data.content]
         */
        constructor({ url, contentType, content }?: {
            url: any;
            contentType: any;
            content: any;
        });
        _url: any;
        _contentType: any;
        _content: any;
        /** @type {string} */
        _sha256hash: string;
        /**
         * @return {string} - The url of the current resource.
         */
        getUrl(): string;
        /**
         * @param {string} value - The resource's url
         */
        setUrl(value: string): void;
        /**
         * @return {string} - The contentType of the current resource.
         */
        getContentType(): string;
        /**
         * @param {string} value - The resource's contentType
         */
        setContentType(value: string): void;
        /**
         * @return {Buffer} - The content of the current resource.
         */
        getContent(): Buffer;
        /**
         * @param {Buffer} value - The resource's content
         */
        setContent(value: Buffer): void;
        getSha256Hash(): string;
        getHashAsObject(): {
            hashFormat: string;
            hash: string;
            contentType: string;
        };
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/renderer/RGridDom" {
    export = RGridDom;
    class RGridDom {
        /**
         * @param data
         * @param {object} [data.domNodes]
         * @param {RGridResource[]} [data.resources]
         */
        constructor({ domNodes, resources }?: {
            domNodes: any;
            resources: any;
        });
        _domNodes: any;
        _resources: any;
        /** @type {string} */
        _sha256hash: string;
        /** @type {string} */
        _contentAsCdt: string;
        /**
         * @return {object} - The domNodes of the current page.
         */
        getDomNodes(): object;
        /**
         * @param {object} value - The page's domNodes
         */
        setDomNodes(value: object): void;
        /**
         * @return {RGridResource[]} - The resourceType of the current page
         */
        getResources(): import("lib/renderer/RGridResource")[];
        /**
         * @param {RGridResource[]} value - The page's resourceType
         */
        setResources(value: import("lib/renderer/RGridResource")[]): void;
        asResource(): import("lib/renderer/RGridResource");
        getSha256Hash(): string;
        getHashAsObject(): {
            hashFormat: string;
            hash: string;
        };
        _getContentAsCdt(): string;
        /**
         * @override
         */
        toJSON(): any;
        /**
         * @override
         */
        toString(): string;
    }
}
declare module "lib/TestResultsFormatter" {
    export = TestResultsFormatter;
    /**
     * A utility class for aggregating and formatting test results.
     */
    class TestResultsFormatter {
        /**
         * @param {TestResults[]} resultsList
         */
        constructor(resultsList?: any[]);
        _resultsList: any[];
        /**
         * Adds an additional results object to the currently stored results list.
         *
         * @param {TestResults} results - A test results returned by a call to `eyes.close' or 'eyes.abort'.
         * @return {TestResultsFormatter} - The updated 'TestResultsFormatter' instance.
         */
        addTestResults(results: any): TestResultsFormatter;
        /**
         * Adds an additional results object to the currently stored results list.
         *
         * @deprecated use {@link #addTestResults(results)} instead
         * @param {TestResults} results - A test results returned by a call to `eyes.close' or 'eyes.abort'.
         * @return {TestResultsFormatter} - The updated 'TestResultsFormatter' instance.
         */
        addResults(results: any): TestResultsFormatter;
        /**
         * @return {TestResults[]}
         */
        getResultsList(): any[];
        /**
         * @return {void}
         */
        clearResultsList(): void;
        /**
         * Creates a TAP representation of the tests results list in hierarchic format.
         *
         * @param {boolean} [includeSubTests=true] - If true, steps will be treated as "subtests". Default is true.
         * @param {boolean} [markNewAsPassed=false] - If true, new tests will be treated as "passed". Default is false.
         * @return {string} - A string which is the TAP representation of the results list.
         */
        asFormatterString(includeSubTests?: boolean, markNewAsPassed?: boolean): string;
        /**
         * Creates a TAP representation of the tests results list in hierarchic format.
         *
         * @param {boolean} [includeSubTests=true] - If true, steps will be treated as "subtests". Default is true.
         * @param {boolean} [markNewAsPassed=false] - If true, new tests will be treated as "passed". Default is false.
         * @return {string} - A string which is the TAP representation of the results list.
         */
        asHierarchicTAPString(includeSubTests?: boolean, markNewAsPassed?: boolean): string;
        /**
         * Creates a TAP representation of the tests results list in which each steps are colored as success/fail.
         *
         * @param {boolean} [markNewAsPassed=false] - If true, new tests will be treated as "passed". Default is false.
         * @return {string} - A string which is the TAP representation of the results list.
         */
        asFlattenedTAPString(markNewAsPassed?: boolean): string;
        toXmlOutput({ totalTime }?: {
            totalTime: any;
        }): string;
    }
}
declare module "lib/runner/VisualGridRunner" {
    export = VisualGridRunner;
    const VisualGridRunner_base: typeof import("lib/runner/EyesRunner");
    class VisualGridRunner extends VisualGridRunner_base {
        /**
         * @param {number} [concurrentSessions]
         */
        constructor(concurrentSessions?: number);
        _concurrentSessions: number;
        /**
         * @return {number}
         */
        getConcurrentSessions(): number;
        makeGetVisualGridClient(makeVisualGridClient: any): void;
        _getVisualGridClient: (...args: any[]) => any;
        getVisualGridClientWithCache(config: any): Promise<any>;
    }
}
declare module "lib/EyesVisualGrid" {
    export = EyesVisualGrid;
    const EyesVisualGrid_base: typeof import("lib/EyesCore");
    /**
     * @typedef {import('./capture/CorsIframeHandles').CorsIframeHandle} CorsIframeHandle
     */
    class EyesVisualGrid extends EyesVisualGrid_base {
        /**
         * Create a specialized version of this class
         * @param {Object} implementations - implementations of related classes
         * @param {string} implementations.agentId - base agent id
         * @param {EyesWrappedDriver} implementations.WrappedDriver - implementation for {@link EyesWrappedDriver}
         * @param {EyesWrappedElement} implementations.WrappedElement - implementation for {@link EyesWrappedElement}
         * @param {DriverCheckSettings} implementations.CheckSettings - specialized version of {@link DriverCheckSettings}
         * @param {VisualGridClient} implementations.VisualGridClient - visual grid client
         * @return {typeof EyesVisualGrid} specialized version of this class
         */
        static specialize({ agentId, WrappedDriver, WrappedElement, CheckSettings, VisualGridClient }: {
            agentId: string;
            WrappedDriver: any;
            WrappedElement: any;
            CheckSettings: any;
            VisualGridClient: any;
        }): typeof EyesVisualGrid;
        /**
         * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
         *
         * @param {string} [serverUrl=EyesBase.getDefaultServerUrl()] The Eyes server URL.
         * @param {boolean} [isDisabled=false] Set to true to disable Applitools Eyes and use the webdriver directly.
         * @param {EyesRunner} [runner] - Set {@code true} to disable Applitools Eyes and use the WebDriver directly.
         */
        constructor(serverUrl?: string, isDisabled?: boolean, runner?: any);
        _runner: any;
        /** @type {EyesJsExecutor} */ _jsExecutor: any;
        /** @function */ _checkWindowCommand: any;
        /** @function */ _closeCommand: any;
        /** @function */ _abortCommand: any;
        /** @type {Promise<void>} */
        _closePromise: Promise<void>;
        /**
         * @signature `open(driver, configuration)`
         * @signature `open(driver, appName, testName, ?viewportSize, ?configuration)`
         *
         * @param {object} driver The web driver that controls the browser hosting the application under test.
         * @param {Configuration|string} optArg1 The Configuration for the test or the name of the application under the test.
         * @param {string} [optArg2] The test name.
         * @param {RectangleSize|object} [optArg3] The required browser's viewport size
         *   (i.e., the visible part of the document's body) or to use the current window's viewport.
         * @param {Configuration} [optArg4] The Configuration for the test
         * @return {Promise<EyesWrappedDriver>} A wrapped WebDriver which enables Eyes trigger recording and frame handling.
         */
        open(driver: object, optArg1: import("lib/config/Configuration") | string, optArg2?: string, optArg3?: import("lib/geometry/RectangleSize") | object, optArg4?: import("lib/config/Configuration")): Promise<any>;
        _driver: any;
        _executor: any;
        _finder: any;
        _context: any;
        _controller: any;
        /**
         * @param {string|DriverCheckSettings} [nameOrCheckSettings] - name of the test case
         * @param {DriverCheckSettings} [checkSettings] - check settings for the described test case
         * @returns {Promise<MatchResult>}
         */
        check(nameOrCheckSettings?: string | any, checkSettings?: any): Promise<import("lib/match/MatchResult")>;
        _checkPrepare(checkSettings: any, operation: any): Promise<any>;
        _getTargetConfiguration(checkSettings: any): Promise<{
            region: any;
            selector: any;
        }>;
        /**
         * @param {boolean} [throwEx]
         * @return {Promise<void>}
         */
        closeAndPrintResults(throwEx?: boolean): Promise<void>;
    }
    namespace EyesVisualGrid {
        export { CorsIframeHandle };
    }
    type CorsIframeHandle = string;
}
declare module "lib/EyesFactory" {
    export = EyesFactory;
    /**
     * @typedef {import('./EyesClassic')} EyesClassic
     * @typedef {import('./EyesVisualGrid')} EyesVisualGrid
     */
    /**
     * This class represents an abstraction for construction of {@link EyesClassic} and {@link EyesVisualGrid}
     */
    class EyesFactory {
        /**
         * Return a specialized
         * @param {Object} implementations - implementations of related classes
         * @param {EyesClassic} implementations.EyesClassic - specialized implementation of {@link EyesClassic} class
         * @param {EyesVisualGrid} implementations.EyesVisualGrid - specialized implementation of {@link EyesVisualGrid} class
         * @return {EyesFactory} specialized version of {@link EyesFactory}
         */
        static specialize({ EyesClassic, EyesVisualGrid }: {
            EyesClassic: EyesClassic;
            EyesVisualGrid: EyesVisualGrid;
        }): EyesFactory;
        /**
         * @private
         * @param {string} [serverUrl] - The Eyes server URL.
         * @param {boolean} [isDisabled=false] - Set {@code true} to disable Applitools Eyes and use the webdriver directly.
         * @param {Object} [config] - Additional configuration object.
         */
        private static fromBrowserInfo;
        /**
         * Creates a new (possibly disabled) Eyes instance that interacts with the Eyes Server at the specified url.
         * @param {string|boolean|VisualGridRunner} [serverUrl=EyesBase.getDefaultServerUrl()] - Eyes server URL
         * @param {boolean} [isDisabled=false] - set to true to disable Applitools Eyes and use the webdriver directly
         * @param {EyesRunner} [runner=new ClassicRunner()] - runner related to the wanted Eyes implementation
         * @return {EyesClassic|EyesVisualGrid} instance of Eyes related to the provided runner
         */
        constructor(serverUrl?: string | boolean | import("lib/runner/VisualGridRunner"), isDisabled?: boolean, runner?: import("lib/runner/EyesRunner"));
    }
    namespace EyesFactory {
        export { EyesClassic, EyesVisualGrid };
    }
    type EyesClassic = import("lib/EyesClassic");
    type EyesVisualGrid = import("lib/EyesVisualGrid");
}
declare module "lib/AccessibilityStatus" {
    export type AccessibilityStatus = string;
    export var AccessibilityStatus: Readonly<{
        Passed: string;
        Failed: string;
    }>;
}
declare module "@applitools/eyes-sdk-core" {
    export var AccessibilityLevel: Readonly<{
        AA: string;
        AAA: string;
    }>;
    export var AccessibilityGuidelinesVersion: Readonly<{
        WCAG_2_0: string;
        WCAG_2_1: string;
    }>;
    export var AccessibilityMatchSettings: typeof import("lib/config/AccessibilityMatchSettings");
    export var AccessibilityRegionType: Readonly<{
        IgnoreContrast: string;
        RegularText: string;
        LargeText: string;
        BoldText: string;
        GraphicalObject: string;
    }>;
    export var BatchInfo: typeof import("lib/config/BatchInfo");
    export var BrowserType: Readonly<{
        CHROME: string;
        FIREFOX: string;
        IE_11: string;
        IE_10: string;
        EDGE: string;
        EDGE_CHROMIUM: string;
        EDGE_LEGACY: string;
        SAFARI: string;
        CHROME_ONE_VERSION_BACK: string;
        CHROME_TWO_VERSIONS_BACK: string;
        FIREFOX_ONE_VERSION_BACK: string;
        FIREFOX_TWO_VERSIONS_BACK: string;
        SAFARI_ONE_VERSION_BACK: string;
        SAFARI_TWO_VERSIONS_BACK: string;
        EDGE_CHROMIUM_ONE_VERSION_BACK: string;
        EDGE_CHROMIUM_TWO_VERSIONS_BACK: string;
    }>;
    export var Configuration: typeof import("lib/config/Configuration");
    export var DeviceName: Readonly<{
        Blackberry_PlayBook: string;
        BlackBerry_Z30: string;
        Galaxy_A5: string;
        Galaxy_Note_10: string;
        Galaxy_Note_10_Plus: string;
        Galaxy_Note_2: string;
        Galaxy_Note_3: string;
        Galaxy_Note_4: string;
        Galaxy_Note_8: string;
        Galaxy_Note_9: string;
        Galaxy_S10: string;
        Galaxy_S10_Plus: string;
        Galaxy_S3: string;
        Galaxy_S5: string;
        Galaxy_S8: string;
        Galaxy_S8_Plus: string;
        Galaxy_S9: string;
        Galaxy_S9_Plus: string;
        iPad: string;
        iPad_6th_Gen: string;
        iPad_7th_Gen: string;
        iPad_Air_2: string;
        iPad_Mini: string;
        iPad_Pro: string;
        iPhone_11: string;
        iPhone_11_Pro: string;
        iPhone_11_Pro_Max: string;
        iPhone_4: string;
        iPhone_5SE: string;
        iPhone_6_7_8: string;
        iPhone_6_7_8_Plus: string;
        iPhone_X: string;
        iPhone_XR: string;
        iPhone_XS: string;
        iPhone_XS_Max: string;
        Kindle_Fire_HDX: string;
        Laptop_with_HiDPI_screen: string;
        Laptop_with_MDPI_screen: string;
        Laptop_with_touch: string;
        LG_G6: string;
        LG_Optimus_L70: string;
        Microsoft_Lumia_550: string;
        Microsoft_Lumia_950: string;
        Nexus_10: string;
        Nexus_4: string;
        Nexus_5: string;
        Nexus_5X: string;
        Nexus_6: string;
        Nexus_6P: string;
        Nexus_7: string;
        Nokia_Lumia_520: string;
        Nokia_N9: string;
        OnePlus_7T: string;
        OnePlus_7T_Pro: string;
        Pixel_2: string;
        Pixel_2_XL: string;
        Pixel_3: string;
        Pixel_3_XL: string;
        Pixel_4: string;
        Pixel_4_XL: string;
    }>;
    export var ExactMatchSettings: typeof import("lib/config/ExactMatchSettings");
    export var FloatingMatchSettings: typeof import("lib/config/FloatingMatchSettings");
    export var ImageMatchSettings: typeof import("lib/config/ImageMatchSettings");
    export var MatchLevel: Readonly<{
        None: string;
        LegacyLayout: string;
        Layout: string;
        Layout2: string;
        Content: string;
        Strict: string;
        Exact: string;
    }>;
    export var PropertyData: typeof import("lib/config/PropertyData");
    export var ProxySettings: typeof import("lib/config/ProxySettings");
    export var ScreenOrientation: Readonly<{
        PORTRAIT: string;
        LANDSCAPE: string;
    }>;
    export var SessionType: Readonly<{
        SEQUENTIAL: string;
        PROGRESSION: string;
    }>;
    export var StitchMode: Readonly<{
        SCROLL: string;
        CSS: string;
    }>;
    export var IosDeviceName: Readonly<{
        iPhone_11_Pro: string;
        iPhone_11_Pro_Max: string;
        iPhone_11: string;
        iPhone_XR: string;
        iPhone_XS: string;
        iPhone_X: string;
        iPhone_8: string;
        iPhone_7: string;
        iPad_Pro_3: string;
        iPad_7: string;
        iPad_Air_2: string;
    }>;
    export var IosScreenOrientation: Readonly<{
        PORTRAIT: string;
        LANDSCAPE_LEFT: string;
        LANDSCAPE_RIGHT: string;
    }>;
    export var IosVersion: Readonly<{
        Latest: string;
    }>;
    export var DebugScreenshotsProvider: typeof import("lib/debug/DebugScreenshotsProvider");
    export var FileDebugScreenshotsProvider: typeof import("lib/debug/FileDebugScreenshotsProvider");
    export var NullDebugScreenshotProvider: typeof import("lib/debug/NullDebugScreenshotProvider");
    export var EyesError: typeof import("lib/errors/EyesError");
    export var CoordinatesTypeConversionError: typeof import("lib/errors/CoordinatesTypeConversionError");
    export var DiffsFoundError: typeof import("lib/errors/DiffsFoundError");
    export var NewTestError: typeof import("lib/errors/NewTestError");
    export var OutOfBoundsError: typeof import("lib/errors/OutOfBoundsError");
    export var TestFailedError: typeof import("lib/errors/TestFailedError");
    export var EyesDriverOperationError: typeof import("lib/errors/EyesDriverOperationError");
    export var ElementNotFoundError: typeof import("lib/errors/ElementNotFoundError");
    export var CoordinatesType: Readonly<{
        SCREENSHOT_AS_IS: string;
        CONTEXT_AS_IS: string;
        CONTEXT_RELATIVE: string;
    }>;
    export var Location: typeof import("lib/geometry/Location");
    export var RectangleSize: typeof import("lib/geometry/RectangleSize");
    export var Region: typeof import("lib/geometry/Region");
    export var PropertyHandler: typeof import("lib/handler/PropertyHandler");
    export var ReadOnlyPropertyHandler: typeof import("lib/handler/ReadOnlyPropertyHandler");
    export var SimplePropertyHandler: typeof import("lib/handler/SimplePropertyHandler");
    export var ImageDeltaCompressor: typeof import("lib/images/ImageDeltaCompressor");
    export var MutableImage: typeof import("lib/images/MutableImage");
    export var ConsoleLogHandler: typeof import("lib/logging/ConsoleLogHandler");
    export var DebugLogHandler: typeof import("lib/logging/DebugLogHandler");
    export var FileLogHandler: typeof import("lib/logging/FileLogHandler");
    export var Logger: typeof import("lib/logging/Logger");
    export var LogHandler: typeof import("lib/logging/LogHandler");
    export var NullLogHandler: typeof import("lib/logging/NullLogHandler");
    export var BrowserNames: Readonly<{
        Edge: string;
        IE: string;
        Firefox: string;
        Chrome: string;
        Safari: string;
        Chromium: string;
    }>;
    export var OSNames: Readonly<{
        Android: string;
        ChromeOS: string;
        IOS: string;
        Linux: string;
        Macintosh: string;
        MacOSX: string;
        Unknown: string;
        Windows: string;
    }>;
    export var UserAgent: typeof import("lib/useragent/UserAgent");
    export var ArgumentGuard: {
        notEqual: (param: any, value: any, paramName: string) => void;
        alphanumeric: (param: any, paramName: string) => void;
        notNull: (param: any, paramName: string) => void;
        isNull: (param: any, paramName: string) => void;
        notNullOrEmpty: (param: any, paramName: string) => void;
        greaterThanOrEqualToZero: (param: number, paramName: string, shouldBeInteger?: boolean) => void;
        greaterThanZero: (param: number, paramName: string, isInteger?: boolean) => void;
        notZero: (param: number, paramName: string, isInteger?: boolean) => void;
        isInteger: (param: number, paramName: string, strict?: boolean) => void;
        isString: (param: any, paramName: string, strict?: boolean) => void;
        isNumber: (param: any, paramName: string, strict?: boolean) => void;
        isBoolean: (param: any, paramName: string, strict?: boolean) => void;
        isArray: (param: any, paramName: string, strict?: boolean) => void;
        isPlainObject: (param: any, paramName: string, strict?: boolean) => void;
        isBuffer: (param: any, paramName: string, strict?: boolean) => void;
        isBase64: (param: any) => void;
        isValidState: (isValid: boolean, errMsg: string) => void;
        isValidType: (param: any, type: any, strict?: boolean) => void;
        isValidEnumValue: (value: any, enumObject: any, strict?: boolean) => void;
        hasProperties: (object: any, properties: string | string[], paramName: string) => void;
    };
    export var ConfigUtils: {
        getConfig: ({ configParams, configPath, logger, }?: {
            configParams?: any[];
            configPath: any;
            logger?: import("lib/logging/Logger");
        }) => {};
        toEnvVarName: (camelCaseStr: string) => string;
    };
    export var DateTimeUtils: {
        toISO8601DateTime: (date?: Date) => string;
        toRfc1123DateTime: (date?: Date) => string;
        toLogFileDateTime: (date?: Date, utc?: boolean) => string;
        fromISO8601DateTime: (dateTime: string) => Date;
    };
    export var FileUtils: {
        writeFromBuffer: (imageBuffer: Buffer, filename: string) => Promise<any>;
        readToBuffer: (path: string) => Promise<Buffer>;
    };
    export var GeneralUtils: {
        urlConcat: (url: string, ...suffixes: string[]) => string;
        stripTrailingSlash: (url: string) => string;
        isAbsoluteUrl: (url: string) => boolean;
        stringify: (...args: any[]) => string;
        stringifySingle: (arg: any) => string;
        toString: (object: any, exclude?: string[]) => string;
        toPlain: (object: any, exclude?: string[], rename?: any) => any;
        mergeDeep: <TFirst, TSecond>(target: TFirst, source: TSecond) => TFirst | TSecond;
        guid: () => string;
        randomAlphanumeric: (length?: number) => string;
        sleep: (ms: number) => Promise<any>;
        toISO8601DateTime: (date?: Date) => string;
        toRfc1123DateTime: (date?: Date) => string;
        toLogFileDateTime: (date?: Date) => string;
        fromISO8601DateTime: (dateTime: string) => Date;
        jwtDecode: (token: string) => any;
        cartesianProduct: (...arrays: any[]) => [][][];
        getPropertyByPath: (object: any, path: string) => any;
        getEnvValue: (propName: string, isBoolean?: boolean) => any;
        backwardCompatible: (...args: any[]) => {};
        cleanStringForJSON: (str: string) => string;
        isFeatureFlagOn: (featureName: any) => boolean;
        isFeatureFlagOff: (featureName: any) => boolean;
        presult: <T>(promise: PromiseLike<T>) => PromiseLike<[any, T]>;
        pexec: (...args: any[]) => import("child_process").PromiseWithChild<{
            stdout: string;
            stderr: string;
        }> & import("child_process").PromiseWithChild<{
            stdout: Buffer;
            stderr: Buffer;
        }> & import("child_process").PromiseWithChild<{
            stdout: string;
            stderr: string;
        }> & import("child_process").PromiseWithChild<{
            stdout: string;
            stderr: string;
        }> & import("child_process").PromiseWithChild<{
            stdout: string | Buffer;
            stderr: string | Buffer;
        }>;
        cachify: (getterFunction: any, cacheRegardlessOfArgs?: boolean) => (...args: any[]) => any;
    };
    export var ImageUtils: {
        parseImage: (buffer: Buffer) => Promise<(new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image>;
        packImage: (image: (new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image) => Promise<Buffer>;
        createImage: (width: number, height: number) => (new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image;
        scaleImage: (image: (new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image, scaleRatio: number) => Promise<(new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image>;
        resizeImage: (image: (new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image, targetWidth: number, targetHeight: number) => Promise<(new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image>;
        cropImage: (image: (new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image, region: any) => Promise<(new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image>;
        rotateImage: (image: (new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image, degrees: number) => Promise<(new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image>;
        copyPixels: (dstImage: (new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image, dstPosition: {
            x: number;
            y: number;
        }, srcImage: (new (width?: number, height?: number) => HTMLImageElement) | import("png-async").Image, srcPosition: {
            x: number;
            y: number;
        }, size: {
            width: number;
            height: number;
        }) => void;
        getImageSizeFromBuffer: (imageBuffer: Buffer) => {
            width: number;
            height: number;
        };
    };
    export var PerformanceUtils: {
        start: (name?: string, storeResults?: boolean) => any;
        end: (name: string, deleteResults?: boolean) => {
            name: string;
            time: number;
            summary: string;
        };
        result: (name: string) => {
            name: string;
            time: number;
            summary: string;
        };
        elapsedString: (milliseconds: number) => string;
    };
    export var StreamUtils: {
        ReadableBufferStream: any;
        WritableBufferStream: any;
    };
    export var TypeUtils: {
        isNull: (value: any) => boolean;
        isNotNull: (value: any) => boolean;
        isString: (value: any) => boolean;
        isNumber: (value: any) => boolean;
        isInteger: (value: any) => boolean;
        isBoolean: (value: any) => boolean;
        isObject: (value: any) => boolean;
        isPlainObject: (value: any) => boolean;
        isArray: (value: any) => boolean;
        isBuffer: (value: any) => boolean;
        isBase64: (value: any) => boolean;
        isUrl: (value: any) => boolean;
        has: (object: any, keys: string | string[]) => boolean;
        hasMethod: (object: any, methods: string | string[]) => boolean;
        getOrDefault: (value: any, defaultValue: any) => any;
        isFunction: (value: any) => boolean;
        isIterator: (value: any) => boolean;
    };
    export var deserializeDomSnapshotResult: typeof import("lib/utils/deserializeDomSnapshotResult");
    export var DomCapture: typeof import("lib/DomCapture");
    export var AppOutputProvider: typeof import("lib/capture/AppOutputProvider");
    export var AppOutputWithScreenshot: typeof import("lib/capture/AppOutputWithScreenshot");
    export var EyesScreenshot: typeof import("lib/capture/EyesScreenshot");
    export var EyesScreenshotNew: typeof import("lib/capture/EyesScreenshotNew");
    export var EyesScreenshotFactory: typeof import("lib/capture/EyesScreenshotFactory");
    export var EyesSimpleScreenshot: typeof import("lib/capture/EyesSimpleScreenshot");
    export var EyesSimpleScreenshotFactory: typeof import("lib/capture/EyesSimpleScreenshotFactory");
    export var FullPageCaptureAlgorithm: typeof import("lib/capture/FullPageCaptureAlgorithm");
    export var ImageProvider: typeof import("lib/capture/ImageProvider");
    export var ImageProviderFactory: typeof import("lib/capture/ImageProviderFactory");
    export var CorsIframeHandle: typeof import("lib/capture/CorsIframeHandles");
    export var CorsIframeHandler: typeof import("lib/capture/CorsIframeHandler");
    export var CutProvider: typeof import("lib/cropping/CutProvider");
    export var FixedCutProvider: typeof import("lib/cropping/FixedCutProvider");
    export var NullCutProvider: typeof import("lib/cropping/NullCutProvider");
    export var UnscaledFixedCutProvider: typeof import("lib/cropping/UnscaledFixedCutProvider");
    export var RemoteSessionEventHandler: typeof import("lib/events/RemoteSessionEventHandler");
    export var SessionEventHandler: typeof import("lib/events/SessionEventHandler");
    export var ValidationInfo: typeof import("lib/events/ValidationInfo");
    export var ValidationResult: typeof import("lib/events/ValidationResult");
    export var CheckSettings: typeof import("lib/fluent/CheckSettings");
    export var DriverCheckSettings: typeof import("lib/fluent/DriverCheckSettings");
    export var locatorToPersistedRegions: typeof import("lib/fluent/locatorToPersistedRegions");
    export var GetRegion: typeof import("lib/fluent/GetRegion");
    export var GetSelector: typeof import("lib/fluent/GetSelector");
    export var IgnoreRegionByRectangle: typeof import("lib/fluent/IgnoreRegionByRectangle");
    export var IgnoreRegionBySelector: typeof import("lib/fluent/IgnoreRegionBySelector");
    export var IgnoreRegionByElement: typeof import("lib/fluent/IgnoreRegionByElement");
    export var GetFloatingRegion: typeof import("lib/fluent/GetFloatingRegion");
    export var FloatingRegionByRectangle: typeof import("lib/fluent/FloatingRegionByRectangle");
    export var FloatingRegionBySelector: typeof import("lib/fluent/FloatingRegionBySelector");
    export var FloatingRegionByElement: typeof import("lib/fluent/FloatingRegionByElement");
    export var GetAccessibilityRegion: typeof import("lib/fluent/GetAccessibilityRegion");
    export var AccessibilityRegionByRectangle: typeof import("lib/fluent/AccessibilityRegionByRectangle");
    export var AccessibilityRegionBySelector: typeof import("lib/fluent/AccessibilityRegionBySelector");
    export var AccessibilityRegionByElement: typeof import("lib/fluent/AccessibilityRegionByElement");
    export var TargetRegionByElement: typeof import("lib/fluent/TargetRegionByElement");
    export var AppOutput: typeof import("lib/match/AppOutput");
    export var MatchResult: typeof import("lib/match/MatchResult");
    export var MatchSingleWindowData: typeof import("lib/match/MatchSingleWindowData");
    export var MatchWindowData: typeof import("lib/match/MatchWindowData");
    export var ImageMatchOptions: typeof import("lib/match/ImageMatchOptions");
    export var MatchWindowDataWithScreenshot: typeof import("lib/match/MatchWindowDataWithScreenshot");
    export namespace metadata {
        export const ActualAppOutput: typeof import("lib/metadata/ActualAppOutput");
        export const Annotations: typeof import("lib/metadata/Annotations");
        const BatchInfo_1: typeof import("lib/metadata/BatchInfo");
        export { BatchInfo_1 as BatchInfo };
        export const Branch: typeof import("lib/metadata/Branch");
        export const ExpectedAppOutput: typeof import("lib/metadata/ExpectedAppOutput");
        const Image_1: typeof import("lib/metadata/Image");
        export { Image_1 as Image };
        const ImageMatchSettings_1: typeof import("lib/metadata/ImageMatchSettings");
        export { ImageMatchSettings_1 as ImageMatchSettings };
        export const SessionResults: typeof import("lib/metadata/SessionResults");
        export const StartInfo: typeof import("lib/metadata/StartInfo");
    }
    export var ImageRotation: typeof import("lib/positioning/ImageRotation");
    export var RegionProvider: typeof import("lib/positioning/RegionProvider");
    export var NullRegionProvider: typeof import("lib/positioning/NullRegionProvider");
    export var RegionPositionCompensation: typeof import("lib/positioning/RegionPositionCompensation");
    export var NullRegionPositionCompensation: typeof import("lib/positioning/NullRegionPositionCompensation");
    export var FirefoxRegionPositionCompensation: typeof import("lib/positioning/FirefoxRegionPositionCompensation");
    export var SafariRegionPositionCompensation: typeof import("lib/positioning/SafariRegionPositionCompensation");
    export var RegionPositionCompensationFactory: typeof import("lib/positioning/RegionPositionCompensationFactory");
    export var PositionProvider: typeof import("lib/positioning/PositionProvider");
    export var InvalidPositionProvider: typeof import("lib/positioning/InvalidPositionProvider");
    export var ScrollPositionProvider: typeof import("lib/positioning/ScrollPositionProvider");
    export var CssTranslatePositionProvider: typeof import("lib/positioning/CssTranslatePositionProvider");
    export var ScrollElementPositionProvider: typeof import("lib/positioning/ScrollElementPositionProvider");
    export var CssTranslateElementPositionProvider: typeof import("lib/positioning/CssTranslateElementPositionProvider");
    export var PositionMemento: typeof import("lib/positioning/PositionMemento");
    export var RenderInfo: typeof import("lib/renderer/RenderInfo");
    export var RenderRequest: typeof import("lib/renderer/RenderRequest");
    export var RenderStatus: {
        NEED_MORE_RESOURCES: string;
        RENDERING: string;
        RENDERED: string;
        ERROR: string;
    };
    export var RenderStatusResults: typeof import("lib/renderer/RenderStatusResults");
    export var RGridDom: typeof import("lib/renderer/RGridDom");
    export var RGridResource: typeof import("lib/renderer/RGridResource");
    export var RunningRender: typeof import("lib/renderer/RunningRender");
    export var EmulationInfo: typeof import("lib/renderer/EmulationInfo");
    export var EmulationDevice: typeof import("lib/renderer/EmulationDevice");
    export var ContextBasedScaleProvider: typeof import("lib/scaling/ContextBasedScaleProvider");
    export var ContextBasedScaleProviderFactory: typeof import("lib/scaling/ContextBasedScaleProviderFactory");
    export var FixedScaleProvider: typeof import("lib/scaling/FixedScaleProvider");
    export var FixedScaleProviderFactory: typeof import("lib/scaling/FixedScaleProviderFactory");
    export var NullScaleProvider: typeof import("lib/scaling/NullScaleProvider");
    export var ScaleProvider: typeof import("lib/scaling/ScaleProvider");
    export var ScaleProviderFactory: typeof import("lib/scaling/ScaleProviderFactory");
    export var ScaleProviderIdentityFactory: typeof import("lib/scaling/ScaleProviderIdentityFactory");
    export var RenderingInfo: typeof import("lib/server/RenderingInfo");
    export var RunningSession: typeof import("lib/server/RunningSession");
    export var ServerConnector: typeof import("lib/server/ServerConnector");
    export var SessionStartInfo: typeof import("lib/server/SessionStartInfo");
    export var MouseTrigger: typeof import("lib/triggers/MouseTrigger");
    export var TextTrigger: typeof import("lib/triggers/TextTrigger");
    export var Trigger: typeof import("lib/triggers/Trigger");
    export var AppEnvironment: typeof import("lib/AppEnvironment");
    export var EyesBase: typeof import("lib/EyesBase");
    export var EyesClassic: typeof import("lib/EyesClassic");
    export var EyesVisualGrid: typeof import("lib/EyesVisualGrid");
    export var EyesFactory: typeof import("lib/EyesFactory");
    export var EyesJsBrowserUtils: typeof import("lib/EyesJsBrowserUtils");
    export var EyesUtils: {
        getViewportSize: (_logger: import("lib/logging/Logger"), { executor }: {
            executor: import("lib/wrappers/EyesJsExecutor");
        }) => import("lib/geometry/RectangleSize");
        setViewportSize: (logger: import("lib/logging/Logger"), { controller, executor, context }: {
            controller: import("lib/wrappers/EyesDriverController");
            executor: import("lib/wrappers/EyesJsExecutor");
            context: import("lib/wrappers/EyesBrowsingContext");
        }, requiredViewportSize: import("lib/geometry/RectangleSize")) => Promise<any>;
        getTopContextViewportRect: (logger: import("lib/logging/Logger"), { controller, executor, context }: {
            controller: import("lib/wrappers/EyesDriverController");
            executor: import("lib/wrappers/EyesJsExecutor");
            context: import("lib/wrappers/EyesBrowsingContext");
        }) => import("lib/geometry/Region");
        getTopContextViewportSize: (logger: import("lib/logging/Logger"), { controller, context, executor }: {
            controller: import("lib/wrappers/EyesDriverController");
            executor: import("lib/wrappers/EyesJsExecutor");
            context: import("lib/wrappers/EyesBrowsingContext");
        }) => import("lib/geometry/Region");
        getCurrentFrameContentEntireSize: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor")) => import("lib/geometry/Region");
        getElementEntireSize: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<import("lib/geometry/Region")>;
        getElementClientRect: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<import("lib/geometry/Region")>;
        getElementRect: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<import("lib/geometry/Region")>;
        getElementProperties: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), properties: string[], element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => any[];
        getElementCssProperties: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), properties: string[], element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => string[];
        getDevicePixelRatio: (_logger: import("lib/logging/Logger"), { executor }: {
            executor: import("lib/wrappers/EyesJsExecutor");
        }) => Promise<number>;
        getMobilePixelRatio: (_logger: import("lib/logging/Logger"), { controller }: {
            controller: import("lib/wrappers/EyesDriverController");
        }, viewportSize: any) => Promise<number>;
        getInnerOffsets: (_logger: any, executor: any, element: any) => Promise<import("lib/geometry/Location")>;
        getTopContextScrollLocation: (logger: import("lib/logging/Logger"), { context, executor }: {
            executor: import("lib/wrappers/EyesJsExecutor");
            context: import("lib/wrappers/EyesBrowsingContext");
        }) => Promise<Location>;
        getScrollLocation: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<Location>;
        scrollTo: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), location: Location, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<Location>;
        getTransforms: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<any>;
        setTransforms: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), transforms: any, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<any>;
        getTranslateLocation: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<Location>;
        translateTo: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), location: Location, element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<Location>;
        isScrollable: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<boolean>;
        getScrollRootElement: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor")) => Promise<import("lib/wrappers/EyesWrappedElement").UnwrappedElement>;
        markScrollRootElement: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<any>;
        getOverflow: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<string>;
        setOverflow: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), overflow: any, element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<string>;
        blurElement: (logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element?: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<import("lib/wrappers/EyesWrappedElement").UnwrappedElement>;
        focusElement: (logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<any>;
        getElementXpath: (logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<string>;
        getElementAbsoluteXpath: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), element: import("lib/wrappers/EyesWrappedElement").UnwrappedElement | import("lib/wrappers/EyesWrappedElement")) => Promise<string>;
        locatorToPersistedRegions: (logger: import("lib/logging/Logger"), { finder, executor }: {
            finder: import("lib/wrappers/EyesElementFinder");
            executor: import("lib/wrappers/EyesJsExecutor");
        }, selector: import("lib/wrappers/EyesWrappedElement").SupportedSelector) => Promise<{
            type: string;
            selector: string;
        }[]>;
        ensureRegionVisible: (logger: import("lib/logging/Logger"), { controller, context, executor }: {
            controller: import("lib/wrappers/EyesDriverController");
            context: import("lib/wrappers/EyesBrowsingContext");
            executor: import("lib/wrappers/EyesJsExecutor");
        }, positionProvider: import("lib/positioning/PositionProvider"), region: Promise<import("lib/geometry/Region")>) => Promise<Location | import("lib/geometry/Location")>;
        ensureFrameVisible: (_logger: import("lib/logging/Logger"), context: import("lib/wrappers/EyesBrowsingContext"), positionProvider: import("lib/positioning/PositionProvider"), offset?: Location) => Promise<Location>;
        getCurrentContextInfo: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor")) => Promise<import("lib/EyesUtils").ContextInfo>;
        getFrameByNameOrId: (_logger: import("lib/logging/Logger"), executor: import("lib/wrappers/EyesJsExecutor"), nameOrId: string) => import("lib/wrappers/EyesWrappedElement").UnwrappedElement;
        findFrameByContext: (_logger: import("lib/logging/Logger"), { executor, context }: {
            context: import("lib/wrappers/EyesBrowsingContext");
            executor: import("lib/wrappers/EyesJsExecutor");
        }, contextInfo: import("lib/EyesUtils").ContextInfo, comparator: (left: import("lib/wrappers/EyesWrappedElement").UnwrappedElement, right: import("lib/wrappers/EyesWrappedElement").UnwrappedElement) => Promise<boolean>) => Promise<any>;
    };
    export var FailureReports: typeof import("lib/FailureReports");
    export var MatchSingleWindowTask: typeof import("lib/MatchSingleWindowTask");
    export var MatchWindowTask: typeof import("lib/MatchWindowTask");
    export var TestResults: typeof import("lib/TestResults");
    export var TestResultsError: typeof import("lib/TestResults");
    export var AccessibilityStatus: typeof import("lib/AccessibilityStatus");
    export var TestResultsFormatter: typeof import("lib/TestResultsFormatter");
    export var TestResultsStatus: Readonly<{
        Passed: string;
        Unresolved: string;
        Failed: string;
    }>;
    export var FrameChain: typeof import("lib/frames/FrameChain");
    export const Frame: typeof import("lib/frames/Frame");
    export var EyesWrappedDriver: typeof import("lib/wrappers/EyesWrappedDriver");
    export var EyesWrappedElement: typeof import("lib/wrappers/EyesWrappedElement");
    export var EyesJsExecutor: typeof import("lib/wrappers/EyesJsExecutor");
    export var EyesElementFinder: typeof import("lib/wrappers/EyesElementFinder");
    export var EyesBrowsingContext: typeof import("lib/wrappers/EyesBrowsingContext");
    export var EyesRunner: typeof import("lib/runner/EyesRunner");
    export var ClassicRunner: typeof import("lib/runner/ClassicRunner");
    export var VisualGridRunner: typeof import("lib/runner/VisualGridRunner");
    export var TestResultContainer: typeof import("lib/runner/TestResultContainer");
    export var TestResultsSummary: typeof import("lib/runner/TestResultsSummary");
}
// declare module '@applitools/eyes-sdk-core' { import main = require('index'); export = main }
