'use strict';

const getAllBlobs = require('./getAllBlobs');

function makeEyesCheckWindow({ sendRequest, processPage, domSnapshotOptions, cypress = cy }) {
    return function eyesCheckWindow(doc, args) {
        const browser = args.browser;
        const layoutBreakpoints = args.layoutBreakpoints;
        const browsers = Array.isArray(browser) ? browser : [browser];
        const { innerWidth: width, innerHeight: height } = doc.defaultView;
        const breakpoints = layoutBreakpoints ? layoutBreakpoints.sort((a, b) => a > b ? -1 : 1) : undefined;
        const sendArgs = typeof args === "object" ? args : { tag: args };
        return takeDomSnapshots(domSnapshotOptions).then(snapshots => {
            // console.log("%cDone taking snapshots!", "color:chartreuse");
            sendRequest({
                command: 'checkWindow',
                data: {
                    url: snapshots[0].url,
                    snapshots,
                    ...sendArgs
                },
            });
        });

        function takeDomSnapshots(options) {
            if (!breakpoints) {
                //console.log('no breakpoints, taking single dom snapshot');
                return takeDomSnapshot(options).then(snapshot => Array(browsers.length).fill(snapshot));
            }

            return browsers.reduce((widths, browser, index) => {
                return widths.then(widthsMap => {
                    return getBrowserInfo(browser).then(({ name, width }) => {
                        const requiredWidth = getBreakpointWidth(breakpoints, width)
                        let groupedBrowsers = widthsMap[requiredWidth];
                        if (!groupedBrowsers) {
                            groupedBrowsers = [];
                            widthsMap[requiredWidth] = groupedBrowsers;
                        }
                        groupedBrowsers.push({ index, width, name })
                        return widthsMap;
                    });
                });
            }, cypress.wrap({}, { log: false })).then(requiredWidths => {
                const snapshots = Array(browsers.length);
                const requiredWidthsKeys = Object.keys(requiredWidths);
                for (const requiredWidth of requiredWidthsKeys) {
                    const browsersInfo = requiredWidths[requiredWidth];
                    // console.log(`taking dom snapshot for width ${requiredWidth}`);
                    cypress.viewport(Number(requiredWidth), height, { log: false }).wait(300, { log: false }).then(() => {
                        takeDomSnapshot(options).then(snapshot => {
                            browsersInfo.forEach(({ index }) => snapshots[index] = snapshot);
                        });
                    });
                };
                return cypress.viewport(width, height).wait(0, { log: false }).then(() => snapshots);
            });
        }

        function takeDomSnapshot(options) {
            // console.log(`take dom snapshot with ${doc.defaultView.innerWidth}`);
            return processPage(Object.assign({ doc }, options)).then(mainFrame => {
                const allBlobs = getAllBlobs(mainFrame)
                    .filter(blob => !blob.errorStatusCode)
                    .map(mapBlob);
                const snapshot = replaceBlobsWithBlobDataInFrame(mainFrame);
                return Promise.all(allBlobs.map(putResource)).then(() => {
                    return snapshot;
                });
            });
        }

        function putResource({ url, value }) {
            return sendRequest({
                command: `resource/${encodeURIComponent(url)}`,
                data: value,
                method: 'PUT',
                headers: { 'Content-Type': 'application/octet-stream' },
            }).catch(_e => {
                snapshot.blobData.splice(
                    snapshot.blobData.findIndex(({ url: blobUrl }) => blobUrl === url),
                    1,
                );
                snapshot.resourceUrls.push(url);
            });
        }

        function getBrowserInfo(browser) {
            const browserInfo = !!browser.name;
            if (browserInfo) {
                const { name, width } = browser;
                return Promise.resolve({ name, width });
            } else {
                const iosDevice = !!browser.iosDeviceInfo;
                const { deviceName, screenOrientation = 'portrait' } = browser.iosDeviceInfo || browser.chromeEmulationInfo || browser;
                const command = iosDevice ? 'getIosDevicesSizes' : 'getEmulatedDevicesSizes';
                return sendRequest({ command }).then(devicesSizes => {
                    const size = devicesSizes[deviceName][screenOrientation];
                    return { name: deviceName, ...size };
                });
            }
        }

        function getBreakpointWidth(breakpoints, width) {
            if (!Array.isArray(breakpoints) || breakpoints.length === 0) {
                return width;
            }
            const breakpoint = breakpoints.find(breakpoint => width >= breakpoint)
            return breakpoint || breakpoints[breakpoints.length - 1] - 1
        }
    };
}

function replaceBlobsWithBlobDataInFrame({ url, cdt, resourceUrls, blobs, frames }) {
    return {
        url,
        cdt,
        resourceUrls,
        blobData: blobs.map(mapBlobData),
        frames: frames.map(replaceBlobsWithBlobDataInFrame),
    };
}

function mapBlobData(blob) {
    if (blob.errorStatusCode) {
        return { url: blob.url, errorStatusCode: blob.errorStatusCode };
    } else {
        return { url: blob.url, type: blob.type || 'application/x-applitools-unknown' };
    }
}

function mapBlob({ url, type, value }) {
    return { url, type: type || 'application/x-applitools-unknown', value };
}

module.exports = makeEyesCheckWindow;