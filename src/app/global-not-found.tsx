import Link from "next/link";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/site-config";
const geist = localFont({
  src: "../../public/fonts/geist-latin.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});
const vazirmatn = localFont({
  src: "../../public/fonts/vazirmatn.woff2",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Page not found — Melish.dev",
  robots: { index: false, follow: false },
};
export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      dir="ltr"
      className={geist.variable + " " + vazirmatn.variable}
    >
      <body>
        <main className="container error-page">
          <span className="error-code">404</span>
          <p className="eyebrow">Melish.dev</p>
          <h1>Page not found</h1>
          <p lang="fa" dir="rtl">
            صفحه مورد نظر پیدا نشد
          </p>
          <div className="hero-actions">
            <Link className="button" href="/en">
              English home
            </Link>
            <Link className="button button-secondary" href="/fa" lang="fa">
              خانه فارسی
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
