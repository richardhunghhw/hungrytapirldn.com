import { useState } from 'react';
import { Menu } from 'lucide-react';
import { NAVBAR_LINKS } from './navbar';
import { NavLink } from './nav-link';
import { X } from '~/utils/svg/custom';
import SocialIcons from './social-icons';

export default function NavSidebar() {
  const [navOpen, setNavOpen] = useState(false);

  function toggleNav() {
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
                <div className='flex h-full flex-col bg-ht-orange-highlight pb-8 pt-16 shadow-xl'>
                  <button
                    type='button'
                    className='mr-8 self-end rounded-md focus:outline-none focus:ring-2'
                    onClick={() => toggleNav()}
                  >
                    <span className='sr-only'>Close mobile nav</span>
                    <X />
                  </button>
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
                                      <NavLink
                                        id={subLink.id}
                                        to={subLink.to as string}
                                        onClick={() => toggleNav()}
                                        position='sidebar'
                                        className='px-8 py-2'
                                      >
                                        {subLink.name}
                                      </NavLink>
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
                                <NavLink
                                  id={link.id}
                                  to={link.to as string}
                                  onClick={() => toggleNav()}
                                  position='sidebar'
                                  className='px-8 py-2'
                                >
                                  {link.name}
                                </NavLink>
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
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
