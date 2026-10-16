import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

// HTTP verification only: this script does not start a server or automate a browser.
const root = fileURLToPath(new URL('../', import.meta.url));
const baseUrl = new URL(process.argv[2] || 'http://localhost:3020');
let configuredEnvironment = {};
for (const filename of ['.env', '.env.production', '.env.local', '.env.production.local']) {
  const target = path.join(root, filename);
  if (existsSync(target)) configuredEnvironment = { ...configuredEnvironment, ...parseEnv(readFileSync(target, 'utf8')) };
}
const candidateOrigin = process.argv[3] || process.env.NEXT_PUBLIC_SITE_URL || configuredEnvironment.NEXT_PUBLIC_SITE_URL || 'https://melish.dev';
let canonicalOrigin = 'https://melish.dev';
try {
  const candidate = new URL(candidateOrigin);
  if (['http:', 'https:'].includes(candidate.protocol)) canonicalOrigin = candidate.origin;
} catch { /* Use the same fallback as the application. */ }

const readJson = relative => JSON.parse(readFileSync(path.join(root, relative), 'utf8'));
const projects = readJson('src/content/en/site.json').projects.map(project => project.slug);
const articles = readJson('src/content/articles.json').map(article => article.slug);
const notFoundCopy = Object.fromEntries(['en', 'fa'].map(locale => [locale, readJson(`src/content/${locale}/site.json`).ui.notFound]));
const sections = ['', 'about', 'projects', 'services', 'experience', 'blog', 'resume', 'contact', 'privacy'];
const localizedRoutes = sections.concat(projects.map(slug => `projects/${slug}`), articles.map(slug => `blog/${slug}`));
const expectedPaths = ['en', 'fa'].flatMap(locale => localizedRoutes.map(route => `/${locale}${route ? `/${route}` : ''}`));
assert.equal(expectedPaths.length, 42, 'Update this acceptance count deliberately when adding site routes.');

const failures = [];
const checked = new Map();
const internalLinks = new Map();
let anchorCount = 0;
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/giu, entity => {
  const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' };
  if (entity.toLowerCase() in named) return named[entity.toLowerCase()];
  const hexadecimal = entity.toLowerCase().startsWith('&#x');
  const number = Number.parseInt(entity.slice(hexadecimal ? 3 : 2, -1), hexadecimal ? 16 : 10);
  return Number.isFinite(number) && number <= 0x10ffff ? String.fromCodePoint(number) : entity;
});
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s=<>`]+)))?/gu)]
  .map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? '')]));
const stripScripts = html => html.replace(/<!--[\s\S]*?-->/gu, '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/giu, '');
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'giu'))].map(match => attrs(match[0]));
const ids = html => new Set([...stripScripts(html).matchAll(/\bid\s*=\s*(?:"([^"]*)"|'([^']*)')/giu)].map(match => decode(match[1] ?? match[2])));
function check(label, callback) {
  try { callback(); } catch (error) { failures.push(`${label}: ${error.message}`); }
}

async function get(resource, redirects = false) {
  const url = new URL(resource, baseUrl);
  url.hash = '';
  const key = `${url.pathname}${url.search}${redirects ? ':follow' : ''}`;
  if (!checked.has(key)) {
    checked.set(key, (async () => {
      const response = await fetch(url, { redirect: redirects ? 'follow' : 'manual', signal: AbortSignal.timeout(20000) });
      const type = response.headers.get('content-type') || '';
      const textual = /(?:text|json|xml|javascript)/u.test(type);
      const payload = textual ? await response.text() : await response.arrayBuffer();
      return { response, type, body: textual ? payload : null };
    })());
  }
  return checked.get(key);
}

function queueInternalLinks(html, currentPath) {
  for (const link of tags(stripScripts(html), '(?:a|link)')) {
    if (!link.href || link.href.startsWith('mailto:') || link.href.startsWith('tel:')) continue;
    let url;
    try { url = new URL(link.href, new URL(currentPath, baseUrl)); } catch {
      failures.push(`${currentPath}: malformed href ${link.href}`);
      continue;
    }
    if (!['http:', 'https:'].includes(url.protocol)) continue;
    if (url.origin !== baseUrl.origin && url.origin !== canonicalOrigin) continue;
    const localPath = `${url.pathname}${url.search}`;
    const fragment = url.hash ? decodeURIComponent(url.hash.slice(1)) : '';
    const key = `${localPath}#${fragment}`;
    if (!internalLinks.has(key)) internalLinks.set(key, { path: localPath, fragment, source: currentPath });
  }
}

async function validatePage(currentPath) {
  const { response, type, body: html } = await get(currentPath);
  check(currentPath, () => {
    assert.equal(response.status, 200, 'expected HTTP 200');
    assert.match(type, /text\/html/u, 'expected HTML');
    const locale = currentPath.split('/')[1];
    const document = tags(html, 'html')[0];
    assert.equal(document?.lang, locale, 'document language');
    assert.equal(document?.dir, locale === 'fa' ? 'rtl' : 'ltr', 'document direction');
    const headings = tags(stripScripts(html), 'h1').filter(heading => !('hidden' in heading) && heading['aria-hidden'] !== 'true');
    assert.equal(headings.length, 1, 'expected one non-hidden H1');
    const links = tags(html, 'link');
    assert.ok(links.some(link => link.rel === 'stylesheet' && link.href), 'missing stylesheet link');
    assert.equal(links.find(link => link.rel === 'canonical')?.href, canonicalOrigin + currentPath, 'canonical URL');
    const suffix = currentPath.replace(/^\/(?:en|fa)/u, '');
    for (const alternate of ['en', 'fa']) {
      assert.equal(links.find(link => link.rel === 'alternate' && link.hreflang === alternate)?.href,
        `${canonicalOrigin}/${alternate}${suffix}`, `${alternate} hreflang`);
    }
    const metadata = tags(html, 'meta');
    assert.ok(metadata.find(meta => meta.name === 'description')?.content, 'missing description');
    assert.ok(metadata.find(meta => meta.property === 'og:title')?.content, 'missing Open Graph title');
    assert.equal(metadata.find(meta => meta.property === 'og:locale')?.content, locale === 'fa' ? 'fa_IR' : 'en_US', 'Open Graph locale');
    for (const name of ['og:image', 'twitter:image']) {
      const value = metadata.find(meta => meta.property === name || meta.name === name)?.content;
      assert.ok(value, `missing ${name}`);
      const imageUrl = new URL(value);
      assert.equal(imageUrl.origin, canonicalOrigin, `${name} canonical origin`);
      assert.equal(imageUrl.pathname, `/${locale}/opengraph-image`, `${name} locale image endpoint`);
    }
    const structuredData = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/giu)]
      .filter(match => attrs(match[1]).type === 'application/ld+json');
    assert.ok(structuredData.length > 0, 'missing JSON-LD');
    for (const script of structuredData) {
      const parsed = JSON.parse(script[2]);
      assert.equal(parsed['@context'], 'https://schema.org', 'JSON-LD context');
    }
  });
  if (response.status === 200 && html) queueInternalLinks(html, currentPath);
}

console.log(`Checking ${expectedPaths.length} routes at ${baseUrl.origin}; canonical origin ${canonicalOrigin}`);
for (const currentPath of expectedPaths) {
  try { await validatePage(currentPath); } catch (error) { failures.push(`${currentPath}: ${error.message}`); }
}

try {
  const { response } = await get('/');
  check('root redirect', () => {
    assert.ok([301, 302, 307, 308].includes(response.status), 'expected redirect');
    assert.equal(new URL(response.headers.get('location'), baseUrl).pathname, '/en');
  });
  const { response: sitemapResponse, body: sitemap } = await get('/sitemap.xml');
  check('sitemap', () => {
    assert.equal(sitemapResponse.status, 200);
    const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gu)].map(match => decode(match[1]));
    assert.equal(locations.length, expectedPaths.length, 'sitemap URL count');
    assert.deepEqual(new Set(locations), new Set(expectedPaths.map(route => canonicalOrigin + route)));
    for (const locale of ['en', 'fa']) assert.match(sitemap, new RegExp(`hreflang="${locale}"`, 'u'));
  });
  const { response: robotsResponse, body: robots } = await get('/robots.txt');
  check('robots', () => {
    assert.equal(robotsResponse.status, 200);
    assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), 'canonical sitemap missing from robots');
    assert.match(robots, /Allow:\s*\//u);
  });
} catch (error) { failures.push(`infrastructure: ${error.message}`); }

for (const locale of ['en', 'fa']) {
  for (const resource of [`/${locale}/missing-page-for-verification`, `/${locale}/projects/missing-project`, `/${locale}/blog/missing-article`]) {
    try {
      const { response, body } = await get(resource);
      check(resource, () => {
        assert.equal(response.status, 404, 'expected HTTP 404');
        const document = tags(body, 'html')[0];
        assert.equal(document?.lang, locale, '404 document locale');
        assert.equal(document?.dir, locale === 'fa' ? 'rtl' : 'ltr', '404 document direction');
        assert.ok(decode(stripScripts(body)).includes(notFoundCopy[locale]), 'missing localized not-found content');
      });
    } catch (error) { failures.push(`${resource}: ${error.message}`); }
  }
  try {
    const { response, type } = await get(`/${locale}/opengraph-image`);
    check(`${locale} Open Graph image`, () => {
      assert.equal(response.status, 200);
      assert.match(type, /^image\//u, 'image MIME type');
    });
  } catch (error) { failures.push(`${locale} Open Graph image: ${error.message}`); }
}
try {
  const { response } = await get('/de/projects/Baruq');
  check('unsupported locale', () => assert.equal(response.status, 404));
} catch (error) { failures.push(`unsupported locale: ${error.message}`); }

// Crawl only local/canonical links. External profile/reference links are deliberately not fetched.
const crawled = new Set();
for (const [key, link] of internalLinks) {
  if (crawled.has(key)) continue;
  crawled.add(key);
  try {
    const result = await get(link.path, true);
    check(`${link.source} → ${link.path}${link.fragment ? `#${link.fragment}` : ''}`, () => {
      assert.equal(result.response.status, 200, 'internal link is broken');
      if (/\.css(?:\?|$)/u.test(link.path)) assert.match(result.type, /text\/css/u, 'stylesheet MIME type');
      if (link.fragment && !link.fragment.startsWith(':~:text=')) {
        anchorCount += 1;
        assert.ok(result.body && ids(result.body).has(link.fragment), `missing anchor ${link.fragment}`);
      }
    });
    if (/text\/html/u.test(result.type) && result.body) queueInternalLinks(result.body, link.path);
  } catch (error) { failures.push(`${link.source} → ${link.path}: ${error.message}`); }
}

if (failures.length) {
  console.error(`\n${failures.length} verification failure(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${expectedPaths.length} locale pages, redirects, sitemap/robots, localized/unsupported 404s, both locale OG images, ${crawled.size} internal links and ${anchorCount} anchors.`);
}
console.log('HTTP checks do not measure computed visibility, responsive layout, keyboard behavior or Lighthouse scores.');
