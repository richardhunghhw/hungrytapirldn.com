import type { V2_MetaFunction } from '@remix-run/react';

import instagramSvg from '~/images/instagram.svg';
import tiktokSvg from '~/images/tiktok.svg';
import xiaohungshu from '~/images/xiaohungshu.svg';
import logo from '~/images/logo-transparent.png';

export const meta: V2_MetaFunction = () => {
	return [{ title: 'Hungry Tapir | Coming Soon! Best Kaya in London' }];
};

export default function Index() {
	return (
		<div className='h-screen bg-htgreen px-6 pt-14 lg:px-8 overflow-y-scroll'>
			<div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
				<div className='flex h-full flex-col items-center justify-center text-center'>
					<img
						src={logo}
						alt='Hungry Tapir Logo'
						className='h-14'
					/>
					<div className='hidden sm:mb-8 sm:flex sm:justify-center'>
						<div className='relative rounded-full px-3 py-1 text-sm leading-6 text-neutral-300 ring-1 ring-neutral-100 hover:ring-neutral-300'>
							We sell the best homemade Kaya in London!
						</div>
					</div>
					<h1 className='text-4xl font-bold tracking-tight text-neutral-100'>Hungry Tapir</h1>
					<p className='mt-4 text-center text-lg text-neutral-300 '>
						Our website is W.I.P. we are working hard to get it ready. In the meantime you can find us on
						our Socials!
					</p>
					<a href='//www.instagram.com/hungrytapirldn/'>
						<img
							src={instagramSvg}
							alt='instagram'
							className='mt-4 h-8'
						/>
					</a>
					<a href='//www.tiktok.com/@hungrytapirldn'>
						<img
							src={tiktokSvg}
							alt='TikTok'
							className='mt-4 h-8'
						/>
					</a>
					<a href='//www.xiaohongshu.com/user/profile/63b77a78000000002702a7d7/'>
						<img
							src={xiaohungshu}
							alt='xiaohongshu'
							className='mt-4 h-12'
						/>
					</a>
				</div>
			</div>
		</div>
	);
}
