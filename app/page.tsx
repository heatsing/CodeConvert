import type { Metadata } from "next";
import { HomeDirectory } from "@/components/home-directory";
import { directoryTools } from "@/lib/home-tools";
import { buildJsonLdScripts, buildMetadata, buildOrganizationJsonLd } from "@/lib/seo";
import { isDiscoverableTool } from "@/lib/tool-capabilities";
import { siteLogoUrl, siteUrl } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Browser Developer Tools",
  description: "Encode and decode text, format code, convert JSON and CSV, and clean source comments with tested local tools.",
  path: "",
  keywords: ["online code tools", "developer tools", "code converter", "base64 encode", "json formatter"]
});

export default function Page() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free online code tools",
    itemListElement: directoryTools.filter(isDiscoverableTool).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${siteUrl}${tool.href}`
    }))
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CodeConvert.net",
    url: siteUrl,
    publisher: {
      "@type": "Organization",
      name: "CodeConvert.net",
      logo: {
        "@type": "ImageObject",
        url: siteLogoUrl,
        width: 1152,
        height: 217
      }
    }
  };

  return (
    <>
      {buildJsonLdScripts([buildOrganizationJsonLd(), website, itemList])}
      <HomeDirectory />
    </>
  );
}
