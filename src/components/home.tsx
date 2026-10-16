import { BidiText } from "./text";
import { getContent } from "@/content";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import { Architecture } from "./architecture";
import { ActionLink, ConsultingCTA } from "./layout";
import {
  Credibility,
  Expertise,
  FeaturedProject,
  JourneyLinks,
  NoteCards,
  Process,
  SectionHeading,
  ServicesGrid,
} from "./sections";
export function Home({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span className="status-dot" />
            {<BidiText text={c.hero.eyebrow} />}
          </p>
          <h1>{<BidiText text={c.hero.title} />}</h1>
          <p className="hero-description">
            {<BidiText text={c.hero.description} />}
          </p>
          <div className="hero-actions">
            <ActionLink href={localizedPath(locale, "projects")}>
              {c.hero.primary}
            </ActionLink>
            <ActionLink secondary href={localizedPath(locale, "contact")}>
              {c.hero.secondary}
            </ActionLink>
          </div>
          <p className="hero-credibility">
            <span /> {c.hero.credibility}
          </p>
        </div>
        <div className="hero-visual">
          <div className="visual-caption">
            <span className="mono">SYSTEM / 01</span>
            <span>{c.hero.caption}</span>
          </div>
          <Architecture locale={locale} />
          <div className="visual-note">
            <span className="bracket">[</span>
            <span>
              <strong>{c.hero.visualLabel}</strong>
              <small>{c.hero.visualNote}</small>
            </span>
            <span className="bracket">]</span>
          </div>
        </div>
      </section>
      <Credibility locale={locale} />
      <section className="section container">
        <div className="intro-row">
          <p className="eyebrow">{c.intro.eyebrow}</p>
          <h2>{c.intro.title}</h2>
          <p>{c.intro.text}</p>
        </div>
        <FeaturedProject locale={locale} />
      </section>
      <section className="section services-section">
        <div className="container">
          <SectionHeading
            eyebrow={c.ui.services}
            title={c.servicesIntro.title}
            href={localizedPath(locale, "services")}
            link={c.nav.services}
          />
          <ServicesGrid locale={locale} />
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow={c.ui.expertise}
          title={
            locale === "fa"
              ? "ابزارها در خدمت تصمیم مهندسی."
              : "The right tools. For the right reasons."
          }
        />
        <Expertise locale={locale} />
      </section>
      <Process locale={locale} />
      <section className="section container">
        <SectionHeading
          eyebrow={c.ui.notes}
          title={c.blogIntro.title}
          href={localizedPath(locale, "blog")}
          link={c.ui.viewAll}
        />
        <NoteCards locale={locale} limit={3} />
      </section>
      <div className="container">
        <JourneyLinks locale={locale} />
      </div>
      <ConsultingCTA locale={locale} />
    </>
  );
}
