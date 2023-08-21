import { Form } from '@remix-run/react';
import { useState } from 'react';
import { ShoppingBag, X } from '~/utils/svg/custom';
import { Button } from './ui/button';
import type { ContentStoreProductEntry } from '~/services/content-store';

const products: ContentStoreProductEntry[] = [
  {
    type: 'product',
    slug: 'the-pandan-kaya',
    metadata: {
      slug: 'the-pandan-kaya',
      title: 'The Pandan Kaya',
      tags: ['pandan', 'kaya', 'jam', 'coconut', 'malaysian', 'singaporean', 'breakfast', 'dessert'],
      category: '',
    },
    data: {
      stripeId: 'prod_Nk7ZiHSHFf24mL',
      id: 'the-pandan-kaya',
      unit: '6oz',
      price: 7,
      images: [
        { url: 'https://ik.imagekit.io/nixibbzora/hungrytapir/product/the-pandan-kaya-1.png', alt: 'The Pandan Kaya' },
      ],
      ingredients: ['pandan', 'kaya', 'jam', 'coconut', 'malaysian', 'singaporean', 'breakfast', 'dessert'].join(', '),
      product: ['product content'],
      productCart: ['product cart content'],
      productSection: ['product section content'],
      imageColour: 'ht-turquoise',
      backgroundColour: 'ht-orange-highlight',
      seoDescription: 'The Pandan Kaya',
    },
  },
];

function CartSidebar() {
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen((prev) => !prev);
  }

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
              <div className='flex h-full flex-col bg-ht-off-white px-8 py-16 md:px-12'>
                <div className='flex justify-between self-stretch'>
                  <div className='font-serif text-3xl font-bold uppercase text-gray-900'>Your Cart</div>
                  <button type='button' className='focus:outline-none' onClick={() => toggleCart()}>
                    <span className='sr-only'>Close mobile cart</span>
                    <X />
                  </button>
                </div>

                <div className='mt-12 flex-1 overflow-y-auto'>
                  <Form
                    reloadDocument // todo animate form pending state
                    id='order-form'
                    method='post'
                    action='/cart'
                  >
                    <ul className='-my-6 divide-y divide-gray-200'>
                      {products.map((product) => (
                        <li key={product.metadata.slug} className='flex py-6'>
                          <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md'>
                            <img
                              src={product.data.images[0].url}
                              alt={product.data.images[0].alt}
                              className='h-full w-full object-cover object-center'
                            />
                          </div>
                          <div className='ml-4 flex flex-1 flex-col'>
                            <div>
                              <div className='flex justify-between'>
                                <h3 className='font-serif text-base font-medium uppercase tracking-tight md:text-lg'>
                                  {product.metadata.title}
                                </h3>
                                <p className='ml-4 font-medium'>£{product.data.price}</p>
                              </div>
                              <p className='font-mono text-lg'>
                                Qty{' '}
                                <input
                                  type='number'
                                  id={product.metadata.slug}
                                  name={product.metadata.slug}
                                  className='border-none focus:border-none active:border-none'
                                  min='0'
                                  max='10'
                                  defaultValue='0'
                                />
                              </p>
                              <Button variant='link'>Remove</Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Form>
                </div>

                <div className='border-t border-ht-black py-2 font-mono font-light'>
                  <div className='flex justify-between text-3xl'>
                    <p>Subtotal</p>
                    <p>£16.00</p>
                  </div>
                  <p className='mt-2 text-xs'>Shipping and taxes calculated at checkout</p>
                  <Button type='submit' form='order-form' className='mt-6 w-full font-extralight uppercase' size='lg'>
                    Continue to checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

export { CartSidebar };
