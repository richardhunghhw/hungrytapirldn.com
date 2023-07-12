import { Link } from '@remix-run/react';
import SocialIcons from './social-icons';

const FOOTER_LINKS = [
    { name: 'About', to: '/about-us' },
    { name: 'FAQ', to: '/faq' },
    { name: 'Blogs & Recipes', to: '/blog' },
    { name: 'Contact', to: '/contact-us' },
    { name: 'Deliveries & Returns', to: '/deliveries-and-returns' },
    { name: 'Terms & Conditions', to: '/terms-and-conditions' },
];

export default function Footer() {
    return (
        <div
            id="footer"
            className="content-wrapper bg-ht-black pt-4 font-mono text-ht-off-white md:pt-8"
        >
            <div className="content-container flex flex-col">
                <div className="mb-24 flex flex-col justify-between space-y-5 p-4 md:mb-48 md:flex-row md:space-y-0">
                    <div className="basis-1/3 lg:basis-1/2">
                        <h1 className="font-bold">HUNGRY TAPIR | LONDON</h1>
                        <SocialIcons />
                    </div>
                    <div className="basis-2/3 lg:basis-1/2">
                        <ul className="flex flex-col flex-wrap uppercase md:h-[5rem]">
                            {FOOTER_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        prefetch="intent"
                                        className="hover:text-opacity-50 focus:text-opacity-50"
                                        to={link.to}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t-1 flex flex-row justify-between border-t-2 border-t-ht-off-white p-4">
                    <p className="text-sm font-light">
                        Copyright Hungry Tapir LLP 2023
                    </p>
                </div>
            </div>
        </div>
    );
}
