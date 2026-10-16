import articles from "@/content/articles.json";
import { publicationDate } from "./site-config";
import type { Locale } from "./i18n";
const tagLabels: Record<string, string> = {
  Architecture: "معماری",
  Identity: "هویت",
  Security: "امنیت",
  "API Design": "طراحی API",
  Messaging: "پیام‌رسانی",
  Infrastructure: "زیرساخت",
  Troubleshooting: "عیب‌یابی",
  "Data Ownership": "مالکیت داده",
  "Read Models": "مدل‌های خواندن",
};
export const articleSlugs = articles.map((a) => a.slug);
export function getArticles(locale: Locale) {
  return articles.map((article) => ({
    slug: article.slug,
    tags: article.tags.map((tag) =>
      locale === "fa" ? tagLabels[tag] || tag : tag,
    ),
    source: article.source,
    ...article[locale],
    publishedAt: publicationDate,
    readingTime: Math.max(
      1,
      Math.ceil(
        article[locale].sections
          .flatMap((s) => [s.title, ...s.paragraphs])
          .join(" ")
          .split(/\s+/u).length / (locale === "fa" ? 160 : 220),
      ),
    ),
  }));
}
export function getArticle(locale: Locale, slug: string) {
  return getArticles(locale).find((a) => a.slug === slug);
}
