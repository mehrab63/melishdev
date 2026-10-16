import { notFound } from "next/navigation";
import { getArticle, articleSlugs } from "@/lib/blog";
import { resolveLocale, type LocaleParams } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { Article } from "@/components/article";
type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return articleSlugs.map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const locale = await resolveLocale(params as LocaleParams["params"]);
  const { slug } = await params;
  const note = getArticle(locale, slug);
  if (!note) notFound();
  const base = pageMetadata(
    locale,
    "blog/" + slug,
    note.title,
    note.description,
  );
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      ...(note.publishedAt ? { publishedTime: note.publishedAt } : {}),
      tags: note.tags,
    },
  };
}
export default async function Page({ params }: Props) {
  const locale = await resolveLocale(params as LocaleParams["params"]);
  const { slug } = await params;
  if (!getArticle(locale, slug)) notFound();
  return <Article locale={locale} slug={slug} />;
}
