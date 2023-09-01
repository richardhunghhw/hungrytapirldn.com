import { Buffer } from 'node:buffer';

export class ApiAuth {
  #passkey: string;
  responseOptions = {
    success: {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    fail: {
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  constructor(basicAuthUsername: string, basicAuthPassword: string) {
    this.#passkey = Buffer.from(`${basicAuthUsername}:${basicAuthPassword}`).toString('base64');
  }

  auth(headers: Headers) {
    return headers.get('Authorization') === `Basic ${this.#passkey}`;
  }
}
