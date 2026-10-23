import type { Metadata } from "next";
import { articles } from "@/data/articles";
import { PageBanner, SectionHeading } from "@/components/shared";
import { ArticleCard } from "@/components/home/sections";
export const metadata: Metadata = { title: "Wawasan Industri", description: "Panduan mengenal forklift, perbedaan scissor lift dan boom lift, serta preventive maintenance equipment." };
export default function ArticlesPage() {
  return <><PageBanner title="Wawasan Industri" /><section className="section"><div className="container"><SectionHeading label="Panduan Equipment" title="Informasi untuk Mendukung Keputusan Anda" /><p className="page-intro">Materi pengenalan equipment dan perawatan. Panduan ini bukan pengganti manual pabrikan atau konsultasi teknis untuk unit tertentu.</p><div className="articles-grid">{articles.map((article) => <ArticleCard article={article} key={article.slug} />)}</div></div></section></>;
}
