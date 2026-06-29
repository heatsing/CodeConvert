import type { Metadata } from "next";
import { HomeDirectory } from "@/components/home-directory";

export const metadata: Metadata = {
  title: "Online Code Tools Directory",
  description: "A clean directory of free online tools for code conversion, generation, formatting, checking, and developer utilities.",
  alternates: {
    canonical: "https://codetools-ai.example.com/"
  },
  openGraph: {
    title: "Online Code Tools Directory | CodeTools AI",
    description: "Search and open free developer tools from one lightweight directory.",
    url: "https://codetools-ai.example.com/",
    siteName: "CodeTools AI",
    type: "website"
  }
};

export default function Page() {
  return <HomeDirectory />;
}
