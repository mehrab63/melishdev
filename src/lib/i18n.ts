export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];
export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "fa" : "en";
}
export function localizedPath(locale: Locale, path = "") {
  return "/" + locale + (path ? "/" + path.replace(/^\//, "") : "");
}
export function switchLocale(pathname: string, locale: Locale) {
  return pathname.replace(/^\/(en|fa)(?=\/|$)/, "/" + locale);
}
export const number = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
export function date(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
