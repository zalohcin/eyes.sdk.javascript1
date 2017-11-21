const assert = require("assert");

const GeneralUtils = require('../src/GeneralUtils');
const ImageMatchSettings = require("../src/match/ImageMatchSettings");

describe('ImageMatchSettings', () => {
    it('toJSON()', () => {
        const ims = new ImageMatchSettings();

        let actualSerialization = GeneralUtils.toJson(ims);
        let expectedSerialization = "{\"matchLevel\":\"Strict\",\"ignore\":[],\"floating\":[]}";
        assert.equal(expectedSerialization, actualSerialization, "ImageMatchSettings serialization does not match!");

        ims.setIgnoreCaret(true);
        actualSerialization = GeneralUtils.toJson(ims);
        expectedSerialization = "{\"matchLevel\":\"Strict\",\"ignoreCaret\":true,\"ignore\":[],\"floating\":[]}";
        assert.equal(expectedSerialization, actualSerialization, "ImageMatchSettings serialization does not match!");
    });
});
