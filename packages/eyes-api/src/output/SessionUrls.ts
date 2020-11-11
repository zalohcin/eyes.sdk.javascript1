import { toPlain } from '../utils/GeneralUtils';

export type SessionUrls = {
    batch?: string,
    session?: string
}

export default class SessionUrlsData implements Required<SessionUrls> {
    private _batch: string;
    private _session: string;

    constructor({ batch, session }: SessionUrls = {}) {
        this._batch = batch;
        this._session = session;
    }

    getBatch(): string {
        return this._batch;
    }

    setBatch(value: string): void {
        this._batch = value;
    }

    get batch(): string {
        return this._batch;
    }

    set batch(value: string) {
        this._batch = value;
    }

    getSession(): string {
        return this._session;
    }

    setSession(value: string): void {
        this._session = value;
    }

    get session(): string {
        return this._session;
    }

    set session(value: string) {
        this._session = value;
    }

    toJSON(): object {
        return toPlain(this)
    }

}