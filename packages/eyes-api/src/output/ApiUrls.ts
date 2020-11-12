import { toPlain } from '../utils/GeneralUtils';

export type ApiUrls = {
    baselineImage?: string,
    currentImage?: string,
    checkpointImage?: string,
    checkpointImageThumbnail?: string,
    diffImage?: string
}


export default class ApiUrlsData implements Required<ApiUrls> {
    private _baselineImage: string;
    private _currentImage: string;
    private _checkpointImage: string;
    private _checkpointImageThumbnail: string;
    private _diffImage: string;

    constructor({
        baselineImage,
        currentImage,
        checkpointImage,
        checkpointImageThumbnail,
        diffImage,
    }: ApiUrls = {}) {
        this._baselineImage = baselineImage
        this._currentImage = currentImage
        this._checkpointImage = checkpointImage
        this._checkpointImageThumbnail = checkpointImageThumbnail
        this._diffImage = diffImage
    }

    getBaselineImage(): string {
        return this._baselineImage
    }

    setBaselineImage(value: string): void {
        this._baselineImage = value
    }

    get baselineImage(): string {
        return this._baselineImage;
    }

    set baselineImage(value: string) {
        this._baselineImage = value;
    }

    getCurrentImage(): string {
        return this._currentImage
    }

    setCurrentImage(value: string): void {
        this._currentImage = value
    }

    get currentImage(): string {
        return this._currentImage;
    }

    set currentImage(value: string) {
        this._currentImage = value;
    }

    getCheckpointImage(): string {
        return this._checkpointImage
    }

    setCheckpointImage(value: string): void {
        this._checkpointImage = value
    }

    get checkpointImage(): string {
        return this._checkpointImage;
    }

    set checkpointImage(value: string) {
        this._checkpointImage = value;
    }

    getCheckpointImageThumbnail(): string {
        return this._checkpointImageThumbnail
    }

    setCheckpointImageThumbnail(value: string): void {
        this._checkpointImageThumbnail = value
    }

    get checkpointImageThumbnail(): string {
        return this._checkpointImageThumbnail;
    }

    set checkpointImageThumbnail(value: string) {
        this._checkpointImageThumbnail = value;
    }

    getDiffImage(): string {
        return this._diffImage
    }

    setDiffImage(value: string): void {
        this._diffImage = value
    }

    get diffImage(): string {
        return this._diffImage;
    }

    set diffImage(value: string) {
        this._diffImage = value;
    }

    toJSON(): object {
        return toPlain(this)
    }
}