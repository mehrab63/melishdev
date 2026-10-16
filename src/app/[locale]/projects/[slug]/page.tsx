import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { resolveLocale, type LocaleParams } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { CaseStudy } from "@/components/case-study";
type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return getContent("en").projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params as LocaleParams["params"]);
  const { slug } = await params;
  const p = getContent(locale).projects.find((p) => p.slug === slug);
  if (!p) notFound();
  return pageMetadata(
    locale,
    "projects/" + slug,
    p.title + " — " + p.type,
    p.description,
  );
}
export default async function Page({ params }: Props) {
  const locale = await resolveLocale(params as LocaleParams["params"]);
  const { slug } = await params;
  if (!getContent(locale).projects.some((p) => p.slug === slug)) notFound();
  return <CaseStudy locale={locale} slug={slug} />;
}
