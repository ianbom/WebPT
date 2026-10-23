import type { MetadataRoute } from "next";
import { products } from "@/data/catalog";
import { articles } from "@/data/articles";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://liftcoindoperkasa.co.id";
  return ["", "/tentang-kami", "/produk", "/layanan", "/rental", "/kontak", "/artikel", ...products.map((product) => `/produk/${product.slug}`), ...articles.map((article) => `/artikel/${article.slug}`)].map((path) => ({ url: `${base}${path}` }));
}
