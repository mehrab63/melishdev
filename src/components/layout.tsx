import { BidiText } from "./text";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  BriefcaseBusiness,
  Mail,
} from "lucide-react";
import { Navigation } from "./navigation";
import { getContent } from "@/content";
import { localizedPath, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        m<span>.</span>
      </span>
      <span dir="ltr">
        Melish<span className="brand-domain">.dev</span>
      </span>
    </span>
  );
}
export function Header({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href={localizedPath(locale)}
          aria-label={"Melish.dev · " + c.nav.home}
        >
          <Brand />
        </Link>
        <Navigation locale={locale} content={{nav:c.nav,ui:c.ui}} />
      </div>
    </header>
  );
}
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  const Icon = diagonal ? ArrowUpRight : ArrowRight;
  return <Icon size={18} className="directional" aria-hidden="true" />;
}
export function ActionLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      className={"button" + (secondary ? " button-secondary" : "")}
      href={href}
    >
      {children}
      <Arrow />
    </Link>
  );
}
export function ConsultingCTA({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  return (
    <section className="consulting-cta container">
      <div className="cta-orbit" aria-hidden="true">
        &#123; &#125;
      </div>
      <div>
        <p className="eyebrow">{c.nav.contact}</p>
        <h2>{<BidiText text={c.cta.title} />}</h2>
        <p>{<BidiText text={c.cta.text} />}</p>
      </div>
      <ActionLink href={localizedPath(locale, "contact")}>
        {c.cta.button}
      </ActionLink>
    </section>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  const social = [
    { name: "GitHub", url: siteConfig.github, icon: Code2 },
    { name: "LinkedIn", url: siteConfig.linkedin, icon: BriefcaseBusiness },
    {
      name: locale === "fa" ? "ایمیل" : "Email",
      url: siteConfig.email ? "mailto:" + siteConfig.email : undefined,
      icon: Mail,
    },
  ];
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href={localizedPath(locale)} aria-label="Melish.dev">
            <Brand />
          </Link>
          <p>{<BidiText text={c.hero.eyebrow} />}</p>
          <span className="footer-line">{c.footer.line}</span>
        </div>
        <nav aria-label={c.footer.explore}>
          <p className="eyebrow">{c.footer.explore}</p>
          <Link href={localizedPath(locale, "projects")}>{c.nav.projects}</Link>
          <Link href={localizedPath(locale, "services")}>{c.nav.services}</Link>
          <Link href={localizedPath(locale, "experience")}>
            {c.footer.experience}
          </Link>
          <Link href={localizedPath(locale, "resume")}>{c.nav.resume}</Link>
        </nav>
        <div>
          <p className="eyebrow">{c.footer.connect}</p>
          {social.map(({ name, url, icon: Icon }) =>
            url ? (
              <a
                href={url}
                key={name}
                rel={
                  url.startsWith("mailto:")
                    ? undefined
                    : "me noopener noreferrer"
                }
              >
                <Icon size={15} aria-hidden="true" />
                {name}
                <Arrow diagonal />
              </a>
            ) : (
              <span className="unconfigured-link" key={name}>
                <Icon size={15} aria-hidden="true" />
                {name}
                <small>{c.ui.socialPending}</small>
              </span>
            ),
          )}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          ©{" "}
          {new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
            useGrouping: false,
          }).format(new Date().getFullYear())}{" "}
          Melish.dev. {c.footer.copyright}
        </span>
        <span>{c.ui.location}</span>
        <Link href={localizedPath(locale, "privacy")}>{c.ui.privacy}</Link>
      </div>
    </footer>
  );
}
export function Breadcrumb({
  locale,
  items,
}: {
  locale: Locale;
  items: { label: string; path?: string }[];
}) {
  const c = getContent(locale);
  return (
    <nav className="breadcrumb" aria-label={c.ui.breadcrumb}>
      <ol>
        <li>
          <Link href={localizedPath(locale)}>{c.nav.home}</Link>
        </li>
        {items.map((item, i) => (
          <li key={i}>
            {item.path ? (
              <Link href={localizedPath(locale, item.path)}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
