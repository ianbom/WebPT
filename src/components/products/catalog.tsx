"use client";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/catalog";
import { productCategories } from "@/data/company";
import { filterProducts, paginateProducts, type Filters } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
const brands = [...new Set(products.map((product) => product.brand))].sort();
const types = [...new Set(products.map((product) => product.type))].sort();
export function Catalog() {
  const params = useSearchParams();
  const requestedCategory = params.get("kategori") || "";
  const requestedBrand = params.get("brand") || "";
  return <CatalogControls key={`${requestedCategory}-${requestedBrand}`} initialFilters={{ categories: productCategories.includes(requestedCategory) ? [requestedCategory] : [], brands: brands.includes(requestedBrand) ? [requestedBrand] : [], types: [] }} />;
}
function CatalogControls({ initialFilters }: { initialFilters: Filters }) {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [allTypes, setAllTypes] = useState(false);
  const filtered = useMemo(() => filterProducts(products, filters), [filters]);
  const { items, totalPages, currentPage } = paginateProducts(filtered, page);
  const selectedCount = Object.values(filters).flat().length;
  const toggle = (group: keyof Filters, value: string) => { setFilters((current) => ({ ...current, [group]: current[group].includes(value) ? current[group].filter((item) => item !== value) : [...current[group], value] })); setPage(1); };
  const reset = () => { setFilters({ categories: [], brands: [], types: [] }); setPage(1); };
  const goTo = (nextPage: number) => { setPage(nextPage); document.querySelector("#catalog-results")?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); };
  return <><div className="catalog-toolbar"><p aria-live="polite">{filtered.length} produk{selectedCount > 0 && ` · ${selectedCount} filter aktif`}</p><Button variant="outline" className="filter-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="product-filters"><SlidersHorizontal size={16} />Filter Produk</Button></div><div className="catalog-layout"><aside id="product-filters" aria-label="Filter produk" className={`catalog-filters ${mobileOpen ? "filters-open" : ""}`}>
    {([{ key: "categories", title: "Kategori Produk", options: productCategories }, { key: "brands", title: "Kategori Brand", options: brands }, { key: "types", title: "Tipe Equipment", options: allTypes ? types : types.slice(0, 10) }] as const).map((group) => <fieldset key={group.key}><legend>{group.title}</legend>{group.options.map((option) => <label key={option} className="filter-option"><Checkbox checked={filters[group.key].includes(option)} onCheckedChange={() => toggle(group.key, option)} /><span>{option}</span></label>)}{group.key === "types" && <button className="filter-more" onClick={() => setAllTypes(!allTypes)}>{allTypes ? "Tampilkan Lebih Sedikit" : "Lihat Lebih Banyak"}</button>}</fieldset>)}<button className="filter-reset" onClick={reset} disabled={!selectedCount}>Reset Filter</button>
    </aside><div id="catalog-results" className="catalog-results"><div className="product-grid catalog-grid" data-reveal-group>{items.map((product) => <ProductCard key={product.slug} product={product} />)}</div>{!items.length && <div className="empty-results" role="status"><h3>Tidak ada produk yang sesuai.</h3><p>Ubah pilihan kategori, brand, atau tipe equipment.</p><Button onClick={reset}>Tampilkan Semua Produk</Button></div>}{totalPages > 1 && <nav className="pagination" aria-label="Halaman katalog"><button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} aria-label="Halaman sebelumnya"><ArrowLeft size={17} /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} onClick={() => goTo(number)} aria-label={`Halaman ${number}`} aria-current={number === currentPage ? "page" : undefined}>{number}</button>)}<button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Halaman berikutnya"><ArrowRight size={17} /></button></nav>}</div></div></>;
}
