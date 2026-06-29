import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL("https://codetools-ai.example.com"),
  title: {
    default: "CodeTools AI",
    template: "%s | CodeTools AI"
  },
  description: "Free browser-based coding tools for converting, generating, explaining, checking, and exporting code."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
