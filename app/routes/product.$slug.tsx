/**
 * Product page
 */

import { type ActionArgs, redirect, json } from '@remix-run/cloudflare';
import type { V2_MetaArgs } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import { isProd } from '~/utils/misc';
import type { ContentStoreProductEntry } from '~/server/entities/content';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { AddToBag } from '~/components/add-to-bag';
import { getSeoMetas } from '~/utils/seo';
import type { loader as rootLoader } from '~/root';
import { MarkdownContent, MarkdownLine } from '~/components/markdown-content';
import { CDNImage } from '~/components/cdn-image';
import { validateRequest } from '~/utils/content';

export function meta({ matches, location, data }: V2_MetaArgs<typeof loader, { root: typeof rootLoader }>) {
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  return getSeoMetas({
    url: hostUrl + location.pathname,
    title: data?.metadata?.title ? data.metadata.title + ' | Hungry Tapir' : undefined,
    // description: data?.metadata?.description, TODO SEO Description
  });
}

export async function loader({ request: { url }, context, params }: ActionArgs) {
  // Fetch product data content-store
  try {
    const urlPath = validateRequest(new URL(url));
    const result = await context.services.content.getProduct(urlPath.slug);
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
  const productContent = productData.data.product;

  const aspectRatio = 8 / 9;

  return (
    <div className={`content-wrapper min-h-screen bg-${productData.data.backgroundColour} h-full`}>
      <div className='content-container my-24 flex flex-col items-center justify-center'>
        <div className='mt-4 flex flex-col items-center space-y-4 md:flex-row md:space-x-8 md:space-y-0'>
          <div className='w-[350px] basis-1/2 self-center overflow-hidden rounded-3xl md:self-baseline'>
            <AspectRatio ratio={aspectRatio}>
              <CDNImage
                alt={productData.data.images[0].alt}
                src={productData.data.images[0].url}
                className='h-full w-full object-cover'
                transformation={[]}
              />
            </AspectRatio>
          </div>
          <div className='items-left flex basis-1/2 flex-col justify-center space-y-6 text-sm md:w-1/2'>
            <header className='title flex flex-row items-end justify-between text-4xl uppercase text-primary sm:text-5xl md:text-5xl'>
              <h1>{productData.metadata.title}</h1>
              <p>£{productData.data.price}</p>
            </header>
            <div>
              <h2 className='title mb-2 text-2xl'>Why we love it</h2>
              <MarkdownContent data={productContent} />
            </div>
            <div>
              <h2 className='title mb-2 text-2xl'>What's Inside</h2>
              <MarkdownLine data={productData.data.ingredients} />
            </div>
            <p className='font-bold'>{productData.data.unit}</p>
            <AddToBag slug={productData.slug} className='text-white' />
          </div>
        </div>
      </div>
    </div>
  );
}
