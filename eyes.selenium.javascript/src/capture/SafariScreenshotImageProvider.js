'use strict';

const {ImageProvider, MutableImage, Region} = require('eyes.sdk');

const ScrollPositionProvider = require('../positioning/ScrollPositionProvider');

class SafariScreenshotImageProvider extends ImageProvider {

    /**
     * @param {Eyes} eyes
     * @param {Object} logger A Logger instance.
     * @param {EyesWebDriver} driver
     * @param {PromiseFactory} promiseFactory
     */
    constructor(eyes, logger, driver, promiseFactory) {
        super();

        this._eyes = eyes;
        this._logger = logger;
        this._driver = driver;
        this._promiseFactory = promiseFactory;
        this._jsExecutor = new SeleniumJavaScriptExecutor(eyes.getDriver());
    }

    /**
     * @override
     * @return {Promise<MutableImage>}
     */
    getImage() {
        this._logger.verbose("Getting screenshot as base64...");

        let image;
        const that = this;
        return this._driver.takeScreenshot().then(screenshot64 => {
            that._logger.verbose("Done getting base64! Creating MutableImage...");
            image = MutableImage.fromBase64(screenshot64, that._promiseFactory);

            return that._eyes.getDebugScreenshotsProvider().save(image, "SAFARI");
        }).then(() => {
            if (!that._eyes.getForceFullPageScreenshot()) {
                const currentFrameChain = that._eyes.getDriver().getFrameChain();

                let loc;
                if (currentFrameChain.size() === 0) {
                    const positionProvider = new ScrollPositionProvider(that._logger, that._jsExecutor, that._promiseFactory);
                    loc = positionProvider.getCurrentPosition();
                } else {
                    loc = currentFrameChain.getDefaultContentScrollPosition();
                }

                const scaleRatio = that._eyes.getDevicePixelRatio();
                let viewportSize = that._eyes.getViewportSize();
                viewportSize = viewportSize.scale(scaleRatio);
                loc = loc.scale(scaleRatio);

                return image.cropImage(new Region(loc, viewportSize));
            }

            return image;
        });
    }
}

module.exports = SafariScreenshotImageProvider;
