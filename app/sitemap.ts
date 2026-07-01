import type { MetadataRoute } from "next";
import { directoryTools } from "@/lib/home-tools";
import { languageConverterTools } from "@/lib/language-converters";
import { onlineTools } from "@/lib/online-tools";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3
    },
    {
      url: `${siteUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3
    },
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
      url: `${siteUrl}/${tool.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.65
    }))
  ];

  return Array.from(new Map(urls.map((entry) => [entry.url, entry])).values());
}
