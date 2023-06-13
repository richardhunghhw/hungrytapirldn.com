export class OrderIdObject {
    state: DurableObjectState;
    env: Env;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.env = env;
    }

    // Handle HTTP requests from clients.
    async fetch(    
        request: Request
    ) {
        const HT_PREFIX = this.env.NODE_ENV === 'PROD' ? 'HT' : 'HTT';
        
        // Current date, YYMMDD => 230429 - This will break in year 2100 lol
        const date = new Date()
            .toISOString()
            .split('T')[0]
            .replaceAll('-', '')
            .slice(2);

        // Fetch exisiting sequence from DO
        const storedValue = await this.state.storage?.get('value') as string;

        // Make next sequence number part, 3 digits
        // TODO what if we exceed 999, for now we will just go directly to 1000
        let nextSeq;
        if (
            !storedValue ||
            storedValue.slice(HT_PREFIX.length, HT_PREFIX.length + 6) !== date
        ) {
            nextSeq = getRndInteger(2, 10);
        } else {
            nextSeq = parseInt(storedValue.slice(HT_PREFIX.length + 6)) + 1;
        }
        nextSeq = nextSeq.toString().padStart(3, '0');

        // Make value
        const result = HT_PREFIX + date + nextSeq;

        // Update DO and return response
        console.debug(`Generated Order ID: ${result}, DO value: ${storedValue}.`);
        await this.state.storage?.put('value', result);
        return new Response(JSON.stringify({ orderId: result }), {
            headers: { 'Content-Type': 'application/json' },
        });
    

        // Returns a random number between min (inclusive) and max (exclusive)
        function getRndInteger(min: number, max: number) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
    }
}

type Env = {
    readonly NODE_ENV: string;
}