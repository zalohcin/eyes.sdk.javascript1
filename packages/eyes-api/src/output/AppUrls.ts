
import { toPlain } from '../utils/GeneralUtils';

export type AppUrls = {
    step?: string,
    stepEditor?: string
}

export default class AppUrlsData implements Required<AppUrls> {
    private _step: string;
    private _stepEditor: string;

    constructor({ step, stepEditor }: AppUrls = {}) {
        this._step = step
        this._stepEditor = stepEditor
    }

    getStep(): string {
        return this._step
    }

    setStep(value: string): void {
        this._step = value
    }

    get step(): string {
        return this._step;
    }

    set step(value: string) {
        this._step = value;
    }

    getStepEditor(): string {
        return this._stepEditor
    }

    setStepEditor(value: string): void {
        this._stepEditor = value
    }

    get stepEditor(): string {
        return this._stepEditor;
    }

    set stepEditor(value: string) {
        this._stepEditor = value;
    }

    toJSON(): object {
        return toPlain(this);
    }
}