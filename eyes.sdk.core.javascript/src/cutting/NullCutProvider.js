'use strict';

const FixedCutProvider = require('./FixedCutProvider');

class NullCutProvider extends FixedCutProvider {
    constructor() {
        super(0, 0, 0, 0);
    }
}

module.exports = NullCutProvider;
