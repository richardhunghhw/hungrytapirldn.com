import { Link, useLocation } from '@remix-run/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { ShoppingBag, X } from '~/utils/svg/custom';

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
    const isSelected =
        to === location.pathname || location.pathname.startsWith(`${to}/`);

    return (
        <Link
            prefetch="intent"
            className="whitespace-nowrap hover:text-primary focus:text-primary focus:outline-none"
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
        console.log('toggleNav');
        setNavOpen((prev) => !prev);
    }

    return (
        <>
            <button
                type="button"
                className="focus:outline-none focus:ring-2 focus:ring-white lg:hidden"
                onClick={() => toggleNav()}
            >
                <span className="sr-only">Open mobile nav</span>
                <Menu />
            </button>
            <div
                className={'relative z-10 ' + navOpen ? 'block' : 'none'}
                role="dialog"
                aria-modal="true"
            >
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
                        'fixed inset-0 h-full w-full bg-gray-900 bg-opacity-75 transition-opacity duration-500 ease-out ' +
                        navOpen
                            ? 'opacity-100'
                            : 'opacity-0'
                    }
                    onClick={() => toggleNav()}
                />

                <div className="fixed inset-0 overflow-hidden transition-all">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-8">
                            {/* <!--
          Slide-over panel, show/hide based on slide-over state.

          Entering: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-full"
            To: "translate-x-0"
          Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-0"
            To: "translate-x-full"
        --> */}
                            <div className="pointer-events-auto relative w-screen max-w-md">
                                {/* <!--
            Close button, show/hide based on slide-over state.

            Entering: "ease-in-out duration-500"
              From: "opacity-0"
              To: "opacity-100"
            Leaving: "ease-in-out duration-500"
              From: "opacity-100"
              To: "opacity-0"
          --> */}
                                <div className="flex h-full flex-col overflow-y-scroll bg-ht-pink px-8 pb-8 pt-16 text-white shadow-xl sm:px-6">
                                    <button
                                        type="button"
                                        className="self-end rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                        onClick={() => toggleNav()}
                                    >
                                        <span className="sr-only">
                                            Close mobile nav
                                        </span>
                                        <X />
                                    </button>
                                    <ul className="relative mt-6 space-y-4">
                                        {NAVBAR_LINKS.flatMap(
                                            (link) => link
                                        ).map((link) => (
                                            <li key={link.to}>
                                                <NavLink
                                                    key={link.to}
                                                    to={link.to}
                                                >
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
            </div>
        </>
    );
}

export default function Navbar() {
    return (
        <div className="content-wrapper fixed z-50 w-[calc(100vw-1.2rem)] bg-transparent py-4 md:w-[calc(100vw-1rem)]">
            <nav className="content-container flex items-center justify-between rounded-full bg-ht-off-white px-6 py-1 font-mono text-xl font-bold uppercase md:text-3xl">
                {/* <NavSidebar /> */}
                <div className="flex justify-center gap-4 py-2 align-middle font-serif">
                    <NavLink key="root" to="/">
                        Hungry Tapir
                    </NavLink>
                </div>
                <ul className="hidden lg:flex">
                    {NAVBAR_LINKS.map((link) => {
                        if (Array.isArray(link)) {
                            return link.map((subLink) => (
                                <li className="px-5 py-2" key={subLink.to}>
                                    <NavLink key={subLink.to} to={subLink.to}>
                                        {subLink.name}
                                    </NavLink>
                                </li>
                            ));
                        } else {
                            return (
                                <li className="px-5 py-2" key={link.to}>
                                    <NavLink key={link.to} to={link.to}>
                                        {link.name}
                                    </NavLink>
                                </li>
                            );
                        }
                    })}
                </ul>
                <div>
                    <ShoppingBag />
                </div>
            </nav>
        </div>
    );
}
