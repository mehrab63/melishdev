import localFont from "next/font/local";
import type { Metadata } from "next";
import { getContent } from "@/content";
import { locales } from "@/lib/i18n";
import { resolveLocale, type LocaleParams } from "@/lib/routes";
import { pageMetadata, structuredData, jsonLd } from "@/lib/seo";
import { Header, Footer } from "@/components/layout";
import "../globals.css";
const geist = localFont({
  src: "../../../public/fonts/geist-latin.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});
const vazirmatn = localFont({
  src: "../../../public/fonts/vazirmatn.woff2",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});
const themeScript = `(()=>{try{const q=matchMedia('(prefers-color-scheme: dark)');const apply=()=>{const v=localStorage.getItem('melish-theme')||'system';document.documentElement.dataset.theme=v==='system'?(q.matches?'dark':'light'):v;};apply();q.addEventListener('change',apply);}catch{document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}})();`;
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params));
}
export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: React.ReactNode }) {
  const locale = await resolveLocale(params),
    c = getContent(locale);
  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={geist.variable + " " + vazirmatn.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          {c.ui.skip}
        </a>
        <Header locale={locale} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer locale={locale} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(structuredData(locale)) }}
        />
      </body>
    </html>
  );
}
