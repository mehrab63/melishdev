# Melish.dev

A bilingual personal brand, engineering portfolio and consulting website for a Senior .NET Backend Engineer / Software Architect. English and Persian share the same components and have complete, separate content. Baruq is the featured engineering case study.

The project is content driven. It has no application backend, account system, analytics or contact delivery service. Missing personal information is deliberately unconfigured; the UI shows a clear pending state instead of fabricated details.

## Run locally

Use Node.js **22.13+** and npm; **Node.js 24 LTS** is recommended and matches the Docker image. The package engine declares this minimum version. Install dependencies from the lockfile after the first installation:

```sh
npm ci
```

Copy `.env.example` to `.env.local`, then fill only the values you are ready to publish:

```sh
# macOS / Linux
cp .env.example .env.local

# Windows PowerShell
Copy-Item .env.example .env.local
```

```sh
npm run dev
```

Open `http://localhost:3000/en` or `http://localhost:3000/fa`. `/` redirects deterministically to `/en`; the browser's preferred language does not change the route.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`npm run verify` runs lint, types, tests and a production build in that order. `npm start` requires a successful build. It runs `scripts/start.mjs`, which stages `public` and `.next/static` into `.next/standalone` before importing the generated server. Set `PORT`, or use `npm start -- --port 3020`, to choose the port. Do not run multiple production builds against the same `.next` directory simultaneously.

With the production server running, use a second terminal for the HTTP route/link audit:

```sh
npm start -- --port 3020
# In a separate terminal:
node scripts/check-routes.mjs http://localhost:3020
# Optional explicit expected canonical origin:
node scripts/check-routes.mjs http://localhost:3020 https://melish.dev
```

The audit checks all 42 initial localized content routes, HTTP statuses, document language/direction, H1 count, canonical/hreflang pairs, JSON-LD, locale Open Graph image URLs and responses, root redirect, sitemap, robots, localized/unsupported 404s, internal links and fragment targets. It reads the configured canonical origin from the optional second argument, environment, or production environment files. It uses native HTTP requests and does not automate a browser or establish computed visibility, mobile layout, accessibility or Lighthouse scores.

## Routes

Every route below exists under both `/en` and `/fa`:

| Path after the locale                 | Content                                                                      |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| `/`                                   | Home, services, featured work, process, experience, notes and consulting CTA |
| `/about`                              | Biography, principles, education and experience                              |
| `/projects`                           | Four engineering case studies                                                |
| `/projects/Baruq`                     | Detailed Baruq architecture study                                            |
| `/projects/identity-platform`         | Identity and authorization study                                             |
| `/projects/distributed-backend`       | Service communication and ownership study                                    |
| `/projects/production-infrastructure` | Container, proxy, DNS and TLS study                                          |
| `/services`                           | Four consulting and engineering categories                                   |
| `/experience`                         | The two supplied employers, durations, education and expertise               |
| `/blog`                               | All engineering notes                                                        |
| `/blog/[slug]`                        | An individual translated note                                                |
| `/resume`                             | Engineering and consulting PDF links, when configured                        |
| `/contact`                            | Hiring and consulting journeys, optional email draft form                    |
| `/privacy`                            | Actual collection, local storage, contact and hosting behavior               |

The eight initial note slugs are `service-boundaries`, `debugging-oauth-pkce`, `api-scopes`, `rabbitmq-or-synchronous`, `dotnet-docker-production`, `tls-dns-reverse-proxy`, `product-seller-data-boundaries` and `supplier-read-model`. Slugs stay identical across languages, so language switching preserves nested routes. Invalid localized pages display a localized 404; unsupported paths use the global not-found page.

Infrastructure endpoints include `/sitemap.xml`, `/robots.txt`, `/en/opengraph-image`, `/fa/opengraph-image` and the favicon/icon resources.

## Architecture

```text
src/
  app/                    App Router layouts, generated routes, errors and metadata
  components/
    navigation.tsx        Mobile navigation, locale and persisted theme controls
    layout.tsx            Header, footer, links, breadcrumbs and common CTAs
    home.tsx              Home page composition
    content-page.tsx      Shared content page composition
    sections.tsx          Services, projects, timeline, expertise and note cards
    case-study.tsx        Engineering case studies
    architecture.tsx      Direction-aware React/CSS systems schematic
    article.tsx           Note body and related articles
    contact-form.tsx      Client-only mailto draft interaction
  content/
    en/site.json          Complete English site copy
    fa/site.json          Complete Persian site copy, matching the English structure
    articles.json         Stable slugs/tags/sources plus full en/fa article bodies
    index.ts              Typed bilingual content accessor
  lib/
    i18n.ts               Locale validation, paths, switching, date/number formatting
    site-config.ts        Centralized public links, personal configuration and dates
    blog.ts               Article lookup and locale-specific reading time
    seo.ts                Canonical/hreflang/Open Graph metadata and JSON-LD
public/
  fonts/                  Self-hosted fonts and license notices
tests/                    Node contract/content tests, using real library modules
```

Server Components are the default. Client code is limited to interactions such as theme selection, mobile navigation, the mailto form and error recovery. Known content routes are statically generated. Next.js's standalone output is used by the production container.

The locale layout sets document `lang` and `dir`: `en/ltr`, `fa/rtl`. Shared layouts use logical CSS properties and adaptable grids. Directional arrows mirror in Persian; technical names remain recognizable and isolated where needed. English and Persian use locale-aware numbers and dates. The theme supports light, dark and system modes; preference is stored under `melish-theme` in local storage and applied before first paint.

SEO is generated from the same route/content model: canonical URLs, English/Persian alternatives, `x-default`, localized Open Graph, sitemap entries and WebSite/Person JSON-LD. Author/social/email schema fields use configuration. Missing contact data is omitted. No unsupported employment dates, university, clients, metrics or certifications are added.

## Public configuration

All `NEXT_PUBLIC_*` values are **public build-time configuration**. Do not place secrets in these fields. Restart development after editing `.env.local`; rebuild the production image to update published content or links.

| Variable                            | Meaning / initial behavior                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`              | Absolute HTTP(S) canonical origin. Defaults to `https://melish.dev`; invalid/relative values fall back to that origin. Change for the real deployment. |
| `NEXT_PUBLIC_AUTHOR`                | Real personal name for structured data. Empty initially.                                                                                               |
| `NEXT_PUBLIC_CONTACT_EMAIL`         | Public contact address. Empty disables the mailto form and email links.                                                                                |
| `NEXT_PUBLIC_GITHUB_URL`            | Actual GitHub profile URL. Empty shows a pending state.                                                                                                |
| `NEXT_PUBLIC_LINKEDIN_URL`          | Actual LinkedIn profile URL. Empty shows a pending state.                                                                                              |
| `NEXT_PUBLIC_RESUME_EN_ENGINEERING` | Actual English engineering PDF URL or local public path.                                                                                               |
| `NEXT_PUBLIC_RESUME_EN_CONSULTING`  | Actual English consulting PDF URL or local public path.                                                                                                |
| `NEXT_PUBLIC_RESUME_FA_ENGINEERING` | Actual Persian engineering PDF URL or local public path.                                                                                               |
| `NEXT_PUBLIC_RESUME_FA_CONSULTING`  | Actual Persian consulting PDF URL or local public path.                                                                                                |
| `BLOG_PUBLISHED_AT`                 | Optional real calendar date in `YYYY-MM-DD` format for the initial notes. Empty or invalid dates keep them undated.                                    |

For a locally served resume, put the real file at e.g. `public/resumes/engineering-en.pdf`, then set the matching URL to `/resumes/engineering-en.pdf`. No PDF files are fabricated. URL configuration accepts HTTP(S) or local public paths for links; unsafe schemes are rejected.

The contact form **opens an email draft** in the visitor's configured mail application. It does not submit an HTTP request, deliver a message, save personal data or claim delivery success. The visitor must send the message from that email application. With no configured email the submit control is disabled and the explanation remains visible. Adding a real contact endpoint later requires implementation, validation and an updated privacy policy; there is no pretend endpoint in this version.

## Edit or add content

1. Edit both `src/content/en/site.json` and `src/content/fa/site.json`. Keep object keys and corresponding arrays aligned. Reuse the existing sections and components rather than creating separate locale components.
2. Preserve factual career information. Obtain missing dates, university, personal contacts and project outcomes from the owner before adding them.
3. To add a note, append one object to `src/content/articles.json` with a unique URL-safe `slug`, shared `tags`, an authoritative `source` link, and complete `en` and `fa` objects. Each translation contains `title`, `description` and `sections` (`title`, `paragraphs`).
4. Article lookup, reading time, metadata, related notes and generated article routes derive from that data. Initial reading-time estimates use 220 English words/minute and 160 Persian words/minute.
5. The initial publication date is shared configuration, not a claimed historical date. For independently dated future articles, extend the content schema and `getArticles` together, then update metadata and tests.
6. Run the verification commands after changing content. The tests currently assert eight initial notes; update that deliberate acceptance constraint when adding a ninth.

The small test loader transpiles non-React TypeScript with the installed TypeScript package into an isolated Node VM. Tests execute real i18n/config/blog/SEO functions, not copied implementations. They cover complete bilingual content, known career information, slug parity, reading time, path preservation, optional configuration, URL schemes and metadata/JSON-LD safety. Visual testing in real browsers is still required for responsive behavior and accessibility; these tests do not claim a Lighthouse score.

## Fonts and assets

Fonts are served locally; no runtime Google Fonts requests are needed:

- `public/fonts/geist-latin.woff2` — Geist (Latin), SIL Open Font License 1.1, notice in `Geist-OFL.txt`.
- `public/fonts/vazirmatn.woff2` — Vazirmatn (Persian), SIL Open Font License 1.1, notice in `Vazirmatn-OFL.txt`.
- `public/fonts/vazirmatn-og.ttf` — Vazirmatn font data for server-generated localized Open Graph images, under the same license.

Keep the license notices when redistributing the fonts. The engineering visuals, case-study graphics and icon are built from code/SVG rather than stock photography. Lucide provides the lightweight interface icons.

## Docker

The multi-stage Dockerfile uses `node:24-alpine`, installs locked dependencies, builds the standalone Next.js server and runs it as a non-root user. All public configuration variables and `BLOG_PUBLISHED_AT` have corresponding builder-stage `ARG` entries.

```sh
docker build -t melish-portfolio \
  --build-arg NEXT_PUBLIC_SITE_URL=https://melish.dev \
  --build-arg NEXT_PUBLIC_AUTHOR="Your real name" \
  --build-arg NEXT_PUBLIC_CONTACT_EMAIL="your-real-address@example.com" \
  --build-arg NEXT_PUBLIC_GITHUB_URL="https://github.com/your-profile" \
  --build-arg NEXT_PUBLIC_LINKEDIN_URL="https://www.linkedin.com/in/your-profile" \
  --build-arg NEXT_PUBLIC_RESUME_EN_ENGINEERING=/resumes/engineering-en.pdf \
  --build-arg NEXT_PUBLIC_RESUME_EN_CONSULTING=/resumes/consulting-en.pdf \
  --build-arg NEXT_PUBLIC_RESUME_FA_ENGINEERING=/resumes/engineering-fa.pdf \
  --build-arg NEXT_PUBLIC_RESUME_FA_CONSULTING=/resumes/consulting-fa.pdf \
  --build-arg BLOG_PUBLISHED_AT=2026-10-16 \
  .
docker run --rm -p 3000:3000 --name melish-portfolio melish-portfolio
```

The values above illustrate syntax. Replace them with real values or omit optional arguments to keep their pending states. In PowerShell, use a backtick for each continued line or place the command on a single line. Build-time public values are embedded by Next.js; supplying different `NEXT_PUBLIC_*` variables only at `docker run` does not update pre-rendered pages.

## Deployment and release checks

Deploy the container behind an HTTPS reverse proxy, or use a Next.js-compatible Node host that runs `npm ci`, `npm run build`, then `npm start`. Standalone mode requires the generated `.next/standalone` tree plus `public` and `.next/static`, as copied in the Dockerfile. This is not configured as a static HTML export.

Set the canonical origin before building. Configure DNS/TLS at the host, retain the supplied security headers, and review the privacy page if the host adds analytics or request logging. No deployment, Git initialization, commit or push is performed automatically by this project.

Before a public release:

- Run `npm run verify` and inspect the production server, not just development mode.
- Test both locales on 320, 375/390/430, 768, 1024 and 1440px layouts, with keyboard navigation and reduced motion.
- Check the header/menu, nested locale switching, all theme modes, hero schematic, timeline, case study, notes, contact and footer in RTL and LTR.
- Follow all internal links, verify localized 404s, canonical/hreflang metadata, sitemap and robots output.
- Configure real personal links/resume files, then test those destinations and the email draft workflow.
- Measure Lighthouse performance, accessibility, SEO and best practices on the deployed production build. The intended target is 90+; only an actual measurement establishes a score.

The owner will review and perform Git commit/push later, per the current handoff instruction.

## Dependency audit snapshot

On **2026-10-16**, `npm audit --omit=dev` reported **0 production dependency vulnerabilities**. The full audit reported five high-severity entries from a single development-tool dependency chain:

```text
eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces 3.0.3
```

[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) concerns stack exhaustion when `braces` processes deeply nested patterns. The advisory lists no patched version; the registry's latest `braces` was still 3.0.3. npm proposed downgrading `eslint-config-next` to 14.2.35, which is not a compatible patch for this Next.js 16 project. No forced downgrade, advisory suppression or dependency override was applied. Recheck the advisory and audit when updating tooling; this snapshot is not a guarantee about future advisories.
