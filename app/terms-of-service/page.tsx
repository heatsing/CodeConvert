import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { siteOpenGraphAlternateLocales, siteOpenGraphLocale, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the CodeConvert.net terms of service for using free online code, formatter, encoder, decoder, text, and developer tools.",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true
    }
  },
  alternates: {
    canonical: `${siteUrl}/terms-of-service`,
    languages: {
      "x-default": `${siteUrl}/terms-of-service`,
      en: `${siteUrl}/terms-of-service`
    }
  },
  openGraph: {
    title: "Terms of Service - CodeConvert",
    description: "Read the CodeConvert.net terms of service for using free online code, formatter, encoder, decoder, text, and developer tools.",
    url: `${siteUrl}/terms-of-service`,
    siteName: "CodeConvert.net",
    type: "website",
    locale: siteOpenGraphLocale,
    alternateLocale: siteOpenGraphAlternateLocales
  }
};

export default function TermsOfServicePage() {
  return <LegalPage kind="terms" />;
}
