import type { AppLoadContext } from '@remix-run/cloudflare';
import { Buffer } from 'node:buffer';

const AUTH_FAIL_RESPONSE = {
  status: 401,
  statusText: 'Unauthorized',
  headers: {
    'Content-Type': 'application/json',
  },
};

function auth({ env: { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } }: AppLoadContext, { headers }: Request) {
  const passkey = Buffer.from(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`).toString('base64');
  return headers.get('Authorization') === `Basic ${passkey}`;
}

export { AUTH_FAIL_RESPONSE, auth };
