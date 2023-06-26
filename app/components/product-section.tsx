/**
 * Component for a product as a section of a page
 */

import { Product } from '~/utils/types';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function ProductSection({
    product,
}: {
    product: Product;
}): JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center sm:flex-row sm:space-x-10">
            <div className="max-w-md">
                <img
                    className="rounded-md"
                    src={product.imageSrc}
                    alt={product.imageAlt}
                />
            </div>
            <div className="mt-4 flex-1 sm:mt-0">
                <div className="flex flex-col justify-center space-y-2 sm:space-y-8">
                    <div className="title flex flex-row items-start justify-between text-4xl md:text-5xl lg:text-6xl">
                        <h1>{product.name}</h1>
                        <span className="ml-8">£{product.price}</span>
                    </div>
                    <p className="prose text-lg md:text-2xl">
                        {product.sectionDescription}
                    </p>
                    <p className="text-base md:text-xl">{product.unit}</p>
                    <Input
                        type="number"
                        // id={product.form_id}
                        // name={product.form_id}
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
