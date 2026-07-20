import { directoryTools } from "@/lib/home-tools";
import { languageConverterTools } from "@/lib/language-converters";
import { onlineTools } from "@/lib/online-tools";
import { shouldIndexDirectoryTool, shouldIndexOnlineTool } from "@/lib/seo-quality";
import { siteIconUrl, siteLogoUrl, siteUrl } from "@/lib/site";

type SitemapEntry = {
  url: string;
  changeFrequency: "daily" | "weekly" | "monthly";
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

function sitemapEntry(entry: SitemapEntry, lastModified: string) {
  const images = entry.images?.map((image) => `\n<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`).join("") ?? "";

  return `<url>
<loc>${escapeXml(entry.url)}</loc>
<lastmod>${lastModified}</lastmod>
<changefreq>${entry.changeFrequency}</changefreq>
<priority>${entry.priority.toFixed(2)}</priority>${images}
</url>`;
}

export function GET() {
  const lastModified = new Date().toISOString();
  const entries: SitemapEntry[] = [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
      images: [siteLogoUrl, siteIconUrl]
    },
    ...directoryTools.filter(shouldIndexDirectoryTool).map((tool) => ({
      url: `${siteUrl}${tool.href}`,
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...languageConverterTools.filter(shouldIndexDirectoryTool).map((tool) => ({
      url: `${siteUrl}${tool.href}`,
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...onlineTools.filter(shouldIndexOnlineTool).map((tool) => ({
      url: `${siteUrl}/${tool.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.65
    }))
  ];
  const uniqueEntries = Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${uniqueEntries.map((entry) => sitemapEntry(entry, lastModified)).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
