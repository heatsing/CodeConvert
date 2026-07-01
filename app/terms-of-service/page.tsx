import type { Metadata } from "next";
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
  return (
    <main className="bg-slate-50 px-4 py-10">
      <article className="mx-auto max-w-4xl rounded-lg border bg-white p-6 text-slate-700 shadow-soft sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">CodeConvert.net</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Terms of Service</h1>
        <p className="mt-3 text-sm text-slate-500">Last Updated: July 2026</p>

        <div className="mt-8 grid gap-7 text-[15px] leading-7">
          <section>
            <h2 className="text-xl font-black text-slate-950">Use of the Site</h2>
            <p className="mt-2">
              CodeConvert.net offers free online tools for developers, writers, and technical users. By using the site, you agree
              to use it lawfully and responsibly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">No Professional Advice</h2>
            <p className="mt-2">
              Tool output is provided for convenience and may be incomplete, inaccurate, or unsuitable for production use. You are
              responsible for reviewing, testing, and validating any generated or transformed content before relying on it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">User Content</h2>
            <p className="mt-2">
              You are responsible for the text, code, files, and other content you enter into the tools. Do not submit content
              that violates laws, infringes rights, contains secrets, or you are not authorized to process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">Availability</h2>
            <p className="mt-2">
              We aim to keep the tools available, but the site may change, pause, or stop without notice. Features may be updated,
              removed, or replaced as the project evolves.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">Limitation of Liability</h2>
            <p className="mt-2">
              CodeConvert.net is provided on an as-is and as-available basis. To the maximum extent permitted by law, we are not
              liable for losses, damages, downtime, data issues, or consequences from using the site or relying on tool output.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">Changes to Terms</h2>
            <p className="mt-2">
              We may update these terms from time to time. Continued use of the site after changes means you accept the updated
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-950">Contact</h2>
            <p className="mt-2">
              For questions about these terms, contact the site owner through the contact method provided on CodeConvert.net.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
