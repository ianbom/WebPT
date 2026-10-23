import { company } from "@/data/company";
import { AnimatedCounter } from "@/components/animations/animated-counter";
export function CompanyFacts() {
  return <div className="company-facts" data-reveal-group><div data-reveal="up"><strong>{company.founded}</strong><span>Tahun Berdiri</span></div><div data-reveal="up"><AnimatedCounter value={1} suffix="Tahun" /><span>Garansi hingga</span></div><div data-reveal="up"><AnimatedCounter value={2000} suffix="HM" /><span>Atau jam operasional</span></div></div>;
}
