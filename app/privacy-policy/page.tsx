import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the CodeConvert.net privacy policy, including what data our browser-based developer tools process and how analytics may be used.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`
  },
  openGraph: {
    title: "Privacy Policy - CodeConvert",
    description: "Privacy information for CodeConvert.net developer tools.",
    url: `${siteUrl}/privacy-policy`,
    siteName: "CodeConvert.net",
    type: "website"
  }
};

export default function PrivacyPolicyPage() {
  return <LegalPage kind="privacy" />;
}
