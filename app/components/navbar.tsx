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
import { TapirTransparent } from '~/utils/svg/tapir';

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
    <NavigationMenu className='content-wrapper pt-4'>
      <NavigationMenuList className='content-container flex w-[calc(100vw-2.4rem)] items-center justify-between rounded-full bg-ht-off-white px-6 py-1 font-mono text-2xl font-bold uppercase sm:w-[calc(100vw-3.2rem)] md:w-[calc(100vw-4.2rem)]'>
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
                    <NavigationMenuContent className='bg-ht-off-white'>
                      <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-7'>
                        <li className='col-span-4 row-span-3'>
                          <NavigationMenuLink asChild>
                            <a
                              className='flex h-full w-full select-none flex-col justify-end rounded-md bg-white from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                              href='/'
                            >
                              <TapirTransparent className='text-5xl' color='#1C1C1C' />
                              <p className='text-sm leading-tight text-muted-foreground'>
                                Handmade, cult-favourite SEA foods in London. Taste the city's best Kaya, crafted in
                                small batches. Order online here.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        {link.links
                          .filter((link) => link.enableNavbar)
                          .map((subLink) => {
                            return (
                              <NavLink key={subLink.id} to={subLink.to as string} className='col-span-3'>
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

        <NavigationMenuItem className='pb-[0.2rem] pt-[0.8rem]'>
          <CartSidebar />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
