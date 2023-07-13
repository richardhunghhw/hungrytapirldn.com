/**
 * linkinbio page for Socials, QR code...
 */
import { Link, useLoaderData } from '@remix-run/react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import SocialIcons from '~/components/social-icons';

import { Button } from '~/components/ui/button';
import type { ContentStoreGeneralEntry } from '~/services/content-store';
import { getGeneralEntry } from '~/services/get-general-entry';
import { TapirTransparent } from '~/utils/svg/tapir';
import type { HTLoaderArgs } from '~/utils/types';

const LINKINBIO_LINKS = [
    { name: 'Website', to: '/', icon: undefined, bgColor: 'bg-ht-pink' },
    { name: 'Blog', to: '/blog', icon: undefined, bgColor: 'bg-ht-pink' },
    { name: 'FAQ', to: '/faq', icon: undefined, bgColor: 'bg-ht-pink' },
    {
        name: 'DELLI',
        to: '//delli.app.link/Uo9albLUl0-601hOCxLTAQ/hungrytapirldn',
        icon: undefined,
        bgColor: '#DBAF1F',
    },
];

export async function loader({ context }: HTLoaderArgs) {
    return getGeneralEntry(context, 'linkinbio');
}

export default function FaqLayout() {
    const pageData = useLoaderData<ContentStoreGeneralEntry>();

    return (
        <div className="flex min-h-screen flex-col justify-center bg-ht-pink-highlight">
            <div className="content-wrapper">
                <div className="content-container">
                    <div className="my-16 flex flex-col items-center space-y-8">
                        <div className="flex flex-col items-center space-y-4 font-mono font-bold ">
                            <TapirTransparent className="text-8xl" />
                            <p className="text-sm">@hungrytapirldn</p>
                            <h1 className="title text-center font-serif text-3xl tracking-widest md:text-6xl">
                                Hungry Tapir LDN
                            </h1>
                            <div className="text-center text-base">
                                {pageData.data.general.map((line, index) => (
                                    <ReactMarkdown key={index}>
                                        {line}
                                    </ReactMarkdown>
                                ))}
                            </div>
                        </div>
                        <div className="flex w-full flex-col space-y-4">
                            {LINKINBIO_LINKS.map((link) => (
                                <Button variant="dark" asChild key={link.to}>
                                    <Link
                                        to={link.to}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.name}
                                    >
                                        {link.icon && (
                                            <span className="flex-start">
                                                {link.icon}
                                            </span>
                                        )}
                                        {link.name}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                        <div>
                            <SocialIcons />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
