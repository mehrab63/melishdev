import type { Locale } from "./i18n";
const safeUrl = (value: string | undefined) => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return value.startsWith("/") && !value.startsWith("//") ? value : undefined;
  }
};
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
export const siteConfig = {
  name: "Melish.dev",
  url: (() => {
    try {
      const u = new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "https://melish.dev",
      );
      return ["http:", "https:"].includes(u.protocol)
        ? u.origin
        : "https://melish.dev";
    } catch {
      return "https://melish.dev";
    }
  })(),
  author: process.env.NEXT_PUBLIC_AUTHOR?.trim() || "",
  email: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined,
  github: safeUrl(process.env.NEXT_PUBLIC_GITHUB_URL),
  linkedin: safeUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  locales: ["en", "fa"] as const,
  defaultLocale: "en" as const,
  resumes: {
    en: {
      engineering: safeUrl(process.env.NEXT_PUBLIC_RESUME_EN_ENGINEERING),
      consulting: safeUrl(process.env.NEXT_PUBLIC_RESUME_EN_CONSULTING),
    },
    fa: {
      engineering: safeUrl(process.env.NEXT_PUBLIC_RESUME_FA_ENGINEERING),
      consulting: safeUrl(process.env.NEXT_PUBLIC_RESUME_FA_CONSULTING),
    },
  } satisfies Record<
    Locale,
    { engineering: string | undefined; consulting: string | undefined }
  >,
};
export const publicationDate =
  /^\d{4}-\d{2}-\d{2}$/.test(process.env.BLOG_PUBLISHED_AT || "") &&
  Number.isFinite(Date.parse(process.env.BLOG_PUBLISHED_AT!)) &&
  new Date(process.env.BLOG_PUBLISHED_AT!).toISOString().slice(0, 10) ===
    process.env.BLOG_PUBLISHED_AT
    ? process.env.BLOG_PUBLISHED_AT
    : undefined;
