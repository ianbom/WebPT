"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Pause, Play } from "lucide-react";
import { ArrowLink } from "@/components/shared";
import assets from "@/data/assets.json";
const slides = [
  { title: "Solusi Terpercaya untuk Material Handling Anda", text: "Distributor resmi forklift dan alat berat. Penjualan, rental, servis, serta dukungan spare part untuk operasional industri Anda.", image: assets.service.src, position: "center 42%", href: "/produk", cta: "Jelajahi Produk Kami" },
  { title: "Mitra Andal untuk Pekerjaan di Ketinggian", text: "Pilihan scissor lift dan boom lift untuk mendukung kebutuhan industri, konstruksi, dan perawatan bangunan.", image: assets.heroBoom.src, position: "center 40%", href: "/rental", cta: "Temukan Solusi Rental" },
  { title: "Dukungan Menyeluruh untuk Operasional Industri", text: "Sejak 2011, Liftco hadir dengan equipment dan layanan purna jual untuk kebutuhan usaha Anda.", image: assets.heroForklift.src, position: "center 40%", href: "/layanan", cta: "Jelajahi Layanan Kami" },
];
export function Hero() {
  const [autoplay] = useState(() => Autoplay({ delay: 5000, stopOnInteraction: true, stopOnFocusIn: true, stopOnMouseEnter: true, playOnInit: false }));
  const [emblaRef, api] = useEmblaCarousel({ loop: true, duration: 40 }, [autoplay]);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const select = useCallback(() => { if (api) setSelected(api.selectedScrollSnap()); }, [api]);
  useEffect(() => {
    if (!api) return;
    api.on("select", select);
    const play = () => setPlaying(true), stop = () => setPlaying(false);
    api.on("autoplay:play", play).on("autoplay:stop", stop);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { if (reduced.matches) autoplay.stop(); else autoplay.play(); };
    update(); reduced.addEventListener("change", update);
    return () => { api.off("select", select).off("autoplay:play", play).off("autoplay:stop", stop); reduced.removeEventListener("change", update); };
  }, [api, select, autoplay]);
  return <section className="hero" aria-label="Solusi Liftco" aria-roledescription="karusel"><div className="hero-viewport" ref={emblaRef}><div className="hero-track">{slides.map((slide, index) => <div key={slide.title} className="hero-slide" aria-hidden={selected !== index} inert={selected !== index} role="group" aria-roledescription="slide" aria-label={`${index + 1} dari ${slides.length}`}>
    <Image src={slide.image} alt={index === 0 ? "Forklift HELI untuk kebutuhan material handling industri" : index === 1 ? "Pilihan boom lift dan scissor lift Mantall" : "Rangkaian material handling equipment HELI"} fill sizes="(max-width: 767px) 1600px, 100vw" priority={index === 0} style={{ objectPosition: slide.position }} /><div className="hero-overlay" /><div className="container hero-content">{index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}<p>{slide.text}</p><ArrowLink href={slide.href}>{slide.cta}</ArrowLink></div>
  </div>)}</div></div><div className="container hero-controls"><div className="hero-dots" aria-label="Pilih slide">{slides.map((slide, index) => <button key={slide.title} aria-label={`Slide ${index + 1}`} aria-current={selected === index ? "true" : undefined} className={selected === index ? "selected" : ""} onClick={() => { autoplay.stop(); api?.scrollTo(index, window.matchMedia("(prefers-reduced-motion: reduce)").matches); }} />)}</div><button className="hero-pause" aria-label={playing ? "Jeda pergantian slide" : "Putar pergantian slide"} onClick={() => playing ? autoplay.stop() : autoplay.play()}>{playing ? <Pause size={14} /> : <Play size={14} />}</button></div></section>;
}
