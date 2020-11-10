"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassicRunner = exports.VisualGridRunner = void 0;
const TypeUtils = require("./utils/TypeUtils");
class EyesRunner {
    constructor() {
        this._eyes = [];
    }
    attach(eyes) {
        this._eyes.push(eyes);
    }
    getAllTestResults(throwErr) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._eyes.length > 0) {
                const results = yield Promise.all(this._eyes.map((eyes) => {
                    return eyes.closeBatch().then(() => eyes.close());
                }));
                return results;
            }
        });
    }
}
exports.default = EyesRunner;
class VisualGridRunner extends EyesRunner {
    constructor(optionsOrLegacyConcurrency) {
        super();
        if (TypeUtils.isNumber(optionsOrLegacyConcurrency)) {
            this._legacyConcurrency = optionsOrLegacyConcurrency;
        }
        else {
            this._legacyConcurrency = optionsOrLegacyConcurrency.testConcurrency;
        }
    }
    get legacyConcurrency() {
        return this._legacyConcurrency;
    }
    get testConcurrency() {
        return this._testConcurrency;
    }
}
exports.VisualGridRunner = VisualGridRunner;
class ClassicRunner extends EyesRunner {
}
exports.ClassicRunner = ClassicRunner;
//# sourceMappingURL=Runners.js.map