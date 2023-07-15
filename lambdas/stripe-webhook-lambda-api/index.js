import Stripe from 'stripe';
import AWS from 'aws-sdk';

/**
 * Lambda function to handle Stripe Webhook events.
 * See https://stripe.com/docs/webhooks for more information.
 * Define environment variables:
 * - STRIPE_SECRET_KEY: Stripe secret key.
 * - STRIPE_ENDPOINT_SECRET_KEY: Stripe endpoint secret key.
 * - STEP_FUNCTION_ARN: Step function ARN.
 * - ENV: Environment (DEV, TEST, PROD)
 */

const STRIPE_WEBHOOK_NOTIFICATION_IPS = [
  '3.18.12.63',
  '3.130.192.231',
  '13.235.14.237',
  '13.235.122.149',
  '18.211.135.69',
  '35.154.171.200',
  '52.15.183.38',
  '54.88.130.119',
  '54.88.130.237',
  '54.187.174.169',
  '54.187.205.235',
  '54.187.216.72',
];

const STRIPE_VALID_EVENT_TYPES = ['checkout.session.completed'];

const IS_PROD = process.env.ENV === 'PROD';

export const handler = function (event, context, callback) {
  console.debug('Entered Stripe Webhook lambda handler. IS_PROD ' + IS_PROD + ' Event: ' + JSON.stringify(event) + '.');

  // Retrieve request parameters
  var headers = event.headers;
  var requestContext = event.requestContext;
  var body = event.body;

  // Output variables to logs
  console.debug('Headers: ' + JSON.stringify(headers));
  console.debug('Request Context: ' + JSON.stringify(requestContext));
  console.debug('Body: ' + JSON.stringify(body));

  // Validate request format
  try {
    if (
      headers['content-type'] !== 'application/json; charset=utf-8' ||
      !!!headers['stripe-signature'] ||
      requestContext['http']['method'] !== 'POST'
    ) {
      if (!IS_PROD) {
        throw new Error(
          `Invalid request. Content-Type: ${headers['content-type']}, Stripe-Signature: ${headers['stripe-signature']}, Method: ${requestContext['http']['method']}.`,
        );
      }
      throw new Error('Invalid request.');
    }
    if (!IS_PROD && STRIPE_WEBHOOK_NOTIFICATION_IPS.includes[requestContext['http']['sourceIp']]) {
      throw new Error('Invalid request.');
    }
  } catch (error) {
    console.error(`Request format validation failure, ${error.message}.`, error.stack);
    callback(error);
  }

  // Setup Stripe
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Missing STRIPE_SECRET_KEY.');
  if (!process.env.STRIPE_ENDPOINT_SECRET_KEY) throw new Error('Missing STRIPE_ENDPOINT_SECRET_KEY.');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
    typescript: true,
  });

  // Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks/signatures for more information.
  // See also https://stripe.com/docs/api/checkout/sessions for object definition.
  let parsedEvent;
  try {
    parsedEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_ENDPOINT_SECRET_KEY,
    );
    if (STRIPE_VALID_EVENT_TYPES.includes(parsedEvent.type) === false) {
      throw new Error(`Invalid event type, ${parsedEvent.type}.`);
    }
  } catch (error) {
    console.error(`Stripe Webhook validation failure, ${error.message}.`, error.stack);
    callback(error);
  }
  console.debug(`Successfully validated request event, ${JSON.stringify(parsedEvent)}.`);

  // **At this point we should be able to assume the request is from Stripe**

  // Invoke Step Functions
  const stepfunctions = new AWS.StepFunctions();
  stepfunctions.startExecution(
    {
      stateMachineArn: process.env.STEP_FUNCTION_ARN,
      input: JSON.stringify(parsedEvent),
    },
    function (error, data) {
      if (error) {
        console.error(`Step function StartExecution error: ${error.message}`, error.stack);
        callback(error);
      } else {
        console.info(`Step function StartExecution success at: ${data.startDate}, arn: ${data.executionArn}.`);
        callback(null, {
          statusCode: 200,
          body: data,
        });
      }
    },
  );
};
