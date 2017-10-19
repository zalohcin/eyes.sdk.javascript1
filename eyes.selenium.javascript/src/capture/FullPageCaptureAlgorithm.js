'use strict';

const {ArgumentGuard, Location, Region, RectangleSize, ImageUtils} = require('eyes.sdk');

// This should pretty much cover all scroll bars (and some fixed position footer elements :).
const MAX_SCROLL_BAR_SIZE = 50;
const MIN_SCREENSHOT_PART_HEIGHT = 10;

class FullPageCaptureAlgorithm {

    constructor(logger) {
        ArgumentGuard.notNull(logger, "logger");
        this._logger = logger;
    }

    /**
     * @private
     * @param {DebugScreenshotsProvider} debugScreenshotsProvider
     * @param {MutableImage} image
     * @param {Region} region
     * @param {String} name
     * @return {Promise}
     */
    static _saveDebugScreenshotPart(debugScreenshotsProvider, image, region, name) {
        const suffix = "part-" + name + "-" + region.getLeft() + "_" + region.getTop() + "_" + region.getWidth() + "x" + region.getHeight();
        return debugScreenshotsProvider.save(image, suffix);
    }

    /**
     * Returns a stitching of a region.
     *
     * @param {ImageProvider} imageProvider The provider for the screenshot.
     * @param {RegionProvider} regionProvider A provider of the region to stitch. If {@code getRegion} returns {@code Region.EMPTY}, the entire image will be stitched.
     * @param {PositionProvider} originProvider A provider for scrolling to initial position before starting the actual stitching.
     * @param {PositionProvider} positionProvider A provider of the scrolling implementation.
     * @param {ScaleProviderFactory} scaleProviderFactory A factory for getting the scale provider.
     * @param {CutProvider} cutProvider
     * @param {int} waitBeforeScreenshots Time to wait before each screenshot (milliseconds).
     * @param {DebugScreenshotsProvider} debugScreenshotsProvider
     * @param {EyesScreenshotFactory} screenshotFactory The factory to use for creating screenshots from the images.
     * @return {MutableImage} An image which represents the stitched region.
     */

    getStitchedRegion(imageProvider, regionProvider, originProvider, positionProvider, scaleProviderFactory, cutProvider, waitBeforeScreenshots, debugScreenshotsProvider, screenshotFactory) {
        this._logger.verbose("getStitchedRegion()");

        ArgumentGuard.notNull(regionProvider, "regionProvider");
        ArgumentGuard.notNull(positionProvider, "positionProvider");

        this._logger.verbose(String.format("Region to check: %s", regionProvider.getRegion()));
        this._logger.verbose(String.format("Coordinates type: %s", regionProvider.getCoordinatesType()));

        // TODO use scaling overlap offset.
        const SCALE_MARGIN_PX = 5;

        // Saving the original position (in case we were already in the outermost frame).
        const originalPosition = originProvider.getState();
        let currentPosition;

        let setPositionRetries = 3;
        do {
            originProvider.setPosition(new Location(0, 0));
            // Give the scroll time to stabilize
            GeneralUtils.sleep(waitBeforeScreenshots);
            currentPosition = originProvider.getCurrentPosition();
        } while (currentPosition.getX() !== 0 && currentPosition.getY() !== 0 && (--setPositionRetries > 0));

        if (currentPosition.getX() !== 0 || currentPosition.getY() !== 0) {
            originProvider.restoreState(originalPosition);
            throw new EyesException("Couldn't set position to the top/left corner!");
        }

        this._logger.verbose("Getting top/left image...");
        let image = imageProvider.getImage();
        debugScreenshotsProvider.save(image, "original");

        // FIXME - scaling should be refactored
        const scaleProvider = scaleProviderFactory.getScaleProvider(image.getWidth());
        // Notice that we want to cut/crop an image before we scale it, we need to change
        const pixelRatio = 1 / scaleProvider.getScaleRatio();

        // FIXME - cropping should be overlaid, so a single cut provider will only handle a single part of the image.
        cutProvider = cutProvider.scale(pixelRatio);
        image = cutProvider.cut(image);
        debugScreenshotsProvider.save(image, "original-cut");

        this._logger.verbose("Done! Creating screenshot object...");
        // We need the screenshot to be able to convert the region to
        // screenshot coordinates.
        const screenshot = screenshotFactory.makeScreenshot(image);
        this._logger.verbose("Done! Getting region in screenshot...");
        let regionInScreenshot = screenshot.convertRegionLocation(regionProvider.getRegion(), regionProvider.getCoordinatesType(), CoordinatesType.SCREENSHOT_AS_IS);

        this._logger.verbose("Done! Region in screenshot: " + regionInScreenshot);
        regionInScreenshot = regionInScreenshot.scale(pixelRatio);
        this._logger.verbose("Scaled region: " + regionInScreenshot);

        // Handling a specific case where the region is actually larger than
        // the screenshot (e.g., when body width/height are set to 100%, and
        // an internal div is set to value which is larger than the viewport).
        regionInScreenshot.intersect(new Region(0, 0, image.getWidth(), image.getHeight()));
        this._logger.verbose("Region after intersect: " + regionInScreenshot);

        if (!regionInScreenshot.isEmpty()) {
            image = ImageUtils.getImagePart(image, regionInScreenshot);
            saveDebugScreenshotPart(debugScreenshotsProvider, image, regionProvider.getRegion(), "before-scaled");
        }

        image = ImageUtils.scaleImage(image, scaleProvider);
        debugScreenshotsProvider.save(image, "scaled");

        let entireSize;
        try {
            entireSize = positionProvider.getEntireSize();
            this._logger.verbose("Entire size of region context: " + entireSize);
        } catch (err) {
            this._logger.log("WARNING: Failed to extract entire size of region context" + e.getMessage());
            this._logger.log("Using image size instead: " + image.getWidth() + "x" + image.getHeight());
            entireSize = new RectangleSize(image.getWidth(), image.getHeight());
        }

        // Notice that this might still happen even if we used
        // "getImagePart", since "entirePageSize" might be that of a frame.
        if (image.getWidth() >= entireSize.getWidth() && image.getHeight() >= entireSize.getHeight()) {
            originProvider.restoreState(originalPosition);

            return image;
        }

        // These will be used for storing the actual stitched size (it is
        // sometimes less than the size extracted via "getEntireSize").
        let lastSuccessfulLocation, lastSuccessfulPartSize;

        // The screenshot part is a bit smaller than the screenshot size,
        // in order to eliminate duplicate bottom scroll bars, as well as fixed
        // position footers.
        const partImageSize = new RectangleSize(image.getWidth(), Math.max(image.getHeight() - MAX_SCROLL_BAR_SIZE, MIN_SCREENSHOT_PART_HEIGHT));

        this._logger.verbose(String.format("Total size: %s, image part size: %s", entireSize, partImageSize));

        // Getting the list of sub-regions composing the whole region (we'll take screenshot for each one).
        const entirePage = new Region(Location.ZERO, entireSize);
        const imageParts = entirePage.getSubRegions(partImageSize);

        this._logger.verbose("Creating stitchedImage container. Size: " + entireSize);
        //Notice stitchedImage uses the same type of image as the screenshots.
        let stitchedImage = new BufferedImage(entireSize.getWidth(), entireSize.getHeight(), image.getType());
        this._logger.verbose("Done! Adding initial screenshot..");
        // Starting with the screenshot we already captured at (0,0).
        const initialPart = image.getData();
        this._logger.verbose(String.format("Initial part:(0,0)[%d x %d]", initialPart.getWidth(), initialPart.getHeight()));
        stitchedImage.getRaster().setRect(0, 0, initialPart);
        this._logger.verbose("Done!");

        lastSuccessfulLocation = new Location(0, 0);
        lastSuccessfulPartSize = new RectangleSize(initialPart.getWidth(), initialPart.getHeight());

        const originalStitchedState = positionProvider.getState();

        // Take screenshot and stitch for each screenshot part.
        this._logger.verbose("Getting the rest of the image parts...");
        let partImage = null;
        for (const partRegion in imageParts) {
            // Skipping screenshot for 0,0 (already taken)
            if (partRegion.getLeft() === 0 && partRegion.getTop() === 0) {
                continue;
            }
            this._logger.verbose(String.format("Taking screenshot for %s", partRegion));
            // Set the position to the part's top/left.
            positionProvider.setPosition(partRegion.getLocation());
            // Giving it time to stabilize.
            GeneralUtils.sleep(waitBeforeScreenshots);
            // Screen size may cause the scroll to only reach part of the way.
            currentPosition = positionProvider.getCurrentPosition();
            this._logger.verbose(String.format("Set position to %s", currentPosition));

            // Actually taking the screenshot.
            this._logger.verbose("Getting image...");
            partImage = imageProvider.getImage();
            debugScreenshotsProvider.save(partImage, "original-scrolled-" + positionProvider.getCurrentPosition().toStringForFilename());

            // FIXME - cropping should be overlaid (see previous comment re cropping)
            partImage = cutProvider.cut(partImage);
            debugScreenshotsProvider.save(partImage, "original-scrolled-cut-" + positionProvider.getCurrentPosition().toStringForFilename());

            this._logger.verbose("Done!");

            if (!regionInScreenshot.isEmpty()) {
                partImage = ImageUtils.getImagePart(partImage, regionInScreenshot);
                saveDebugScreenshotPart(debugScreenshotsProvider, partImage, partRegion, "original-scrolled-" + positionProvider.getCurrentPosition().toStringForFilename());
            }

            // FIXME - scaling should be refactored
            partImage = ImageUtils.scaleImage(partImage, scaleProvider);
            saveDebugScreenshotPart(debugScreenshotsProvider, partImage, partRegion, "original-scrolled-" + positionProvider.getCurrentPosition().toStringForFilename() + "-scaled-");


            // Stitching the current part.
            this._logger.verbose("Stitching part into the image container...");
            stitchedImage.getRaster().setRect(currentPosition.getX(), currentPosition.getY(), partImage.getData());
            this._logger.verbose("Done!");

            lastSuccessfulLocation = currentPosition;
        }

        if (partImage !== null) {
            lastSuccessfulPartSize = new RectangleSize(partImage.getWidth(), partImage.getHeight());
        }

        this._logger.verbose("Stitching done!");
        positionProvider.restoreState(originalStitchedState);
        originProvider.restoreState(originalPosition);

        // If the actual image size is smaller than the extracted size, we
        // crop the image.
        const actualImageWidth = lastSuccessfulLocation.getX() + lastSuccessfulPartSize.getWidth();
        const actualImageHeight = lastSuccessfulLocation.getY() + lastSuccessfulPartSize.getHeight();
        this._logger.verbose("Extracted entire size: " + entireSize);
        this._logger.verbose("Actual stitched size: " + actualImageWidth + "x" + actualImageHeight);

        if (actualImageWidth < stitchedImage.getWidth() || actualImageHeight < stitchedImage.getHeight()) {
            this._logger.verbose("Trimming unnecessary margins..");
            stitchedImage = ImageUtils.getImagePart(stitchedImage,
                new Region(0, 0,
                    Math.min(actualImageWidth, stitchedImage.getWidth()),
                    Math.min(actualImageHeight, stitchedImage.getHeight())));
            this._logger.verbose("Done!");
        }

        debugScreenshotsProvider.save(stitchedImage, "stitched");
        return stitchedImage;
    }
}

module.exports = FullPageCaptureAlgorithm;
