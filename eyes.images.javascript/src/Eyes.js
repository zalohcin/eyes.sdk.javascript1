'use strict';

const {ArgumentGuard, EyesBase, RegionProvider, MutableImage, PromiseFactory, RectangleSize, NullRegionProvider, CheckSettings} = require('eyes.sdk');
const EyesImagesScreenshot = require('./EyesImagesScreenshot');

const VERSION = require('../package.json').version;

/**
 * The main type - to be used by the users of the library to access all functionality.
 */
class Eyes extends EyesBase {

    /**
     * Initializes an Eyes instance.
     *
     * @param {String} [serverUrl]
     * @param {PromiseFactory} [promiseFactory] If not specified will be created using `Promise` class
     **/
    constructor(serverUrl, promiseFactory) {
        if (!promiseFactory) {
            promiseFactory = new PromiseFactory((asyncAction) => {
                return new Promise(asyncAction);
            }, null);
        }

        super(promiseFactory, serverUrl || EyesBase.DEFAULT_EYES_SERVER);

        this._title = undefined;
        this._screenshot = undefined;
        this._inferred = "";
    }

    //noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
    getBaseAgentId() {
        return 'eyes.images/' + VERSION;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Starts a test.
     *
     * @param {String} appName The application being tested.
     * @param {String} testName The test's name.
     * @param {RectangleSize} [imageSize] Determines the resolution used for the baseline. {@code null} will automatically grab the resolution from the image.
     * @return {Promise}
     */
    open(appName, testName, imageSize) {
        return super.openBase(appName, testName, imageSize, null);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Perform visual validation for the current image.
     *
     * @param {String|Buffer|MutableImage} image The image base64 string, image buffer or MutableImage.
     * @param {String} [tag] Tag to be associated with the validation checkpoint.
     * @param {Boolean} [ignoreMismatch] True if the server should ignore a negative result for the visual validation.
     * @param {int} [retryTimeout] timeout for performing the match (ms).
     * @return {Promise<Boolean>} True if the image matched the expected output, false otherwise.
     * @throws {DiffsFoundError} Thrown if a mismatch is detected and immediate failure reports are enabled.
     */
    checkImage(image, tag, ignoreMismatch, retryTimeout) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`CheckImage(Image, '${tag}', '${ignoreMismatch}', '${retryTimeout}'): Ignored`);
            return this._promiseFactory.resolve(false);
        }

        try {
            ArgumentGuard.notNull(image, "image cannot be null!");
        } catch (err) {
            return this._promiseFactory.resolve(new Error(err));
        }

        this._logger.verbose(`checkImage(Image, '${tag}', '${ignoreMismatch}', '${retryTimeout}')`);
        return this._checkImage(new NullRegionProvider(this.getPromiseFactory()), image, tag, ignoreMismatch, retryTimeout);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Perform visual validation for the current image.
     * IMPORTANT! Changed order of parameters: image first, region second!
     *
     * @param {Object} region The region of the image which should be verified, or {undefined}/{null} if the entire image should be verified.
     * @param {String|Buffer|MutableImage} image The image base64 string, image buffer or MutableImage.
     * @param {String} [tag] An optional tag to be associated with the validation checkpoint.
     * @param {Boolean} [ignoreMismatch] True if the server should ignore a negative result for the visual validation.
     * @param {int} [retryTimeout] timeout for performing the match (ms).
     * @return {Promise<Boolean>} True if the image matched the expected output, false otherwise.
     * @throws {DiffsFoundError} Thrown if a mismatch is detected and immediate failure reports are enabled.
     */
    checkRegion(image, region, tag, ignoreMismatch, retryTimeout) {
        if (this.getIsDisabled()) {
            this._logger.verbose(`checkRegion(Image, [${region}], '${tag}', '${ignoreMismatch}', '${retryTimeout}'): Ignored`);
            return this._promiseFactory.resolve(false);
        }

        try {
            ArgumentGuard.notNull(image, "image cannot be null!");
            ArgumentGuard.notNull(region, "region cannot be null!");
        } catch (err) {
            return this._promiseFactory.resolve(new Error(err));
        }

        this._logger.verbose(`checkRegion(Image, [${region}], '${tag}', '${ignoreMismatch}', '${retryTimeout}')`);
        return this._checkImage(new RegionProvider(region, this.getPromiseFactory()), image, tag, ignoreMismatch, retryTimeout);
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
        if (this.getIsDisabled()) {
            this._logger.verbose(`replaceImage('${stepIndex}', Image, '${tag}', '${title}', '${userInputs}'): Ignored`);
            return this._promiseFactory.resolve(false);
        }

        try {
            ArgumentGuard.notNull(image, "image cannot be null!");
            ArgumentGuard.notNull(stepIndex, "stepIndex cannot be null!");
        } catch (err) {
            return this._promiseFactory.resolve(new Error(err));
        }

        image = this._normalizeImageType(image);

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
        return this._promiseFactory.resolve(undefined);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the viewport size.
     *
     * @return {Promise<RectangleSize>}
     */
    getViewportSize() {
        return this._promiseFactory.resolve(this._viewportSizeHandler.get());
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Set the viewport size.
     *
     * @param {RectangleSize} size The required viewport size.
     * @return {Promise<void>}
     */
    setViewportSize(size) {
        try {
            ArgumentGuard.notNull(size, "size");
        } catch (err) {
            return this._promiseFactory.resolve(new Error(err));
        }

        this._viewportSizeHandler.set(RectangleSize.copy(size));
        return this._promiseFactory.resolve();
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the inferred environment.
     *
     * @protected
     * @return {Promise<String>} A promise which resolves to the inferred environment string.
     */
    getInferredEnvironment() {
        return this._promiseFactory.resolve(this._inferred);
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
     * @return {Promise<EyesImagesScreenshot>} The screenshot.
     */
    getScreenshot() {
        return this._promiseFactory.resolve(this._screenshot);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Get the title.
     *
     * @protected
     * @return {Promise<String>} The current title of of the AUT.
     */
    getTitle() {
        return this._promiseFactory.resolve(this._title);
    }

    /**
     * Internal function for performing an image verification for an image (or a region of an image).
     *
     * @private
     * @param {RegionProvider} regionProvider The region of the image which should be verified, or {undefined}/{null} if the entire image should be verified.
     * @param {String|Buffer|MutableImage} image The image base64 string, image buffer or MutableImage.
     * @param {String} tag An optional tag to be associated with the validation checkpoint.
     * @param {Boolean} ignoreMismatch True if the server should ignore a negative result for the visual validation.
     * @param {int} retryTimeout The amount of time to retry matching in milliseconds or a negative value to use the default retry timeout.
     * @return {Promise<Boolean>}
     */
    _checkImage(regionProvider, image, tag, ignoreMismatch, retryTimeout) {
        image = this._normalizeImageType(image);

        if (!this._viewportSizeHandler.get()) {
            this._viewportSize = RectangleSize.copy(image.getSize());
        }

        this._screenshot = new EyesImagesScreenshot(image);

        this._title = tag || '';
        return super.checkWindowBase(regionProvider, tag, ignoreMismatch, new CheckSettings(retryTimeout)).then(results => {
            return results.getAsExpected();
        });
    }

    /**
     * @private
     * @param {String|Buffer|MutableImage} image
     * @return {MutableImage}
     */
    _normalizeImageType(image) {
        if (image instanceof MutableImage) {
            return image;
        } else if (Buffer.isBuffer(image)) {
            return new MutableImage(image, this._promiseFactory);
        } else if (typeof image === 'string' || image instanceof String) {
            return MutableImage.fromBase64(image, this._promiseFactory);
        }

        throw new TypeError("unsupported type of image!");
    }
}

module.exports = Eyes;
