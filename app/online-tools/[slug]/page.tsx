import { notFound, permanentRedirect } from "next/navigation";
import { onlineToolBySlug, onlineTools } from "@/lib/online-tools";

type OnlineToolRedirectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return onlineTools.map((tool) => ({ slug: tool.slug }));
}

export default async function OnlineToolRedirectPage({ params }: OnlineToolRedirectPageProps) {
  const { slug: routeSlug } = await params;
  const slug = routeSlug.toLowerCase();
  if (Object.hasOwn(onlineToolBySlug, slug)) {
    permanentRedirect(`/${slug}`);
  }

  notFound();
}
