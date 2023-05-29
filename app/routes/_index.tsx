import type { V2_MetaFunction } from '@remix-run/react';
import { Link } from '@remix-run/react';
import { LoaderArgs, redirect } from '@remix-run/cloudflare';

import kayaImage from '~/images/kaya.webp';

export const meta: V2_MetaFunction = () => {
	return [{ title: 'Hungry Tapir | Best Kaya in London' }];
};

export async function loader({ context }: LoaderArgs) {
	if (context.NODE_ENV === 'PROD') {
		return redirect('/coming-soon');
	}
	return null;
}

export default function Index() {
	return (
		<div className='bg-slate-100 h-screen overflow-y-scroll'>
			<div
				id='landing'
				className='bg-lime-950 text-white flex h-4/5 flex-col items-center justify-center text-6xl font-bold'
			>
				<h1>
					We sell{' '}
					<Link
						to=''
						className='underline'
					>
						Kaya
					</Link>
					!
				</h1>
				<h1>
					We also sell{' '}
					<Link
						to=''
						className='underline'
					>
						Vegan Kaya
					</Link>
					!
				</h1>
			</div>

			<div
				id='product-kaya'
				className='mx-24 my-4 flex h-2/5 justify-center'
			>
				<div className='bg-white mb-4 mr-8 flex-none basis-1/2 rounded-md bg-cover shadow-md'>
					<div className={`flex-none basis-1/2 bg-[url('/build/_assets/kaya-JNTW256A.webp')]`} />
				</div>
				<div className='bg-white flex flex-none basis-1/2 flex-col rounded-md p-4 shadow-md'>
					<h1>Signature Kaya</h1>
					<p>
						Made with Thai Coconut Milk and aromatic Pandan Leaves, our Kaya Jam will make you think of
						sunny beaches and bustling markets only found in Southeast asia.
					</p>
					<p>
						We love it spread generously onto a slice of thick white toast with butter, but also mixing it
						into Yogurt, Porridge, really anything that calls for Jam!
					</p>
					<Link to='/cart'>Buy Now</Link>
				</div>
			</div>

			<div
				id='product-vegankaya'
				className='mx-24 my-4 flex h-2/5 flex-row-reverse justify-center'
			>
				<div className='bg-white mb-4 ml-8 flex-none basis-1/2 rounded-md bg-cover shadow-md'>
					<div className={`flex-none basis-1/2 bg-[url('/build/_assets/kaya-JNTW256A.webp')]`} />
				</div>
				<div className='bg-white flex flex-none basis-1/2 flex-col rounded-md p-4 shadow-md'>
					<h1>Vegan Kaya</h1>
					<p>
						Our Vegan Kaya Jam, a delicious alternative for those who follow a plant-based diet! We've
						replaced the traditional eggs in our recipe with silky smooth tofu, making it a perfect spread
						for vegans and vegetarians alike.
					</p>
					<p>
						Our Vegan Kaya Jam is still made with the same authentic Thai Coconut Milk and aromatic Pandan
						Leaves that will transport you straight to the bustling markets of Southeast Asia. We've also
						kept the traditional sweetness of Gula Melaka and Rock Sugar, ensuring that each bite is just as
						satisfying as the original.
					</p>
					<Link to='/cart'>Buy Now</Link>
				</div>
			</div>

			<div
				id='footer'
				className='bg-lime-950 text-white flex-auto px-24 py-6'
			>
				<ul>
					<li>
						<p className='text-xl font-bold'>Hungry Tapir</p>
					</li>
					<li>
						<Link to='/about'>About Us</Link>
					</li>
					<li>
						<Link to='/delivery'>Deliveries & Returns</Link>
					</li>
					<li>
						<Link to='/terms'>Terms & Conditions</Link>
					</li>
					<li>
						<p className='text-sm font-light'>Copyright Hungry Tapir LLP 2023</p>
					</li>
				</ul>
			</div>
		</div>
	);
}
