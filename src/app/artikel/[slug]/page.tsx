import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import { ArrowLink, Breadcrumb, SectionHeading } from "@/components/shared";
import { ArticleCard } from "@/components/home/sections";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return articles.map((article) => ({ slug: article.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const article = articles.find((article) => article.slug === slug);
  return { title: article?.title || "Artikel Tidak Ditemukan", description: article?.intro };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params; const article = articles.find((article) => article.slug === slug);
  if (!article) notFound();
  return <><article className="section article-detail"><div className="container"><Breadcrumb items={[{ label: "Artikel", href: "/artikel" }, { label: article.title }]} /><div className="article-readable"><p className="eyebrow">Panduan Equipment</p><h1>{article.title}</h1><p className="article-lead">{article.intro}</p><Image className="article-cover" src={article.image} alt={article.imageAlt} width={1000} height={550} priority sizes="(max-width: 767px) 95vw, 900px" />{article.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}<div className="article-advice"><h2>Butuh Bantuan Memilih Equipment?</h2><p>Konsultasikan kebutuhan operasional Anda bersama tim Liftco Indo Perkasa.</p><ArrowLink href="/kontak">Hubungi Kami</ArrowLink></div></div></div></article><section className="section related-articles"><div className="container"><SectionHeading label="Baca Juga" title="Wawasan Equipment Lainnya" /><div className="articles-grid">{articles.filter((related) => related.slug !== slug).map((related) => <ArticleCard article={related} key={related.slug} />)}</div></div></section></>;
}
