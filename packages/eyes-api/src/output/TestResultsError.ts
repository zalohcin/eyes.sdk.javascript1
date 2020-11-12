import TestResults from "./TestResults";

export type TestResultsError = {
    name?: string,
    error?: Error,
    isError?: boolean
}

export default class TestResultsErrorData extends TestResults implements Required<TestResultsError> {
    private _error: Error;
    private _isError: boolean;

    constructor({ name, error }: TestResultsError) {
        super({ name });
        this._isError = true;
        this._error = error;
    }

    get error(): Error {
        return this._error;
    }

    set error(error: Error) {
        this._error = error;
    }

    get isError(): boolean {
        return this._isError;
    }

    set isError(value: boolean) {
        this._isError = value;
    }
}