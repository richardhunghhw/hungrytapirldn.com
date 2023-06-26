/**
 * Product page
 */

import { redirect } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { isProd } from '~/utils/misc';
import type { HTActionArgs } from '~/utils/types';
import type { ContentStoreProductEntry } from '~/services/content-store';
import { getProduct, validateRequest } from '~/services/content-store';

// Fetch product data content-store
export async function loader({
    request: { url },
    context,
    params,
}: HTActionArgs) {
    try {
        const urlPath = validateRequest(new URL(url));
        const result = await getProduct(context, urlPath.slug);
        console.log(urlPath.slug);
        if (!result) {
            throw new Error('Entry not found');
        }
        return result;
    } catch (error) {
        console.error(error); // TODO badlink
        if (isProd(context)) return redirect('/404');
    }
}

export default function Product() {
    const productData = useLoaderData<ContentStoreProductEntry>();
    if (!productData || !productData.data) return null;

    console.log(`product ${JSON.stringify(productData)}`);
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div className="flex flex-col items-center md:flex-row">
                <div className="basis-1/2">
                    <div className="mt-5">
                        <img
                            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                            alt="Photo by Drew Beamer"
                            className="rounded-md object-cover"
                        />
                    </div>
                </div>
                <div className="basis-1/2">
                    <div className="flex flex-col md:w-1/2">
                        <div className="items-left mt-5 flex flex-col justify-center">
                            <h1 className="text-6xl font-extrabold uppercase text-primary">
                                {productData.metadata.title}
                            </h1>
                            <p>{productData.data.unit}</p>
                            {productData.data.product.map((product, index) => {
                                console.log(product);
                                return <div key={index}>{product}</div>;
                            })}
                            <p>{productData.data.price}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row items-center">
                <div className="w-1/3">
                    {productData.data.Ingredients.map((ingredient) => (
                        <div key={ingredient}>{ingredient}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
