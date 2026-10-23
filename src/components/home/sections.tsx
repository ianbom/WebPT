import Image from "next/image";
import Link from "next/link";
import { CheckSquare, ArrowRight } from "lucide-react";
import assets from "@/data/assets.json";
import { services, commitments } from "@/data/company";
import { CompanyFacts } from "./company-facts";
import { featuredProducts } from "@/data/catalog";
import { articles } from "@/data/articles";
import { ArrowLink, SectionHeading } from "@/components/shared";
import { ProductCard } from "@/components/products/product-card";
export function ServicesSection() {
  return <section className="services-section dark-section" id="layanan"><div className="container"><div className="service-intro"><SectionHeading label="Layanan Kami" title="Layanan Komprehensif untuk Mendukung Operasional Anda" /><p>Kami menyediakan solusi kebutuhan alat berat Anda, mulai dari penjualan unit, penyewaan equipment, hingga perawatan dan perbaikan. Dukungan spare part original melengkapi layanan kami untuk kelangsungan operasional usaha Anda.</p></div><div className="services-grid">{services.map((service, index) => <Link href={service.href} key={service.title} className="service-item"><span className="service-number">0{index + 1}</span><h3>{service.title}</h3><p>{service.short}</p><ArrowRight className="service-hover-arrow" size={20} aria-hidden="true" /></Link>)}</div></div></section>;
}
export function AboutSection() {
  return <section className="section about-section"><div className="container about-grid"><div className="about-left"><p className="eyebrow">Tentang Kami</p><h2>Mitra Terpercaya untuk Produktivitas Industri Indonesia</h2><div className="about-main-image dot-pattern"><Image src={assets.rental.src} alt="Scissor lift yang ditawarkan oleh Liftco Indo Perkasa" fill sizes="(max-width: 767px) 95vw, 570px" /></div></div><div className="about-right"><p>PT Liftco Indo Perkasa bergerak di bidang material handling dan maintenance building equipment. Berdiri sejak 2011, kami melayani kebutuhan penjualan dan rental forklift, lifting equipment, serta construction machinery untuk berbagai kegiatan industri.</p><p>Sebagai agen resmi HELI dan Mantall untuk penjualan, servis, dan spare part, kami mendampingi pelanggan dalam memilih equipment yang tepat guna. Dukungan kami mencakup perawatan, perbaikan, suku cadang original, trade-in, dan modifikasi equipment.</p><div className="about-secondary-image"><Image src={assets.heroBoom.src} alt="Equipment Mantall untuk pekerjaan di ketinggian" fill sizes="(max-width: 767px) 95vw, 570px" /></div><ArrowLink href="/tentang-kami">Mengenal Liftco</ArrowLink></div></div></section>;
}
export function FeaturedProducts() {
  return <section className="section dark-section featured-section"><div className="container"><SectionHeading label="Produk Kami" title="Pilihan Produk Terbaik untuk Kebutuhan Anda" href="/produk" linkLabel="Lihat Semua Produk" /><div className="product-grid featured-grid">{featuredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div></div></section>;
}
export function WhyChooseUs() {
  const advantages = ["Distributor resmi forklift HELI", "Garansi hingga 1 tahun atau 2.000 HM", "Dukungan layanan purna jual", "Ketersediaan spare part original"];
  return <section className="section why-section"><div className="container why-grid"><div><p className="eyebrow">Mengapa Kami</p><h2>Alasan Memilih Kami sebagai Mitra Bisnis Anda</h2><ul className="advantages">{advantages.map((item) => <li key={item}><CheckSquare size={17} aria-hidden="true" />{item}</li>)}</ul><CompanyFacts /></div><div className="why-image dot-pattern"><Image src={assets.service.src} alt="Pilihan forklift untuk kebutuhan industri" fill sizes="(max-width: 767px) 95vw, 570px" /></div></div></section>;
}
export function BrandsSection() {
  return <section className="brands-section"><div className="container"><SectionHeading label="Brand Produk Kami" title="Pilihan Brand untuk Mendukung Industri Anda" href="/produk" linkLabel="Jelajahi Produk" /><div className="brands-grid">{([{ key: "heli", name: "HELI" }, { key: "mantall", name: "Mantall" }, { key: "lcm", name: "LCM" }] as const).map((brand) => <Link key={brand.key} href={`/produk?brand=${brand.name}`} aria-label={`Produk ${brand.name}`}><Image src={assets[brand.key].src} alt={brand.name} width={assets[brand.key].width} height={assets[brand.key].height} /></Link>)}<Link href="/produk?brand=Dingli" className="brand-name" aria-label="Produk Dingli">DINGLI</Link></div></div></section>;
}
export function ArticlesSection() {
  return <section className="section articles-section"><div className="container"><SectionHeading label="Wawasan Industri" title="Wawasan Seputar Equipment Industri" href="/artikel" linkLabel="Lihat Semua Artikel" /><div className="articles-grid">{articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></div></section>;
}
export function ArticleCard({ article }: { article: (typeof articles)[number] }) {
  return <article className="article-card"><Link href={`/artikel/${article.slug}`}><div className="article-image"><Image src={article.image} alt={article.imageAlt} fill sizes="(max-width: 767px) 95vw, 380px" /></div><p className="article-category">Panduan Equipment</p><h3>{article.title}</h3><span className="article-arrow" aria-hidden="true"><ArrowRight size={19} /></span></Link></article>;
}
export function CommitmentsSection() {
  return <section className="commitments-section"><Image src={assets.heroBoom.src} alt="" fill sizes="100vw" /><div className="commitments-overlay" /><div className="container"><div className="commitments-panel"><p className="eyebrow">Komitmen Layanan Kami</p><h2>Lebih dari Equipment. Dukungan untuk Usaha Anda.</h2>{commitments.map((commitment) => <div key={commitment.title}><h3>{commitment.title}</h3><p>{commitment.text}</p></div>)}<ArrowLink href="/layanan">Kenali Layanan Kami</ArrowLink></div></div></section>;
}
