'use strict';

const {ArgumentGuard, GeneralUtils, EyesBase, EyesError, ImageUtils, RegionProvider, MutableImage, RectangleSize, NullRegionProvider, EyesSimpleScreenshot} = require('eyes.sdk');

const Target = require('./fluent/Target');
const VERSION = require('../package.json').version;

/**
 * The main type - to be used by the users of the library to access all functionality.
 */
class Eyes extends EyesBase {

    /**
     * Initializes an Eyes instance.
     *
     * @param {String} [serverUrl=EyesBase.DEFAULT_EYES_SERVER] The Eyes server URL.
     * @param {PromiseFactory} [promiseFactory] If not specified will be created using `Promise` object
     **/
    constructor(serverUrl, promiseFactory) {
        super(serverUrl, false, promiseFactory);

        this._title = undefined;
        this._screenshot = undefined;
        this._inferred = "";
    }

    /** @override */
    getBaseAgentId() {
        return 'eyes.images/' + VERSION;
    }

    /**
     * Starts a test.
     *
     * @param {String} appName The application being tested.
     * @param {String} testName The test's name.
     * @param {RectangleSize} [imageSize] Determines the resolution used for the baseline. {@code null} will automatically grab the resolution from the image.
     * @return {Promise}
     */
    open(appName, testName, imageSize) {
        return super.openBase(appName, testName, imageSize);
    }

    /**
     * @param {string} name
     * @param {ImagesCheckSettings} checkSettings
     * @return {Promise.<boolean>}
     */
    check(name, checkSettings) {
        ArgumentGuard.notNull(checkSettings, "checkSettings");

        if (this.getIsDisabled()) {
            this._logger.verbose(`check('${name}', checkSettings): Ignored`);
            return this.getPromiseFactory().resolve(false);
        }

        return this._checkImage(name, false, checkSettings);
    }

    /**
     * Perform visual validation for the current image.
     *
     * @param {String|Buffer|MutableImage} image The image path, base64 string, image buffer or MutableImage.
     * @param {String} [tag] Tag to be associated with the validation checkpoint.
     * @param {Boolean} [ignoreMismatch] True if the server should ignore a negative result for the visual validation.
     * @param {int} [retryTimeout] timeout for performing the match (ms).
     * @return {Promise<Boolean>} True if the image matched the expected output, false otherwise.
     * @throws {DiffsFoundError} Thrown if a mismatch is detected and immediate failure reports are enabled.
     */
    checkImage(image, tag, ignoreMismatch, retryTimeout) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`checkImage(Image, '${tag}', '${ignoreMismatch}', '${retryTimeout}'): Ignored`);
            return this.getPromiseFactory().resolve(false);
        }

        ArgumentGuard.notNull(image, "image cannot be null!");

        this._logger.verbose(`checkImage(Image, '${tag}', '${ignoreMismatch}', '${retryTimeout}')`);
        // noinspection JSCheckFunctionSignatures
        return this._checkImage(tag, ignoreMismatch, Target.image(image).timeout(retryTimeout));
    }

    /**
     * Perform visual validation for the current image.
     *
     * @param {Region|RegionObject} region The region of the image which should be verified, or {undefined}/{null} if the entire image should be verified.
     * @param {String|Buffer|MutableImage} image The image path, base64 string, image buffer or MutableImage.
     * @param {String} [tag] An optional tag to be associated with the validation checkpoint.
     * @param {Boolean} [ignoreMismatch] True if the server should ignore a negative result for the visual validation.
     * @param {int} [retryTimeout] timeout for performing the match (ms).
     * @return {Promise<Boolean>} True if the image matched the expected output, false otherwise.
     * @throws {DiffsFoundError} Thrown if a mismatch is detected and immediate failure reports are enabled.
     */
    checkRegion(image, region, tag, ignoreMismatch, retryTimeout) {
        ArgumentGuard.notNull(image, "image");
        ArgumentGuard.notNull(region, "region");

        if (this.getIsDisabled()) {
            this._logger.verbose(`checkRegion(Image, [${region}], '${tag}', '${ignoreMismatch}', '${retryTimeout}'): Ignored`);
            return this.getPromiseFactory().resolve(false);
        }

        this._logger.verbose(`checkRegion(Image, [${region}], '${tag}', '${ignoreMismatch}', '${retryTimeout}')`);
        // noinspection JSCheckFunctionSignatures
        return this._checkImage(tag, ignoreMismatch, Target.region(image, region).timeout(retryTimeout));
    }

    /**
     * Internal function for performing an image verification for an image (or a region of an image).
     *
     * @private
     * @param {String} name An optional tag to be associated with the validation checkpoint.
     * @param {Boolean} ignoreMismatch True if the server should ignore a negative result for the visual validation.
     * @param {ImagesCheckSettings} checkSettings The settings to use when checking the image.
     * @return {Promise<Boolean>}
     */
    _checkImage(name, ignoreMismatch, checkSettings) {
        const that = this;
        return this._normalizeImage(checkSettings).then(image => {
            that._screenshot = new EyesSimpleScreenshot(image);

            if (!that._viewportSizeHandler.get()) {
                return that.setViewportSize(image.getSize());
            }
        }).then(() => {
            let regionProvider;
            if (checkSettings.getTargetRegion()) {
                regionProvider = new RegionProvider(checkSettings.getTargetRegion(), that.getPromiseFactory());
            } else {
                regionProvider = new NullRegionProvider(that.getPromiseFactory());
            }

            // Set the title to be linked to the screenshot.
            that._title = name || '';

            return super.checkWindowBase(regionProvider, name, ignoreMismatch, checkSettings);
        }).then(/** MatchResult */ mr => {
            return mr.getAsExpected();
        });
    }

    /**
     * @private
     * @param {ImagesCheckSettings} checkSettings The settings to use when checking the image.
     * @return {Promise.<MutableImage>}
     */
    _normalizeImage(checkSettings) {
        const promiseFactory = this.getPromiseFactory();
        return promiseFactory.makePromise((resolve, reject) => {
            if (checkSettings.getMutableImage()) {
                return resolve(checkSettings.getMutableImage());
            }

            if (checkSettings.getImageBuffer()) {
                return resolve(new MutableImage(checkSettings.getImageBuffer(), promiseFactory));
            }

            if (checkSettings.getImageString()) {
                return resolve(MutableImage.fromBase64(checkSettings.getImageString(), promiseFactory));
            }

            if (checkSettings.getImagePath()) {
                return ImageUtils.readImage(checkSettings.getImagePath(), promiseFactory).then(data => {
                    return resolve(new MutableImage(data, promiseFactory));
                }).catch(err => reject(new EyesError(`Can't read image [${err.message}]`)));
            }

            reject(new EyesError(`Can't recognize supported image from checkSettings.`));
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Replaces the actual image in a running session.
     *
     * @param {number} stepIndex The zero based index of the step in which to replace the image.
     * @param {String|Buffer|MutableImage} image The image base64 string, image buffer or MutableImage.
     * @param {String} [tag] A tag to be associated with the validation checkpoint.
     * @param {String} [title] A title to be associated with the validation checkpoint.
     * @param {Array} [userInputs] An array of user inputs to which lead to the validation checkpoint.
     * @return {Promise<Boolean>} True if the image matched the expected output, false otherwise.
     * @throws {DiffsFoundError} Thrown if a mismatch is detected and immediate failure reports are enabled.
     */
    replaceImage(stepIndex, image, tag, title, userInputs) {
        ArgumentGuard.notNull(stepIndex, "stepIndex");
        ArgumentGuard.notNull(image, "image");

        if (this.getIsDisabled()) {
            this._logger.verbose(`replaceImage('${stepIndex}', Image, '${tag}', '${title}', '${userInputs}'): Ignored`);
            return this.getPromiseFactory().resolve(false);
        }

        if (GeneralUtils.isBuffer(image) || GeneralUtils.isString(image)) {
            image = new MutableImage(image, this.getPromiseFactory());
        }

        this._logger.verbose(`replaceImage('${stepIndex}', Image, '${tag}', '${title}', '${userInputs}')`);
        return super.replaceWindow(stepIndex, image, tag, title, userInputs).then(results => {
            return results.getAsExpected();
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Adds a mouse trigger.
     *
     * @param {MouseTrigger.MouseAction} action  Mouse action.
     * @param {Region} control The control on which the trigger is activated (context relative coordinates).
     * @param {Location} cursor  The cursor's position relative to the control.
     */
    addMouseTrigger(action, control, cursor) {
        super.addMouseTriggerBase(action, control, cursor);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Adds a keyboard trigger.
     *
     * @param {Region} control The control's context-relative region.
     * @param {String} text The trigger's text.
     */
    addTextTrigger(control, text) {
        super.addTextTriggerBase(control, text);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the AUT session id.
     *
     * @return {Promise<?String>}
     */
    getAUTSessionId() {
        return this.getPromiseFactory().resolve(undefined);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the viewport size.
     *
     * @return {Promise<RectangleSize>}
     */
    getViewportSize() {
        return this.getPromiseFactory().resolve(this._viewportSizeHandler.get());
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the viewport size.
     *
     * @param {RectangleSize} viewportSize The required viewport size.
     * @return {Promise<void>}
     */
    setViewportSize(viewportSize) {
        ArgumentGuard.notNull(viewportSize, "size");

        this._viewportSizeHandler.set(new RectangleSize(viewportSize));
        return this.getPromiseFactory().resolve();
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the inferred environment.
     *
     * @protected
     * @return {Promise<String>} A promise which resolves to the inferred environment string.
     */
    getInferredEnvironment() {
        return this.getPromiseFactory().resolve(this._inferred);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets the inferred environment for the test.
     *
     * @param {String} inferred The inferred environment string.
     */
    setInferredEnvironment(inferred) {
        this._inferred = inferred;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the screenshot.
     *
     * @return {Promise<EyesSimpleScreenshot>} The screenshot.
     */
    getScreenshot() {
        return this.getPromiseFactory().resolve(this._screenshot);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the title.
     *
     * @protected
     * @return {Promise<String>} The current title of of the AUT.
     */
    getTitle() {
        return this.getPromiseFactory().resolve(this._title);
    }
}

module.exports = Eyes;
