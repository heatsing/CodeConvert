import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the CodeConvert.net terms of service for using free online code, formatter, encoder, decoder, text, and developer tools.",
  alternates: {
    canonical: `${siteUrl}/terms-of-service`
  },
  openGraph: {
    title: "Terms of Service | CodeConvert.net",
    description: "Terms for using CodeConvert.net developer tools.",
    url: `${siteUrl}/terms-of-service`,
    siteName: "CodeConvert.net",
    type: "website"
  }
};

export default function TermsOfServicePage() {
  return <LegalPage kind="terms" />;
}
