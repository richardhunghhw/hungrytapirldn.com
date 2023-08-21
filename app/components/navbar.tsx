import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu';
import NavSidebar from './nav-sidebar';
import { CartSidebar } from './cart-sidebar';
import { NavLink } from './nav-link';

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
  { id: 'find-us', name: 'Find Us', to: '/contact-us', enableSidebar: true, enableNavbar: true },
];

export default function Navbar() {
  return (
    <NavigationMenu className='content-wrapper py-4'>
      <NavigationMenuList className='content-container flex w-[calc(100vw-2.4rem)] items-center justify-between rounded-full bg-ht-off-white px-6 py-1 font-mono text-2xl font-bold uppercase md:w-[calc(100vw-4.2rem)]'>
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
                    <NavigationMenuTrigger className='uppercase'>{link.name}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                        <li className='row-span-3'>
                          <NavigationMenuLink asChild>
                            <a
                              className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                              href='/'
                            >
                              {/* <Icons.logo className='h-6 w-6' /> */}
                              <div className='mb-2 mt-4 text-lg font-medium'>shadcn/ui</div>
                              <p className='text-sm leading-tight text-muted-foreground'>
                                Beautifully designed components built with Radix UI and Tailwind CSS.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        {link.links
                          .filter((link) => link.enableNavbar)
                          .map((subLink) => {
                            return (
                              <NavLink key={subLink.id} to={subLink.to as string}>
                                <NavigationMenuLink>{subLink.name}</NavigationMenuLink>
                              </NavLink>
                            );
                          })}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavLink id={link.id} to={link.to as string}>
                    <NavigationMenuLink>{link.name}</NavigationMenuLink>
                  </NavLink>
                )}
              </NavigationMenuItem>
            ))}
          </ul>
        </li>

        <NavigationMenuItem className='py-2'>
          <CartSidebar />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
