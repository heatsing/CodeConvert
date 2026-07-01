import { permanentRedirect } from "next/navigation";
import { onlineToolBySlug, onlineTools } from "@/lib/online-tools";

type OnlineToolRedirectPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return onlineTools.map((tool) => ({ slug: tool.slug }));
}

export default function OnlineToolRedirectPage({ params }: OnlineToolRedirectPageProps) {
  const slug = params.slug.toLowerCase();
  if (onlineToolBySlug[slug]) {
    permanentRedirect(`/${slug}`);
  }

  permanentRedirect("/");
}
