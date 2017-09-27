const {describe, it} = require("mocha");
const assert = require("assert");

const GeneralUtils = require("../../src/GeneralUtils");

describe('GeneralUtils', function(){
    describe('#urlConcat()', function(){
        it('should return / when the values are empty', function() {
            assert.equal("/", GeneralUtils.urlConcat('', ''));
        });
        it('should return the correct Url when both parts don\'t start/end with a "/"', function () {
            const left = "http://www.applitools.com",
                right = "subdomain/index.html";
            assert.equal(left + "/" + right, GeneralUtils.urlConcat(left, right));
        });
        it('should return the correct Url when only left part ends with a "/"', function () {
            const left = "http://www.applitools.com/",
                right = "subdomain/index.html";
            assert.equal(left + right, GeneralUtils.urlConcat(left, right));
        });
        it('should return the correct Url when only right part starts with a "/"', function () {
            const left = "http://www.applitools.com",
                right = "/subdomain/index.html";
            assert.equal(left + right, GeneralUtils.urlConcat(left, right));
        });
        it('should return the correct Url when both parts start/end with a "/"', function () {
            const left = "http://www.applitools.com",
                right = "/subdomain/index.html";
            assert.equal(left + right, GeneralUtils.urlConcat(left + "/", right));
        });
    });
});
