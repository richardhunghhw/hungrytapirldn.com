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
    for (let message of batch.messages) {
      try {
        await processMessage(env, message);
        message.ack();
      } catch (e) {
        message.retry();
      }
    }
  },
};

async function processMessage(env: Env, order: any) {
  console.log(`Processing message: ${JSON.stringify(order)}`);

  // Validate message to be an order

  // Submit order to API
  await fetch(env.ORDER_CREATION_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
}
