import fetch from './fetch';

export default class BurnerApi {
  constructor(token, apiBaseUrl, apiVersion) {
    this.token = token;
    this.apiBaseUrl = apiBaseUrl || 'https://api.burnerapp.com';
    this.apiVersion = apiVersion || '2.1.10';
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  parseJSON(response) {
    return response.json();
  }

  /**
   * Fetch the user's list of Burners.
   */
  fetchBurners() {
    // TODO: Header gen needs its own method.
    const headers = {
      Authorization: `Bearer ${this.token}`,
      'X-Application-Version': this.apiVersion
    };

    return fetch(`${this.apiBaseUrl}/v1/burners`, {
      method: 'get',
      headers,
    })
      .then(this.checkStatus)
      .then(this.parseJSON)
  }
}
