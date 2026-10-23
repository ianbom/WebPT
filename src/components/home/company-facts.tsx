"use client";
import { useEffect, useRef, useState } from "react";
import { company } from "@/data/company";
export function CompanyFacts() {
  const container = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);
  useEffect(() => {
    const element = container.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const update = (now: number) => {
        const next = Math.min((now - start) / 2000, 1);
        setProgress(1 - (1 - next) ** 3);
        if (next < 1) frame = requestAnimationFrame(update);
      };
      frame = requestAnimationFrame(update);
    }, { threshold: .3 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return <div className="company-facts" ref={container}><div><strong>{company.founded}</strong><span>Tahun Berdiri</span></div><div><strong aria-hidden="true">{Math.round(progress)} <small>Tahun</small></strong><span className="sr-only">1 tahun.</span><span>Garansi hingga</span></div><div><strong aria-hidden="true">{Math.round(2000 * progress).toLocaleString("id-ID")} <small>HM</small></strong><span className="sr-only">2.000 HM.</span><span>Atau jam operasional</span></div></div>;
}
