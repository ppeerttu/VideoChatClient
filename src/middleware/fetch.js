import config from '../config';
const API_URL = config.apiBaseUrl;

export class Fetch {

  callApi (method, headers, path, body = null) {
    const head = new Headers();
    const keys = Object.keys(headers);
    keys.map(key => head.append(key, headers[key]));
    if (body) {
      return fetch(`${API_URL}${path}`, {
        method: method.toUpperCase(),
        headers: head,
        body: JSON.stringify(body)
      });
    }
    return fetch(`${API_URL}${path}`, {
      method: method.toUpperCase(),
      headers: head
    });

  }
}
