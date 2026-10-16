import { NextResponse, type NextRequest } from "next/server";
import { getContent } from "@/content";
import { articleSlugs } from "@/lib/blog";

const staticSections = [
  "",
  "about",
  "projects",
  "services",
  "experience",
  "blog",
  "resume",
  "contact",
  "privacy",
  "opengraph-image",
];
const localizedSections = new Set([
  ...staticSections,
  ...getContent("en").projects.map((project) => `projects/${project.slug}`),
  ...articleSlugs.map((slug) => `blog/${slug}`),
]);

function localizedNotFound(locale: "en" | "fa") {
  const fa = locale === "fa";
  const copy = getContent(locale).ui;
  const title = copy.notFound;
  const description = copy.notFoundText;
  const home = copy.backHome;
  const other = fa ? "English home" : "خانه فارسی";
  return `<!doctype html><html lang="${locale}" dir="${fa ? "rtl" : "ltr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} — Melish.dev</title><style>@font-face{font-family:Geist;src:url('/fonts/geist-latin.woff2')}@font-face{font-family:Vazirmatn;src:url('/fonts/vazirmatn.woff2')}*{box-sizing:border-box}body{margin:0;background:#f4f1e8;color:#151a16;font-family:${fa ? "Vazirmatn" : "Geist"},sans-serif}.page{min-height:100vh;display:grid;place-content:center;padding:2rem;text-align:center}.code{font-size:clamp(5rem,18vw,11rem);font-weight:800;line-height:.8;color:#173f2c}.brand{margin:2rem 0 .75rem;color:#53745f;letter-spacing:.14em;text-transform:uppercase}h1{font-size:clamp(2rem,6vw,4rem);margin:.25rem}p{color:#526057;max-width:34rem}.actions{display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem;margin-top:1.5rem}a{padding:.8rem 1.15rem;border:1px solid #173f2c;border-radius:999px;color:#173f2c;text-decoration:none}a:first-child{background:#173f2c;color:#fff}@media(prefers-color-scheme:dark){body{background:#101512;color:#eef2e9}p{color:#aebbb1}a{border-color:#b9ef42;color:#eef2e9}a:first-child{background:#b9ef42;color:#101512}.code{color:#b9ef42}}</style></head><body><main class="page"><div class="code">404</div><div class="brand">Melish.dev</div><h1>${title}</h1><p>${description}</p><div class="actions"><a href="/${locale}">${home}</a><a href="/${fa ? "en" : "fa"}" lang="${fa ? "en" : "fa"}" dir="${fa ? "ltr" : "rtl"}">${other}</a></div></main></body></html>`;
}

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-melish-pathname", request.nextUrl.pathname);

  const match = request.nextUrl.pathname.match(/^\/(en|fa)(?:\/(.*))?\/?$/);
  if (match) {
    const section = (match[2] || "").replace(/\/$/, "");
    if (!localizedSections.has(section)) {
      return new NextResponse(localizedNotFound(match[1] as "en" | "fa"), {
        status: 404,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
