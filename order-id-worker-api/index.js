/* 
Cloudflare Worker to generate a unique order ID for each order
*/

export default {
	async fetch(request, env) {
		return await handleRequest(request, env);
	},
};

// Generate a unique order ID for each order based on date and a sequence number
async function handleRequest(request, env) {
	// Validate request method, Accept, Content-Type
	if (
		request.method !== 'POST' ||
		request.headers.get('Accept') !== 'application/json' ||
		request.headers.get('Content-Type') !== 'application/json'
	) {
		return new Response('Invalid request', { status: 405 });
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
		return new Response('Invalid request', { status: 406 });
	}

	// Setup
	const KV = env[env.KV];
	const HT_PREFIX = env.ENV === 'PROD' ? 'HT' : 'HTT';

	// Current date, YYMMDD => 230429 - This will break in year 2100 lol
	const date = new Date().toISOString().split('T')[0].replaceAll('-', '').slice(2);

	// Fetch exisiting sequence from KV
	const kvValue = await KV.get(env.KV_SEQ_ORDERID);

	// Make next sequence number part, 3 digits
	// TODO what if we exceed 999, for now we will just go directly to 1000
	let nextSeq;
	if (kvValue === null || kvValue.slice(HT_PREFIX.length, HT_PREFIX.length + 6) !== date) {
		nextSeq = getRndInteger(2, 10);
	} else {
		nextSeq = parseInt(kvValue.slice(HT_PREFIX.length + 6)) + 1;
	}
	nextSeq = nextSeq.toString().padStart(3, '0');

	// Make value
	const result = HT_PREFIX + date + nextSeq;

	// Update KV and return response
	console.debug(`Generated Order ID: ${result}, KV value: ${kvValue}.`);
	try {
		await KV.put(env.KV_SEQ_ORDERID, result);
	} catch (error) {
		return new Response(error, { status: 500 });
	}
	return new Response(JSON.stringify({ orderId: result }), {
		headers: { 'Content-Type': 'application/json' },
	});
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
