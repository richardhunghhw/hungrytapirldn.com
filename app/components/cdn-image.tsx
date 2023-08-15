import { IKImage } from 'imagekitio-react';

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
  name: string;
  [key: string]: any;
};

function CDNImage(props: CDNImageProps) {
  const { name, ...rest } = props;
  const image = images[name];
  return <IKImage urlEndpoint='https://ik.imagekit.io/nixibbzora/' path={image.id} alt={image.alt} {...rest} />;
}

export { type CDNImageProps, CDNImage };
