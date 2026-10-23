import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import assets from "@/data/assets.json";
export function ArrowLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return <Link href={href} className={`arrow-link ${className}`} data-reveal="up">{children}<ArrowRight aria-hidden="true" /></Link>;
}
export function SectionHeading({ label, title, href, linkLabel = "Lihat Selengkapnya" }: { label: string; title: string; href?: string; linkLabel?: string }) {
  return <div className="section-heading"><div><p className="eyebrow" data-reveal="fade">{label}</p><h2 data-reveal="up" data-reveal-delay="90">{title}</h2></div>{href && <ArrowLink href={href}>{linkLabel}</ArrowLink>}</div>;
}
export function PageBanner({ title, image = assets.service.src, position = "center" }: { title: string; image?: string; position?: string }) {
  return <section className="page-banner"><Image src={image} alt="" fill priority sizes="100vw" className="banner-image" style={{ objectPosition: position }} /><div className="banner-overlay" /><div className="container"><h1 data-initial-reveal="up">{title}</h1></div></section>;
}
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="breadcrumb" aria-label="Jejak navigasi"><Link href="/">Beranda</Link>{items.map((item, index) => <span key={index}><span aria-hidden="true">/</span>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>;
}
