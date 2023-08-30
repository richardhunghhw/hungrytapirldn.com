export type JSONObject = { [key: string]: JSONValue };

export type JSONValue = JSONObject | Array<JSONValue> | string | number | boolean;

export type Product = {
  id: string;
  stripe_id: string;
  slug: string;

  name: string;
  sectionDescription: string;
  description: string;
  ingredients: string[];

  imageSrc: string;
  imageAlt: string;

  price: number;
  unit: string;
};
