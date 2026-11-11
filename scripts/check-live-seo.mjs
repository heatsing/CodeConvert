import { getToolCapability } from "../lib/tool-capabilities.ts";
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
  if (url.pathname !== "/" && !getToolCapability(url.pathname).indexable) failures.push(`${url.pathname}: sitemap lists an unaccepted tool`);
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
  "/url-encode-and-decode",
  "/constructor",
  "/__proto__",
  "/tools/constructor",
  "/tools/__proto__",
  "/online-tools/constructor",
  "/online-tools/__proto__"
];
for (const pathname of ghostChecks) {
  const response = await fetch(`${baseUrl}${pathname}`, { redirect: "manual" });
  if (response.status !== 404) failures.push(`${pathname}: unknown or retired URL should return 404, received ${response.status}`);
}

const codelf = await fetch(`${baseUrl}/codelf`, { redirect: "manual" });
if (codelf.status !== 200) failures.push(`/codelf: expected 200, received ${codelf.status}`);

const homepage = await (await fetch(baseUrl)).text();
const homepageIds = new Set([...homepage.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
for (const match of homepage.matchAll(/<a\b[^>]*href="\/?#([^"]+)"/g)) {
  if (!homepageIds.has(match[1])) failures.push(`#${match[1]}: homepage navigation has no destination`);
}
const homepageLinks = [...homepage.matchAll(/<a\b[^>]*href="(\/[^"#?]+)"/g)].map((match) => match[1]);
for (const path of homepageLinks) {
  if (["/privacy-policy", "/terms-of-service", "/sitemap.xml"].includes(path)) continue;
  if (!getToolCapability(path).discoverable) failures.push(`${path}: unaccepted tool appears on homepage`);
}
for (const path of ["/code-converter", "/code-generator", "/css-minifier", "/sql-formatter", "/regex-generator", "/css-to-inline", "/python-to-rust-converter"]) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  if (response.status !== 200) failures.push(`${path}: existing URL must remain available`);
  if (!/<meta name="robots" content="[^"]*noindex/.test(html)) failures.push(`${path}: limited/unavailable page must be noindex`);
  if (urls.some((url) => new URL(url).pathname === path)) failures.push(`${path}: limited/unavailable page must not be in sitemap`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`Error: ${failure}`));
  process.exit(1);
}

console.log(`Validated ${urls.length} sitemap pages.`);
console.log("All sitemap pages return 200 with one H1, self-canonical metadata, indexable robots, unique title/description, and required tool JSON-LD.");
console.log("Ghost URLs return 404 and /codelf returns 200.");
