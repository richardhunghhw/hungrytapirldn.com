import { redirect, type ActionArgs, type LoaderArgs } from '@remix-run/cloudflare';
import { useMatches, useSubmit } from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import { zodResolver } from '@hookform/resolvers/zod';

import { TapirTransparent } from '~/utils/svg/tapir';
import type { CartItem } from '~/server/entities/cart';
import type { ContentStoreProductEntry } from '~/server/entities/content';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { type UseFormReturn, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '~/components/ui/button';

export async function loader({ context }: LoaderArgs) {
  return null;
}

export async function action({
  request,
  context: {
    env: { HOST_URL, CONFIGSTORE_WORKER },
    services: { stripe },
  },
}: ActionArgs) {
  // Handle Add To Bag action
  const formData = await request.formData();

  // Validate form data TODO

  // Extract slug and quantity from form data
  console.log(formData);
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}, ${pair[1]}`);
  }

  // **Post this point, we know we have a valid order**

  // Get a unique order ID from worker
  let orderId: string | undefined = undefined;
  try {
    const response = await CONFIGSTORE_WORKER.fetch(request.clone());
    if (response.status !== 200) {
      throw new Error(`Failed to fetch order ID from worker. Status: ${response.status}`);
    }
    const responseBody: { orderId: string } = await response.json();
    orderId = responseBody.orderId;
    console.debug(`Fetched order ID from worker: ${orderId}`);
  } catch (error) {
    // TODO Sentry
    console.error(`Failed to fetch order ID from worker, proceeding without an order ID: ${error}`);
  }

  // Create checkout session
  console.log(`Creating checkout session for order ID: ${orderId}`);
  const checkoutSession = await stripe.createCheckoutSession(orderId);
  console.log(`checkoutSession: ${JSON.stringify(checkoutSession)}`);
  if (!checkoutSession?.url) throw new Error('Unable to create Stripe Checkout Session.'); // TODO handle this better
  const checkoutUrl = checkoutSession.url;
  return redirect(checkoutUrl);
}

const CartInformation = ({ products, cart }: { products: ContentStoreProductEntry[]; cart: CartItem[] }) => {
  return (
    <Form className=''>
      <ul className='-my-6 divide-y divide-gray-200'>
        {!cart || cart.length === 0 ? (
          <div className='mt-12 flex flex-1 flex-col justify-center'>
            <p className='title'>Your cart is empty</p>
          </div>
        ) : (
          cart.map((cartItem) => {
            // TODO optimise this
            const product = products.find((product) => product.slug === cartItem.slug);

            if (!product) {
              Sentry.captureException(`CartItem not found in Products: ${cartItem.slug}`);
              return null;
            }

            return (
              <li key={product.metadata.slug} className='flex py-6'>
                <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md'>
                  <img
                    src={product.data.images[0].url}
                    alt={product.data.images[0].alt}
                    className='h-full w-full object-cover object-center'
                  />
                </div>
                <div className='ml-4 flex flex-1 flex-col'>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <h3 className='font-serif text-base font-medium uppercase tracking-tight md:text-lg'>
                        {product.metadata.title}
                      </h3>
                      <p className='ml-4 font-medium'>£{product.data.price}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </Form>
  );
};

type ShippingOption = {
  id: string;
  label: string;
  description: string;
  price: number;
};

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    description: 'Shipped in batched, every Thursday, 3-5 working days',
    price: 3.0,
  },
  {
    id: 'stall',
    label: 'Stall Collection',
    description: 'Collect from our weekly stalls around London',
    price: 0.0,
  },
];

interface ShippingOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  form: FormReturn;
}

const ShippingOption = ({ form }: ShippingOptionProps) => {
  return (
    <div className='mt-4 rounded border p-4'>
      <h2 className='mb-4 text-xl'>Delivery</h2>
      <RadioGroup></RadioGroup>
      <FormField
        control={form.control}
        name='shipping_option'
        render={({ field }) => (
          <FormItem className='space-y-3'>
            <FormLabel>Shipping option...</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                {SHIPPING_OPTIONS.map((option) => (
                  <FormItem key={option.label}>
                    <FormControl>
                      <RadioGroupItem key={option.label} value={option.id} />
                    </FormControl>
                    <FormLabel>
                      <div className='flex justify-between'>
                        <div>{option.label}</div>
                        <div>{option.description}</div>
                        <div className='font-bold'>£{option.price}</div>
                      </div>
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {form.watch('shipping_option') === 'stall' && (
        <div className='mt-4'>
          <h2 className='mb-4 text-xl'>Stall Collection Date</h2>
        </div>
      )}
    </div>
  );
};

type PaymentOption = {
  id: string;
  label: string;
  description: string;
  price: number;
};

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'card',
    label: 'Card',
    description: 'Pay with your card',
    price: 0.0,
  },
  {
    id: 'bank-transfer',
    label: 'Bank Transfer',
    description: 'Pay with bank transfer',
    price: -0.2,
  },
];

interface PaymentOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  form: FormReturn;
}

const PaymentOption = ({ form }: PaymentOptionProps) => {
  return (
    <div className='mt-4 rounded border p-4'>
      <h2 className='mb-4 text-xl'>Shipping</h2>
      <RadioGroup></RadioGroup>
      <FormField
        control={form.control}
        name='payment_method'
        render={({ field }) => (
          <FormItem className='space-y-3'>
            <FormLabel>Payment option...</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col space-y-1'>
                {PAYMENT_OPTIONS.map((option) => (
                  <FormItem key={option.label}>
                    <FormControl>
                      <RadioGroupItem key={option.label} value={option.id} />
                    </FormControl>
                    <FormLabel>
                      <div className='flex justify-between'>
                        <div>{option.label}</div>
                        <div>{option.description}</div>
                        <div className='font-bold'>£{option.price}</div>
                      </div>
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const FormSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    shipping_option: z
      .enum(['standard', 'stall'], {
        required_error: 'Please select a shipping method .',
      })
      .default('standard'),
    stall_collection_date: z.string().optional(),
    payment_method: z
      .enum(['bank-transfer', 'card'], {
        required_error: 'Please select a payment method.',
      })
      .default('card'),
  })
  .superRefine((data, ctx) => {
    if (data.shipping_option === 'stall') {
      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter your email address.',
          path: ['email'],
        });
      }
      if (!data.stall_collection_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select a stall collection date.',
          path: ['stall_collection_date'],
        });
      }
    }
  });

type FormValues = z.infer<typeof FormSchema>;

type FormReturn = UseFormReturn<FormValues>;

export default function Cart() {
  const submit = useSubmit();
  const matches = useMatches();
  const rootLoaderData = matches.find((match) => match.id === 'root')?.data;

  const cart = rootLoaderData.cart as CartItem[];
  const products = rootLoaderData.products as ContentStoreProductEntry[];

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  function onValidSubmit(data: FormValues, event?: React.BaseSyntheticEvent) {
    console.log(data);
    console.log(event);
    submit(data, {
      method: 'post',
    });
  }

  return (
    <main className='flex min-h-screen flex-col'>
      <header className='content-wrapper bg-ht-orange'>
        <div className='content-container'>
          <div className='title-section flex flex-col'>
            <h1 className='title text-center'>Your Cart</h1>
          </div>
        </div>
      </header>
      <article className='content-wrapper body-text-wrapper'>
        <div className='content-container mt-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onValidSubmit)}>
              <CartInformation products={products} cart={cart} />
              <ShippingOption form={form} />
              <PaymentOption form={form} />
              <Button type='submit' className='mt-6 w-full font-extralight uppercase'>
                Check out
              </Button>
            </form>
          </Form>
        </div>
      </article>
    </main>
  );
}
