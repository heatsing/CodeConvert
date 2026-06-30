import type { Metadata } from "next";
import { HomeDirectory } from "@/components/home-directory";
import { directoryTools } from "@/lib/home-tools";
import { buildJsonLdScripts, buildMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Quick Code Conversion Tools | CodeConvert.net",
  description: "Free online code tools for converting, encoding, decoding, formatting, checking, generating, and cleaning developer text from one fast workspace.",
  path: "",
  keywords: ["online code tools", "developer tools", "code converter", "base64 encode", "json formatter"]
});

export default function Page() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free online code tools",
    itemListElement: directoryTools.slice(0, 60).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${siteUrl}${tool.href}`
    }))
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CodeTools AI",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      {buildJsonLdScripts([website, itemList])}
      <HomeDirectory />
    </>
  );
}
