"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import assets from "@/data/assets.json";
import { company, navigation } from "@/data/company";
export function Footer() {
  const compact = usePathname() === "/kontak";
  return <footer className={`site-footer ${compact ? "compact-footer" : ""}`}>
    {!compact && <div className="container footer-main"><div className="footer-intro"><Link className="footer-logo" href="/"><Image src={assets.logo.src} width={260} height={51} alt="PT Liftco Indo Perkasa" /></Link><h2>Temukan Solusi Terbaik untuk Kebutuhan Anda</h2><div className="footer-actions"><Link href="/kontak" className="solid-button">Hubungi Kami <ArrowRight size={15} /></Link><Link href="/produk" className="solid-button light">Lihat Katalog <ArrowRight size={15} /></Link></div><p className="footer-tagline">Sales · Rental · Service · Spare Part · Trade In</p></div><div><h3>Navigasi Cepat</h3><nav aria-label="Navigasi footer" className="footer-nav">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/kontak">Kontak</Link></nav><div className="footer-offices">{company.offices.map((office) => <div key={office.name}><h3>{office.name}</h3>{office.phones.map((phone) => <a key={phone} href={`tel:+62${phone.slice(1).replaceAll("-", "")}`}><Phone />{phone}</a>)}<a href={`mailto:${office.email}`}><Mail />{office.email}</a><p><MapPin />{office.address}</p></div>)}</div></div></div>}
    <div className="footer-bottom container"><p>Copyright {new Date().getFullYear()} © PT Liftco Indo Perkasa</p>{compact && <Link href="/">Kembali ke Beranda <ArrowRight size={14} /></Link>}</div>
  </footer>;
}
