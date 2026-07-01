"use client";

export function SiteFooter() {
  return (
    <footer className="border-t bg-white px-4 py-5 text-center text-[13px] leading-7 text-slate-950">
      <div>
        <span>Copyright &copy;2026 CodeConvert.net</span>
        <span> | Last Updated (Jul 2026) | Concept by </span>
        <a href="/" className="underline underline-offset-2 hover:text-blue-700">
          CodeConvert.net
        </a>
      </div>
      <div>
        <a href="/#top" className="underline underline-offset-2 hover:text-blue-700">
          Privacy Policy
        </a>
        <span> | </span>
        <a href="/#top" className="underline underline-offset-2 hover:text-blue-700">
          Terms of Service
        </a>
        <span> | </span>
        <a href="/sitemap.xml" className="underline underline-offset-2 hover:text-blue-700">
          Site Map
        </a>
      </div>
    </footer>
  );
}
