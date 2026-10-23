import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/product";
export function ProductCard({ product }: { product: Product }) {
  return <article className="product-card" data-reveal="up"><Link href={`/produk/${product.slug}`} className="product-card-link"><div className="product-card-image"><Image src={product.images[0].src} alt={product.name} fill sizes="(max-width: 600px) 90vw, (max-width: 1024px) 42vw, 285px" /></div><div className="product-card-content"><p className="product-meta"><span>{product.brand}</span><span aria-hidden="true">•</span><span>{product.type}</span></p><h3>{product.name}</h3><span className="product-link">Lihat Produk <ArrowRight size={17} aria-hidden="true" /></span></div></Link></article>;
}
