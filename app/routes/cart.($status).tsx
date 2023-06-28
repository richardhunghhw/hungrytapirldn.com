import type { LoaderArgs } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import type { V2_MetaFunction } from '@remix-run/react';
import { Form, Link, useLoaderData } from '@remix-run/react';
import type { Stripe } from 'stripe';

import { getStripe } from '~/services/stripe';
import type { HTActionArgs } from '~/utils/types';

export const meta: V2_MetaFunction = () => {
    return [{ title: 'Hungry Tapir | Order Kaya' }];
};

type Product = {
    id: string;
    stripe_id: string;
    form_id: string;
    name: string;
    shortDescription: string;
    price: string;
    imageSrc: string;
    imageAlt: string;
};

const db_products: Product[] = [
    {
        id: 'kaya-signature',
        stripe_id: 'prod_Nk7ZiHSHFf24mL',
        form_id: 'kaya-signature-quantity',
        name: 'Signature Kaya Jam 6oz',
        shortDescription:
            'Coconut Milk, Gula Melaka, Rock Sugar, Pandan Leaves, Eggs, Salt.',
        price: '7.00',
        imageSrc: 'kayaImage1',
        imageAlt: 'Signature Kaya Jar',
    },
    {
        id: 'kaya-vegan',
        stripe_id: 'prod_Nk8T1CWRimuaIF',
        form_id: 'kaya-vegan-quantity',
        name: 'Vegan Kaya Jam 6oz',
        shortDescription:
            'Coconut Milk, Gula Melaka, Rock Sugar, Pandan Leaves, Tofu, Salt.',
        price: '7.00',
        imageSrc: 'kayaImage2',
        imageAlt: 'Vegan Kaya Jar',
    },
];

// Supply product data
export async function loader({ params }: LoaderArgs) {
    if (params?.status) {
        console.log(params.status);
    }
    return json(db_products);
}

// Handle form POST request
export async function action({ request, context }: HTActionArgs) {
    const formData = await request.formData();

    // todo: validate form data

    // Create checkout items
    const checkoutLineItems = [
        {
            price: 'price_1MydK6LNU8oiV5Be0omfpEG3',
            quantity: Number(formData.get('kaya-signature-quantity')),
        },
        {
            price: 'price_1MyeCKLNU8oiV5BealclK5xS',
            quantity: Number(formData.get('kaya-vegan-quantity')),
        },
    ].filter((lineItem) => lineItem.quantity > 0);

    // Validate checkout items
    if (checkoutLineItems.length === 0) {
        return redirect('/cart');
    }

    // **Post this point, we know we have a valid order**

    // Get a unique order ID from worker
    let orderId: string | undefined = undefined;
    try {
        const response = await context.CONFIGSTORE_WORKER.fetch(
            request.clone()
        );
        if (response.status !== 200) {
            throw new Error(
                `Failed to fetch order ID from worker. Status: ${response.status}`
            );
        }
        const responseBody: { orderId: string } = await response.json();
        orderId = responseBody.orderId;
        console.debug(`Fetched order ID from worker: ${orderId}`);
    } catch (error) {
        // TODO Sentry
        console.error(
            `Failed to fetch order ID from worker, proceeding without an order ID: ${error}`
        );
    }

    // Create checkout session
    console.log(`Creating checkout session for order ID: ${orderId}`);
    const stripe = getStripe(context);
    const checkoutSession: Stripe.Response<Stripe.Checkout.Session> =
        await stripe.checkout.sessions.create({
            line_items: checkoutLineItems,
            mode: 'payment',
            success_url: `http://localhost:8788/order/success?session_id={CHECKOUT_SESSION_ID}",`,
            cancel_url: `http://localhost:8788/cart/cancelled`,
            client_reference_id: orderId!,
        });
    console.log(`checkoutSession: ${JSON.stringify(checkoutSession)}`);
    if (!checkoutSession?.url)
        throw new Error('Unable to create Stripe Checkout Session.');
    const checkoutUrl = checkoutSession.url;
    return redirect(checkoutUrl);
}

export default function Cart() {
    const products = useLoaderData<typeof loader>();
    return (
        <div className="fixed inset-0 overflow-hidden">
            <div className="h-full max-w-screen-lg sm:mx-12 md:mx-24 lg:mx-48 xl:mx-auto">
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                    <div className="flex justify-center px-4 pt-6">
                        <Link to="/" className="text-lg font-medium">
                            Hungry Tapir
                        </Link>
                    </div>

                    <div className="flex justify-between px-4 py-6">
                        <div className="text-lg font-medium text-gray-900">
                            Order Form
                        </div>
                        <div className="ml-3 flex h-7 items-center">
                            <Link
                                to="/"
                                className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Back</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-6">
                        <Form
                            reloadDocument // todo animate form pending state
                            id="order-form"
                            method="post"
                            action="/cart"
                        >
                            <ul
                                role="list"
                                className="-my-6 divide-y divide-gray-200"
                            >
                                {products.map((product) => (
                                    <li key={product.id} className="flex py-6">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                src={product.imageSrc}
                                                alt={product.imageAlt}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>{product.name}</h3>
                                                    <p className="ml-4">
                                                        {product.price}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {product.shortDescription}
                                                </p>
                                                <p className="text-gray-500">
                                                    Qty{' '}
                                                    <input
                                                        type="number"
                                                        id={product.form_id}
                                                        name={product.form_id}
                                                        className="border-none focus:border-none active:border-none"
                                                        min="0"
                                                        max="10"
                                                        defaultValue="0"
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Form>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6">
                        <div className="flex justify-between font-medium text-gray-900">
                            <p>Subtotal</p>
                            <p>£16.00</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                            <input
                                type="submit"
                                form="order-form"
                                className="w-full rounded-md border border-transparent bg-lime-900 px-6 py-3 font-medium text-white shadow-md hover:cursor-pointer hover:bg-lime-950"
                                value="Checkout"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
