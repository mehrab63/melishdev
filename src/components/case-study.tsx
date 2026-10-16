import { BidiText } from "./text";
import Link from "next/link";
import { getContent } from "@/content";
import { localizedPath, type Locale } from "@/lib/i18n";
import { Architecture } from "./architecture";
import { Breadcrumb, ConsultingCTA, Arrow } from "./layout";
const tech = [
  "ASP.NET Core",
  "RabbitMQ",
  "MassTransit",
  "gRPC",
  "SQL Server",
  "Docker",
  "Traefik",
  "Duende",
  "Next.js",
  "PWA",
];
export function CaseStudy({ locale, slug }: { locale: Locale; slug: string }) {
  const c = getContent(locale),
    project = c.projects.find((p) => p.slug === slug)!;
  const isBaruq = slug === "Baruq";
  const indices =
    slug === "identity-platform"
      ? [2, 4, 9]
      : slug === "distributed-backend"
        ? [1, 3, 4, 5]
        : [8, 9];
  const content = isBaruq
    ? c.caseSections
    : indices.map((i) => c.caseSections[i]);
  return (
    <>
      <div className="container">
        <Breadcrumb
          locale={locale}
          items={[
            { label: c.nav.projects, path: "projects" },
            { label: project.title },
          ]}
        />
        <header className="page-intro case-intro">
          <p className="eyebrow">{project.kind}</p>
          <h1>
            {project.title}
            <span className="title-subline">{project.type}</span>
          </h1>
          <p>{<BidiText text={project.description} />}</p>
          <div className="tag-list">
            {(isBaruq ? tech : project.tags).map((tag) => (
              <span className="tag" key={tag}>
                <bdi>{tag}</bdi>
              </span>
            ))}
          </div>
        </header>
        <div className="case-hero">
          <div>
            <p className="eyebrow">{project.scope}</p>
            <h2>{isBaruq ? c.hero.visualLabel : project.type}</h2>
            <p>{isBaruq ? c.caseIntro : project.description}</p>
            {!isBaruq && (
              <p className="case-disclaimer">
                {locale === "fa"
                  ? "این بخش یک مطالعه فنی است؛ سابقه همکاری با مشتری یا رخداد عملیاتی مشخصی به آن نسبت داده نمی‌شود."
                  : "This is a technical study, not a claim about an unprovided client engagement or production incident."}
              </p>
            )}
          </div>
          <Architecture locale={locale} compact />
        </div>
        <div className="article-layout">
          <aside className="article-toc">
            <p className="eyebrow">
              {locale === "fa" ? "در این مطالعه" : "In this study"}
            </p>
            <nav
              aria-label={
                locale === "fa" ? "فهرست مطالعه" : "Case study contents"
              }
            >
              {content.map((item, i) => (
                <a href={"#section-" + i} key={item.title}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>
          <article className="prose case-body">
            {content.map((item, i) => (
              <section id={"section-" + i} key={item.title}>
                <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                <h2>{item.title}</h2>
                <p>{<BidiText text={item.body} />}</p>
                {isBaruq && i === 5 && (
                  <div
                    className="readmodel-diagram"
                    aria-label="Seller to Product through events"
                  >
                    <bdi>Seller</bdi>
                    <span>↓ {locale === "fa" ? "رویداد" : "Event"} ↓</span>
                    <bdi>SupplierReadModel</bdi>
                    <span>
                      ↓ {locale === "fa" ? "پرس‌وجوی محلی" : "Local query"} ↓
                    </span>
                    <bdi>Product</bdi>
                  </div>
                )}
              </section>
            ))}
            <Link className="text-link" href={localizedPath(locale, "blog")}>
              {c.blogIntro.title}
              <Arrow />
            </Link>
          </article>
        </div>
      </div>
      <ConsultingCTA locale={locale} />
    </>
  );
}
