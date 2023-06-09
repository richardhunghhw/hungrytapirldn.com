import { HTAppLoadContext } from './types';

export function isProd(context: HTAppLoadContext): boolean {
    return context.NODE_ENV === 'PROD';
}

export function isTest(context: HTAppLoadContext): boolean {
    return context.NODE_ENV === 'TEST';
}

export function isDev(context: HTAppLoadContext) {
    return !(isProd(context) || isTest(context));
}
