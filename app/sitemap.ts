import type { MetadataRoute } from "next";
import { directoryTools } from "@/lib/home-tools";
import { languageConverterTools } from "@/lib/language-converters";
import { onlineTools } from "@/lib/online-tools";
import { siteUrl } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1
    },
    ...TOOLS.map((tool) => ({
      url: `${siteUrl}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...directoryTools.map((tool) => ({
      url: `${siteUrl}${tool.href}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...languageConverterTools.map((tool) => ({
      url: `${siteUrl}${tool.href}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...onlineTools.map((tool) => ({
      url: `${siteUrl}/online-tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.65
    }))
  ];

  return Array.from(new Map(urls.map((entry) => [entry.url, entry])).values());
}
