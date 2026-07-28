const baseUrl = (process.env.SEO_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

function values(xml, tag) {
  return [...xml.matchAll(new RegExp(`<${tag}>([^<]+)</${tag}>`, "g"))].map((match) => match[1]);
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}.`);
const sitemap = await sitemapResponse.text();
const urls = values(sitemap, "loc").filter((url) => !url.match(/\.(png|jpg|jpeg|webp|svg)$/i));
const failures = [];
const titles = new Map();
const descriptions = new Map();

for (const canonicalUrl of urls) {
  const url = new URL(canonicalUrl);
  const response = await fetch(`${baseUrl}${url.pathname}`, { redirect: "manual" });
  const html = await response.text();
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "";
  const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? "";
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1] ?? "";
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  const robots = html.match(/<meta name="robots" content="([^"]*)"/i)?.[1] ?? "";

  if (response.status !== 200) failures.push(`${url.pathname}: expected 200, received ${response.status}`);
  if (!html.trim()) failures.push(`${url.pathname}: empty HTML`);
  if (h1Count !== 1) failures.push(`${url.pathname}: expected one H1, found ${h1Count}`);
  if (canonical !== canonicalUrl) failures.push(`${url.pathname}: canonical ${canonical || "missing"} does not match sitemap URL`);
  if (robots.toLowerCase().includes("noindex")) failures.push(`${url.pathname}: sitemap page is noindex`);
  if (!html.includes('"@type":"SoftwareApplication"') && url.pathname !== "/") failures.push(`${url.pathname}: SoftwareApplication JSON-LD missing`);
  if (!html.includes('"@type":"BreadcrumbList"') && url.pathname !== "/") failures.push(`${url.pathname}: BreadcrumbList JSON-LD missing`);
  if (!title) failures.push(`${url.pathname}: title missing`);
  if (!description) failures.push(`${url.pathname}: description missing`);

  if (titles.has(title)) failures.push(`${url.pathname}: duplicate title also used by ${titles.get(title)}`);
  else titles.set(title, url.pathname);
  if (descriptions.has(description)) failures.push(`${url.pathname}: duplicate description also used by ${descriptions.get(description)}`);
  else descriptions.set(description, url.pathname);
}

const ghostChecks = [
  "/json-formatter-and-minifier",
  "/json-to-yaml-converter",
  "/html-formatter-minifier-and-beautifier",
  "/url-encode-and-decode"
];
for (const pathname of ghostChecks) {
  const response = await fetch(`${baseUrl}${pathname}`, { redirect: "manual" });
  if (response.status !== 404) failures.push(`${pathname}: retired ghost URL should return 404, received ${response.status}`);
}

const codelf = await fetch(`${baseUrl}/codelf`, { redirect: "manual" });
if (codelf.status !== 200) failures.push(`/codelf: expected 200, received ${codelf.status}`);

if (failures.length) {
  failures.forEach((failure) => console.error(`Error: ${failure}`));
  process.exit(1);
}

console.log(`Validated ${urls.length} sitemap pages.`);
console.log("All sitemap pages return 200 with one H1, self-canonical metadata, indexable robots, unique title/description, and required tool JSON-LD.");
console.log("Ghost URLs return 404 and /codelf returns 200.");
