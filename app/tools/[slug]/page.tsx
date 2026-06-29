import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS, toolBySlug, type ToolSlug } from "@/lib/tools";
import { siteUrl } from "@/lib/site";

type ToolPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: ToolPageProps): Metadata {
  const tool = toolBySlug[params.slug as ToolSlug];
  if (!tool) return {};

  const url = `${siteUrl}/tools/${tool.slug}`;

  return {
    title: tool.title,
    description: tool.description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${tool.title} | CodeTools AI`,
      description: tool.description,
      url,
      siteName: "CodeTools AI",
      type: "website"
    }
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = toolBySlug[params.slug as ToolSlug];
  if (!tool) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: `${siteUrl}/tools/${tool.slug}`,
    description: tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }} />
      <ToolLayout tool={tool} />
    </>
  );
}
