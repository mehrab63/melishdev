import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { root, loadTsModule, plain } from "./helpers/load-ts.mjs";

const read = (relative) =>
  JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const english = read("src/content/en/site.json");
const persian = read("src/content/fa/site.json");
const articles = read("src/content/articles.json");

function compareContent(left, right, key = "content") {
  assert.equal(
    typeof right,
    typeof left,
    `${key} must have the same type in each locale`,
  );
  if (typeof left === "string") {
    assert.ok(left.trim().length > 0, `${key} must not be empty in English`);
    assert.ok(right.trim().length > 0, `${key} must not be empty in Persian`);
    return;
  }
  if (Array.isArray(left)) {
    assert.ok(Array.isArray(right), `${key} must be an array in Persian`);
    assert.equal(
      right.length,
      left.length,
      `${key} must have bilingual item parity`,
    );
    left.forEach((value, index) =>
      compareContent(value, right[index], `${key}[${index}]`),
    );
    return;
  }
  if (left && typeof left === "object") {
    assert.deepEqual(
      Object.keys(right).sort(),
      Object.keys(left).sort(),
      `${key} must have bilingual field parity`,
    );
    for (const child of Object.keys(left))
      compareContent(left[child], right[child], `${key}.${child}`);
  }
}

test("all site sections have complete English and Persian content", () => {
  compareContent(english, persian);
  assert.match(persian.hero.title, /[\u0600-\u06ff]/u);
  assert.equal(english.services.length, 4);
  assert.equal(english.projects.length, 4);
  assert.equal(english.caseSections.length, 10);
  assert.equal(english.skills.length, 7);
  assert.equal(english.process.length, 6);
  assert.deepEqual(
    english.projects.map((project) => project.slug),
    persian.projects.map((project) => project.slug),
  );
});

test("professional history contains only the supplied employers, durations and education", () => {
  assert.deepEqual(english.experience, [
    {
      company:
        "Information and Communication Technology Organization of Tehran Municipality",
      role: "Programmer / Senior Specialist",
      duration: "6 years",
    },
    {
      company: "Ide Pardazan Houshang Rahbord",
      role: "Software Developer",
      duration: "4 years",
    },
  ]);
  for (const locale of [english, persian]) {
    assert.deepEqual(Object.keys(locale.education).sort(), [
      "degree",
      "specialization",
    ]);
    for (const employment of locale.experience) {
      assert.deepEqual(Object.keys(employment).sort(), [
        "company",
        "duration",
        "role",
      ]);
    }
  }
  assert.deepEqual(english.education, {
    degree: "M.Sc. in Computer Engineering",
    specialization: "Computer Systems Architecture",
  });
});

test("all eight engineering notes have stable unique slugs and full bilingual sections", () => {
  assert.equal(articles.length, 8);
  assert.equal(
    new Set(articles.map((article) => article.slug)).size,
    articles.length,
  );
  for (const article of articles) {
    assert.match(article.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(article.tags.length > 0);
    assert.ok(
      article.tags.every((tag) => typeof tag === "string" && tag.trim()),
    );
    assert.equal(new URL(article.source).protocol, "https:");
    compareContent(article.en, article.fa, article.slug);
    assert.match(article.fa.title, /[\u0600-\u06ff]/u);
    for (const locale of ["en", "fa"]) {
      assert.ok(
        article[locale].sections.length >= 3,
        `${article.slug}/${locale} must be a full note`,
      );
      for (const section of article[locale].sections)
        assert.ok(section.paragraphs.length >= 2);
    }
  }
});

test("article lookup, reading time and optional publication dates work in each locale", () => {
  const undated = loadTsModule("src/lib/blog.ts");
  const dated = loadTsModule("src/lib/blog.ts", {
    BLOG_PUBLISHED_AT: "2026-10-16",
  });
  assert.deepEqual(
    plain(undated.articleSlugs),
    articles.map((article) => article.slug),
  );
  for (const locale of ["en", "fa"]) {
    for (const raw of articles) {
      const article = undated.getArticle(locale, raw.slug);
      assert.equal(article.title, raw[locale].title);
      assert.equal(article.publishedAt, undefined);
      assert.ok(
        Number.isInteger(article.readingTime) && article.readingTime > 0,
      );
      assert.equal(
        dated.getArticle(locale, raw.slug).publishedAt,
        "2026-10-16",
      );
    }
  }
  assert.equal(undated.getArticle("en", "not-an-article"), undefined);
});
