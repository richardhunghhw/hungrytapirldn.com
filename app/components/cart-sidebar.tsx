import { Link, useFetcher } from '@remix-run/react';
import * as Sentry from '@sentry/remix';

import { Button } from './ui/button';
import { NumberInput } from './number-input';
import { ShoppingBag, X } from '~/utils/svg/custom';
import type { ContentStoreProductEntry } from '~/server/entities/content';
import type { CartItem } from '~/server/entities/cart';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet';

export type CartSidebarProps = {
  cart: CartItem[];
  products: ContentStoreProductEntry[];
};

function CartSidebar({ cart, products }: CartSidebarProps) {
  const fetcher = useFetcher();

  const postCartUpdate = async (action: 'update' | 'remove', slug: string, quantity: number) => {
    // Create a new FormData object
    const formData = new FormData();
    formData.append('action', action);
    formData.append('slug', slug);
    formData.append(`${slug}-quantity-input`, quantity.toString());

    // Send a POST request with the updated values
    fetcher.submit(formData, {
      method: 'post',
      action: '/',
    });
  };

  const onCartItemUpdate = async (slug: string, quantity: number) => {
    await postCartUpdate('update', slug, quantity);
  };

  const onCartItemRemove = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    slug: string,
    quantity: number,
  ) => {
    e.preventDefault();
    await postCartUpdate('remove', slug, quantity);
  };

  const subtotal = cart.reduce((acc, cartItem) => {
    const product = products.find((product) => product.slug === cartItem.slug); // TODO refine this
    if (!product) {
      Sentry.captureException(`CartItem not found in Products: ${cartItem.slug}`);
      return acc;
    }
    return acc + product.data.price * cartItem.quantity;
  }, 0.0);
  const subtotalFormatted = subtotal.toFixed(2);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button type='button'>
          <span className='sr-only'>Open cart sidebar</span>
          <ShoppingBag />
        </button>
      </SheetTrigger>

      <SheetContent side='right'>
        <div className='flex h-full flex-col bg-ht-orange-highlight px-8 py-16 md:px-12'>
          <div className='flex justify-between self-stretch'>
            <div className='font-serif text-3xl font-bold uppercase text-gray-900'>Your Cart</div>
            <SheetClose asChild>
              <button type='button'>
                <span className='sr-only'>Close mobile cart</span>
                <X />
              </button>
            </SheetClose>
          </div>

          {cart.length === 0 ? (
            <div className='mt-12 flex flex-1 flex-col justify-center'>
              <p className='title text-2xl'>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className='mt-12 flex-1 divide-y divide-gray-200 overflow-y-auto'>
                <ul className=''>
                  {cart.map((cartItem) => {
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
                        <div className='ml-4 flex flex-1 flex-col items-start space-y-2'>
                          <div className='flex justify-between'>
                            <h3 className='font-serif text-xl font-medium uppercase tracking-tight md:text-2xl'>
                              {product.metadata.title}
                            </h3>
                            <p className='ml-4 font-medium'>£{product.data.price}</p>
                          </div>
                          <NumberInput
                            slug={product.slug}
                            position='sidebar'
                            initValue={cartItem.quantity}
                            // disabled={cartUpdating}
                            onUpdate={onCartItemUpdate}
                          />
                          <Button variant='link' onClick={(e) => onCartItemRemove(e, cartItem.slug, cartItem.quantity)}>
                            Remove
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className='border-t border-ht-black py-2 font-mono font-light'>
                <div className='flex justify-between text-3xl'>
                  <p>Subtotal</p>
                  <p>£{subtotalFormatted}</p>
                </div>
                <p className='mt-2 text-xs'>Shipping and taxes calculated at checkout</p>
                <SheetClose asChild>
                  <Button className='mt-6 w-full font-extralight uppercase' asChild>
                    <Link to='/cart'>Continue to checkout</Link>
                  </Button>
                </SheetClose>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { CartSidebar };
