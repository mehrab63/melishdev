import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getContent } from "@/content";
import { isLocale } from "@/lib/i18n";
export const alt = "Melish.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale = isLocale(value) ? value : "en",
    c = getContent(locale);
  const font = await readFile(
    join(process.cwd(), "public/fonts/vazirmatn-og.ttf"),
  );
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#102e28",
          color: "#f5f6ef",
          padding: "65px",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Vazirmatn",
          textAlign: locale === "fa" ? "right" : "left",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#d4e9a6" }}>
          Melish.dev
        </div>
        <div
          style={{
            display: "flex",
            fontSize: locale === "fa" ? 49 : 60,
            lineHeight: 1.5,
            maxWidth: 1070,
          }}
          dir={locale === "fa" ? "rtl" : "ltr"}
        >
          {c.hero.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            borderTop: "1px solid #416058",
            paddingTop: 24,
          }}
          dir={locale === "fa" ? "rtl" : "ltr"}
        >
          {c.hero.eyebrow}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Vazirmatn", data: font, style: "normal", weight: 400 }],
    },
  );
}
