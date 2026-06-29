import type { Metadata } from "next";
import { HomeDirectory } from "@/components/home-directory";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Online Code Tools Directory",
  description: "A clean directory of free online tools for code conversion, generation, formatting, checking, and developer utilities.",
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: "Online Code Tools Directory | CodeTools AI",
    description: "Search and open free developer tools from one lightweight directory.",
    url: siteUrl,
    siteName: "CodeTools AI",
    type: "website"
  }
};

export default function Page() {
  return <HomeDirectory />;
}
