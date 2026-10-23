"use client";
import Link from "next/link";
import { ArrowUp, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
export function FloatingControls() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const update = () => setVisible(window.scrollY > 500); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  return <><Link href="/kontak" className="floating-contact" aria-label="Hubungi tim Liftco"><MessageSquare size={26} /></Link>{visible && <button className="back-to-top" aria-label="Kembali ke atas" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}><ArrowUp size={19} /></button>}</>;
}
