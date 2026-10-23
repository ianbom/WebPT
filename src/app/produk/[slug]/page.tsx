import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckSquare } from "lucide-react";
import { products } from "@/data/catalog";
import { inquiryEmail, relatedProducts } from "@/lib/catalog";
import { Breadcrumb, SectionHeading } from "@/components/shared";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductCard } from "@/components/products/product-card";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((product) => product.slug === slug);
  return { title: product?.name || "Produk Tidak Ditemukan", description: product ? `${product.name}. Informasi produk ${product.brand}, spesifikasi dan konsultasi kebutuhan equipment bersama PT Liftco Indo Perkasa.` : undefined };
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((product) => product.slug === slug);
  if (!product) notFound();
  const model = product.specifications.find((specification) => /model|tipe/i.test(specification.label));
  return <><section className="product-detail section"><div className="container"><Breadcrumb items={[{ label: "Produk", href: "/produk" }, { label: product.name }]} /><div className="product-detail-grid"><ProductGallery product={product} /><div className="product-summary"><p className="product-meta">{product.brand}<span>•</span>{product.type}</p><h1>{product.name}</h1><dl><div><dt>Brand</dt><dd>{product.brand}</dd></div><div><dt>Kategori</dt><dd>{product.category}</dd></div><div><dt>{model ? "Model" : "Tipe Equipment"}</dt><dd>{model?.value || product.type}</dd></div></dl><div className="inquiry-panel"><h2>Informasi Produk & Pemesanan?</h2><p>Konsultasikan kebutuhan, konfigurasi, dan ketersediaan unit dengan tim Liftco.</p><a href={inquiryEmail(product.name)} className="solid-button">Hubungi Kami <ArrowRight size={16} /></a></div></div></div><div className="product-description"><h2>Deskripsi Produk</h2>{product.description.length ? product.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>Informasi {product.name} dari katalog PT Liftco Indo Perkasa. Hubungi tim kami untuk membahas penggunaan dan konfigurasi equipment yang sesuai.</p>}<h2>Spesifikasi Produk</h2>{product.specifications.length > 0 && <dl className="specifications">{product.specifications.map((specification, index) => <div key={`${specification.label}-${index}`}><dt>{specification.label}</dt><dd>{specification.value}</dd></div>)}</dl>}{product.tables.map((table, index) => <div className="table-scroll" tabIndex={0} role="region" aria-label={`Tabel spesifikasi ${index + 1}`} key={index}><table><caption>Data spesifikasi dari katalog resmi</caption><tbody>{table.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => rowIndex === 0 ? <th scope="col" key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>)}{!product.specifications.length && !product.tables.length && <p>Spesifikasi terperinci tersedia pada gambar atau diagram produk, jika dicantumkan dalam galeri. Untuk konfigurasi model ini, hubungi tim Liftco.</p>}<p className="spec-note">Data mengikuti katalog sumber. Gambar keluarga produk dapat dipakai bersama oleh beberapa model pada katalog resmi. Konfirmasikan konfigurasi dan spesifikasi unit sebelum pemesanan.</p></div></div></section><div className="product-support dark-section"><div className="container"><span><CheckSquare />Garansi hingga 1 tahun atau 2.000 HM</span><span><CheckSquare />Dukungan spare part original</span><span><CheckSquare />Layanan purna jual</span></div></div><section className="section"><div className="container"><SectionHeading label="Rekomendasi Produk" title="Jelajahi Produk Lainnya dari Kami" href="/produk" linkLabel="Lihat Semua Produk" /><div className="product-grid featured-grid">{relatedProducts(products, product).map((related) => <ProductCard key={related.slug} product={related} />)}</div><Link href="/kontak" className="sr-only">Kontak dan kantor Liftco</Link></div></section></>;
}
