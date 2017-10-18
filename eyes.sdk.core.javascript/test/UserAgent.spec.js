const {describe, it} = require("mocha");
const assert = require("assert");

const UserAgent = require("../src/UserAgent");

const FirefoxUserAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0";
const ChromeUserAgent = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Mobile Safari/537.36";
const SafariUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1";
const OperaUserAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41";
const IEUserAgent = "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)";
const BotUserAgent = "Googlebot/2.1 (+http://www.google.com/bot.html)";

describe('UserAgent', () => {
    describe('#parseUserAgentString()', () => {
        it('should return Firefox as browser, Windows as OS', () => {
            const userAgent = UserAgent.parseUserAgentString(FirefoxUserAgent, true);
            assert.equal("Windows", userAgent.getOS());
            assert.equal("10", userAgent.getOSMajorVersion());
            assert.equal("0", userAgent.getOSMinorVersion());
            assert.equal("Firefox", userAgent.getBrowser());
            assert.equal("54", userAgent.getBrowserMajorVersion());
            assert.equal("0", userAgent.getBrowserMinorVersion());
        });

        it('should return Chrome as browser, Android as OS', () => {
            const userAgent = UserAgent.parseUserAgentString(ChromeUserAgent, true);
            assert.equal("Android", userAgent.getOS());
            assert.equal("6", userAgent.getOSMajorVersion());
            assert.equal("0", userAgent.getOSMinorVersion());
            assert.equal("Chrome", userAgent.getBrowser());
            assert.equal("60", userAgent.getBrowserMajorVersion());
            assert.equal("0", userAgent.getBrowserMinorVersion());
        });

        it('should return Safari as browser, IOS as OS', () => {
            const userAgent = UserAgent.parseUserAgentString(SafariUserAgent, true);
            assert.equal("IOS", userAgent.getOS());
            assert.equal("10", userAgent.getOSMajorVersion());
            assert.equal("3", userAgent.getOSMinorVersion());
            assert.equal("Safari", userAgent.getBrowser());
            assert.equal("602", userAgent.getBrowserMajorVersion());
            assert.equal("1", userAgent.getBrowserMinorVersion());
        });

        it('should return Chrome as browser, Linux as OS', () => {
            const userAgent = UserAgent.parseUserAgentString(OperaUserAgent, true);
            assert.equal("Linux", userAgent.getOS());
            assert.equal(undefined, userAgent.getOSMajorVersion());
            assert.equal(undefined, userAgent.getOSMinorVersion());
            assert.equal("Chrome", userAgent.getBrowser());
            assert.equal("51", userAgent.getBrowserMajorVersion());
            assert.equal("0", userAgent.getBrowserMinorVersion());
        });

        it('should return IE as browser, Windows as OS', () => {
            const userAgent = UserAgent.parseUserAgentString(IEUserAgent, true);
            assert.equal("Windows", userAgent.getOS());
            assert.equal(undefined, userAgent.getOSMajorVersion());
            assert.equal(undefined, userAgent.getOSMinorVersion());
            assert.equal("IE", userAgent.getBrowser());
            assert.equal("9", userAgent.getBrowserMajorVersion());
            assert.equal("0", userAgent.getBrowserMinorVersion());
        });

        it('should return Unknown as browser, Unknown as OS', () => {
            const userAgent = UserAgent.parseUserAgentString(BotUserAgent, true);
            assert.equal("Unknown", userAgent.getOS());
            assert.equal(undefined, userAgent.getOSMajorVersion());
            assert.equal(undefined, userAgent.getOSMinorVersion());
            assert.equal("Unknown", userAgent.getBrowser());
            assert.equal(undefined, userAgent.getBrowserMajorVersion());
            assert.equal(undefined, userAgent.getBrowserMinorVersion());
        });
    });
});
