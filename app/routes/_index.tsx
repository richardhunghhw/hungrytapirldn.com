import type { V2_MetaFunction } from '@remix-run/react';
import { Link, useLoaderData } from '@remix-run/react';
import { redirect } from '@remix-run/cloudflare';
import type { HTLoaderArgs } from '~/utils/types';

import logoTransparent from '~/images/logo-transparent.png';
import kayaImage from '~/images/kaya.webp';
import ProductSection from '~/components/product-section';
import { Button } from '~/components/ui/button';
import type {
    ContentStoreGeneralEntry,
    ContentStoreProductEntry,
} from '~/services/content-store';
import { getGeneral, getProduct } from '~/services/content-store';

const circle = () => <div className="h-4 w-4 rounded-full bg-ht-black" />;

export const meta: V2_MetaFunction = () => {
    return [{ title: 'Hungry Tapir | Best Kaya in London' }];
};

export async function loader({ context }: HTLoaderArgs) {
    if (context.NODE_ENV === 'PROD') {
        return redirect('/coming-soon');
    }
    const orderNow = await getGeneral(context, 'landing-section-order-now');
    const whatKaya = await getGeneral(context, 'landing-section-what-is-kaya');
    const kayaTurquoise = await getProduct(context, 'signature-kaya-jam-8oz');
    const kayaLightPink = await getProduct(context, 'vegan-kaya-jam-8oz');

    // TODO if any of the above queries fails, there is something wrong with the website, perhaps do something with that information
    return {
        orderNow,
        whatKaya,
        kayaTurquoise,
        kayaLightPink,
    };
}

export default function Index() {
    const data = useLoaderData<{
        orderNow: ContentStoreGeneralEntry;
        whatKaya: ContentStoreGeneralEntry;
        kayaTurquoise: ContentStoreProductEntry;
        kayaLightPink: ContentStoreProductEntry;
    }>();
    if (!data) return null; // todo

    return (
        <div className="snap-y snap-normal">
            <section
                id="landing"
                className="flex h-[calc(100vh-200px)] snap-start flex-col items-center justify-center bg-ht-light-pink text-6xl font-bold text-ht-light-green md:h-[calc(100vh-100px)]"
            >
                <div className="content-container flex flex-col items-center justify-center">
                    <img
                        className="h-[calc(100vh-200px)] rounded-md"
                        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
                        alt="Landscape photograph by Tobias Tullius"
                    />
                    <div className="absolute flex flex-col items-center">
                        <img
                            src={logoTransparent}
                            alt="Hungry Tapir Kaya"
                            className="h-24"
                        />
                        <h1 className="title text-center">WE MAKE KAYA</h1>
                    </div>
                </div>
            </section>

            <section
                className="content-wrapper h-[12rem] snap-start bg-ht-peach py-4 md:h-[3.8rem]"
                id="banner"
            >
                <div className="content-container">
                    <ul className="title flex flex-col items-center justify-between text-xl text-ht-black md:flex-row">
                        <li>HOMEMADE</li>
                        <li>{circle()}</li>
                        <li>100% TASTY</li>
                        <li>{circle()}</li>
                        <li>SMALL-BATCH</li>
                        <li className="block md:hidden lg:block">{circle()}</li>
                        <li className="block md:hidden lg:block">DAIRY-FREE</li>
                    </ul>
                </div>
            </section>

            <section
                id="order-now"
                className="content-wrapper snap-start bg-ht-green py-4"
            >
                <div className="content-container flex flex-col-reverse items-center md:flex-row md:space-x-10">
                    <div className="flex flex-col items-center justify-center space-y-12 rounded-3xl border border-ht-black p-8 font-mono text-ht-black md:max-w-[55%]">
                        <h1 className="title text-4xl">Pandan</h1>
                        <h1 className="title text-4xl">Coconut Milk</h1>
                        <h1 className="title text-4xl">Gula Melaka</h1>
                        <div className="prose">
                            {data.orderNow.data.general.map((item, index) => (
                                <p key={index}>{item}</p>
                            ))}
                        </div>
                        <Button variant="outline" size="lg">
                            ORDER NOW
                        </Button>
                    </div>
                    <div>
                        <img
                            className="h-[400px] rounded-md"
                            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
                            alt="Landscape photograph by Tobias Tullius"
                        />
                    </div>
                </div>
            </section>

            <section
                id="what-is-kaya"
                className="content-wrapper bg-ht-pink snap-start py-4"
            >
                <div className="content-container flex flex-col-reverse items-center md:flex-row md:space-x-10">
                    <div className="flex flex-col items-center justify-center space-y-12 rounded-3xl border border-ht-black p-8 font-mono text-ht-black md:max-w-[65%]">
                        <h1 className="title text-4xl">What is kaya?</h1>
                        <div className="prose">
                            {data.whatKaya.data.general.map((item, index) => (
                                <p key={index}>{item}</p>
                            ))}
                        </div>
                    </div>
                    <div>
                        <img
                            className="h-[400px] rounded-md"
                            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
                            alt="Landscape photograph by Tobias Tullius"
                        />
                    </div>
                </div>
            </section>

            <section
                id="product-kaya"
                className="content-wrapper snap-start bg-ht-turquoise py-4"
            >
                <div className="content-container">
                    <ProductSection product={data.kayaTurquoise} />
                </div>
            </section>

            <section
                id="product-vegan-kaya"
                className="content-wrapper snap-start bg-ht-light-pink py-4"
            >
                <div className="content-container">
                    <ProductSection product={data.kayaLightPink} />
                </div>
            </section>
        </div>
    );
}
