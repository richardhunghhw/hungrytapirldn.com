/**
 * Config store for Hungry Tapir Store
 */
export { OrderIdObject } from './objects/OrderIdObject';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      await validateRequest(request, env);
    } catch (error: Error) {
      if (env.NODE_ENV === 'PROD') {
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
  // Validate request method, Accept, Content-Type
  if (
    request.method !== 'POST' ||
    request.headers.get('Accept') !== 'application/json' ||
    request.headers.get('Content-Type') !== 'application/json'
  ) {
    throw new Error('Invalid request, mismatch method, Accept or Content-Type');
  }

  // Validate request body Token
  try {
    const body = await request.json();
    const token = body.token;
    const type = body.type;
    if (token !== env.TOKEN || type !== 'order') {
      return new Response('Unauthorized', { status: 401 });
    }
  } catch (error) {
    throw new Error('Invalid request body');
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
