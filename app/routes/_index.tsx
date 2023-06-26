import type { V2_MetaFunction } from '@remix-run/react';
import { Link } from '@remix-run/react';
import { redirect } from '@remix-run/cloudflare';
import type { HTLoaderArgs } from '~/utils/types';

import logoTransparent from '~/images/logo-transparent.png';
import kayaImage from '~/images/kaya.webp';
import ProductSection from '~/components/product-section';
import { Button } from '~/components/ui/button';

const circle = () => <div className="h-4 w-4 rounded-full bg-ht-black" />;

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
        <div className="snap-y snap-normal">
            <section
                id="landing"
                className="flex h-[calc(100vh-200px)] snap-start flex-col items-center justify-center bg-ht-light-pink text-6xl font-bold text-ht-yellow md:h-[calc(100vh-100px)]"
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
                        <p>
                            Donec dictum justo eget massa suscipit, vitae
                            blandit felis volutpat. Curabitur mollis, odio id
                            rhoncus venenatis, elit nunc rutrum ipsum, eget
                            ultricies sem justo in mi.
                        </p>
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
                className="content-wrapper snap-start bg-ht-bright-pink py-4"
            >
                <div className="content-container flex flex-col-reverse items-center md:flex-row md:space-x-10">
                    <div className="flex flex-col items-center justify-center space-y-12 rounded-3xl border border-ht-black p-8 font-mono text-ht-black md:max-w-[65%]">
                        <h1 className="title text-4xl">What is kaya?</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed pellentesque eleifend dui non ornare.
                            Nulla luctus tempus erat ut venenatis. Vestibulum
                            venenatis turpis arcu, et aliquet tellus varius ut.
                            Phasellus tempor arcu est, sit amet vestibulum purus
                            pharetra at. In dictum a tortor sed mollis. Maecenas
                            metus enim, pretium a erat eget, pharetra dictum
                            tortor. Vivamus ante est, consectetur et neque et,
                            porttitor feugiat ipsum. Ut blandit quis nisi vitae
                            volutpat. Proin vitae volutpat urna, nec varius ex.
                            Ut vel lacus sit amet diam fringilla maximus. Sed
                            lacinia rutrum sapien a placerat. Phasellus et elit
                            in elit molestie tristique. Duis metus urna, ornare
                            a convallis quis, accumsan eget mi. Donec auctor
                            libero justo, a interdum sem porta ut. Donec dictum
                            justo eget massa suscipit, vitae blandit felis
                            volutpat. Curabitur mollis, odio id rhoncus
                            venenatis, elit nunc rutrum ipsum, eget ultricies
                            sem justo in mi.
                        </p>
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
                    <ProductSection
                        product={{
                            id: 'kaya',
                            stripe_id: '',
                            slug: 'test',
                            name: 'PANDAN KAYA',
                            sectionDescription:
                                'WHAT’S INSIDE Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                            description: 'NANANA',
                            ingredients: ['test', 'test', 'test'],
                            imageSrc:
                                'https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80',
                            imageAlt: '',
                            price: 7,
                            unit: '8oz',
                        }}
                    />
                </div>
            </section>

            <section
                id="product-vegan-kaya"
                className="content-wrapper snap-start bg-ht-light-pink py-4"
            >
                <div className="content-container">
                    <ProductSection
                        product={{
                            id: 'vegan-kaya',
                            stripe_id: '',
                            slug: 'test2',
                            name: 'VEGAN PANDAN KAYA',
                            sectionDescription:
                                'WHAT’S INSIDE Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                            description: 'NANANA',
                            ingredients: ['test', 'test', 'test'],
                            imageSrc:
                                'https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80',
                            imageAlt: '',
                            price: 7,
                            unit: '8oz',
                        }}
                    />
                </div>
            </section>
        </div>
    );
}
