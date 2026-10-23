import type { Product } from "../types/product.ts";
export type Filters = { categories: string[]; brands: string[]; types: string[] };
export function filterProducts(products: Product[], filters: Filters) {
  return products.filter((product) =>
    (!filters.categories.length || filters.categories.includes(product.category)) &&
    (!filters.brands.length || filters.brands.includes(product.brand)) &&
    (!filters.types.length || filters.types.includes(product.type))
  );
}
export function paginateProducts(products: Product[], page: number, pageSize = 9) {
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const currentPage = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  return { items: products.slice((currentPage - 1) * pageSize, currentPage * pageSize), totalPages, currentPage };
}
export function relatedProducts(products: Product[], current: Product) {
  return products.filter((product) => product.slug !== current.slug)
    .sort((first, second) => Number(second.type === current.type) - Number(first.type === current.type) || Number(second.category === current.category) - Number(first.category === current.category)).slice(0, 4);
}
export function inquiryEmail(productName: string) {
  return `mailto:marketing@liftco.co.id?subject=${encodeURIComponent(`Informasi produk - ${productName.replace(/[\r\n]+/g, " ")}`)}`;
}
