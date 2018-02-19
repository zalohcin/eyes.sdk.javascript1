const assert = require("assert");

const GeneralUtils = require("../src/GeneralUtils");

describe('GeneralUtils', function(){
    describe('#urlConcat()', function(){
        it('should return / when the values are empty', function() {
            assert.equal(GeneralUtils.urlConcat('', ''), "/");
        });
        it('should return the correct Url when both parts don\'t start/end with a "/"', function () {
            const left = "http://www.applitools.com",
                right = "subdomain/index.html";
            assert.equal(GeneralUtils.urlConcat(left, right), left + "/" + right);
        });
        it('should return the correct Url when only left part ends with a "/"', function () {
            const left = "http://www.applitools.com/",
                right = "subdomain/index.html";
            assert.equal(GeneralUtils.urlConcat(left, right), left + right);
        });
        it('should return the correct Url when only right part starts with a "/"', function () {
            const left = "http://www.applitools.com",
                right = "/subdomain/index.html";
            assert.equal(GeneralUtils.urlConcat(left, right), left + right);
        });
        it('should return the correct Url when both parts start/end with a "/"', function () {
            const left = "http://www.applitools.com",
                right = "/subdomain/index.html";
            assert.equal(GeneralUtils.urlConcat(left + "/", right), left + right);
        });
        it('should return the correct Url when given multiple suffixes', function () {
            assert.equal(GeneralUtils.urlConcat("http://www.applitools.com/", "/subdomain/", "/index.html"), "http://www.applitools.com/subdomain/index.html");
        });
        it('should return the correct Url when given multiple suffixes and query params', function () {
            assert.equal(GeneralUtils.urlConcat("http://www.applitools.com/", "/subdomain/", "?param=1"), "http://www.applitools.com/subdomain?param=1");
        });
    });

    describe('#jwtDecode()', function(){
        it('decoded should be equal with original', function() {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ";
            const decoded = GeneralUtils.jwtDecode(token);

            assert.equal(decoded.admin, true);
            assert.equal(decoded.name, "John Doe");
            assert.equal(decoded.sub, "1234567890");
        });
    });
});
