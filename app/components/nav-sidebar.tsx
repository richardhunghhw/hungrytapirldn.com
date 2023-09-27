import { Menu } from 'lucide-react';

import { NAVBAR_LINKS } from './navbar';
import { NavLink } from './nav-link';
import { X } from '~/utils/svg/custom';
import SocialIcons from './social-icons';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet';

export default function NavSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button type='button' className='lg:hidden'>
          <span className='sr-only'>Open mobile nav</span>
          <Menu />
        </button>
      </SheetTrigger>

      <SheetContent side='left'>
        <div className='flex h-full flex-col bg-ht-orange-highlight pb-8 pt-16 shadow-xl'>
          <SheetClose asChild>
            <button type='button' className='mr-8 self-end rounded-md'>
              <span className='sr-only'>Close mobile nav</span>
              <X />
            </button>
          </SheetClose>
          <div className='mt-6'>
            <ul className='text-2xl font-bold uppercase'>
              {NAVBAR_LINKS.filter((link) => link.enableSidebar)
                .flatMap((link) => link)
                .map((link) => {
                  if (Array.isArray(link.links)) {
                    return (
                      // <li key={link.id}>
                      //   <span className='px-8'>{link.name}</span>
                      //   <ul className='mb-6 mt-2'>
                      // {
                      link.links
                        .filter((link) => link.enableSidebar)
                        .map((subLink) => {
                          return (
                            <li key={subLink.id}>
                              <SheetClose asChild>
                                <NavLink
                                  id={subLink.id}
                                  to={subLink.to as string}
                                  // onClick={() => toggleNav()}
                                  position='sidebar'
                                  className='px-8 py-2'
                                >
                                  {subLink.name}
                                </NavLink>
                              </SheetClose>
                            </li>
                          );
                        })
                      // }
                      //   </ul>
                      // </li>
                    );
                  } else {
                    return (
                      <li key={link.id}>
                        <SheetClose asChild>
                          <NavLink
                            id={link.id}
                            to={link.to as string}
                            // onClick={() => toggleNav()}
                            position='sidebar'
                            className='px-8 py-2'
                          >
                            {link.name}
                          </NavLink>
                        </SheetClose>
                      </li>
                    );
                  }
                })}
            </ul>
          </div>
          <div className='mt-4 justify-self-end px-8 py-2'>
            <SocialIcons />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
