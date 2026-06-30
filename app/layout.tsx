import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GoogleAnalytics } from "@/components/google-analytics";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CodeTools AI - Free Online Code Tools",
    template: "%s | CodeTools AI"
  },
  description: "Free browser-based coding tools for converting, encoding, decoding, formatting, generating, explaining, checking, cleaning, and exporting developer text.",
  applicationName: "CodeTools AI",
  authors: [{ name: "CodeTools AI" }],
  creator: "CodeTools AI",
  publisher: "CodeTools AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <I18nProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </I18nProvider>
      </body>
    </html>
  );
}
