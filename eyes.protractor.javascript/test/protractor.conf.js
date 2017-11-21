// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

// noinspection JSUnusedGlobalSymbols
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    suites: {
        selenium: 'selenium/*.spec.js',
        default: '*.spec.js',
    },
    capabilities: {
        'browserName': 'chrome'
    },
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 300000
    },
    onPrepare: () => {
        // we need this to get appName and testName and pass them to eyes.open in beforeEach
        // noinspection JSUnresolvedFunction, JSUnresolvedVariable, JSUnusedGlobalSymbols
        jasmine.getEnv().addReporter({
            specStarted: (result) => {
                global.testName = result.description;
                // noinspection JSUnresolvedVariable
                global.appName = result.fullName.replace(" " + testName, "");
            }
        });
    },
};