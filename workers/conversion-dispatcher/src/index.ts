/**
 * Conversion Dispatcher for Hungry Tapir Store
 */
export interface Env {
  INBOUND: Queue<any>;
  ORDER_CREATION_API: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    let log = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers),
    };
    await env.INBOUND.send(log, { contentType: 'json' });
    return new Response('Success!');
  },

  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    let messages = JSON.stringify(batch.messages);
    console.log(`consumed from our queue: ${messages}`);
    for (let message of batch.messages) {
      await processOrderMessage(message);
    }
  },
};

async function processOrderMessage(order: any) {
  console.log(`processing order: ${JSON.stringify(order)}`);
  return fetch(process.env.ORDER_CREATION_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
}
