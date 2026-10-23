import type { Metadata } from "next";
import { Suspense } from "react";
import { PageBanner, SectionHeading } from "@/components/shared";
import { Catalog } from "@/components/products/catalog";
export const metadata: Metadata = { title: "Produk", description: "Jelajahi 68 pilihan forklift HELI, scissor lift, boom lift, warehouse equipment dan construction machinery. Filter produk berdasarkan kategori, brand dan tipe." };
export default function ProductsPage() {
  return <><PageBanner title="Produk Kami" /><section className="section"><div className="container"><SectionHeading label="Produk Kami" title="Pilihan Produk Terbaik untuk Kebutuhan Anda" /><Suspense fallback={<p className="catalog-loading">Memuat katalog produk...</p>}><Catalog /></Suspense></div></section></>;
}
