export type ContentType = 'general' | 'blog' | 'faq' | 'product' | 'stalldate';

function allContentTypes(): ContentType[] {
  return ['general', 'blog', 'product', 'faq', 'stalldate'];
}

export type EntryMetadata = {
  slug: string;
  title: string;
  tags: Array<string>;
};

export type BaseEntry = {
  type: ContentType;
  slug: string;
  metadata: EntryMetadata;
};

export type ContentStoreGeneralEntry = BaseEntry & {
  data: {
    general: Array<string>;
  };
};

export type ContentStoreBlogEntry = BaseEntry & {
  data: {
    blog: Array<string>;
  };
};

export type ContentStoreFaqEntry = BaseEntry & {
  data: {
    faq: Array<string>;
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

export type ContentStoreProductEntry = BaseEntry & {
  data: {
    stripeId: string;
    id: string;
    unit: string;
    price: number;
    primaryImage: string;
    primaryImageAlt: string;
    Ingredients: string[];
    product: Array<string>;
    productCart: Array<string>;
    productSection: Array<string>;
    imageColour: string;
    backgroundColour: string;
  };
};

export type ContentStoreEntry =
  | ContentStoreGeneralEntry
  | ContentStoreBlogEntry
  | ContentStoreFaqEntry
  | ContentStoreProductEntry
  | ContentStoreStallDateEntry;

export { allContentTypes };

export {
  getGeneral,
  listGenerals,
  getBlog,
  listBlogs,
  getProduct,
  listProducts,
  getFaq,
  listFaqs,
  listAll,
} from './get-content';

export { refreshEntries, refreshAllEntries } from './refresh-content';

export { validateRequest, makeUriFromContentTypeSlug, makeUrlFromContentTypeSlug, makeUrlFromContent } from './utils';
