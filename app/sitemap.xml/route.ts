import { assessToolRoute } from "@/lib/seo-quality";
import { siteIconUrl, siteLogoUrl, siteUrl } from "@/lib/site";
import { toolRoutes } from "@/lib/tool-route-inventory";

type SitemapEntry = {
  url: string;
  changeFrequency: "daily" | "weekly";
  priority: number;
  images?: string[];
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sitemapEntry(entry: SitemapEntry) {
  const images = entry.images?.map((image) => `\n<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`).join("") ?? "";
  return `<url>
<loc>${escapeXml(entry.url)}</loc>
<changefreq>${entry.changeFrequency}</changefreq>
<priority>${entry.priority.toFixed(2)}</priority>${images}
</url>`;
}

export function GET() {
  const entries: SitemapEntry[] = [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
      images: [siteLogoUrl, siteIconUrl]
    },
    ...toolRoutes
      .map((route) => ({ route, assessment: assessToolRoute(route) }))
      .filter(({ assessment }) => assessment.indexable)
      .map(({ route, assessment }) => ({
        url: `${siteUrl}${route.href}`,
        changeFrequency: "weekly" as const,
        priority: assessment.grade === "A" ? 0.8 : 0.65
      }))
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(sitemapEntry).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
