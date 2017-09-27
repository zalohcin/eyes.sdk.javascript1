'use strict';

const RegionProvider = require('./RegionProvider');
const Region = require('./Region');

class NullRegionProvider extends RegionProvider {

    // noinspection JSMethodCanBeStatic
    /**
     * @return {Region} A region with "as is" viewport coordinates.
     */
    getRegion() {
        return Region.EMPTY;
    }
}

module.exports = NullRegionProvider;
