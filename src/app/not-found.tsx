import Link from "next/link";
export default function NotFound() {
  return <section className="section"><div className="container not-found"><p className="eyebrow">404 / Halaman Tidak Ditemukan</p><h1>Halaman yang Anda cari tidak tersedia.</h1><p>Kembali ke beranda atau jelajahi katalog equipment Liftco.</p><div className="flex flex-wrap justify-center gap-4"><Link className="solid-button" href="/">Beranda</Link><Link className="solid-button" href="/produk">Lihat Produk</Link></div></div></section>;
}
