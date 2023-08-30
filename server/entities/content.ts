export type ContentType = 'general' | 'blog' | 'faq' | 'product' | 'stalldate';

function allContentTypes(): ContentType[] {
  return ['general', 'blog', 'product', 'faq', 'stalldate'];
}

export type EntryMetadata = {
  slug: string;
  title: string;
  tags: Array<string>;
  category: string;
};

export type BaseEntry = {
  type: ContentType;
  slug: string;
  metadata: EntryMetadata;
};

export type ContentStoreGeneralEntry = BaseEntry & {
  data: {
    general: Array<string>;
    url: string;
  };
};

export type ContentStoreBlogEntry = BaseEntry & {
  data: {
    blog: Array<string>;
    seoDescription: string;
  };
};

export type ContentStoreFaqEntry = BaseEntry & {
  data: {
    faq: Array<string>;
    productSectionRef: string;
    seoDescription: string;
  };
};

export type ContentStoreProductEntry = BaseEntry & {
  data: {
    stripeId: string;
    id: string;
    unit: string;
    price: number;
    images: {
      url: string;
      alt: string;
    }[];
    ingredients: string;
    product: Array<string>;
    productCart: Array<string>;
    productSection: Array<string>;
    imageColour: string;
    backgroundColour: string;
    seoDescription: string;
  };
};

export type ContentStoreStallDateEntry = BaseEntry & {
  data: {
    location: string;
    startDT: string;
    endDT: string;
    collectionEnabled: boolean;
  };
};

export type ContentStoreEntry =
  | ContentStoreGeneralEntry
  | ContentStoreBlogEntry
  | ContentStoreFaqEntry
  | ContentStoreProductEntry
  | ContentStoreStallDateEntry;

export { allContentTypes };
