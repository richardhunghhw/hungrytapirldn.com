import type { V2_MetaFunction } from '@remix-run/react';
import { Link } from '@remix-run/react';
import { redirect } from '@remix-run/cloudflare';
import type { HTLoaderArgs } from '~/utils/types';

import kayaImage from '~/images/kaya.webp';

export const meta: V2_MetaFunction = () => {
    return [{ title: 'Hungry Tapir | Best Kaya in London' }];
};

export async function loader({ context }: HTLoaderArgs) {
    if (context.NODE_ENV === 'PROD') {
        return redirect('/coming-soon');
    }
    return null;
}

export default function Index() {
    return (
        <div className="bg-slate-100">
            <div
                id="landing"
                className="flex h-screen flex-col items-center justify-center bg-ht-green text-6xl font-bold text-white"
            >
                <h1>
                    We sell{' '}
                    <Link to="" className="underline">
                        Kaya
                    </Link>
                    !
                </h1>
                <h1>
                    We also sell{' '}
                    <Link to="" className="underline">
                        Vegan Kaya
                    </Link>
                    !
                </h1>
            </div>

            <div
                id="product-kaya"
                className="mx-24 my-4 flex h-2/5 justify-center"
            >
                <div className="mb-4 mr-8 flex-none basis-1/2 rounded-md bg-white bg-cover shadow-md">
                    <div
                        className={`flex-none basis-1/2 bg-[url('/build/_assets/kaya-JNTW256A.webp')]`}
                    />
                </div>
                <div className="flex flex-none basis-1/2 flex-col rounded-md bg-white p-4 shadow-md">
                    <h1>Signature Kaya</h1>
                    <p>
                        Made with Thai Coconut Milk and aromatic Pandan Leaves,
                        our Kaya Jam will make you think of sunny beaches and
                        bustling markets only found in Southeast asia.
                    </p>
                    <p>
                        We love it spread generously onto a slice of thick white
                        toast with butter, but also mixing it into Yogurt,
                        Porridge, really anything that calls for Jam!
                    </p>
                    <Link to="/cart">Buy Now</Link>
                </div>
            </div>

            <div
                id="product-vegankaya"
                className="mx-24 my-4 flex h-2/5 flex-row-reverse justify-center"
            >
                <div className="mb-4 ml-8 flex-none basis-1/2 rounded-md bg-white bg-cover shadow-md">
                    <div
                        className={`flex-none basis-1/2 bg-[url('/build/_assets/kaya-JNTW256A.webp')]`}
                    />
                </div>
                <div className="flex flex-none basis-1/2 flex-col rounded-md bg-white p-4 shadow-md">
                    <h1>Vegan Kaya</h1>
                    <p>
                        Our Vegan Kaya Jam, a delicious alternative for those
                        who follow a plant-based diet! We've replaced the
                        traditional eggs in our recipe with silky smooth tofu,
                        making it a perfect spread for vegans and vegetarians
                        alike.
                    </p>
                    <p>
                        Our Vegan Kaya Jam is still made with the same authentic
                        Thai Coconut Milk and aromatic Pandan Leaves that will
                        transport you straight to the bustling markets of
                        Southeast Asia. We've also kept the traditional
                        sweetness of Gula Melaka and Rock Sugar, ensuring that
                        each bite is just as satisfying as the original.
                    </p>
                    <Link to="/cart">Buy Now</Link>
                </div>
            </div>

            <div className="mx-24 my-4 flex h-2/5 justify-center">
                <div className="flex flex-col md:w-1/2">
                    <div className="h-12 w-24 bg-ht-green">
                        <p>Green</p>
                    </div>
                    <div className="h-12 w-24 bg-ht-green-dark">
                        <p>Dark Green</p>
                    </div>
                    <div className="h-12 w-24 bg-ht-gold">
                        <p>Gold</p>
                    </div>
                    <div className="h-12 w-24 bg-ht-gold-light">
                        <p>Light gold</p>
                    </div>
                    <div className="h-12 w-24 bg-ht-coral">
                        <p>Coral</p>
                    </div>
                    <div className="h-12 w-24 bg-ht-blue">
                        <p>Blue</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
