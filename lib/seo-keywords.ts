export type KeywordConversionPair = {
  from: string;
  to: string;
} | null;

export function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function uniqueKeywords(keywords: string[]) {
  return keywords
    .map((keyword) => keyword.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((keyword, index, allKeywords) => allKeywords.findIndex((item) => item.toLowerCase() === keyword.toLowerCase()) === index);
}

export function keywordVariants(name: string) {
  return [
    name,
    `${name} online`,
    `free ${name}`,
    `free ${name} online`,
    `${name} tool`
  ];
}

export function intentKeywords(name: string, category: string, categoryLabel: string) {
  const lowerName = name.toLowerCase();
  const keywords = [
    `${name} online tool`,
    `free online ${categoryLabel.toLowerCase()}`,
    `${categoryLabel} for developers`,
    "browser based developer tool",
    "paste copy download tool",
    "no signup online tool"
  ];

  if (lowerName.includes("json")) keywords.push("json formatter", "json validator", "json beautifier", "json converter", "format json online");
  if (lowerName.includes("xml")) keywords.push("xml formatter", "xml validator", "xml beautifier", "xml converter", "format xml online");
  if (lowerName.includes("yaml")) keywords.push("yaml formatter", "yaml validator", "yaml converter", "format yaml online");
  if (lowerName.includes("html")) keywords.push("html formatter", "html minifier", "html encoder decoder", "html beautifier");
  if (lowerName.includes("css")) keywords.push("css formatter", "css beautifier", "css minifier", "format css online");
  if (lowerName.includes("javascript") || lowerName.includes("js")) keywords.push("javascript formatter", "javascript beautifier", "javascript minifier", "js formatter online");
  if (lowerName.includes("typescript")) keywords.push("typescript formatter", "typescript converter", "typescript code tool", "ts formatter online");
  if (lowerName.includes("base64")) keywords.push("base64 encode", "base64 decode", "base64 converter", "base64 encoder decoder");
  if (lowerName.includes("url")) keywords.push("url encode", "url decode", "url parser", "url parameter tool");
  if (lowerName.includes("regex")) keywords.push("regex tester", "regular expression tester", "regex generator", "regex checker");
  if (lowerName.includes("hash") || lowerName.includes("md5") || lowerName.includes("sha")) keywords.push("hash generator", "md5 generator", "sha generator", "checksum tool");
  if (lowerName.includes("jwt")) keywords.push("jwt decoder", "jwt parser", "jwt token tool", "jwt encode decode");
  if (lowerName.includes("text") || category === "Text") keywords.push("text tools", "text cleaner", "text converter", "word counter", "character counter");
  if (category === "Font Styles") keywords.push("font generator", "fancy text generator", "unicode text generator", "social media font generator");
  if (category === "Security") keywords.push("security tools", "token checker", "hash tools", "web security tool");
  if (category === "Network") keywords.push("network tools", "dns tools", "ip lookup", "domain checker");
  if (category === "Code") keywords.push("code converter", "code generator", "code checker", "code formatter", "programming tool");
  if (category === "Language") keywords.push("online compiler", "language tools", "programming language tool", "code runner");
  if (category === "Format" || category === "Formatter") keywords.push("formatter online", "beautifier online", "code formatter", "data formatter");
  if (category === "Encode" || category === "Decode") keywords.push("encoder decoder", "encode decode online", "text encoder", "text decoder");

  return uniqueKeywords(keywords);
}

export function keywordIntent(title: string, categoryLabel: string, conversionPair: KeywordConversionPair) {
  const normalizedTitle = normalizeSearchText(title);
  if (conversionPair) return `convert ${conversionPair.from} code to ${conversionPair.to}`;
  if (normalizedTitle.includes("json")) return "format, validate, convert, or inspect JSON data";
  if (normalizedTitle.includes("xml")) return "format, validate, convert, or inspect XML markup";
  if (normalizedTitle.includes("html")) return "clean, encode, decode, or format HTML";
  if (normalizedTitle.includes("css") || normalizedTitle.includes("scss") || normalizedTitle.includes("less")) return "format, beautify, or minify stylesheet code";
  if (normalizedTitle.includes("base64")) return "encode, decode, or convert Base64 text";
  if (normalizedTitle.includes("url")) return "encode, decode, or inspect URL strings";
  if (normalizedTitle.includes("regex")) return "test, generate, or explain regular expressions";
  if (normalizedTitle.includes("hash") || normalizedTitle.includes("md5") || normalizedTitle.includes("sha")) return "generate and inspect hash values";
  if (normalizedTitle.includes("remove")) return "remove unwanted characters, formatting, comments, or repeated content";
  if (normalizedTitle.includes("case")) return "convert text case for titles, labels, names, and content cleanup";
  if (normalizedTitle.includes("font") || categoryLabel === "Font Styles") return "create styled Unicode text for bios, captions, usernames, and posts";
  if (normalizedTitle.includes("code")) return "process code snippets in a focused browser workspace";
  return `process ${categoryLabel.toLowerCase()} input quickly`;
}

export function keywordPhrases(title: string, categoryLabel: string, conversionPair: KeywordConversionPair) {
  const normalizedTitle = normalizeSearchText(title);
  const baseTitle = title.replace(/\s+Online$/i, "").trim();
  const phrases = [
    `free ${baseTitle} online`,
    `${baseTitle} tool`,
    `${categoryLabel.toLowerCase()} for developers`,
    "browser based editor",
    "copy and download output"
  ];

  if (conversionPair) {
    phrases.push(
      `${conversionPair.from} to ${conversionPair.to} converter`,
      `convert ${conversionPair.from} code to ${conversionPair.to}`,
      `free ${conversionPair.from} to ${conversionPair.to} code converter`
    );
  }

  if (normalizedTitle.includes("json")) phrases.push("JSON formatter", "JSON validator", "JSON beautifier", "JSON converter");
  if (normalizedTitle.includes("xml")) phrases.push("XML formatter", "XML validator", "XML beautifier", "XML converter");
  if (normalizedTitle.includes("yaml")) phrases.push("YAML formatter", "YAML validator", "YAML converter");
  if (normalizedTitle.includes("html")) phrases.push("HTML formatter", "HTML minifier", "HTML encoder decoder");
  if (normalizedTitle.includes("css") || normalizedTitle.includes("scss") || normalizedTitle.includes("less")) phrases.push("CSS formatter", "CSS beautifier", "stylesheet formatter");
  if (normalizedTitle.includes("javascript") || normalizedTitle.includes("typescript")) phrases.push("JavaScript formatter", "TypeScript formatter", "code beautifier");
  if (normalizedTitle.includes("base64")) phrases.push("Base64 encoder", "Base64 decoder", "Base64 converter");
  if (normalizedTitle.includes("url")) phrases.push("URL encoder", "URL decoder", "URL parameter tool");
  if (normalizedTitle.includes("regex")) phrases.push("regex tester", "regular expression checker", "regex generator");
  if (normalizedTitle.includes("hash") || normalizedTitle.includes("md5") || normalizedTitle.includes("sha")) phrases.push("hash generator", "MD5 generator", "SHA checksum tool");
  if (normalizedTitle.includes("jwt")) phrases.push("JWT decoder", "JWT parser", "token inspector");
  if (normalizedTitle.includes("word counter")) phrases.push("word count tool", "online word counter", "text statistics");
  if (normalizedTitle.includes("character counter")) phrases.push("character count tool", "letter counter", "text length checker");
  if (categoryLabel === "Text Tools") phrases.push("text cleaner", "text converter", "remove text formatting", "plain text tool");
  if (categoryLabel === "Font Styles") phrases.push("font generator", "fancy text generator", "Unicode text generator", "social media fonts");

  return uniqueKeywords(phrases).slice(0, 9);
}
