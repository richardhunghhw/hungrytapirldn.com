import { Form, Link, useLocation } from '@remix-run/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { ShoppingBag, X } from '~/utils/svg/custom';
import { Button } from './ui/button';

const NAVBAR_LINKS = [
  [
    { name: 'Pandan', to: '/product/the-pandan-kaya' },
    { name: 'Vegan', to: '/product/the-vegan-kaya' },
  ],
  { name: 'Our Story', to: '/about-us' },
  { name: 'Find Us', to: '/contact-us' },
];

function NavLink({
  to,
  children,
  ...rest
}: Omit<Parameters<typeof Link>['0'], 'to'> & {
  to: string;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const isSelected = to === location.pathname || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      prefetch='intent'
      className='whitespace-nowrap hover:text-primary focus:text-primary focus:outline-none'
      to={to}
      {...rest}
    >
      {children}
    </Link>
  );
}

function NavSidebar() {
  const [navOpen, setNavOpen] = useState(false);

  function toggleNav() {
    console.log('toggleNav' + navOpen);
    setNavOpen((prev) => !prev);
  }

  return (
    <>
      <button
        type='button'
        className='text-xl focus:outline-none focus:ring-2 focus:ring-white md:text-3xl lg:hidden'
        onClick={() => toggleNav()}
      >
        <span className='sr-only'>Open mobile nav</span>
        <Menu />
      </button>
      <dialog className={'z-10'} onClose={toggleNav} open={navOpen} aria-modal='true'>
        {/* <!--
    Background backdrop, show/hide based on slide-over state.

    Entering: "ease-in-out duration-500"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in-out duration-500"
      From: "opacity-100"
      To: "opacity-0"
  --> */}
        <div
          className={
            'fixed inset-0 h-full w-full bg-gray-900 bg-opacity-75 transition-opacity duration-500 ease-out ' + navOpen
              ? 'opacity-100'
              : 'opacity-0'
          }
          onClick={() => toggleNav()}
        />

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-8'>
              {/* <!--
          Slide-over panel, show/hide based on slide-over state.

          Entering: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-full"
            To: "translate-x-0"
          Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-0"
            To: "translate-x-full"
        --> */}
              <div className='pointer-events-auto relative w-screen max-w-md'>
                {/* <!--
            Close button, show/hide based on slide-over state.

            Entering: "ease-in-out duration-500"
              From: "opacity-0"
              To: "opacity-100"
            Leaving: "ease-in-out duration-500"
              From: "opacity-100"
              To: "opacity-0"
          --> */}
                <div className='flex h-full flex-col overflow-y-scroll bg-ht-orange-highlight px-8 pb-8 pt-16 shadow-xl sm:px-6'>
                  <button
                    type='button'
                    className='self-end rounded-md focus:outline-none focus:ring-2'
                    onClick={() => toggleNav()}
                  >
                    <span className='sr-only'>Close mobile nav</span>
                    <X />
                  </button>
                  <ul className='relative mt-6 space-y-4 text-2xl font-bold'>
                    {NAVBAR_LINKS.flatMap((link) => link).map((link) => (
                      <li key={link.to}>
                        <NavLink key={link.to} to={link.to}>
                          {link.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

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

const products: Product[] = [
  {
    id: 'kaya-signature',
    stripe_id: 'prod_Nk7ZiHSHFf24mL',
    form_id: 'kaya-signature-quantity',
    name: 'Signature Kaya Jam 6oz',
    shortDescription: 'Coconut Milk, Gula Melaka, Rock Sugar, Pandan Leaves, Eggs, Salt.',
    price: '7.00',
    imageSrc: '/images/product/the-pandan-kaya.png',
    imageAlt: 'Signature Kaya Jar',
  },
  {
    id: 'kaya-vegan',
    stripe_id: 'prod_Nk8T1CWRimuaIF',
    form_id: 'kaya-vegan-quantity',
    name: 'Vegan Kaya Jam 6oz',
    shortDescription: 'Coconut Milk, Gula Melaka, Rock Sugar, Pandan Leaves, Tofu, Salt.',
    price: '7.00',
    imageSrc: '/images/product/the-pandan-kaya.png',
    imageAlt: 'Vegan Kaya Jar',
  },
];

function CartSidebar() {
  const [cartOpen, setCartOpen] = useState(true);

  function toggleCart() {
    console.log('toggleCart' + cartOpen);
    setCartOpen((prev) => !prev);
  }

  return (
    <>
      <button
        type='button'
        className='text-xl focus:outline-none focus:ring-2 focus:ring-white md:text-3xl'
        onClick={() => toggleCart()}
      >
        <span className='sr-only'>Open cart sidebar</span>
        <ShoppingBag />
      </button>
      <dialog className={'z-20'} onClose={toggleCart} open={cartOpen} aria-modal='true'>
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
              <div className='flex h-full flex-col bg-ht-off-white px-8 pb-20 pt-16 md:px-12'>
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
                        <li key={product.id} className='flex py-6'>
                          <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md'>
                            <img
                              src={product.imageSrc}
                              alt={product.imageAlt}
                              className='h-full w-full object-cover object-center'
                            />
                          </div>
                          <div className='ml-4 flex flex-1 flex-col'>
                            <div>
                              <div className='flex justify-between'>
                                <h3 className='font-serif text-base font-medium uppercase tracking-tight md:text-lg'>
                                  {product.name}
                                </h3>
                                <p className='ml-4 font-medium'>£{product.price}</p>
                              </div>
                              <p className='mt-2 text-xs font-light'>{product.shortDescription}</p>
                              <p>
                                Qty{' '}
                                <input
                                  type='number'
                                  id={product.form_id}
                                  name={product.form_id}
                                  className='border-none focus:border-none active:border-none'
                                  min='0'
                                  max='10'
                                  defaultValue='0'
                                />
                              </p>
                              <span>Remove</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Form>
                </div>

                <div className='border-t border-ht-black py-2'>
                  <div className='flex justify-between text-3xl font-medium'>
                    <p>Subtotal</p>
                    <p>£16.00</p>
                  </div>
                  <p className='mt-2 text-xs font-light'>Shipping and taxes calculated at checkout</p>
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

export default function Navbar() {
  return (
    <div className='content-wrapper fixed z-50 w-[calc(100vw-1.2rem)] bg-transparent py-4 md:w-[calc(100vw-1rem)]'>
      <nav className='content-container flex items-center justify-between rounded-full bg-ht-off-white px-6 py-1 font-mono'>
        <NavSidebar />
        <div className='flex justify-center gap-4 py-2 align-middle font-serif text-xl font-bold uppercase md:text-3xl'>
          <NavLink key='root' to='/'>
            Hungry Tapir
          </NavLink>
        </div>
        <ul className='hidden font-bold uppercase lg:flex'>
          {NAVBAR_LINKS.map((link) => {
            if (Array.isArray(link)) {
              return link.map((subLink) => (
                <li className='px-5 py-2' key={subLink.to}>
                  <NavLink key={subLink.to} to={subLink.to}>
                    {subLink.name}
                  </NavLink>
                </li>
              ));
            } else {
              return (
                <li className='px-5 py-2' key={link.to}>
                  <NavLink key={link.to} to={link.to}>
                    {link.name}
                  </NavLink>
                </li>
              );
            }
          })}
        </ul>
        <CartSidebar />
      </nav>
    </div>
  );
}
