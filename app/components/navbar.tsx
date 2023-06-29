import { Link, useLocation } from '@remix-run/react';
import { ShoppingBag } from '~/utils/svg/custom';

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
            className="whitespace-nowrap text-2xl font-bold hover:text-primary focus:text-primary focus:outline-none"
            to={to}
            {...rest}
        >
            {children}
        </Link>
    );
}

export default function Navbar() {
    return (
        <div className="content-wrapper fixed z-50 w-[calc(100vw-1.2rem)] bg-transparent py-4 md:w-[calc(100vw-1rem)]">
            <nav className="content-container flex items-center justify-between rounded-full bg-ht-off-white px-6 py-1 font-mono uppercase">
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
                    <ShoppingBag className="text-3xl" />
                </div>
            </nav>
        </div>
    );
}
