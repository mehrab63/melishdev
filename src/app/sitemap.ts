import type { MetadataRoute } from "next";
import { locales, localizedPath } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { articleSlugs } from "@/lib/blog";
import { getContent } from "@/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "about",
    "projects",
    "services",
    "experience",
    "blog",
    "resume",
    "contact",
    "privacy",
    ...getContent("en").projects.map((p) => "projects/" + p.slug),
    ...articleSlugs.map((slug) => "blog/" + slug),
  ];
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: siteConfig.url.replace(/\/$/, "") + localizedPath(locale, path),
      alternates: {
        languages: {
          en: siteConfig.url.replace(/\/$/, "") + localizedPath("en", path),
          fa: siteConfig.url.replace(/\/$/, "") + localizedPath("fa", path),
          "x-default":
            siteConfig.url.replace(/\/$/, "") + localizedPath("en", path),
        },
      },
    })),
  );
}
