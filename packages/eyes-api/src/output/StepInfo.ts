import { toPlain } from '../utils/GeneralUtils';
import AppUrlsData, { AppUrls } from './AppUrls';
import ApiUrlsData, { ApiUrls } from './ApiUrls';

export type StepInfo = {
    name?: string,
    isDifferent?: boolean,
    hasBaselineImage?: boolean,
    hasCurrentImage?: boolean,
    appUrls?: AppUrls | object,
    apiUrls?: ApiUrls | object,
    renderId?: string[]
}

export default class StepInfoData implements Required<StepInfo> {
    private _name: string;
    private _isDifferent: boolean;
    private _hasBaselineImage: boolean;
    private _hasCurrentImage: boolean;
    private _appUrls: AppUrls | object;
    private _apiUrls: ApiUrls | object;
    private _renderId: string[]

    constructor({
        name,
        isDifferent,
        hasBaselineImage,
        hasCurrentImage,
        appUrls,
        apiUrls,
        renderId,
    }: StepInfo = {}) {
        if (appUrls && !(appUrls instanceof AppUrlsData)) {
            appUrls = new AppUrlsData(appUrls)
        }

        if (apiUrls && !(apiUrls instanceof ApiUrlsData)) {
            apiUrls = new ApiUrlsData(apiUrls)
        }

        this._name = name
        this._isDifferent = isDifferent
        this._hasBaselineImage = hasBaselineImage
        this._hasCurrentImage = hasCurrentImage
        this._appUrls = appUrls
        this._apiUrls = apiUrls
        this._renderId = renderId
    }

    getName(): string {
        return this._name
    }

    setName(value: string): void {
        this._name = value
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    getIsDifferent(): boolean {
        return this._isDifferent
    }

    setIsDifferent(value: boolean): void {
        this._isDifferent = value
    }

    get isDifferent(): boolean {
        return this._isDifferent;
    }

    set isDifferent(value: boolean) {
        this._isDifferent = value;
    }

    getHasBaselineImage(): boolean {
        return this._hasBaselineImage
    }

    setHasBaselineImage(value: boolean): void {
        this._hasBaselineImage = value
    }

    get hasBaselineImage(): boolean {
        return this._hasBaselineImage;
    }

    set hasBaselineImage(value: boolean) {
        this._hasBaselineImage = value;
    }

    getHasCurrentImage(): boolean {
        return this._hasCurrentImage
    }

    setHasCurrentImage(value: boolean): void {
        this._hasCurrentImage = value
    }

    get hasCurrentImage(): boolean {
        return this._hasCurrentImage;
    }

    set hasCurrentImage(value: boolean) {
        this._hasCurrentImage = value;
    }

    getAppUrls(): AppUrls {
        return this._appUrls
    }

    setAppUrls(value: AppUrls): void {
        this._appUrls = value
    }

    get appUrls(): AppUrls {
        return this._appUrls;
    }

    set appUrls(value: AppUrls) {
        this._appUrls = value;
    }

    getApiUrls(): ApiUrls {
        return this._apiUrls
    }

    setApiUrls(value: ApiUrls): void {
        this._apiUrls = value
    }

    get apiUrls(): ApiUrls {
        return this._apiUrls;
    }

    set apiUrls(value: ApiUrls) {
        this._apiUrls = value;
    }

    getRenderId(): string[] {
        return this._renderId
    }

    setRenderId(value: string[]): void {
        this._renderId = value
    }

    get renderId(): string[] {
        return this._renderId;
    }

    set renderId(value: string[]) {
        this._renderId = value;
    }

    toJSON(): object {
        return toPlain(this)
    }
}