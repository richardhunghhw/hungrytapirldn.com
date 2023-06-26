import { Link } from '@remix-run/react';
import { Instagram } from 'lucide-react';
import { IconTikTok, IconXiaoHungShu } from '~/utils/icons';

const FOOTER_LINKS = [
    { name: 'About', to: '/about' },
    { name: 'FAQ', to: '/faq' },
    { name: 'Blogs & Recipes', to: '/blog' },
    { name: 'Contact', to: '/contact-us' },
    { name: 'Deliveries & Returns', to: '/deliveries-and-return' },
    { name: 'Terms & Conditions', to: '/terms-and-conditions' },
];

function FooterIcon({
    link,
    children,
}: {
    link: string;
    children: React.ReactNode;
}) {
    return (
        <a
            href={link}
            className="block rounded-full bg-ht-peach p-2"
            target="_blank"
            rel="noopener noreferrer"
        >
            <div className="text-2xl text-ht-black">{children}</div>
        </a>
    );
}

export default function Footer() {
    return (
        <div
            id="footer"
            className="content-wrapper bg-ht-black pt-4 font-mono text-ht-peach md:pt-8"
        >
            <div className="content-container flex flex-col">
                <div className="mb-24 flex flex-col justify-between space-y-5 p-4 md:mb-48 md:flex-row md:space-y-0">
                    <div className="basis-1/3 lg:basis-1/2">
                        <h1 className="font-bold">HUNGRY TAPIR | LONDON</h1>
                        <ul className="mt-4 flex flex-row space-x-4">
                            <li>
                                <FooterIcon link="//www.instagram.com/hungrytapirldn/">
                                    <Instagram />
                                </FooterIcon>
                            </li>
                            <li>
                                <FooterIcon link="//www.tiktok.com/@hungrytapirldn/">
                                    <IconTikTok />
                                </FooterIcon>
                            </li>
                            <li>
                                <FooterIcon link="//www.xiaohongshu.com/user/profile/63b77a78000000002702a7d7/">
                                    <IconXiaoHungShu />
                                </FooterIcon>
                            </li>
                        </ul>
                    </div>
                    <div className="basis-2/3 lg:basis-1/2">
                        <ul className="flex flex-col flex-wrap uppercase md:h-[5rem]">
                            {FOOTER_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        prefetch="intent"
                                        className="hover:text-ht-light-pink focus:text-ht-light-pink focus:outline-none"
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

                <div className="border-t-1 flex flex-row justify-between border-t-2 border-t-ht-peach p-4">
                    <p className="text-sm font-light">
                        Copyright Hungry Tapir LLP 2023
                    </p>
                </div>
            </div>
        </div>
    );
}
