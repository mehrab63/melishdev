"use client";
import { useParams } from "next/navigation";
import { getContent } from "@/content";
import { isLocale } from "@/lib/i18n";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale =
      typeof params.locale === "string" && isLocale(params.locale)
        ? params.locale
        : "en",
    c = getContent(locale);
  return (
    <section className="container error-page">
      <p className="eyebrow">Melish.dev</p>
      <h1>{c.ui.error}</h1>
      <p>{c.ui.errorText}</p>
      <button className="button" onClick={reset}>
        {c.ui.retry}
      </button>
    </section>
  );
}
