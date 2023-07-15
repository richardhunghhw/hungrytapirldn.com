import type { HTAppLoadContext } from './types';

export function isProd({ NODE_ENV }: HTAppLoadContext): boolean {
  return NODE_ENV === 'PROD';
}

export function isTest({ NODE_ENV }: HTAppLoadContext): boolean {
  return NODE_ENV === 'TEST';
}

export function isDev(context: HTAppLoadContext) {
  return !(isProd(context) || isTest(context));
}
