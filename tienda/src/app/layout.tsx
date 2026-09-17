import type { Metadata } from "next";
import { Press_Start_2P, Manrope } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { STORE_NAME, STORE_TAGLINE, STORE_DESCRIPTION } from "@/lib/site-config";

const pixelFont = Press_Start_2P({ variable: "--font-pixel", subsets: ["latin"], weight: "400" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${STORE_NAME} — ${STORE_TAGLINE}`, template: `%s · ${STORE_NAME}` },
  description: STORE_DESCRIPTION,
  openGraph: { title: STORE_NAME, description: STORE_TAGLINE, type: "website", locale: "es_CO" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${pixelFont.variable} ${manrope.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-manrope), ui-sans-serif, system-ui, sans-serif" }}
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}