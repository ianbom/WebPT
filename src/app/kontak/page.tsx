import type { Metadata } from "next";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { company } from "@/data/company";
import { PageBanner } from "@/components/shared";
import { ContactForm } from "@/components/contact-form";
export const metadata: Metadata = { title: "Kontak", description: "Hubungi PT Liftco Indo Perkasa di Tangerang, Surabaya/Sidoarjo dan Semarang. Telepon 021-29672215 atau email marketing@liftco.co.id." };
export default function ContactPage() {
  return <div className="contact-page"><PageBanner title="Kontak" /><section className="section"><div className="container"><h2>Hubungi Kami untuk Solusi Terbaik Anda</h2><p className="page-intro">Sampaikan kebutuhan penjualan, rental, servis, atau spare part kepada tim Liftco. Hubungi kantor kami melalui telepon dan email, atau susun draf email melalui form berikut.</p><div className="contact-grid"><div className="contact-offices">{company.offices.map((office) => <article key={office.name}><h3>{office.name}</h3><div><MapPin aria-hidden="true" /><p>{office.address}</p></div>{office.phones.map((phone) => <a key={phone} href={`tel:+62${phone.slice(1).replaceAll("-", "")}`}><Phone aria-hidden="true" />{phone}</a>)}<a href={`mailto:${office.email}`}><Mail aria-hidden="true" />{office.email}</a><p className="office-hours">Senin - Jumat: 09.00 - 17.00</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.map)}`} target="_blank" rel="noopener noreferrer" className="map-link">Cari alamat di Google Maps <ExternalLink size={13} /></a></article>)}</div><ContactForm /></div></div></section></div>;
}
