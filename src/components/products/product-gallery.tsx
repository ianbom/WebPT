"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import type { Product } from "@/types/product";
export function ProductGallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const image = product.images[selected];
  return <div className="product-gallery"><button className="gallery-main" onClick={() => dialog.current?.showModal()} aria-label={`Perbesar gambar ${product.name}`}><Image src={image.src} alt={image.alt || product.name} fill priority sizes="(max-width: 767px) 95vw, 570px" /><span className="gallery-zoom"><ZoomIn size={21} /></span></button>{product.images.length > 1 && <div className="gallery-thumbnails" aria-label="Pilih gambar produk">{product.images.map((thumbnail, index) => <button key={thumbnail.src} className={selected === index ? "selected" : ""} aria-label={`Gambar ${index + 1}: ${thumbnail.alt}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><Image src={thumbnail.src} width={90} height={80} alt={thumbnail.alt} /></button>)}</div>}<dialog ref={dialog} className="gallery-dialog" aria-label={`Gambar diperbesar: ${product.name}`} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="gallery-dialog-inner"><button onClick={() => dialog.current?.close()} className="dialog-close" aria-label="Tutup gambar"><X /></button><Image src={image.src} width={image.width} height={image.height} alt={image.alt || product.name} sizes="90vw" /><p>{image.alt || product.name}</p></div></dialog></div>;
}
