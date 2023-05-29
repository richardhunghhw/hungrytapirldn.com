import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

/**
 * Lambda handler for the Customer Checkout Process.
 * Define environment variables:
 * - DYNAMODB_TABLE_NAME: DynamoDB table name
 * - ENV: Environment (DEV, TEST, PROD)
 */

const IS_PROD = process.env.ENV === 'PROD';
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

// Validate request format
const validateRequest = (headers, requestContext) => {
	if (
		headers['content-type'] !== 'application/json; charset=utf-8' ||
		// !!!headers['stripe-signature'] ||
		requestContext['http']['method'] !== 'POST'
	) {
		if (!IS_PROD) {
			throw new Error(
				`Invalid request. Content-Type: ${headers['content-type']}, Stripe-Signature: ${headers['stripe-signature']}, Method: ${requestContext['http']['method']}.`,
			);
		}
		throw new Error('Invalid request.');
	}
};

// Setup DynamoDB client
const setupDynamoDBClient = () => {
	const ddbClient = new DynamoDBClient({ region: 'eu-west-2' });
	return DynamoDBDocumentClient.from(ddbClient, {
		marshallOptions: { convertEmptyValues: true },
	});
};

// Get customer record or prepare to create it if it doesn't exist
const getOrCreateCustomer = async (ddbDocClient, requestBody) => {
	// Check if customer exists
	let customer = null;
	if (!!requestBody.customer_id) {
		customer = await ddbDocClient.send(
			new GetCommand({
				TableName: DYNAMODB_TABLE_NAME,
				Key: {
					PK: 'CUS#' + requestBody.customerId,
					SK: 'CUS#' + requestBody.customerId,
				},
			}),
		);
	}
	console.debug(`Customer: ${JSON.stringify(customer)}`);

	// If customer doesn't exist, create reqeuest items for batch write to create it
	let requestItems = null;
	if (!!!requestBody.customer_id || !customer.Item) {
		requestItems = [];

		// Create Customer record
		requestItems.push({
			PK: 'CUS#' + requestBody.customer_id,
			SK: 'CUS#' + requestBody.customer_id,
			CreatedDT: requestBody.created,
			UpdatedDT: requestBody.created,
			FirstName: requestBody.first_name,
			LastName: requestBody.last_name,
			Email: requestBody.email,
			Phone: requestBody.phone,
		});

		// Create CustomerAddress record
		requestItems.push({
			PK: 'CUS#' + requestBody.customer_id,
			SK: 'CUS#' + requestBody.customer_id + '#ADR#' + requestBody.shipping_address.id,
			CreatedDT: requestBody.created,
			UpdatedDT: requestBody.created,
			Id: requestBody.shipping_address.id,
			FirstName: requestBody.shipping_address.first_name,
			LastName: requestBody.shipping_address.last_name,
			Line1: requestBody.shipping_address.line1,
			Line2: requestBody.shipping_address.line2,
			City: requestBody.shipping_address.city,
			County: requestBody.shipping_address.county,
			Postcode: requestBody.shipping_address.postcode,
		});
	}

	// Return customer record and request items
	return { customer: customer.Item, requestItems: requestItems };
};

export const handler = async function (event, context, callback) {
	console.debug(
		'Entered Customer Checkout Lambda handler. IS_PROD ' + IS_PROD + ' Event: ' + JSON.stringify(event) + '.',
	);

	// Retrieve request parameters
	var headers = event.headers;
	var requestContext = event.requestContext;
	var body = event.body;

	// Output variables to logs for debugging
	console.debug('Headers: ' + JSON.stringify(headers));
	console.debug('Request Context: ' + JSON.stringify(requestContext));
	console.debug('Body: ' + JSON.stringify(body));

	try {
		validateRequest(headers, requestContext, body);
	} catch (error) {
		console.error(`Request format validation failure, ${error.message}.`, error.stack);
		callback(error);
	}

	// **At this point we should be able to assume the request is from Frontend**

	// Parse the request body
	const requestBody = JSON.parse(body);

	// Setup DynamoDB client
	const ddbDocClient = setupDynamoDBClient();
	const requestItems = [];

	// Check if customer exists
	// const { customer, requestItems: customerRequestItems } = await getCustomer(ddbDocClient, requestBody.customer_id);

	// Create Order record
	requestItems.push({
		PK: 'ORD#' + requestBody.order_id,
		SK: 'ORD#' + requestBody.order_id,
		CreatedDT: requestBody.created,
		UpdatedDT: requestBody.created,
		Status: 'open',
		PaymentStatus: 'pending',
		FulfillmentStatus: 'unfulfilled',
		ReturnStatus: '',
		Id: requestBody.order_id,
		OrderCosts: requestBody.order_costs,
		ShippingOption: requestBody.shipping_option,
		ShippingAddress: requestBody.shipping_address,
		PaymentChannel: requestBody.payment_channel,
	});

	// Create OrderLineItems records
	requestBody.order_line_items.forEach((orderLineItem) => {
		requestItems.push({
			PK: 'ORD#' + requestBody.order_id,
			SK: 'ORD#' + requestBody.order_id + '#LIT#' + orderLineItem.id,
			CreatedDT: requestBody.created,
			UpdatedDT: requestBody.created,
			Id: requestBody.order_id,
			ItemId: orderLineItem.id,
			StripeId: orderLineItem.stripe_id,
			ItemPrice: orderLineItem.price,
			ItemQuantity: orderLineItem.quantity,
		});
	});

	// Create OrderPayment record
	const paymentChannel = requestBody.payment_channel;
	switch (paymentChannel) {
		case 'bank_transfer':
			requestItems.push({
				PK: 'ORD#' + requestBody.order_id,
				SK: 'ORD#' + requestBody.order_id + '#PAY#' + requestBody.customer_id,
				CreatedDT: requestBody.created,
				UpdatedDT: requestBody.created,
				Id: requestBody.order_id,
				PaymentItemStatus: 'pending',
				PaymentChannel: 'bank_transfer',
			});
			break;
		case 'stripe':
			requestItems.push({
				PK: 'ORD#' + requestBody.order_id,
				SK: 'ORD#' + requestBody.order_id + '#PAY#' + requestBody.customer_id,
				CreatedDT: requestBody.created,
				UpdatedDT: requestBody.created,
				Id: requestBody.order_id,
				PaymentItemStatus: 'pending',
				PaymentChannel: 'stripe',
				StripeSession: requestBody?.stripe_session ? requestBody.stripe_session : '',
			});
			break;
		default:
			throw new Error(`Invalid payment channel: ${paymentChannel}.`);
	}

	// Create DynamoDB request parameters
	const params = {
		RequestItems: {
			[DYNAMODB_TABLE_NAME]: requestItems.map((item) => ({
				PutRequest: {
					Item: item,
				},
			})),
		},
	};
	console.debug(`DynamoDB request parameters: ${JSON.stringify(params)}`);

	// Write the records to DynamoDB
	let retryCount = 0;
	let putSucceeded = false;
	while (!putSucceeded && retryCount < 3) {
		try {
			await ddbDocClient.send(new BatchWriteCommand(params));
			console.log('Successfully put batch of items.');
			putSucceeded = true;
		} catch (error) {
			console.error('Failed to put batch of items:', error);
			if (error.name === 'TransactionCanceledException') {
				const failedItems = requestItems.filter(
					(_, index) => error.cancellationReasons[index].Code === 'ConditionalCheckFailed',
				);
				console.log('Failed items:', failedItems);
			}

			retryCount++;
			console.log(`Retrying put operation (${retryCount})...`);
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
		}
	}

	// Return response
	if (putSucceeded) {
		callback(null, {
			statusCode: 200,
			body: 'Success',
		});
	} else {
		callback(new Error('Failed insert into conversion store.'));
	}
};
