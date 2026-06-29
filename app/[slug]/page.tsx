import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DirectoryToolWorkspace } from "@/components/directory-tool-workspace";
import { directoryToolBySlug, directoryTools, directoryToolSlug } from "@/lib/home-tools";
import { languageConverterBySlug, languageConverterTools } from "@/lib/language-converters";

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
  const tool = getTool(params.slug);
  if (!tool) return {};

  return {
    title: `${tool.name} Online`,
    description: tool.description,
    alternates: {
      canonical: `https://codetools-ai.example.com/${tool.href.slice(1)}`
    },
    openGraph: {
      title: `${tool.name} Online | CodeTools AI`,
      description: tool.description,
      url: `https://codetools-ai.example.com/${tool.href.slice(1)}`,
      siteName: "CodeTools AI",
      type: "website"
    }
  };
}

export default function RootToolPage({ params }: RootToolPageProps) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  return <DirectoryToolWorkspace tool={tool} />;
}
