/**
 * Component for a product as a section of a page
 */

import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { ContentStoreProductEntry } from '~/server/entities/content';

export default function ProductSection({ product }: { product: ContentStoreProductEntry }): JSX.Element {
  const aspectRatio = 8 / 9;

  return (
    <div className='flex flex-col items-center justify-center sm:flex-row sm:space-x-10'>
      <div className='w-[350] overflow-hidden'>
        <AspectRatio ratio={aspectRatio}>
          <img
            src={product.data.primaryImage}
            alt={product.data.primaryImageAlt}
            className='h-full w-full object-cover'
          />
        </AspectRatio>
      </div>
      <div className='mt-4 flex-1 sm:mt-0'>
        <div className='flex flex-col justify-center space-y-2 sm:space-y-8'>
          <div className='title flex flex-row items-start justify-between text-4xl md:text-5xl lg:text-6xl'>
            <h1>{product.metadata.title}</h1>
            <span className='ml-8'>£{product.data.price}</span>
          </div>
          <p className='text-lg md:text-xl'>{product.data.productSection}</p>
          <p className='text-base md:text-xl'>{product.data.unit}</p>
          <Input
            type='number'
            id={product.data.id}
            name={product.data.id}
            className='border-none focus:border-none active:border-none'
            min='0'
            max='10'
            defaultValue='0'
          />

          <Button variant='secondary'>ADD TO CART</Button>
        </div>
      </div>
    </div>
  );
}
