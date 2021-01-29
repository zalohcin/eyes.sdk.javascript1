export default class EyesError extends Error {
  private _type: string
  private _options: Record<string, any>
  constructor(message: string, type?: string, options?: Record<string, any>) {
    super(message)
    this.name = this.constructor.name
    this._type = type
    this._options = options
  }
}
