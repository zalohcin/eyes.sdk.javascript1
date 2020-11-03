import * as ArgumentGuard from './utils/ArgumentGuard'
import * as TypeUtils from './utils/TypeUtils'

export type PlainProxySettings = {
  url: string,
  username?: string,
  password?: string,
  isHttpOnly?: boolean,
}

export default class ProxySettings implements PlainProxySettings {
  private _url: string
  private _port: string
  private _username: string
  private _password: string
  private _isHttpOnly: boolean
  private _isDisabled: boolean

  constructor(isDisabled: false)
  constructor(proxy: PlainProxySettings)
  constructor(url: string, username?: string, password?: string, isHttpOnly?: boolean)
  constructor(proxyOrUrlOrIsDisabled: PlainProxySettings|string|false, username?: string, password?: string, isHttpOnly?: boolean) {
    ArgumentGuard.notNull(proxyOrUrlOrIsDisabled, {name: 'proxyOrUrlOrIsDisabled'})

    if (proxyOrUrlOrIsDisabled === false) {
      this._isDisabled = true
    } else {
      if (TypeUtils.isString(proxyOrUrlOrIsDisabled)) {
        return new ProxySettings({url: proxyOrUrlOrIsDisabled, username, password, isHttpOnly})
      }
      this._url = proxyOrUrlOrIsDisabled.url
      this._username = proxyOrUrlOrIsDisabled.username
      this._password = proxyOrUrlOrIsDisabled.password
      this._isHttpOnly = proxyOrUrlOrIsDisabled.isHttpOnly
      this._isDisabled = false

      // NOTE:
      // This is needed to preserve port 80 and backwards compatibility with the
      // default port of 8080 when running isHttpOnly.
      //
      // By default, URL sets the default port for a protocol to an empty string.
      // When an empty string is set for the port and isHttpOnly is enabled, then
      // the port defaults to 8080. Without this, port 80 is not a legal
      // configuraiton option.
      //
      // See also:
      // https://nodejs.org/api/url.html#url_url_port
      // eyes-sdk-core/lib/server/getTunnelAgentFromProxy.js:26
      if (isHttpOnly) {
        const result = this._url.match(/:(\d+)$/)
        this._port = result ? result[1] : ''
      }
    }
  }

  get url () {
    return this._url
  }
  getUri() {
    return this.url
  }

  get username() {
    return this._username
  }
  getUsername() {
    return this._username
  }

  get password() {
    return this._password
  }
  getPassword() {
    return this._password
  }

  get isHttpOnly() {
    return this._isHttpOnly
  }
  getIsHttpOnly() {
    return this._isHttpOnly
  }

  get isDisabled() {
    return this._isDisabled
  }
  getIsDisabled() {
    return this._isDisabled
  }
}