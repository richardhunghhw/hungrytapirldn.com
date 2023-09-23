import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';
import NavSidebar from './nav-sidebar';
import { CartSidebar, type CartSidebarProps } from './cart-sidebar';
import { NavLink } from './nav-link';
import { useLocation } from '@remix-run/react';

export type NAVBAR_LINK = {
  id: string;
  name: string;
  links?: NAVBAR_LINK[];
  to?: string;
  enableSidebar: boolean;
  enableNavbar: boolean;
};

export const NAVBAR_LINKS: NAVBAR_LINK[] = [
  { id: 'home', name: 'Home', to: '/', enableSidebar: true, enableNavbar: false },
  {
    id: 'order-now',
    name: 'Order Now',
    to: '/product',
    links: [
      {
        id: 'order-the-pandan-kaya',
        name: 'The Pandan Kaya',
        to: '/product/the-pandan-kaya',
        enableSidebar: true,
        enableNavbar: true,
      },
      {
        id: 'order-the-vegan-kaya',
        name: 'The Vegan Kaya',
        to: '/product/the-vegan-kaya',
        enableSidebar: true,
        enableNavbar: true,
      },
    ],
    enableSidebar: true,
    enableNavbar: true,
  },
  { id: 'about-us', name: 'Our Story', to: '/about-us', enableSidebar: true, enableNavbar: true },
  { id: 'faq', name: 'FAQ', to: '/faq', enableSidebar: true, enableNavbar: false },
  { id: 'find-us', name: 'Contact Us', to: '/contact-us', enableSidebar: true, enableNavbar: true },
];

export default function Navbar({ cart, products }: CartSidebarProps) {
  const location = useLocation();

  return (
    <NavigationMenu className='content-wrapper pt-4'>
      <NavigationMenuList className='content-container flex w-[calc(100vw-2rem)] items-center justify-between rounded-full bg-ht-off-white px-6 py-1 font-mono text-2xl font-bold uppercase md:w-[calc(100vw-4rem)] lg:w-[calc(100vw-8rem)]'>
        <NavSidebar />

        <NavigationMenuItem className='title py-2 text-xl md:text-2xl'>
          <NavLink key='root' to='/'>
            Hungry Tapir
          </NavLink>
        </NavigationMenuItem>

        <li className='hidden grow px-8 lg:block'>
          <ul className='flex items-center justify-evenly'>
            {NAVBAR_LINKS.filter((link) => link.enableNavbar).map((link) => (
              <NavigationMenuItem key={link.id}>
                {Array.isArray(link.links) ? (
                  <>
                    <NavigationMenuTrigger
                      className={`uppercase ${location.pathname.startsWith(`${link.to}/`) ? 'underline' : ''}`}
                    >
                      {link.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className='bg-ht-off-white'>
                      <ul className='w-[200px] space-y-4 p-6'>
                        {link.links
                          .filter((link) => link.enableNavbar)
                          .map((subLink) => {
                            return (
                              <li key={subLink.id}>
                                <NavLink id={subLink.id} to={subLink.to as string} className='uppercase'>
                                  {subLink.name}
                                </NavLink>
                              </li>
                            );
                          })}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavLink id={link.id} to={link.to as string}>
                    {link.name}
                  </NavLink>
                )}
              </NavigationMenuItem>
            ))}
          </ul>
        </li>

        <NavigationMenuItem className='pb-[0.2rem] pt-[0.8rem]'>
          <CartSidebar cart={cart} products={products} />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
