import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingControls } from "@/components/layout/floating-controls";
import { ScrollAnimations } from "@/components/animations/scroll-animations";
import "./globals.css";
const inter = localFont({ src: "../../public/fonts/Inter-variable.ttf", display: "swap", variable: "--font-inter", weight: "100 900" });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://liftcoindoperkasa.co.id"),
  title: { default: "PT Liftco Indo Perkasa | Solusi Material Handling", template: "%s | PT Liftco Indo Perkasa" },
  description: "Distributor forklift HELI, lifting equipment dan construction machinery. Penjualan, rental, service, dan spare part original bersama PT Liftco Indo Perkasa.",
  openGraph: { type: "website", locale: "id_ID", siteName: "PT Liftco Indo Perkasa", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PT Liftco Indo Perkasa - Material Handling Equipment" }] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" className={inter.variable}><body><a href="#main-content" className="skip-link">Lewati ke konten utama</a><Header /><main id="main-content">{children}</main><ScrollAnimations /><Footer /><FloatingControls /></body></html>;
}
