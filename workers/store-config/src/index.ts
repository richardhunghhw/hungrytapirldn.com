/**
 * Config store for Hungry Tapir Store
 */
import { Buffer } from 'node:buffer';

export { OrderIdObject } from './objects/OrderIdObject';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      await validateRequest(request, env);
    } catch (error: Error) {
      console.error('err', error);
      if (env.NODE_ENV !== 'PROD') {
        return new Response(error.message, { status: 400 });
      } else {
        return new Response('Invalid request', { status: 400 });
      }
    }

    const url = new URL(request.url);
    switch (url.pathname) {
      case '/orderId':
        return await handleOrderIdRequest(request, env);
      default:
        return new Response('Not found', { status: 404 });
    }
  },
};

async function validateRequest(request: Request, env: Env) {
  // Validate request method
  if (request.method !== 'POST') {
    throw new Error('Invalid request');
  }

  // Validate request Token
  const passkey = Buffer.from(`${env.BASIC_AUTH_USERNAME}:${env.BASIC_AUTH_PASSWORD}`).toString('base64');
  if (request.headers.get('Authorization') !== `Basic ${passkey}`) {
    throw new Error('Unauthorized');
  }
}

// Generate a unique order ID for each order based on date and a sequence number
async function handleOrderIdRequest(request: Request, env: Env): Promise<Response> {
  const id = env.DO_ORDERID.idFromName('OrderId');
  const orderId = await env.DO_ORDERID.get(id);

  return await orderId.fetch(request, env);
}

type Env = {
  readonly NODE_ENV: string;
  DO_ORDERID: DurableObjectNamespace;
};
