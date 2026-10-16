import { BidiText } from "./text";
import Link from "next/link";
import {
  Network,
  Code2,
  ShieldCheck,
  ScanLine,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { getContent } from "@/content";
import type { SiteContent } from "@/content";
import { getArticles } from "@/lib/blog";
import { localizedPath, number, date, type Locale } from "@/lib/i18n";
import { ActionLink, Arrow } from "./layout";
const icons = [Network, Code2, ShieldCheck, ScanLine];
export function SectionHeading({
  eyebrow,
  title,
  text,
  href,
  link,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {text && <p className="section-description">{text}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {link}
          <Arrow />
        </Link>
      )}
    </div>
  );
}
export function ServicesGrid({
  locale,
  expanded = false,
}: {
  locale: Locale;
  expanded?: boolean;
}) {
  const c = getContent(locale);
  return (
    <div className={"services-grid" + (expanded ? " services-expanded" : "")}>
      {c.services.map((service, i) => {
        const Icon = icons[i];
        return (
          <article
            className="service-card"
            key={service.title}
            id={"service-" + (i + 1)}
          >
            <div className="card-top">
              <span className="icon-tile">
                <Icon size={22} strokeWidth={1.6} />
              </span>
              <span className="mono">
                {number(i + 1, locale).padStart(locale === "en" ? 2 : 1, "0")}
              </span>
            </div>
            <h3>{<BidiText text={service.title} />}</h3>
            <p>{<BidiText text={service.description} />}</p>
            {expanded ? (
              <>
                <ul className="check-list">
                  {service.details.map((item) => (
                    <li key={item}>
                      <Check size={16} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="service-outcome">{service.outcome}</p>
                <Link
                  className="text-link"
                  href={localizedPath(locale, "contact")}
                >
                  {c.cta.button}
                  <Arrow />
                </Link>
              </>
            ) : (
              <Link
                className="service-card-link"
                href={localizedPath(locale, "services") + "#service-" + (i + 1)}
                aria-label={service.title}
              >
                <ArrowUpRight className="directional" size={21} />
              </Link>
            )}
          </article>
        );
      })}
    </div>
  );
}
export function Credibility({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  return (
    <section className="credibility container" aria-label={c.ui.experience}>
      {c.stats.map((stat) => (
        <div key={stat.value}>
          <strong>{stat.value}</strong>
          <p>{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
export function Expertise({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  return (
    <div className="expertise-list">
      {c.skills.map((skill) => (
        <div className="expertise-row" key={skill.label}>
          <h3>{skill.label}</h3>
          <div className="tag-list">
            {skill.items.map((item) => (
              <span className="tag" key={item}>
                <bdi>{item}</bdi>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
export function Process({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  return (
    <section className="process-section">
      <div className="container">
        <SectionHeading eyebrow={c.ui.approach} title={c.processTitle} />
        <ol className="process-list">
          {c.process.map((step, i) => (
            <li key={step.title}>
              <span className="process-number">
                {new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
                  minimumIntegerDigits: 2,
                }).format(i + 1)}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
export function ProjectCard({
  project,
  locale,
  index = 0,
}: {
  project: SiteContent["projects"][number];
  locale: Locale;
  index?: number;
}) {
  const c = getContent(locale);
  return (
    <article className="project-card">
      <Link
        className={"project-visual project-visual-" + index}
        href={localizedPath(locale, "projects/" + project.slug)}
        tabIndex={-1}
        aria-hidden="true"
      >
        <span className="project-visual-label">
          <bdi>{project.tags[0]}</bdi>
        </span>
        {index === 0 ? (
          <span className="Baruq-symbol">
            b<span>.</span>
          </span>
        ) : index === 1 ? (
          <ShieldCheck size={90} strokeWidth={1} />
        ) : index === 2 ? (
          <Network size={90} strokeWidth={1} />
        ) : (
          <Code2 size={90} strokeWidth={1} />
        )}
        <span className="project-visual-footnote">{project.kind}</span>
      </Link>
      <div className="project-card-body">
        <p className="eyebrow">{project.kind}</p>
        <h2>
          <Link href={localizedPath(locale, "projects/" + project.slug)}>
            {project.title}
            <Arrow diagonal />
          </Link>
        </h2>
        <h3>{project.type}</h3>
        <p>{<BidiText text={project.description} />}</p>
        <div className="tag-list">
          {project.tags.map((tag) => (
            <span className="tag" key={tag}>
              <bdi>{tag}</bdi>
            </span>
          ))}
        </div>
        <Link
          className="text-link"
          href={localizedPath(locale, "projects/" + project.slug)}
        >
          {c.ui.readCase}
          <Arrow />
        </Link>
      </div>
    </article>
  );
}
export function FeaturedProject({ locale }: { locale: Locale }) {
  const c = getContent(locale),
    p = c.projects[0];
  return (
    <article className="featured-project">
      <div className="featured-copy">
        <div className="featured-label">
          <span className="technical-dot" />
          {c.ui.work}
          <span className="mono">01</span>
        </div>
        <h2>
          {p.title}
          <span>{p.type}</span>
        </h2>
        <p>{p.description}</p>
        <div className="tag-list">
          {p.tags.map((tag) => (
            <span className="tag" key={tag}>
              <bdi>{tag}</bdi>
            </span>
          ))}
        </div>
        <Link
          className="button button-lime"
          href={localizedPath(locale, "projects/Baruq")}
        >
          {c.ui.readCase}
          <Arrow />
        </Link>
      </div>
      <div className="featured-graphic" aria-hidden="true">
        <span className="graphic-note">
          {locale === "fa"
            ? "مالکیت داده، مستقل از نمایش آن"
            : "DATA OWNERSHIP, WITHOUT THE COUPLING"}
        </span>
        <div className="boundary-box">
          <span>
            <bdi>Seller Service</bdi>
          </span>
          <small>
            {locale === "fa" ? "مالک داده فروشنده" : "Owns supplier data"}
          </small>
          <div className="mini-database">
            <bdi>Seller DB</bdi>
          </div>
        </div>
        <div className="event-bridge">
          <span />
          <bdi>Integration events</bdi>
          <span />
        </div>
        <div className="boundary-box highlighted">
          <span>
            <bdi>Product Service</bdi>
          </span>
          <small>
            {locale === "fa"
              ? "نمای محلی، مرز مستقل"
              : "Local view. Independent boundary."}
          </small>
          <div className="mini-database">
            <bdi>SupplierReadModel</bdi>
          </div>
        </div>
        <div className="graphic-caption">
          <span className="technical-dot" />
          {locale === "fa"
            ? "قرارداد مشترک؛ نه پایگاه داده مشترک"
            : "Shared contracts. Not shared databases."}
        </div>
      </div>
    </article>
  );
}
export function NoteCards({
  locale,
  limit,
}: {
  locale: Locale;
  limit?: number;
}) {
  const c = getContent(locale);
  const notes = getArticles(locale).slice(0, limit);
  return (
    <div className="notes-grid">
      {notes.map((note, i) => (
        <article className="note-card" key={note.slug}>
          <div className="note-top">
            <span className="mono">
              {new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
                minimumIntegerDigits: 2,
              }).format(i + 1)}
            </span>
            <span className="note-category">
              <bdi>{note.tags[0]}</bdi>
            </span>
          </div>
          <h3>
            <Link href={localizedPath(locale, "blog/" + note.slug)}>
              {<BidiText text={note.title} />}
            </Link>
          </h3>
          <p>{<BidiText text={note.description} />}</p>
          <div className="note-meta">
            <span>
              {number(note.readingTime, locale)} {c.ui.minutes}
            </span>
            <Link
              href={localizedPath(locale, "blog/" + note.slug)}
              aria-label={c.ui.read + ": " + note.title}
            >
              <Arrow />
            </Link>
          </div>
          {note.publishedAt && (
            <time dateTime={note.publishedAt}>
              {date(note.publishedAt, locale)}
            </time>
          )}
        </article>
      ))}
    </div>
  );
}
export function ExperienceTimeline({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  return (
    <ol className="experience-timeline">
      {c.experience.map((job, i) => (
        <li key={job.company}>
          <div className="timeline-marker" aria-hidden="true">
            {number(i + 1, locale)}
          </div>
          <div>
            <span className="duration">{job.duration}</span>
            <h2>{job.company}</h2>
            <p>{job.role}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
export function JourneyLinks({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  return (
    <section className="journey-grid">
      <div>
        <p className="eyebrow">{c.contact.hire}</p>
        <h3>{c.contact.hireRoles.join(" / ")}</h3>
        <ActionLink secondary href={localizedPath(locale, "experience")}>
          {c.ui.experience}
        </ActionLink>
      </div>
      <div>
        <p className="eyebrow">{c.contact.help}</p>
        <h3>
          {locale === "fa"
            ? "از مسئله تا راه‌حل قابل اعتماد."
            : "From a difficult problem to a reliable solution."}
        </h3>
        <ActionLink secondary href={localizedPath(locale, "services")}>
          {c.nav.services}
        </ActionLink>
      </div>
    </section>
  );
}
