import type { AppLoadContext } from '@remix-run/cloudflare';

export function isProd({ env: { NODE_ENV } }: AppLoadContext): boolean {
  return NODE_ENV === 'PROD';
}

export function isTest({ env: { NODE_ENV } }: AppLoadContext): boolean {
  return NODE_ENV === 'TEST';
}

export function isDev(context: AppLoadContext) {
  return !(isProd(context) || isTest(context));
}
