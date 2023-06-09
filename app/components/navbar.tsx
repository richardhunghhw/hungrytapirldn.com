import { Link, useLocation } from '@remix-run/react';

const NAVBAR_LINKS = [
    { name: 'Signature Kaya', to: '/products/kaya-signature-6oz' },
    { name: 'Vegan Kaya', to: '/products/kaya-vegan-6oz' },
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
        <li className="px-5 py-2">
            <Link
                prefetch="intent"
                className="block whitespace-nowrap text-2xl	font-bold text-white hover:text-primary focus:text-primary focus:outline-none"
                to={to}
                {...rest}
            />
        </li>
    );
}

export default function Navbar() {
    return (
        <div className="bg-primary px-24 py-9">
            <nav className="max-w-8xl mx-auto flex items-center justify-between font-extrabold">
                <div className="flex justify-center gap-4 align-middle">
                    <Link
                        prefetch="intent"
                        to="/"
                        className="underlined block whitespace-nowrap text-2xl font-bold text-primary transition focus:outline-none"
                    >
                        <h1>Hungry Tapir</h1>
                    </Link>
                </div>
                <ul className="hidden lg:flex">
                    {NAVBAR_LINKS.map((link) => (
                        <NavLink key={link.to} to={link.to}>
                            {link.name}
                        </NavLink>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
