import { BidiText } from "./text";
import Link from "next/link";
import { GraduationCap, FileText, Check, MapPin, Mail } from "lucide-react";
import { getContent } from "@/content";
import { siteConfig } from "@/lib/site-config";
import { localizedPath, type Locale } from "@/lib/i18n";
import { ActionLink, Breadcrumb, ConsultingCTA, Arrow } from "./layout";
import { ContactForm } from "./contact-form";
import {
  ExperienceTimeline,
  Expertise,
  JourneyLinks,
  NoteCards,
  Process,
  ProjectCard,
  SectionHeading,
  ServicesGrid,
} from "./sections";
export const sections = [
  "about",
  "projects",
  "services",
  "experience",
  "blog",
  "resume",
  "contact",
  "privacy",
] as const;
export type Section = (typeof sections)[number];
export function ContentPage({
  locale,
  section,
}: {
  locale: Locale;
  section: Section;
}) {
  const c = getContent(locale);
  const label =
    section === "experience"
      ? c.ui.experience
      : section === "privacy"
        ? c.ui.privacy
        : c.nav[section];
  const intro =
    section === "about"
      ? { title: c.about.title, text: c.about.lead }
      : section === "experience"
        ? c.experienceIntro
        : section === "projects"
          ? c.projectsIntro
          : section === "services"
            ? c.servicesIntro
            : section === "blog"
              ? c.blogIntro
              : section === "resume"
                ? { title: c.resume.title, text: c.resume.text }
                : section === "contact"
                  ? { title: c.contact.title, text: c.contact.text }
                  : { title: c.privacy.title, text: "" };
  return (
    <>
      <div className="container">
        <Breadcrumb locale={locale} items={[{ label }]} />
        <header className="page-intro">
          <p className="eyebrow">
            <span className="status-dot" />
            {label}
          </p>
          <h1>{<BidiText text={intro.title} />}</h1>
          {intro.text && <p>{<BidiText text={intro.text} />}</p>}
        </header>
        {section === "about" && (
          <>
            <div className="about-grid">
              <div className="prose">
                {c.about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p className="location">
                  <MapPin size={17} />
                  {c.ui.location}
                </p>
              </div>
              <div className="education-card">
                <GraduationCap size={28} />
                <p className="eyebrow">{c.ui.education}</p>
                <h2>{c.education.degree}</h2>
                <p>{c.education.specialization}</p>
              </div>
            </div>
            <div className="principles-grid">
              {c.about.principles.map((p, i) => (
                <article key={p.title}>
                  <span className="mono">0{i + 1}</span>
                  <h2>{p.title}</h2>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
            <section className="section">
              <SectionHeading
                eyebrow={c.ui.experience}
                title={c.experienceIntro.title}
              />
              <ExperienceTimeline locale={locale} />
              <ActionLink secondary href={localizedPath(locale, "experience")}>
                {c.ui.experience}
              </ActionLink>
            </section>
          </>
        )}
        {section === "projects" && (
          <div className="projects-grid">
            {c.projects.map((project, i) => (
              <ProjectCard
                project={project}
                locale={locale}
                index={i}
                key={project.slug}
              />
            ))}
          </div>
        )}
        {section === "services" && (
          <>
            <ServicesGrid locale={locale} expanded />
            <div className="engagement-note">
              <span className="eyebrow">
                {locale === "fa" ? "شروع همکاری" : "A useful starting point"}
              </span>
              <p>
                {locale === "fa"
                  ? "مسئله، محدودیت‌ها و نتیجه مورد انتظار را مشخص می‌کنیم؛ سپس دامنه کار و روش اعتبارسنجی را انتخاب می‌کنیم."
                  : "We start with the problem, constraints and the outcome you need. Then we agree on scope and how to validate the result."}
              </p>
              <Link
                className="text-link"
                href={localizedPath(locale, "projects/Baruq")}
              >
                {c.projects[0].title} · {c.ui.readCase}
                <Arrow />
              </Link>
            </div>
          </>
        )}
        {section === "experience" && (
          <>
            <ExperienceTimeline locale={locale} />
            <div className="education-card education-wide">
              <GraduationCap size={30} />
              <div>
                <p className="eyebrow">{c.ui.education}</p>
                <h2>{c.education.degree}</h2>
                <p>{c.education.specialization}</p>
              </div>
              <ActionLink secondary href={localizedPath(locale, "resume")}>
                {c.nav.resume}
              </ActionLink>
            </div>
            <section className="section">
              <SectionHeading eyebrow={c.ui.expertise} title={c.hero.eyebrow} />
              <Expertise locale={locale} />
            </section>
          </>
        )}
        {section === "blog" && <NoteCards locale={locale} />}
        {section === "resume" && (
          <>
            <div className="resume-grid">
              {(["engineering", "consulting"] as const).map((kind) => {
                const href = siteConfig.resumes[locale][kind];
                return (
                  <article className="resume-card" key={kind}>
                    <FileText size={32} />
                    <span className="file-label">
                      PDF · {locale.toUpperCase()}
                    </span>
                    <h2>{c.resume[kind]}</h2>
                    <p>
                      {kind === "engineering"
                        ? c.resume.engineeringText
                        : c.resume.consultingText}
                    </p>
                    {href ? (
                      <a href={href} className="button" download>
                        {c.ui.download}
                        <Arrow />
                      </a>
                    ) : (
                      <div className="pending-download">
                        <span>{c.ui.download}</span>
                        <p>{c.ui.resumePending}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
            <Link
              className="text-link resume-experience"
              href={localizedPath(locale, "experience")}
            >
              {c.resume.viewExperience}
              <Arrow />
            </Link>
          </>
        )}
        {section === "contact" && (
          <div className="contact-grid">
            <div className="contact-options">
              {[
                { title: c.contact.hire, items: c.contact.hireRoles },
                { title: c.contact.help, items: c.contact.helpRoles },
              ].map((group) => (
                <section key={group.title}>
                  <h2>{group.title}</h2>
                  <ul className="check-list">
                    {group.items.map((item) => (
                      <li key={item}>
                        <Check size={17} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              <div className="direct-contact">
                <Mail size={20} />
                {siteConfig.email ? (
                  <a href={"mailto:" + siteConfig.email} dir="ltr">
                    {siteConfig.email}
                  </a>
                ) : (
                  <p>{c.ui.contactPending}</p>
                )}
              </div>
              <p className="location">
                <MapPin size={16} />
                {c.ui.location}
              </p>
            </div>
            <ContactForm copy={c.contact} email={siteConfig.email} />
          </div>
        )}
        {section === "privacy" && (
          <article className="prose privacy-prose">
            {c.privacy.sections.map((item) => (
              <section key={item.title}>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </section>
            ))}
          </article>
        )}
        {(section === "projects" || section === "resume") && (
          <JourneyLinks locale={locale} />
        )}
      </div>
      {(section === "about" || section === "services") && (
        <Process locale={locale} />
      )}
      {section !== "contact" && section !== "privacy" && (
        <ConsultingCTA locale={locale} />
      )}
    </>
  );
}
