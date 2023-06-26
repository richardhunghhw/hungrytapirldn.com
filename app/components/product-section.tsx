/**
 * Component for a product as a section of a page
 */

import { Button } from './ui/button';
import { Input } from './ui/input';
import type { ContentStoreProductEntry } from '~/services/content-store';

export default function ProductSection({
    product,
}: {
    product: ContentStoreProductEntry;
}): JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center sm:flex-row sm:space-x-10">
            <div className="max-w-md">
                <img
                    className="rounded-md"
                    src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
                    alt=""
                />
            </div>
            <div className="mt-4 flex-1 sm:mt-0">
                <div className="flex flex-col justify-center space-y-2 sm:space-y-8">
                    <div className="title flex flex-row items-start justify-between text-4xl md:text-5xl lg:text-6xl">
                        <h1>{product.metadata.title}</h1>
                        <span className="ml-8">£{product.data.price}</span>
                    </div>
                    <p className="prose text-lg md:text-2xl">
                        {product.data.productSection}
                    </p>
                    <p className="text-base md:text-xl">{product.data.unit}</p>
                    <Input
                        type="number"
                        id={product.data.id}
                        name={product.data.id}
                        className="border-none focus:border-none active:border-none"
                        min="0"
                        max="10"
                        defaultValue="0"
                    />

                    <Button variant="secondary">ADD TO CART</Button>
                </div>
            </div>
        </div>
    );
}
