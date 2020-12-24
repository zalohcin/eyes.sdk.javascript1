'use strict';
const chalk = require('chalk');
const getAllBlobs = require('./getAllBlobs');

function makeEyesCheckWindow({ sendRequest, processPage, domSnapshotOptions }) {
    return function eyesCheckWindow(doc, args) {
        const globalConfigBreakpoints = Cypress.config('eyesLayoutBreakpoints');
        const layoutBreakpoints = args.layoutBreakpoints || JSON.parse(globalConfigBreakpoints);
        const breakpoints = layoutBreakpoints ? layoutBreakpoints.sort((a, b) => a > b ? -1 : 1) : undefined;
        const { innerWidth: width, innerHeight: height } = doc.defaultView;
        return takeDomSnapshots(domSnapshotOptions).then(snapshots => {
            // console.log("%cDone taking snapshots!", "color:chartreuse");
            console.log(snapshots);
            sendRequest({
                command: 'checkWindow',
                data: {
                    url: snapshots[0].url,
                    snapshots,
                    ...args
                },
            });
            // cy.viewport(width, height, { log: false }).wait(0, { log: false });
        });

        function takeDomSnapshots(options) {
            const eyesOpenArgs = Cypress.config('eyesOpenArgs')
            const globalConfigBrowsers = Cypress.config('eyesBrowser');
            const browsers = eyesOpenArgs.browser || JSON.parse(globalConfigBrowsers)
            if (!breakpoints) {
                //console.log('no breakpoints, taking single dom snapshot');
                return takeDomSnapshot(doc, options).then(snapshot => Array(browsers.length).fill(snapshot));
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
            }, cy.wrap({})).then(requiredWidths => {
                console.log(requiredWidths);

                // const isStrictBreakpoints = Array.isArray(breakpoints)
                // const smallestBreakpoint = Math.min(...(isStrictBreakpoints ? breakpoints : []))

                // if (isStrictBreakpoints && requiredWidths[smallestBreakpoint - 1]) {
                //     const smallestBrowsers = requiredWidths[smallestBreakpoint - 1]
                //         .map(({ name, width }) => `(${name}, ${width})`)
                //         .join(', ')
                //console.log(`%cThe following configuration's viewport-widths are smaller than the smallest configured layout breakpoint (${smallestBreakpoint} pixels): [${smallestBrowsers}]. As a fallback, the resources that will be used for these configurations have been captured on a viewport-width of ${smallestBreakpoint} - 1 pixels. If an additional layout breakpoint is needed for you to achieve better results - please add it to your configuration.`, 'color:yellow')
                // }

                //console.log(`taking multiple dom snapshots for breakpoints: ${breakpoints}`)
                //console.log(`required widths: ${requiredWidthsKeys.join(', ')}`)
                const snapshots = Array(browsers.length);
                if (requiredWidths[width]) {
                    //console.log(`taking dom snapshot for existing width ${width}`)
                    return takeDomSnapshot(doc, options).then(snapshot => {
                        requiredWidths[width].forEach(({ index }) => (snapshots[index] = snapshot));
                        return { snapshots, requiredWidths };
                    });
                } else {
                    return { snapshots, requiredWidths };
                }
            }).then(({ snapshots, requiredWidths }) => {
                const requiredWidthsKeys = Object.keys(requiredWidths);
                let cyPromise = cy.window({ log: false });
                for (const requiredWidth of requiredWidthsKeys) {
                    const browsersInfo = requiredWidths[requiredWidth];
                    //console.log(`taking dom snapshot for width ${requiredWidth}`);
                    cyPromise = cyPromise.viewport(Number(requiredWidth), height, { log: false }).wait(0, { log: false }).then(() => {
                        return takeDomSnapshot(doc, options).then(snapshot => {
                            browsersInfo.forEach(({ index }) => snapshots[index] = snapshot);
                            return snapshots;
                        });
                    });
                }
                return cyPromise;
            });
        }

        function takeDomSnapshot(doc, options) {
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