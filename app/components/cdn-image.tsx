import { IKImage } from 'imagekitio-react';
import { IMAGEKIT_URL_ENDPOINT } from '~/services/image-store';

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
  id?: string;
  [key: string]: any;
};

function CDNImage(props: CDNImageProps) {
  const { name, alt, src, ...rest } = props;

  console.log('CDNImage', name, alt, src, rest);

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
        lqip={{ active: true, quality: 20 }}
        loading='lazy'
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
        lqip={{ active: true, quality: 20 }}
        loading='lazy'
        transformation={[
          {
            height: '500',
            width: '800',
            mode: 'fo-auto',
          },
        ]}
        {...rest}
      />
    );
  }
}

export { type CDNImageProps, CDNImage };
