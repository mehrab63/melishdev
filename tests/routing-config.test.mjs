import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule, plain } from "./helpers/load-ts.mjs";

const i18n = loadTsModule("src/lib/i18n.ts");
const sections = [
  "",
  "about",
  "projects",
  "projects/baruq",
  "services",
  "experience",
  "blog",
  "resume",
  "contact",
  "privacy",
  "blog/debugging-oauth-pkce",
];

test("exactly two explicit locales are supported, with English as the default", () => {
  assert.deepEqual(plain(i18n.locales), ["en", "fa"]);
  assert.equal(i18n.isLocale("en"), true);
  assert.equal(i18n.isLocale("fa"), true);
  for (const locale of ["EN", "ar", "", "en-US"])
    assert.equal(i18n.isLocale(locale), false);
  const { siteConfig } = loadTsModule("src/lib/site-config.ts");
  assert.equal(siteConfig.defaultLocale, "en");
  assert.deepEqual(plain(siteConfig.locales), ["en", "fa"]);
});

test("language switching preserves equivalent nested routes in both directions", () => {
  for (const section of sections) {
    const english = i18n.localizedPath("en", section);
    const persian = i18n.localizedPath("fa", section);
    assert.equal(i18n.switchLocale(english, "fa"), persian);
    assert.equal(i18n.switchLocale(persian, "en"), english);
  }
  assert.equal(
    i18n.localizedPath("fa", "/projects/baruq"),
    "/fa/projects/baruq",
  );
  assert.equal(i18n.switchLocale("/engineering", "fa"), "/engineering");
  assert.equal(i18n.otherLocale("en"), "fa");
  assert.equal(i18n.otherLocale("fa"), "en");
});

test("number and date presentation respects the selected locale", () => {
  assert.equal(i18n.number(1234, "en"), "1,234");
  assert.match(i18n.number(1234, "fa"), /[۰-۹]/u);
  assert.match(i18n.date("2026-10-16", "en"), /October.*2026/);
  assert.match(i18n.date("2026-10-16", "fa"), /[۰-۹]/u);
});

test("personal information stays unconfigured until real environment values are provided", () => {
  const { siteConfig, publicationDate } = loadTsModule(
    "src/lib/site-config.ts",
  );
  assert.equal(siteConfig.author, "");
  assert.equal(siteConfig.email, undefined);
  assert.equal(siteConfig.github, undefined);
  assert.equal(siteConfig.linkedin, undefined);
  assert.equal(publicationDate, undefined);
  for (const locale of ["en", "fa"])
    for (const kind of ["engineering", "consulting"]) {
      assert.equal(siteConfig.resumes[locale][kind], undefined);
    }
});

test("configured public contact and resume links accept useful URLs and reject script URLs", () => {
  const valid = loadTsModule("src/lib/site-config.ts", {
    NEXT_PUBLIC_SITE_URL: "https://portfolio.example",
    NEXT_PUBLIC_AUTHOR: "  Example Author  ",
    NEXT_PUBLIC_CONTACT_EMAIL: "  engineer@example.com  ",
    NEXT_PUBLIC_GITHUB_URL: "https://github.com/example",
    NEXT_PUBLIC_RESUME_FA_ENGINEERING: "/resumes/engineering-fa.pdf",
  }).siteConfig;
  assert.equal(valid.author, "Example Author");
  assert.equal(valid.email, "engineer@example.com");
  assert.equal(new URL(valid.url).origin, "https://portfolio.example");
  assert.equal(valid.github, "https://github.com/example");
  assert.equal(valid.resumes.fa.engineering, "/resumes/engineering-fa.pdf");
  const invalid = loadTsModule("src/lib/site-config.ts", {
    NEXT_PUBLIC_CONTACT_EMAIL: "invalid-email",
    NEXT_PUBLIC_GITHUB_URL: "javascript:alert(1)",
    NEXT_PUBLIC_LINKEDIN_URL: "javascript:alert(1)",
    NEXT_PUBLIC_RESUME_EN_CONSULTING:
      "data:text/html,<script>alert(1)</script>",
  }).siteConfig;
  assert.equal(invalid.email, undefined);
  assert.equal(invalid.github, undefined);
  assert.equal(invalid.linkedin, undefined);
  assert.equal(invalid.resumes.en.consulting, undefined);
});

test("canonical origin remains absolute and publication dates must be real calendar dates", () => {
  for (const value of [
    "/relative-path",
    "//untrusted.example",
    "javascript:alert(1)",
    "invalid",
  ]) {
    const { siteConfig } = loadTsModule("src/lib/site-config.ts", {
      NEXT_PUBLIC_SITE_URL: value,
    });
    const origin = new URL(siteConfig.url);
    assert.ok(["https:", "http:"].includes(origin.protocol));
    assert.equal(origin.hostname, "melish.dev");
  }
  for (const value of [
    "",
    "not-a-date",
    "2026-02-31",
    "2026-13-01",
    "2026-1-1",
  ]) {
    assert.equal(
      loadTsModule("src/lib/site-config.ts", { BLOG_PUBLISHED_AT: value })
        .publicationDate,
      undefined,
    );
  }
  assert.equal(
    loadTsModule("src/lib/site-config.ts", { BLOG_PUBLISHED_AT: "2024-02-29" })
      .publicationDate,
    "2024-02-29",
  );
});

test("SEO links pair every page with its canonical and equivalent locale", () => {
  const { pageMetadata } = loadTsModule("src/lib/seo.ts", {
    NEXT_PUBLIC_SITE_URL: "https://portfolio.example",
  });
  for (const locale of ["en", "fa"]) {
    for (const section of sections) {
      const meta = pageMetadata(locale, section);
      assert.equal(
        meta.alternates.canonical,
        i18n.localizedPath(locale, section),
      );
      assert.equal(
        meta.alternates.languages.en,
        i18n.localizedPath("en", section),
      );
      assert.equal(
        meta.alternates.languages.fa,
        i18n.localizedPath("fa", section),
      );
      assert.equal(
        meta.alternates.languages["x-default"],
        i18n.localizedPath("en", section),
      );
      assert.equal(meta.openGraph.locale, locale === "fa" ? "fa_IR" : "en_US");
      assert.ok(meta.title.length > 0 && meta.description.length > 0);
    }
  }
});

test("structured data omits unconfigured private fields and escapes script-closing input", () => {
  const { structuredData, jsonLd } = loadTsModule("src/lib/seo.ts");
  const graph = structuredData("en")["@graph"];
  assert.equal(
    graph.find((item) => item["@type"] === "Person").email,
    undefined,
  );
  assert.deepEqual(
    plain(graph.find((item) => item["@type"] === "Person").sameAs),
    [],
  );
  const raw = { text: '</script><script>alert("test")</script>' };
  const serialized = jsonLd(raw);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), raw);
});
