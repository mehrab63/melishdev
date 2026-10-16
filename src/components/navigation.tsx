"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useSyncExternalStore, useLayoutEffect } from "react";
import { Menu, X, SunMoon, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizedPath, switchLocale } from "@/lib/i18n";
import type { SiteContent } from "@/content";
const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("melish-theme", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("melish-theme", callback);
  };
};
const snapshot = () => {
  try {
    return localStorage.getItem("melish-theme") || "system";
  } catch {
    return "system";
  }
};
export function Navigation({
  locale,
  content,
}: {
  locale: Locale;
  content: Pick<SiteContent, "nav" | "ui">;
}) {
  const pathname = usePathname(),
    details = useRef<HTMLDetailsElement>(null);
  const theme = useSyncExternalStore(subscribe, snapshot, () => "system");
  useLayoutEffect(() => {
    const current = snapshot();
    document.documentElement.dataset.theme =
      current === "system"
        ? matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : current;
  }, [theme, locale, pathname]);
  const links = Object.entries(content.nav);
  const route = (key: string) =>
    localizedPath(locale, key === "home" ? "" : key);
  const close = () => {
    if (details.current) details.current.open = false;
  };
  const setTheme = (value: string) => {
    try {
      localStorage.setItem("melish-theme", value);
    } catch {}
    document.documentElement.dataset.theme =
      value === "system"
        ? matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : value;
    window.dispatchEvent(new Event("melish-theme"));
  };
  return (
    <>
      <nav
        className="desktop-nav"
        aria-label={locale === "fa" ? "ناوبری اصلی" : "Main navigation"}
      >
        {links
          .filter(([k]) => k !== "contact")
          .map(([key, label]) => (
            <Link
              key={key}
              href={route(key)}
              aria-current={pathname === route(key) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
      </nav>
      <div className="header-actions">
        <label className="theme-control">
          <SunMoon size={17} aria-hidden="true" />
          <span className="sr-only">{content.ui.theme}</span>
          <select
            aria-label={content.ui.theme}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="system">{content.ui.system}</option>
            <option value="light">{content.ui.light}</option>
            <option value="dark">{content.ui.dark}</option>
          </select>
        </label>
        <div className="locale-switch" role="group" aria-label={content.ui.language}>
          <Link href={switchLocale(pathname,'en')} hrefLang="en" lang="en" className={locale === 'en' ? 'active' : ''} aria-current={locale==='en'?'true':undefined} aria-label={locale==='en'?'English, current language':'Switch to English'}>EN</Link>
          <span className="switch-divider" aria-hidden="true">/</span>
          <Link href={switchLocale(pathname,'fa')} hrefLang="fa" lang="fa" className={locale === 'fa' ? 'active' : ''} aria-current={locale==='fa'?'true':undefined} aria-label={locale==='fa'?'فارسی، زبان فعلی':'Switch to Persian'}>FA</Link>
        </div>
        <Link className="header-contact" href={route("contact")}>
          {content.nav.contact}
          <ArrowUpRight size={15} className="directional" aria-hidden="true" />
        </Link>
        <details
          className="mobile-navigation"
          ref={details}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              close();
              details.current?.querySelector("summary")?.focus();
            }
          }}
        >
          <summary>
            <span className="sr-only menu-open">{content.ui.openMenu}</span>
            <span className="sr-only menu-close">{content.ui.closeMenu}</span>
            <Menu className="menu-open" size={22} />
            <X className="menu-close" size={22} />
          </summary>
          <nav
            aria-label={locale === "fa" ? "ناوبری موبایل" : "Mobile navigation"}
          >
            {links.map(([key, label]) => (
              <Link
                key={key}
                href={route(key)}
                aria-current={pathname === route(key) ? "page" : undefined}
                onClick={close}
              >
                {label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </>
  );
}
