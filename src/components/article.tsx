import { BidiText } from "./text";
import Link from "next/link";
import { getArticle, getArticles } from "@/lib/blog";
import { date, number, localizedPath, type Locale } from "@/lib/i18n";
import { getContent } from "@/content";
import { siteConfig } from "@/lib/site-config";
import { jsonLd } from "@/lib/seo";
import { Breadcrumb, ConsultingCTA, Arrow } from "./layout";
export function Article({ locale, slug }: { locale: Locale; slug: string }) {
  const c = getContent(locale),
    note = getArticle(locale, slug)!;
  const related = getArticles(locale)
    .filter((n) => n.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.tags.some((t) => note.tags.includes(t))) -
        Number(a.tags.some((t) => note.tags.includes(t))),
    )
    .slice(0, 2);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: note.title,
    description: note.description,
    inLanguage: locale,
    url: siteConfig.url + localizedPath(locale, "blog/" + slug),
    author: { "@type": "Person", name: siteConfig.author || "Melish.dev" },
    ...(note.publishedAt ? { datePublished: note.publishedAt } : {}),
    keywords: note.tags.join(", "),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <div className="container">
        <Breadcrumb
          locale={locale}
          items={[{ label: c.nav.blog, path: "blog" }, { label: note.title }]}
        />
        <header className="page-intro article-intro">
          <div className="tag-list">
            {note.tags.map((tag) => (
              <span className="tag" key={tag}>
                <bdi>{tag}</bdi>
              </span>
            ))}
          </div>
          <h1>{<BidiText text={note.title} />}</h1>
          <p>{<BidiText text={note.description} />}</p>
          <div className="article-meta">
            <span>Melish.dev</span>
            <span>
              {number(note.readingTime, locale)} {c.ui.minutes}
            </span>
            {note.publishedAt ? (
              <time dateTime={note.publishedAt}>
                {date(note.publishedAt, locale)}
              </time>
            ) : (
              <span>{c.ui.undated}</span>
            )}
          </div>
        </header>
        <div className="article-layout">
          <aside className="article-toc">
            <p className="eyebrow">
              {locale === "fa" ? "در این یادداشت" : "In this note"}
            </p>
            <nav
              aria-label={
                locale === "fa" ? "فهرست یادداشت" : "Article contents"
              }
            >
              {note.sections.map((section, i) => (
                <a href={"#section-" + i} key={section.title}>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>
          <article className="prose article-body">
            {note.sections.map((section, i) => (
              <section id={"section-" + i} key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            ))}
            <div className="reference">
              <p className="eyebrow">
                {locale === "fa" ? "منبع برای مطالعه بیشتر" : "Further reading"}
              </p>
              <a href={note.source} target="_blank" rel="noopener noreferrer">
                {locale === "fa"
                  ? "مستندات و استاندارد مرجع"
                  : "Primary documentation & specification"}
                <Arrow diagonal />
              </a>
            </div>
          </article>
        </div>
        <section className="related-notes">
          <h2>{c.ui.related}</h2>
          <div>
            {related.map((n) => (
              <Link key={n.slug} href={localizedPath(locale, "blog/" + n.slug)}>
                <span className="eyebrow">
                  <bdi>{n.tags[0]}</bdi>
                </span>
                <h3>{n.title}</h3>
                <Arrow />
              </Link>
            ))}
          </div>
        </section>
      </div>
      <ConsultingCTA locale={locale} />
    </>
  );
}
