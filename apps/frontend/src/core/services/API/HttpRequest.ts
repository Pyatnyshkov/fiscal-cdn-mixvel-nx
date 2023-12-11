import axios from 'axios'

export class HttpRequest {
  private _url
  private _client
  constructor(url: string) {
    this._url = url
    this._client = axios
    this._client.defaults.headers.post['Content-Type'] = 'text/xml'
  }

  public post<T>(data: string) {
    return this._client.post<T>(this._url, data)
  }
}
