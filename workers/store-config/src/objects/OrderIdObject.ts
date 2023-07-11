export class OrderIdObject {
    state: DurableObjectState;
    env: Env;
    static readonly sequenceLength: number = 1e3;
    static readonly hashLength: number = 10;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.env = env;
    }

    // Asynchronously hashes an input string via SHA-256.
    private async hash(message: string): Promise<string> {
        const data = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((byte) => byte.toString(16))
            .join('')
            .toUpperCase();
        return hashHex;
    }

    // NB: this will not work if there are >= 1e3 requests on the same exact ms.
    // Atomically returns and increments the unique counter stored in DO.
    private async sequence() {
        let val;
        await this.state.storage.transaction(async (txn) => {
            val = await txn.get('counter');
            val =
                val === undefined || val === OrderIdObject.sequenceLength
                    ? 0
                    : val;
            await txn.put('counter', val + 1);
        });
        return val;
    }

    // Handle HTTP requests from clients.
    async fetch(request: Request) {
        const HT_PREFIX = this.env.NODE_ENV === 'PROD' ? 'HT' : 'HTT';

        // Atomically generate and put the unique identifier.
        // Padding is log10(sequenceLength). Implicit assumption sequenceLength is power of 10.
        const nextSeq = await this.sequence();
        const nextSeqPadded = nextSeq
            .toString()
            .padStart(Math.log10(OrderIdObject.sequenceLength), '0');

        // Make value.
        const result = new Date().toISOString() + nextSeqPadded;

        // Obfusciate with hash, chance of collision is 16^hashLength.
        const hashedResult =
            HT_PREFIX +
            (await this.hash(result)).slice(0, OrderIdObject.hashLength);

        // Return response.
        console.debug(
            `Generated Order ID: ${hashedResult}, DO value: ${nextSeq}.`
        );
        return new Response(JSON.stringify({ orderId: hashedResult }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

type Env = {
    readonly NODE_ENV: string;
};
