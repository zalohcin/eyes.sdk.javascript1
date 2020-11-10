"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Eyes_1 = require("./Eyes");
const CheckSettings_1 = require("./input/CheckSettings");
const Configuration_1 = require("./input/Configuration");
function API(spec) {
    class APIEyes extends Eyes_1.default {
        constructor() {
            super(...arguments);
            this._spec = spec;
        }
    }
    class APICheckSettings extends CheckSettings_1.default {
        constructor() {
            super(...arguments);
            this._spec = spec;
        }
    }
    return {
        Eyes: APIEyes,
        CheckSettings: APICheckSettings,
        Configuration: Configuration_1.default,
    };
}
exports.default = API;
//# sourceMappingURL=API.js.map