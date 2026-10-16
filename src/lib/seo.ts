import type { Metadata } from "next";
import { getContent } from "@/content";
import { siteConfig } from "./site-config";
import { locales, localizedPath, type Locale } from "./i18n";
export function pageMetadata(
  locale: Locale,
  path = "",
  title?: string,
  description?: string,
): Metadata {
  const c = getContent(locale);
  const fullTitle = title
    ? title + " — Melish.dev"
    : "Melish.dev — " + c.hero.eyebrow;
  const desc =
    description ||
    (locale === "en"
      ? "Senior .NET Backend Engineer and Software Architect specializing in microservices, distributed systems, authentication, and production troubleshooting."
      : "مهندس ارشد بک‌اند .NET و معمار نرم‌افزار با تمرکز بر Microservices، سیستم‌های توزیع‌شده، احراز هویت و عیب‌یابی سیستم‌های Production.");
  const canonical = localizedPath(locale, path);
  return {
    metadataBase: new URL(siteConfig.url),
    title: fullTitle,
    description: desc,
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ...locales.map((l) => [l, localizedPath(l, path)]),
        ["x-default", localizedPath("en", path)],
      ]),
    },
    openGraph: {
      type: "website",
      siteName: "Melish.dev",
      title: fullTitle,
      description: desc,
      url: canonical,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
      images: [
        {
          url: "/" + locale + "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Melish.dev — Backend engineering and software architecture",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: ["/" + locale + "/opengraph-image"],
    },
  };
}
export function structuredData(locale: Locale) {
  const c = getContent(locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": siteConfig.url + "/#website",
        name: "Melish.dev",
        url: siteConfig.url,
        inLanguage: ["en", "fa"],
      },
      {
        "@type": "Person",
        "@id": siteConfig.url + "/#person",
        name: siteConfig.author || "Melish.dev",
        url: siteConfig.url,
        jobTitle: c.hero.eyebrow,
        description: c.about.lead,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tehran",
          addressCountry: "IR",
        },
        sameAs: [siteConfig.github, siteConfig.linkedin].filter(Boolean),
        ...(siteConfig.email ? { email: siteConfig.email } : {}),
      },
    ],
  };
}
export const jsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, String.fromCharCode(92) + "u003c");
