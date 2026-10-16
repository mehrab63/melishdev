import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { isLocale } from "./i18n";
import { pageMetadata } from "./seo";
import { ContentPage, type Section } from "@/components/content-page";
export type LocaleParams = { params: Promise<{ locale: string }> };
export async function resolveLocale(params: LocaleParams["params"]) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
export function sectionRoute(section: Section) {
  return {
    Page: async ({ params }: LocaleParams) => (
      <ContentPage locale={await resolveLocale(params)} section={section} />
    ),
    metadata: async ({ params }: LocaleParams) => {
      const locale = await resolveLocale(params),
        c = getContent(locale);
      const title =
        section === "experience"
          ? c.ui.experience
          : section === "privacy"
            ? c.ui.privacy
            : c.nav[section];
      return pageMetadata(locale, section, title);
    },
  };
}
