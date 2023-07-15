const AUTH_FAIL_RESPONSE = {
  status: 401,
  statusText: 'Unauthorized',
  headers: {
    'Content-Type': 'application/json',
  },
};

function auth({ headers }: Request) {
  return headers.get('Authorization') === `Basic __basicCredentials__`;
}

export { AUTH_FAIL_RESPONSE, auth };
