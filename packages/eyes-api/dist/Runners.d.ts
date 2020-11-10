import Eyes from './Eyes';
export default class EyesRunner {
    private _eyes;
    attach(eyes: Eyes): void;
    getAllTestResults(throwErr: boolean): Promise<any>;
}
export declare class VisualGridRunner extends EyesRunner {
    private _legacyConcurrency;
    private _testConcurrency;
    constructor(options: {
        testConcurrency: number;
    });
    constructor(legacyConcurrency: number);
    get legacyConcurrency(): number;
    get testConcurrency(): number;
}
export declare class ClassicRunner extends EyesRunner {
}
