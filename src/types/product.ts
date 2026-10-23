export type Asset = { src: string; width: number; height: number; source: string };
export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  type: string;
  sourceCategories: { name: string; url: string }[];
  images: (Asset & { alt: string })[];
  description: string[];
  specifications: { label: string; value: string }[];
  tables: string[][][];
  source: string;
};
