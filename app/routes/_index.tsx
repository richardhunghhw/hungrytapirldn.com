import type { V2_MetaFunction } from '@remix-run/react';
import { Link, useLoaderData } from '@remix-run/react';
import { redirect } from '@remix-run/cloudflare';
import type { HTLoaderArgs } from '~/utils/types';

import { Button } from '~/components/ui/button';
import type {
    ContentStoreGeneralEntry,
    ContentStoreProductEntry,
} from '~/services/content-store';
import {
    getGeneral,
    getProduct,
    makeUriFromContentTypeSlug,
} from '~/services/content-store';
import { TapirTransparent } from '~/utils/svg/tapir';
import { AspectRatio } from '~/components/ui/aspect-ratio';
import { Input } from '~/components/ui/input';

const circle = () => <div className="h-4 w-4 rounded-full bg-ht-black" />;

export const meta: V2_MetaFunction = () => {
    return [{ title: 'Hungry Tapir | Best Kaya in London' }];
};

export async function loader({ context }: HTLoaderArgs) {
    if (context.NODE_ENV === 'PROD') {
        return redirect('/coming-soon');
    }
    const orderNow = await getGeneral(context, 'section~order-now');
    const whatKaya = await getGeneral(context, 'section~what-is-kaya');
    const kayaPandan = await getProduct(context, 'the-pandan-kaya');
    const kayaVegan = await getProduct(context, 'the-vegan-kaya');

    // TODO if any of the above queries fails, there is something wrong with the website, perhaps do something with that information
    return {
        orderNow,
        whatKaya,
        kayaPandan,
        kayaVegan,
    };
}

function ProductCard({
    product,
}: {
    product: ContentStoreProductEntry;
}): JSX.Element {
    return (
        <div className="flex flex-grow flex-col items-center justify-center space-y-2 rounded-3xl border border-ht-black p-12 sm:space-y-8">
            <div className="title text-center text-4xl">
                <h1>{product.metadata.title}</h1>
            </div>
            <div className="w-[350px] overflow-hidden">
                <AspectRatio ratio={8 / 9}>
                    <img
                        src={product.data.primaryImage}
                        alt={product.data.primaryImageAlt}
                        className="h-full w-full object-cover"
                    />
                </AspectRatio>
            </div>
            <Button variant="link" asChild>
                <Link
                    to={
                        makeUriFromContentTypeSlug(
                            'product',
                            product.metadata.slug
                        ) as string
                    }
                >
                    Learn more
                </Link>
            </Button>
            <Input
                type="number"
                id={product.data.id}
                name={product.data.id}
                className="border-none focus:border-none active:border-none"
                min="0"
                max="10"
                defaultValue="0"
            />
            <Button variant="dark" className="text-ht-orange">
                ADD TO CART -{' '}
                <span className="ml-8">£{product.data.price}</span>
            </Button>
        </div>
    );
}

export default function Index() {
    const data = useLoaderData<{
        orderNow: ContentStoreGeneralEntry;
        whatKaya: ContentStoreGeneralEntry;
        kayaPandan: ContentStoreProductEntry;
        kayaVegan: ContentStoreProductEntry;
    }>();
    if (!data) return null; // todo

    return (
        <div className="snap-y snap-normal">
            <section
                id="landing"
                className="flex h-[calc(100vh-200px)] snap-start flex-col items-center justify-center bg-ht-pink-highlight text-6xl font-bold text-ht-green-highlight md:h-[calc(100vh-100px)]"
            >
                <div className="content-container flex flex-col items-center justify-center">
                    <img
                        className="h-[calc(100vh-200px)] rounded-md"
                        src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
                        alt="Landscape photograph by Tobias Tullius"
                    />
                    <div className="absolute flex flex-col items-center">
                        <TapirTransparent className="text-[6rem]" />
                        <h1 className="title text-center">WE MAKE KAYA</h1>
                    </div>
                </div>
            </section>

            <section
                className="content-wrapper h-[12rem] snap-start bg-ht-off-white py-4 md:h-[3.8rem]"
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
                className="content-wrapper snap-start bg-ht-green py-4 md:py-16"
            >
                <div className="content-container flex flex-col-reverse items-center space-y-4 space-y-reverse md:flex-row md:space-x-16">
                    <div className="flex flex-grow flex-col items-center justify-center space-y-10 rounded-3xl border border-ht-black p-8 font-mono text-ht-black">
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
                    <div className="w-[350px] overflow-hidden rounded-3xl">
                        <AspectRatio ratio={8 / 11}>
                            <img
                                src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
                                alt="Landscape photograph by Tobias Tullius"
                                className="h-full w-full object-cover"
                            />
                        </AspectRatio>
                    </div>
                </div>
            </section>

            <section
                id="what-is-kaya"
                className="content-wrapper snap-start bg-ht-pink py-4 md:py-16"
            >
                <div className="content-container flex flex-col items-center space-y-4 md:flex-row md:space-x-16">
                    <div className="w-[350px] overflow-hidden rounded-3xl">
                        <AspectRatio ratio={8 / 11}>
                            <img
                                src="/images/content/what-is-kaya-kaya-toast.jpg"
                                alt="Kaya Toast"
                                className="h-full w-full object-cover"
                            />
                        </AspectRatio>
                    </div>
                    <div className="flex flex-grow flex-col items-center justify-center space-y-10 rounded-3xl border border-ht-black p-8 font-mono text-ht-black">
                        <h1 className="title text-4xl">What is kaya?</h1>
                        <div className="prose">
                            {data.whatKaya.data.general.map((item, index) => (
                                <p key={index}>{item}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="product-cards"
                className="content-wrapper snap-start bg-ht-orange py-4 md:py-16"
            >
                <div className="content-container flex flex-col items-center space-x-16 md:flex-row">
                    <ProductCard product={data.kayaPandan} />
                    <ProductCard product={data.kayaVegan} />
                </div>
            </section>
        </div>
    );
}
