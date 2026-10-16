import en from "./en/site.json";
import fa from "./fa/site.json";
import type { Locale } from "@/lib/i18n";
export type SiteContent = typeof en;
const content: Record<Locale, SiteContent> = { en, fa };
export const getContent = (locale: Locale) => content[locale];
