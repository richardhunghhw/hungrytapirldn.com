import { Link } from '@remix-run/react';
import {
    IconFacebook,
    IconInstagram,
    IconThreads,
    IconTikTok,
    IconXiaoHungShu,
} from '~/utils/svg/custom';

const SOCIAL_LINKS = [
    {
        enabled: true,
        link: '//www.facebook.com/HungryTapirLdn',
        label: 'Facebook',
        icon: <IconFacebook />,
    },
    {
        enabled: true,
        link: '//www.instagram.com/hungrytapirldn',
        label: 'Instagram',
        icon: <IconInstagram />,
    },
    {
        enabled: true,
        link: '//www.www.threads.net/@hungrytapirldn',
        label: 'Threads',
        icon: <IconThreads />,
    },
    {
        enabled: true,
        link: '//www.tiktok.com/@hungrytapirldn',
        label: 'TikTok',
        icon: <IconTikTok />,
    },
    {
        enabled: true,
        link: '//www.xiaohongshu.com/user/profile/63b77a78000000002702a7d7',
        label: 'XiaoHongShu',
        icon: <IconXiaoHungShu />,
    },
];

function SocialIcon({
    link,
    label,
    children,
}: {
    link: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            to={link}
            className="block"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
        >
            <span className="text-ht-black">{children}</span>
        </Link>
    );
}

export default function SocialIcons() {
    return (
        <ul className="mt-4 flex flex-row flex-wrap space-x-4">
            {SOCIAL_LINKS.map((link) => {
                if (!link.enabled) {
                    return null;
                }
                return (
                    <li key={link.link}>
                        <SocialIcon link={link.link} label={link.label}>
                            {link.icon}
                        </SocialIcon>
                    </li>
                );
            })}
        </ul>
    );
}
