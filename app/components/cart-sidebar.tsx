import { useState } from 'react';
import { Link, useFetcher } from '@remix-run/react';
import * as Sentry from '@sentry/remix';

import { Button } from './ui/button';
import { NumberInput } from './number-input';
import { ShoppingBag, X } from '~/utils/svg/custom';
import type { ContentStoreProductEntry } from '~/server/entities/content';
import type { CartItem } from '~/server/entities/cart';

export type CartSidebarProps = {
  cart: CartItem[];
  products: ContentStoreProductEntry[];
};

function CartSidebar({ cart, products }: CartSidebarProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const fetcher = useFetcher();

  const toggleCart = () => {
    setCartOpen((prev) => !prev);
  };

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
    <>
      <button
        type='button'
        className='text-xl focus:outline-none focus:ring-2 focus:ring-white md:text-2xl'
        onClick={() => toggleCart()}
      >
        <span className='sr-only'>Open cart sidebar</span>
        <ShoppingBag />
      </button>

      <dialog className='z-20' onClose={toggleCart} open={cartOpen} aria-modal='true'>
        <div
          className={
            'fixed inset-0 h-full w-full bg-gray-900 bg-opacity-75 transition-opacity duration-500 ease-out ' + cartOpen
              ? 'opacity-100'
              : 'opacity-0'
          }
          onClick={() => toggleCart()}
        />

        <div className='fixed inset-0 overflow-hidden'>
          <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-8'>
            <div className='pointer-events-auto relative w-screen max-w-md'>
              <div className='flex h-full flex-col bg-ht-orange-highlight px-8 py-16 md:px-12'>
                <div className='flex justify-between self-stretch'>
                  <div className='font-serif text-3xl font-bold uppercase text-gray-900'>Your Cart</div>
                  <button type='button' className='focus:outline-none' onClick={() => toggleCart()}>
                    <span className='sr-only'>Close mobile cart</span>
                    <X />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className='mt-12 flex flex-1 flex-col justify-center'>
                    <p className='title'>Your cart is empty</p>
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
                                  <h3 className='font-serif text-base font-medium uppercase tracking-tight md:text-lg'>
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
                                <Button
                                  variant='link'
                                  onClick={(e) => onCartItemRemove(e, cartItem.slug, cartItem.quantity)}
                                >
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
                      <Button className='mt-6 w-full font-extralight uppercase' asChild>
                        <Link to='/cart' onClick={() => toggleCart()}>
                          Continue to checkout
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

export { CartSidebar };
