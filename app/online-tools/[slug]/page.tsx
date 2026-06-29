import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnlineToolWorkspace } from "@/components/online-tool-workspace";
import { onlineToolBySlug, onlineTools } from "@/lib/online-tools";

type OnlineToolPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return onlineTools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: OnlineToolPageProps): Metadata {
  const tool = onlineToolBySlug[params.slug];
  if (!tool) return {};

  return {
    title: `${tool.name} Online Tool`,
    description: tool.description,
    alternates: {
      canonical: `https://codetools-ai.example.com/online-tools/${tool.slug}`
    },
    openGraph: {
      title: `${tool.name} Online Tool | CodeTools AI`,
      description: tool.description,
      url: `https://codetools-ai.example.com/online-tools/${tool.slug}`,
      siteName: "CodeTools AI",
      type: "website"
    }
  };
}

export default function OnlineToolPage({ params }: OnlineToolPageProps) {
  const tool = onlineToolBySlug[params.slug];
  if (!tool) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: `https://codetools-ai.example.com/online-tools/${tool.slug}`,
    description: tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <OnlineToolWorkspace tool={tool} />
    </>
  );
}
