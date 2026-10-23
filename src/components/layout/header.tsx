"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import assets from "@/data/assets.json";
import { navigation, productCategories } from "@/data/company";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/components/ui/sheet";
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return <header className="site-header"><div className="header-row">
    <Link href="/" className="header-logo" aria-label="Liftco Indo Perkasa - Beranda"><Image src={assets.logo.src} width={390} height={76} alt="PT Liftco Indo Perkasa" priority /></Link>
    <nav className="desktop-navigation" aria-label="Navigasi utama">{navigation.map((item) => item.href === "/produk" ? <div className="nav-dropdown" key={item.href} onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setProductsOpen(false); }}>
      <div className="nav-product"><Link href={item.href} className={active(item.href) ? "active" : ""} aria-current={active(item.href) ? "page" : undefined}>{item.label}</Link><button aria-label="Buka kategori produk" aria-expanded={productsOpen} aria-controls="desktop-product-menu" onClick={() => setProductsOpen(!productsOpen)} onKeyDown={(event) => { if (event.key === "Escape") setProductsOpen(false); }}><ChevronDown size={13} /></button></div>
      <div id="desktop-product-menu" className={`nav-submenu ${productsOpen ? "is-open" : ""}`} onKeyDown={(event) => { if (event.key === "Escape") { setProductsOpen(false); (event.currentTarget.previousElementSibling?.querySelector("button") as HTMLButtonElement)?.focus(); } }}>{productCategories.map((category) => <Link key={category} href={`/produk?kategori=${encodeURIComponent(category)}`} onClick={() => setProductsOpen(false)}>{category}</Link>)}</div>
    </div> : <Link key={item.href} href={item.href} className={active(item.href) ? "active" : ""} aria-current={active(item.href) ? "page" : undefined}>{item.label}</Link>)}</nav>
    <Link href="/kontak" className="header-contact">Kontak</Link>
    <Sheet open={open} onOpenChange={setOpen}><SheetTrigger asChild><button className="mobile-toggle" aria-label="Buka menu navigasi"><Menu size={36} strokeWidth={1.5} /></button></SheetTrigger><SheetContent className="mobile-sheet" showCloseButton={false}>
      <div className="flex items-center justify-between border-b pb-6"><Image src={assets.logo.src} width={220} height={43} alt="PT Liftco Indo Perkasa" /><SheetClose className="mobile-close" aria-label="Tutup menu"><X /></SheetClose></div><SheetTitle className="sr-only">Navigasi utama</SheetTitle><SheetDescription className="sr-only">Halaman dan kategori produk Liftco Indo Perkasa.</SheetDescription>
      <nav aria-label="Navigasi seluler">{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active(item.href) ? "page" : undefined}>{item.label}</Link>)}<Link href="/kontak" onClick={() => setOpen(false)}>Kontak</Link></nav><div className="mobile-categories"><p className="eyebrow">Kategori Produk</p>{productCategories.map((category) => <Link key={category} href={`/produk?kategori=${encodeURIComponent(category)}`} onClick={() => setOpen(false)}>{category}</Link>)}</div><a className="mobile-email" href="mailto:marketing@liftco.co.id">marketing@liftco.co.id</a>
    </SheetContent></Sheet>
  </div></header>;
}
