import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { siteOpenGraphAlternateLocales, siteOpenGraphLocale, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the CodeConvert.net privacy policy, including what data our browser-based developer tools process and how analytics may be used.",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true
    }
  },
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
    languages: {
      "x-default": `${siteUrl}/privacy-policy`,
      en: `${siteUrl}/privacy-policy`
    }
  },
  openGraph: {
    title: "Privacy Policy - CodeConvert",
    description: "Read the CodeConvert.net privacy policy, including what data our browser-based developer tools process and how analytics may be used.",
    url: `${siteUrl}/privacy-policy`,
    siteName: "CodeConvert.net",
    type: "website",
    locale: siteOpenGraphLocale,
    alternateLocale: siteOpenGraphAlternateLocales
  }
};

export default function PrivacyPolicyPage() {
  return <LegalPage kind="privacy" />;
}
