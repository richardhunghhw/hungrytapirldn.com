import { IKImage } from 'imagekitio-react';

const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/nixibbzora/';

type Image = {
  id: string;
  alt: string;
};

const images: {
  [key: string]: Image;
} = {
  landing: {
    id: 'hungrytapir/general/landing.png',
    alt: 'Landing Image Malaysian Store',
  },
  coconutTree: {
    id: 'hungrytapir/general/coconut-tree.jpg',
    alt: 'Coconut Tree',
  },
  kayaToast: {
    id: 'hungrytapir/general/kaya-toast.jpg',
    alt: 'Kaya Toast',
  },
};

type CDNImageProps = {
  name?: string;
  alt?: string;
  src?: string;
  lazy?: boolean;
  transformation?: Array<{ [key: string]: any }>;
  [key: string]: any;
};

function CDNImage({
  name,
  alt,
  src,
  lazy = true,
  transformation = [{ height: '400', width: '600', mode: 'fo-auto' }],
  ...rest
}: CDNImageProps) {
  if (!name && !(alt && src)) {
    return null;
  }

  if (name) {
    // Image by name ref
    const image = images[name];
    return (
      <IKImage
        urlEndpoint={IMAGEKIT_URL_ENDPOINT}
        path={image.id}
        alt={image.alt}
        lqip={{ active: true, quality: 10 }}
        loading={lazy ? 'lazy' : 'eager'}
        {...rest}
      />
    );
  } else {
    // Markdown image
    return (
      <IKImage
        urlEndpoint={IMAGEKIT_URL_ENDPOINT}
        src={src}
        alt={alt}
        lqip={{ active: true, quality: 10 }}
        loading='lazy'
        transformation={transformation}
        {...rest}
      />
    );
  }
}

export { type CDNImageProps, CDNImage };
