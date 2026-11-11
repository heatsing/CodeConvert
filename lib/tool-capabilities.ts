import examples from "../data/verified-tool-examples.json" with { type: "json" };
import contentSlugs from "../data/tool-content-manifest.json" with { type: "json" };

export type ToolStatus = "verified" | "limited" | "unavailable" | "unreviewed";
export type ToolCapability = { status: ToolStatus; discoverable: boolean; indexable: boolean; reason: string };
const reviewedContent = new Set<string>(contentSlugs);
const limited: Record<string, string> = {
  "code-converter": "Creates a migration worksheet; automatic code translation is not available.",
  "code-generator": "Creates a fixed starter template; it does not implement a requested program.",
  "code-explainer": "Counts source keywords; it does not explain or verify program behavior.",
  "code-checker": "Runs simple text heuristics; it is not a compiler or security audit.",
  "code-to-pdf": "Exports a text document; PDF generation is not available."
};

// Promotion requires executable examples. Navigation, metadata and sitemap share this rule.
export function getToolCapability(path: string): ToolCapability {
  const slug = path.replace(/^\/+|\/+$/g, "").toLowerCase();
  if (Object.hasOwn(limited, slug)) return { status: "limited", discoverable: false, indexable: false, reason: limited[slug] };
  const unavailableReason = unavailableToolReason(slug.replace(/-/g, " "));
  if (unavailableReason || /-to-.+-converter$/.test(slug)) return { status: "unavailable", discoverable: false, indexable: false, reason: unavailableReason ?? "This conversion is not implemented. No processed result is available." };
  if (Object.hasOwn(examples, slug) && (examples as Record<string, unknown[]>)[slug].length > 0) return { status: "verified", discoverable: true, indexable: reviewedContent.has(slug), reason: "Local processing has executable acceptance examples." };
  return { status: "unreviewed", discoverable: false, indexable: false, reason: "This tool has not passed the current acceptance checks and is not included in the recommended directory." };
}
export function isDiscoverableTool(tool: { href?: string; slug?: string }) {
  return getToolCapability(tool.slug ?? tool.href ?? "").discoverable;
}

export function unavailableToolReason(name: string) {
  const title = name.toLowerCase();
  if (title.includes("css to inline")) return "CSS inlining is not implemented. Applying selectors requires an HTML document and a cascade-aware inliner; no inline styles have been generated.";
  if (title.includes("regex generator")) return "Automatic regex generation is not available. Use Regex Tester to test an expression you provide.";
  const liveChecks = ["ssl checker", "whois lookup", "dns lookup", "dns record viewer", "dns propagation", "ip lookup", "ip information", "url scanner", "security headers", "http headers", "ping test", "traceroute", "port scanner", "subdomain finder", "http status checker", "redirect checker", "mac address lookup", "cidr calculator"];
  if (liveChecks.some((tool) => title.includes(tool))) return "This tool has no live checking service connected. No request was sent and no security or availability result can be determined.";
  if (/md5 generator|hmac generator|jwt encode|jwt verify|md5 decrypt|hash cracker/.test(title)) return "This cryptographic operation is not implemented. No hash, signed token, or verification result has been produced.";
  if (/sql formatter|json5|base62|base85|base91|pinyin|simplified traditional|qr code generator|barcode generator/.test(title)) return "This conversion is not implemented reliably yet. Your input has been kept unchanged; no result has been generated.";
  if (/css minifier|minify css|yaml to json|json to yaml|toml to json|ini to json|yaml to xml|xml to yaml|yaml to csv|csv to yaml|xml to csv|json to toml|json to ini/.test(title)) return "This conversion needs a format-specific parser that is not available yet. Your input has been kept unchanged.";
  if (/minify html|minify xml|html minifier|xml minifier|curl to php|quoted printable|wingdings translator|base64 to image|image to base64/.test(title)) return "This conversion is not implemented reliably yet. Your input has been kept unchanged; no result has been generated.";
  if (/^(css|scss|less|sass|stylus) to (css|scss|less|sass|stylus)/.test(title)) return "This preprocessor conversion is not implemented. Use a compiler for the requested language; your source has been kept unchanged.";
  if (/apa citation generator|unit test|code summarizer|code commenter|api code|sql query|shell script|dockerfile|code snippet|readme generator|code refactor|code optimizer/.test(title)) return "This generator is not connected to a code analysis or generation engine. No result has been generated from your input.";
  return null;
}
