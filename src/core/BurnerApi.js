import fetch from './fetch';

export default class BurnerApi {
  constructor(token, apiBaseUrl, apiVersion) {
    this.token = token;
    // TODO: Are there two separate API versions?
    this.apiBaseUrl = apiBaseUrl || 'https://api.burnerapp.com/';
    this.apiVersion = apiVersion || '2.1.10';
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`Burner API error: ${response.status} - ${response.statusText}`);
      error.response = response;
      throw error;
    }
  }

  _parseJSON(response) {
    return response.json();
  }

  _headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      'X-Application-Version': this.apiVersion
    };
  }

  /**
   * Fetch the user's list of Burners.
   */
  fetchBurners() {
    return fetch(`${this.apiBaseUrl}/v1/burners`, {
      method: 'GET',
      headers: this._headers(),
    })
      .then(this._checkStatus)
      .then(this._parseJSON)
  }

  /**
   * Send a message.
   *
   * @param {String} body - The body of the message.
   * @param {String} burnerId - The burner id of the sender.
   * @param {String} phoneNumber - The phone number receiving the message.
   */
  sendMessage(options = {}) {
    const {body, burnerId, phoneNumber} = options;

    const headers = this._headers();
    headers['Content-Type'] = 'application/json';

    return fetch(`${this.apiBaseUrl}/v1/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        burnerId,
        toNumber: phoneNumber,
        text: body
      })
    })
      .then(this._checkStatus)
      .then(response => response)
  }
}
