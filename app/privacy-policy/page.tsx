import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the CodeConvert.net privacy policy, including what data our browser-based developer tools process and how analytics may be used.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`
  },
  openGraph: {
    title: "Privacy Policy | CodeConvert.net",
    description: "Privacy information for CodeConvert.net developer tools.",
    url: `${siteUrl}/privacy-policy`,
    siteName: "CodeConvert.net",
    type: "website"
  }
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-slate-50 px-4 py-10">
      <article className="mx-auto max-w-4xl rounded-lg border bg-white p-6 text-slate-700 shadow-soft sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">CodeConvert.net</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-500">Last Updated: July 2026</p>

        <div className="mt-8 grid gap-7 text-[15px] leading-7">
          <section>
            <h2 className="text-xl font-black text-slate-950">Overview</h2>
            <p className="mt-2">
              CodeConvert.net provides browser-based tools for code conversion, formatting, encoding, decoding, text processing,
              and developer workflows. This policy explains how information may be handled when you use the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">Tool Input</h2>
            <p className="mt-2">
              Most tools are designed to process the text you enter in the browser interface. You should not paste passwords,
              private keys, production secrets, confidential source code, or other sensitive information into any online tool.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">Analytics</h2>
            <p className="mt-2">
              We may use analytics services, such as Google Analytics, to understand page usage, improve navigation, and find
              technical issues. Analytics may collect information such as browser type, device type, approximate location, pages
              visited, and referral source.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">Cookies</h2>
            <p className="mt-2">
              The site or third-party analytics providers may use cookies or similar technologies to measure usage and remember
              basic preferences. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">Third-Party Services</h2>
            <p className="mt-2">
              CodeConvert.net may include services for hosting, analytics, security, or performance. These providers process
              data according to their own policies and only for the purposes needed to operate the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">Changes</h2>
            <p className="mt-2">
              We may update this privacy policy as the site changes. The latest version will be available on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">Contact</h2>
            <p className="mt-2">
              For privacy questions, contact the site owner through the contact method provided on CodeConvert.net.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
