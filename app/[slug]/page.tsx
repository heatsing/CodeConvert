import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectoryToolWorkspace } from "@/components/directory-tool-workspace";
import { ToolLayout } from "@/components/tool-layout";
import { directoryToolBySlug, directoryTools, directoryToolSlug } from "@/lib/home-tools";
import { languageConverterBySlug, languageConverterTools } from "@/lib/language-converters";
import { siteUrl } from "@/lib/site";
import { toolBySlug, type ToolSlug } from "@/lib/tools";

type RootToolPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return [...directoryTools.map((tool) => ({ slug: directoryToolSlug(tool.name) })), ...languageConverterTools.map((tool) => ({ slug: tool.href.slice(1) }))];
}

function getTool(slug: string) {
  const normalizedSlug = slug.toLowerCase();
  return directoryToolBySlug[normalizedSlug] ?? languageConverterBySlug[normalizedSlug];
}

export function generateMetadata({ params }: RootToolPageProps): Metadata {
  const normalizedSlug = params.slug.toLowerCase();
  const coreTool = toolBySlug[normalizedSlug as ToolSlug];
  if (coreTool) {
    const title = coreTool.title;
    const description = coreTool.description;
    const href = `/${coreTool.slug}`;

    return {
      title,
      description,
      alternates: {
        canonical: `${siteUrl}${href}`
      },
      openGraph: {
        title: `${title} | CodeTools AI`,
        description,
        url: `${siteUrl}${href}`,
        siteName: "CodeTools AI",
        type: "website"
      }
    };
  }

  const tool = getTool(normalizedSlug);
  if (!tool) return {};
  const description = tool.headerDescription ?? tool.description;

  return {
    title: `${tool.name} Online`,
    description,
    alternates: {
      canonical: `${siteUrl}${tool.href}`
    },
    openGraph: {
      title: `${tool.name} Online | CodeTools AI`,
      description,
      url: `${siteUrl}${tool.href}`,
      siteName: "CodeTools AI",
      type: "website"
    }
  };
}

export default function RootToolPage({ params }: RootToolPageProps) {
  const normalizedSlug = params.slug.toLowerCase();
  const coreTool = toolBySlug[normalizedSlug as ToolSlug];
  if (coreTool) {
    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: coreTool.faqs.map((faq) => ({
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
      name: coreTool.title,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      url: `${siteUrl}/${coreTool.slug}`,
      description: coreTool.description,
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
        <ToolLayout tool={coreTool} />
      </>
    );
  }

  const tool = getTool(normalizedSlug);
  if (!tool) notFound();

  return <DirectoryToolWorkspace tool={tool} />;
}
