import { Link, useLocation } from '@remix-run/react';
import { ShoppingBag } from 'lucide-react';

const NAVBAR_LINKS = [
    { name: 'Signature', to: '/product/signature-kaya-jam-8oz' },
    { name: 'Vegan', to: '/product/vegan-kaya-jam-8oz' },
    { name: 'Blog', to: '/blog' },
    { name: 'About', to: '/about' },
];

function NavLink({
    to,
    ...rest
}: Omit<Parameters<typeof Link>['0'], 'to'> & { to: string }) {
    const location = useLocation();
    const isSelected =
        to === location.pathname || location.pathname.startsWith(`${to}/`);

    return (
        <Link
            prefetch="intent"
            className="whitespace-nowrap text-2xl font-bold hover:text-primary focus:text-primary focus:outline-none"
            to={to}
            {...rest}
        />
    );
}

export default function Navbar() {
    return (
        <div className="content-wrapper fixed z-50 w-[calc(100vw-1.2rem)] bg-transparent py-4 md:w-[calc(100vw-1rem)]">
            <nav className="content-container flex items-center justify-between rounded-full bg-ht-peach px-6 py-1 font-mono uppercase">
                <div className="flex justify-center gap-4 py-2 align-middle">
                    <NavLink key="root" to="/">
                        Hungry Tapir
                    </NavLink>
                </div>
                <ul className="hidden lg:flex">
                    {NAVBAR_LINKS.map((link) => (
                        <li className="px-5 py-2" key={link.to}>
                            <NavLink key={link.to} to={link.to}>
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <div>
                    <ShoppingBag />
                </div>
            </nav>
        </div>
    );
}
