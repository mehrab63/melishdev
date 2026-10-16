"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getContent } from "@/content";
import { isLocale, localizedPath } from "@/lib/i18n";
export default function NotFound() {
  const params = useParams();
  const locale =
      typeof params.locale === "string" && isLocale(params.locale)
        ? params.locale
        : "en",
    c = getContent(locale);
  return (
    <section className="container error-page">
      <span className="error-code">404</span>
      <p className="eyebrow">Melish.dev</p>
      <h1>{c.ui.notFound}</h1>
      <p>{c.ui.notFoundText}</p>
      <Link className="button" href={localizedPath(locale)}>
        {c.ui.backHome}
      </Link>
    </section>
  );
}
