import { ReactNode, Suspense } from 'react';
import type { V2_MetaArgs } from '@remix-run/react';
import { Await, Link, useLoaderData } from '@remix-run/react';
import { defer, type LoaderArgs } from '@remix-run/cloudflare';

import { Button } from '~/components/ui/button';
import type { ContentStoreProductEntry } from '~/server/entities/content';
import { makeUriFromContentTypeSlug } from '~/utils/content';
import { TapirTransparent } from '~/utils/svg/tapir';
import { AspectRatio } from '~/components/ui/aspect-ratio';
import { AddToBag } from '~/components/add-to-bag';
import { getSeoMetas } from '~/utils/seo';
import type { loader as rootLoader } from '~/root';
import { CDNImage } from '~/components/cdn-image';
import { Skeleton } from '~/components/ui/skeleton';

const circle = () => <div className='h-4 w-4 rounded-full bg-ht-black' />;

const star = () => (
  <div
    className='h-4 w-4 bg-gff-gold'
    style={{
      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    }}
  />
);

export function meta({ matches, location, data }: V2_MetaArgs<typeof loader, { root: typeof rootLoader }>) {
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  return getSeoMetas({
    url: hostUrl + location.pathname,
    title: 'Hungry Tapir | Best Kaya in London',
    description:
      "Handmade, cult-favourite South-East Asian foods in London. Taste the city's best Kaya, crafted in small batches. Order online here.",
  });
}

export async function loader({
  context: {
    services: { content },
  },
}: LoaderArgs) {
  return defer({
    orderNow: content.getGeneral('section~order-now'),
    whatKaya: content.getGeneral('section~what-is-kaya'),
    kayaPandan: content.getProduct('the-pandan-kaya'),
    kayaVegan: content.getProduct('the-vegan-kaya'),
  });
}

function ProductCard({ product }: { product: ContentStoreProductEntry }): JSX.Element {
  const aspectRatio = 8 / 9;

  return (
    <div className='flex w-full flex-grow flex-col items-center justify-center space-y-4 rounded-3xl text-ht-black md:w-fit md:border-2 md:border-ht-black md:p-6 lg:p-12'>
      <div className='order-first w-[260px] overflow-hidden sm:w-[320px] md:order-none md:w-[280px] lg:w-[320px]'>
        <AspectRatio ratio={aspectRatio}>
          <CDNImage
            alt={product.data.images[0].alt}
            src={product.data.images[0].url}
            className='h-full w-full object-cover'
            transformation={[{ height: '600', width: '600', mode: 'fo-auto', progressive: true }]}
          />
        </AspectRatio>
      </div>
      <Link
        className='title flex flex-col items-center text-center text-4xl'
        to={makeUriFromContentTypeSlug('product', product.metadata.slug) as string}
      >
        {product.metadata.title.split(' ').map((word, i) => (
          <span key={i}>{word}</span>
        ))}
      </Link>
      <div className='text-2xl font-extrabold text-black'>£{product.data.price}</div>
      <AddToBag
        slug={product.slug}
        enabled={product.data.enabled}
        className='w-full max-w-[260px] sm:max-w-[320px] md:max-w-[280px] lg:max-w-[320px]'
      />
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className='flex w-full flex-grow flex-col items-center justify-center space-y-4 rounded-3xl text-ht-black md:w-fit md:border-2 md:border-ht-black md:p-6 lg:p-12'>
      <Skeleton className='h-60 w-[260px] sm:w-[320px] md:w-[280px] lg:w-[320px]' />
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className='flex w-full flex-grow flex-col items-center justify-center space-y-4 overflow-x-hidden'>
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-6 w-full' />
    </div>
  );
}

export default function Index() {
  const { orderNow, whatKaya, kayaPandan, kayaVegan } = useLoaderData<typeof loader>();

  return (
    <main className='snap-y snap-normal'>
      <header
        id='landing'
        className='flex h-[calc(100vh-200px)] snap-start flex-col items-center justify-center bg-ht-pink-highlight font-bold text-ht-green-highlight md:h-[calc(100vh-100px)]'
      >
        <div className='content-container flex flex-col items-center justify-center'>
          <div className='absolute inset-0'>
            <CDNImage
              name='landing'
              className='h-[calc(100vh-200px)] w-screen object-cover md:h-[calc(100vh-100px)]'
              lazy={false}
              transformation={[{ progressive: true }]}
            />
          </div>
          <div className='absolute flex flex-col items-center'>
            <TapirTransparent className='text-5xl md:text-8xl' />
            <h1 className='title text-center text-5xl tracking-[.5em] md:text-7xl'>WE MAKE KAYA</h1>
          </div>
        </div>
      </header>

      <section className='content-wrapper hidden h-[3.8rem] snap-start bg-ht-off-white py-4 sm:block' id='banner'>
        <div className='content-container'>
          <ul className='title flex flex-row items-center justify-between space-x-4 overflow-hidden whitespace-nowrap text-xl text-ht-black'>
            <li>HOMEMADE</li>
            <li>{circle()}</li>
            <li>SMALL-BATCH</li>
            <li>{circle()}</li>
            <li>PRESERVATIVE FREE</li>
            <li className='hidden lg:block'>{circle()}</li>
            <li className='hidden lg:block'>MADE WITH CARE</li>
          </ul>
        </div>
      </section>

      <section id='what-is-kaya' className='content-wrapper snap-start bg-ht-green py-6 md:py-16'>
        <div className='content-container flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0 lg:space-x-16'>
          <div className='w-[calc(100vw-2.4rem)] overflow-hidden rounded-3xl sm:w-[calc(100vw-3.2rem)] md:w-[64rem]'>
            <AspectRatio ratio={8 / 11}>
              <CDNImage
                name='kayaToast'
                className='h-full w-full object-cover'
                transformation={[{ progressive: true }]}
              />
            </AspectRatio>
          </div>
          <div className='flex w-full flex-grow flex-col items-start justify-center space-y-4 rounded-3xl px-4 text-left font-mono text-ht-black md:w-auto md:max-w-[70%] md:items-center md:space-y-10 md:border-2 md:border-ht-black md:p-8'>
            <h2 className='title font-serif text-2xl md:text-4xl'>What is kaya?</h2>
            <hr className='w-full border-2 border-ht-black md:hidden' />
            <Suspense fallback={<SectionSkeleton />}>
              <Await resolve={whatKaya}>
                {(whatKaya) =>
                  Array.prototype.map.call(whatKaya.data.general, (item, index) => (
                    <p key={index}>{item}</p>
                  )) as ReactNode[]
                }
              </Await>
            </Suspense>
          </div>
        </div>
      </section>

      <section className='content-wrapper hidden h-[3.8rem] snap-start bg-ht-black py-4 sm:block' id='banner'>
        <div className='content-container'>
          <ul className='title flex flex-row items-center justify-center space-x-4 overflow-hidden whitespace-nowrap text-xl text-ht-off-white'>
            <li className='flex space-x-1'>
              {star()}
              {star()}
              {star()}
            </li>
            <li>Three Star Great Taste Awards 2024</li>
            <li className='flex space-x-1'>
              {star()}
              {star()}
              {star()}
            </li>
          </ul>
        </div>
      </section>

      <section id='order-now' className='content-wrapper snap-start bg-ht-pink py-6 md:py-16'>
        <div className='content-container flex flex-col-reverse items-center space-y-4 space-y-reverse md:flex-row md:space-x-4 md:space-y-0 lg:space-x-16'>
          <div className='flex flex-grow flex-col items-start justify-center space-y-4 rounded-3xl px-4 text-left font-mono text-ht-black md:w-auto md:max-w-[70%] md:items-center md:space-y-10 md:border-2 md:border-ht-black md:p-8 md:text-center'>
            <h2 className='title font-serif text-2xl md:text-4xl'>Pandan</h2>
            <h2 className='title font-serif text-2xl md:text-4xl'>Coconut Milk</h2>
            <h2 className='title font-serif text-2xl md:text-4xl'>Gula Melaka</h2>
            <hr className='w-full border-2 border-ht-black md:hidden' />
            <Suspense fallback={<SectionSkeleton />}>
              <Await resolve={orderNow}>
                {(orderNow) =>
                  Array.prototype.map.call(orderNow.data.general, (item, index) => (
                    <p key={index}>{item}</p>
                  )) as ReactNode[]
                }
              </Await>
            </Suspense>
            <Button variant='outline' size='lg' className='px-16'>
              ORDER NOW
            </Button>
          </div>
          <div className='w-[calc(100vw-2.4rem)] overflow-hidden rounded-3xl sm:w-[calc(100vw-3.2rem)] md:w-[42rem]'>
            <AspectRatio ratio={8 / 11}>
              <CDNImage
                name='coconutTree'
                className='h-full w-full object-cover'
                transformation={[{ progressive: true }]}
              />
            </AspectRatio>
          </div>
        </div>
      </section>

      <section id='product-cards' className='content-wrapper snap-start bg-ht-orange py-8 md:py-16'>
        <div className='content-container flex flex-col space-y-12 md:flex-row md:space-x-4 md:space-y-0 lg:space-x-16'>
          <Suspense fallback={<ProductCardSkeleton />}>
            <Await resolve={kayaPandan}>{(kayaPandan) => <ProductCard product={kayaPandan} />}</Await>
          </Suspense>
          <Suspense fallback={<ProductCardSkeleton />}>
            <Await resolve={kayaVegan}>{(kayaVegan) => <ProductCard product={kayaVegan} />}</Await>
          </Suspense>
        </div>
      </section>
    </main>
  );
}
