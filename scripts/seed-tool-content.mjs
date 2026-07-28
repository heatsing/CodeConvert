import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const slugs = [
  "code-converter", "code-generator", "code-explainer", "comment-remover", "code-checker", "code-to-pdf",
  "json-formatter", "json-formatter-and-minifier", "json-beautifier", "json-validator", "json-viewer",
  "json-to-xml", "xml-to-json", "json-to-yaml-converter", "json-to-csv", "csv-to-json",
  "html-to-markdown", "markdown-to-html", "html-formatter", "html-formatter-minifier-and-beautifier",
  "html-encode", "html-decode", "xml-formatter", "xml-beautifier", "css-formatter", "css-beautifier",
  "css-minifier", "javascript-formatter", "javascript-minifier", "typescript-formatter", "sql-formatter",
  "yaml-formatter", "markdown-formatter", "graphql-formatter", "base64-encode", "base64-decode",
  "base64-encode-and-decode", "url-encode", "url-decode", "url-encode-and-decode", "jwt-decode",
  "regex-tester", "regex-generator", "regex-extractor", "regex-replace", "regex-explainer",
  "binary-code-translator", "url-parser", "query-string-parser", "code-formatter", "code-beautifier",
  "code-diff", "json-to-typescript", "json-to-java", "json-to-python", "remove-line-breaks",
  "character-remover", "duplicate-line-remover", "duplicate-word-finder", "word-counter",
  "character-counter", "whitespace-remover", "title-case-converter", "small-text-generator"
];

const titleOverrides = {
  "json-formatter-and-minifier": "JSON Formatter and Minifier",
  "html-formatter-minifier-and-beautifier": "HTML Formatter, Minifier and Beautifier",
  "base64-encode-and-decode": "Base64 Encode and Decode",
  "url-encode-and-decode": "URL Encode and Decode",
  "jwt-decode": "JWT Decode",
  "regex-tester": "Regex Tester",
  "url-parser": "URL Parser",
  "query-string-parser": "Query String Parser",
  "json-to-typescript": "JSON to TypeScript",
  "json-to-java": "JSON to Java",
  "json-to-python": "JSON to Python",
  "small-text-generator": "Small Text Generator"
};

const clusters = {
  json: ["json-formatter", "json-validator", "json-viewer", "json-to-xml", "json-to-yaml-converter", "json-to-csv", "json-to-typescript"],
  markup: ["html-formatter", "html-to-markdown", "markdown-to-html", "html-encode", "html-decode", "xml-formatter", "xml-to-json"],
  style: ["css-formatter", "css-beautifier", "css-minifier", "javascript-formatter", "javascript-minifier", "typescript-formatter"],
  encode: ["base64-encode", "base64-decode", "base64-encode-and-decode", "url-encode", "url-decode", "binary-code-translator", "jwt-decode"],
  regex: ["regex-tester", "regex-generator", "regex-extractor", "regex-replace", "regex-explainer"],
  code: ["code-converter", "code-generator", "code-explainer", "comment-remover", "code-checker", "code-to-pdf", "code-formatter", "code-diff"],
  text: ["remove-line-breaks", "character-remover", "duplicate-line-remover", "duplicate-word-finder", "word-counter", "character-counter", "whitespace-remover", "title-case-converter", "small-text-generator"],
  url: ["url-parser", "query-string-parser", "url-encode", "url-decode", "url-encode-and-decode", "jwt-decode"]
};

const examples = {
  json: ['{"project":"atlas","active":true,"ports":[3000,3001]}', '{\n  "project": "atlas",\n  "active": true,\n  "ports": [\n    3000,\n    3001\n  ]\n}'],
  xml: ["<service><name>atlas</name><port>3000</port></service>", "<service>\n  <name>atlas</name>\n  <port>3000</port>\n</service>"],
  html: ["<article><h2>Release</h2><p>Version 3 is ready.</p></article>", "<article>\n  <h2>Release</h2>\n  <p>Version 3 is ready.</p>\n</article>"],
  css: [".card{display:grid;gap:12px;color:#123456}", ".card {\n  display: grid;\n  gap: 12px;\n  color: #123456;\n}"],
  javascript: ["const total=(items)=>items.reduce((sum,item)=>sum+item.price,0);", "const total = (items) =>\n  items.reduce((sum, item) => sum + item.price, 0);"],
  typescript: ["type User={id:number;name:string};const user:User={id:7,name:'Mina'};", "type User = {\n  id: number;\n  name: string;\n};\n\nconst user: User = { id: 7, name: 'Mina' };"],
  sql: ["select id,name from users where active=true order by name;", "SELECT id,\n       name\nFROM users\nWHERE active = true\nORDER BY name;"],
  yaml: ["service:\n name: atlas\n ports: [3000, 3001]", "service:\n  name: atlas\n  ports:\n    - 3000\n    - 3001"],
  markdown: ["#Release\n-Added API\n-Fixed auth", "# Release\n\n- Added API\n- Fixed auth"],
  graphql: ["query User($id:ID!){user(id:$id){id name email}}", "query User($id: ID!) {\n  user(id: $id) {\n    id\n    name\n    email\n  }\n}"],
  text: ["First line.\nSecond line wraps early.\nThird line continues.", "First line. Second line wraps early. Third line continues."],
  code: ["function total(items){return items.reduce((sum,item)=>sum+item.price,0)}", "function total(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}"]
};

const exactExamples = {
  "code-converter": ["const greet = (name) => `Hello ${name}`;", "def greet(name):\n    return f\"Hello {name}\""],
  "code-generator": ["Create a TypeScript function that groups orders by status.", "function groupByStatus(orders: Order[]) {\n  return Object.groupBy(orders, order => order.status);\n}"],
  "code-explainer": ["const visible = items.filter(item => item.active).slice(0, 5);", "Keep active items, then return at most the first five results."],
  "comment-remover": ["// tax is a decimal\nconst total = subtotal * (1 + tax);", "const total = subtotal * (1 + tax);"],
  "code-checker": ["function ratio(total, count) { return total / count; }", "Review: handle count === 0 before dividing."],
  "code-to-pdf": ["export function add(a: number, b: number) {\n  return a + b;\n}", "Code Document\nLanguage: TypeScript\n\nexport function add(a: number, b: number) {\n  return a + b;\n}"],
  "json-formatter": ['{"release":"3.2","changes":["api","auth"],"stable":true}', '{\n  "release": "3.2",\n  "changes": [\n    "api",\n    "auth"\n  ],\n  "stable": true\n}'],
  "json-formatter-and-minifier": ['{\n  "event": "order.created",\n  "id": 42\n}', '{"event":"order.created","id":42}'],
  "json-beautifier": ['{"user":{"id":7,"profile":{"name":"Mina","timezone":"UTC"}}}', '{\n  "user": {\n    "id": 7,\n    "profile": {\n      "name": "Mina",\n      "timezone": "UTC"\n    }\n  }\n}'],
  "json-validator": ['{"id":42,"items":["A","B",]}', "Invalid JSON: trailing comma after the final array item."],
  "json-viewer": ['{"orders":[{"id":42,"total":19.5},{"id":43,"total":8}]}', 'orders\n  [0]\n    id: 42\n    total: 19.5\n  [1]\n    id: 43\n    total: 8'],
  "json-to-xml": ['{"order":{"id":42,"paid":true}}', "<order>\n  <id>42</id>\n  <paid>true</paid>\n</order>"],
  "xml-to-json": ["<order><id>42</id><paid>true</paid></order>", '{\n  "order": {\n    "id": 42,\n    "paid": true\n  }\n}'],
  "json-to-yaml-converter": ['{"service":{"name":"api","replicas":3}}', "service:\n  name: api\n  replicas: 3"],
  "json-to-csv": ['[{"sku":"A-1","qty":2},{"sku":"B-7","qty":5}]', "sku,qty\nA-1,2\nB-7,5"],
  "csv-to-json": ["sku,qty\nA-1,2\nB-7,5", '[\n  {"sku":"A-1","qty":"2"},\n  {"sku":"B-7","qty":"5"}\n]'],
  "html-to-markdown": ["<h2>Setup</h2><p>Install the package.</p><ul><li>Run tests</li></ul>", "## Setup\n\nInstall the package.\n\n- Run tests"],
  "markdown-to-html": ["## Setup\n\nInstall the package.\n\n- Run tests", "<h2>Setup</h2>\n<p>Install the package.</p>\n<ul>\n  <li>Run tests</li>\n</ul>"],
  "html-formatter": ["<main><h1>Account</h1><form><label>Email<input type=\"email\"></label></form></main>", "<main>\n  <h1>Account</h1>\n  <form>\n    <label>Email<input type=\"email\"></label>\n  </form>\n</main>"],
  "html-formatter-minifier-and-beautifier": ["<nav>\n  <a href=\"/docs\">Docs</a>\n  <a href=\"/api\">API</a>\n</nav>", "<nav><a href=\"/docs\">Docs</a><a href=\"/api\">API</a></nav>"],
  "html-encode": ["<strong>Ready & tested</strong>", "&lt;strong&gt;Ready &amp; tested&lt;/strong&gt;"],
  "html-decode": ["&lt;button disabled&gt;Save &amp; close&lt;/button&gt;", "<button disabled>Save & close</button>"],
  "xml-formatter": ["<catalog><book id=\"b1\"><title>APIs</title></book></catalog>", "<catalog>\n  <book id=\"b1\">\n    <title>APIs</title>\n  </book>\n</catalog>"],
  "xml-beautifier": ["<response status=\"ok\"><item><id>42</id></item></response>", "<response status=\"ok\">\n  <item>\n    <id>42</id>\n  </item>\n</response>"],
  "css-formatter": ["@media(min-width:768px){.layout{grid-template-columns:240px 1fr;gap:24px}}", "@media (min-width: 768px) {\n  .layout {\n    grid-template-columns: 240px 1fr;\n    gap: 24px;\n  }\n}"],
  "css-beautifier": [":root{--brand:#2463eb}.button{background:var(--brand);color:white}", ":root {\n  --brand: #2463eb;\n}\n\n.button {\n  background: var(--brand);\n  color: white;\n}"],
  "css-minifier": [".notice {\n  border: 1px solid #ddd;\n  padding: 12px;\n}", ".notice{border:1px solid #ddd;padding:12px}"],
  "javascript-formatter": ["async function load(id){const response=await fetch(`/api/items/${id}`);return response.json()}", "async function load(id) {\n  const response = await fetch(`/api/items/${id}`);\n  return response.json();\n}"],
  "javascript-minifier": ["export function clamp(value, min, max) {\n  return Math.min(max, Math.max(min, value));\n}", "export function clamp(value,min,max){return Math.min(max,Math.max(min,value))}"],
  "typescript-formatter": ["interface Order{id:number;status:'new'|'paid'};const paid=(order:Order)=>order.status==='paid';", "interface Order {\n  id: number;\n  status: 'new' | 'paid';\n}\n\nconst paid = (order: Order) => order.status === 'paid';"],
  "sql-formatter": ["select customer_id,count(*) as orders from purchases where created_at>=current_date-30 group by customer_id having count(*)>2;", "SELECT customer_id,\n       COUNT(*) AS orders\nFROM purchases\nWHERE created_at >= CURRENT_DATE - 30\nGROUP BY customer_id\nHAVING COUNT(*) > 2;"],
  "yaml-formatter": ["deploy:\n image: api:3.2\n env:\n - name: MODE\n   value: production", "deploy:\n  image: api:3.2\n  env:\n    - name: MODE\n      value: production"],
  "markdown-formatter": ["##API notes\nUse `GET /orders`.\n1.fetch token\n2.send request", "## API notes\n\nUse `GET /orders`.\n\n1. Fetch token\n2. Send request"],
  "graphql-formatter": ["mutation UpdateOrder($id:ID!,$status:String!){updateOrder(id:$id,status:$status){id status updatedAt}}", "mutation UpdateOrder($id: ID!, $status: String!) {\n  updateOrder(id: $id, status: $status) {\n    id\n    status\n    updatedAt\n  }\n}"],
  "base64-encode": ["API test: order 42", "QVBJIHRlc3Q6IG9yZGVyIDQy"],
  "base64-decode": ["QVBJIHRlc3Q6IG9yZGVyIDQy", "API test: order 42"],
  "base64-encode-and-decode": ["status=ready", "c3RhdHVzPXJlYWR5"],
  "url-encode": ["https://example.com/search?q=red shoes&sort=new", "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dred%20shoes%26sort%3Dnew"],
  "url-decode": ["q=red%20shoes%26sort%3Dnew", "q=red shoes&sort=new"],
  "url-encode-and-decode": ["campaign=summer sale&source=email", "campaign%3Dsummer%20sale%26source%3Demail"],
  "jwt-decode": ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsInJvbGUiOiJlZGl0b3IifQ.signature", '{\n  "sub": "42",\n  "role": "editor"\n}'],
  "regex-tester": ["/\\b[A-Z]{2}-\\d{4}\\b/g\nTickets: AB-1042, invalid A-22, CD-8801", "Matches (2)\nAB-1042\nCD-8801"],
  "regex-generator": ["Match invoice IDs such as INV-2026-0042", "\\bINV-\\d{4}-\\d{4}\\b"],
  "regex-extractor": ["/#[a-z0-9_-]+/gi\nTags: #NextJS, #seo-audit and #API", "#NextJS\n#seo-audit\n#API"],
  "regex-replace": ["/\\s{2,}/g\nName:  Mina    Chen", "Name: Mina Chen"],
  "regex-explainer": ["/^(?<scheme>https?):\\/\\/(?<host>[^/]+)$/i", "Start to end: capture http/https as scheme, then capture the host after //; case-insensitive."],
  "binary-code-translator": ["01001000 01101001", "Hi"],
  "url-parser": ["https://api.example.com/v2/orders?id=42#items", "Protocol: https\nHost: api.example.com\nPath: /v2/orders\nQuery: id=42\nFragment: items"],
  "query-string-parser": ["utm_source=newsletter&plan=pro&trial=true", "utm_source: newsletter\nplan: pro\ntrial: true"],
  "code-formatter": ["if(user&&user.active){sendEmail(user.email)}else{log('inactive')}", "if (user && user.active) {\n  sendEmail(user.email);\n} else {\n  log('inactive');\n}"],
  "code-beautifier": ["for(const item of items){if(item.stock>0){available.push(item)}}", "for (const item of items) {\n  if (item.stock > 0) {\n    available.push(item);\n  }\n}"],
  "code-diff": ["Before: const limit = 10;\nAfter: const limit = 25;", "Line 1 changed: 10 -> 25"],
  "json-to-typescript": ['{"id":42,"name":"Mina","roles":["editor"]}', "interface User {\n  id: number;\n  name: string;\n  roles: string[];\n}"],
  "json-to-java": ['{"id":42,"active":true}', "public class User {\n  private int id;\n  private boolean active;\n}"],
  "json-to-python": ['{"id":42,"active":true}', "@dataclass\nclass User:\n    id: int\n    active: bool"],
  "remove-line-breaks": ["A sentence copied from a PDF\nwraps before the paragraph\nis actually finished.", "A sentence copied from a PDF wraps before the paragraph is actually finished."],
  "character-remover": ["Order #A-42 / Priority!", "Order A42  Priority"],
  "duplicate-line-remover": ["alpha\nbeta\nalpha\ngamma\nbeta", "alpha\nbeta\ngamma"],
  "duplicate-word-finder": ["The report report contains a repeated repeated phrase.", "report: 2\nrepeated: 2"],
  "word-counter": ["Clear release notes help teams understand what changed.", "Words: 9\nCharacters: 55\nLines: 1"],
  "character-counter": ["Meta descriptions should explain the page clearly.", "Characters: 50\nCharacters without spaces: 44"],
  "whitespace-remover": ["Name:   Mina\tChen\n\nStatus: ready", "Name: Mina Chen\nStatus: ready"],
  "title-case-converter": ["a practical guide to json api testing", "A Practical Guide to JSON API Testing"],
  "small-text-generator": ["Release Notes", "ʀᴇʟᴇᴀꜱᴇ ɴᴏᴛᴇꜱ"]
};

function titleFor(slug) {
  if (titleOverrides[slug]) return titleOverrides[slug];
  return slug.split("-").map((word) => {
    const upper = { json: "JSON", xml: "XML", html: "HTML", css: "CSS", url: "URL", sql: "SQL", jwt: "JWT", base64: "Base64", javascript: "JavaScript", typescript: "TypeScript", csv: "CSV", yaml: "YAML" };
    return upper[word] ?? `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }).join(" ");
}

function familyFor(slug) {
  if (clusters.text.includes(slug)) return "text";
  if (clusters.regex.includes(slug)) return "regex";
  if (clusters.encode.includes(slug) || clusters.url.includes(slug)) return "encode";
  if (clusters.code.includes(slug) || slug.startsWith("json-to-")) return "code";
  if (slug.includes("json")) return "json";
  if (slug.includes("xml")) return "xml";
  if (slug.includes("html")) return "html";
  if (slug.includes("css")) return "css";
  if (slug.includes("javascript")) return "javascript";
  if (slug.includes("typescript")) return "typescript";
  if (slug.includes("sql")) return "sql";
  if (slug.includes("yaml")) return "yaml";
  if (slug.includes("markdown")) return "markdown";
  if (slug.includes("graphql")) return "graphql";
  return "code";
}

function relatedFor(slug) {
  const cluster = Object.values(clusters).find((items) => items.includes(slug)) ?? clusters.code;
  return cluster.filter((item) => item !== slug).slice(0, 6);
}

function actionFor(slug) {
  if (slug.includes("-to-")) return "convert";
  if (slug.includes("format") || slug.includes("beautif")) return "format";
  if (slug.includes("minifier")) return "minify";
  if (slug.includes("encode")) return "encode";
  if (slug.includes("decode")) return "decode";
  if (slug.includes("validator") || slug.includes("checker")) return "validate";
  if (slug.includes("parser")) return "parse";
  if (slug.includes("remover")) return "remove";
  if (slug.includes("counter")) return "count";
  if (slug.includes("regex")) return "test";
  if (slug.includes("generator")) return "generate";
  return "inspect";
}

function subjectFor(slug, family) {
  if (slug.includes("json")) return "JSON objects, arrays, keys, and values";
  if (slug.includes("xml")) return "XML elements, attributes, namespaces, and nesting";
  if (slug.includes("html")) return "HTML elements, links, lists, and document structure";
  if (slug.includes("css")) return "CSS selectors, declarations, media rules, and custom properties";
  if (slug.includes("javascript")) return "JavaScript functions, expressions, modules, and strings";
  if (slug.includes("typescript")) return "TypeScript types, interfaces, generics, and executable code";
  if (slug.includes("sql")) return "SQL clauses, joins, expressions, and dialect-specific syntax";
  if (slug.includes("yaml")) return "YAML indentation, sequences, mappings, anchors, and scalar values";
  if (slug.includes("markdown")) return "Markdown headings, links, lists, tables, and code fences";
  if (slug.includes("graphql")) return "GraphQL operations, variables, fragments, and selection sets";
  if (slug.includes("base64")) return "Base64 text, UTF-8 characters, and padding";
  if (slug.includes("url") || slug.includes("query-string")) return "URL components, query parameters, reserved characters, and percent encoding";
  if (slug.includes("jwt")) return "JWT headers, payload claims, timestamps, and signatures";
  if (family === "regex") return "regular-expression patterns, flags, groups, and representative test text";
  if (family === "text") return "working text copied from documents, forms, spreadsheets, email, or a CMS";
  return "source code, structured text, and the destination workflow";
}

function audienceFor(family) {
  const audiences = {
    json: "API developers, integration engineers, QA testers, and technical writers",
    xml: "Backend developers, integration specialists, QA engineers, and teams maintaining XML systems",
    html: "Frontend developers, documentation teams, CMS editors, and content migration specialists",
    css: "Frontend developers, UI engineers, reviewers, and people debugging stylesheet output",
    javascript: "JavaScript developers, reviewers, support engineers, and maintainers of browser or Node.js code",
    typescript: "TypeScript developers, API teams, reviewers, and maintainers working with typed models",
    sql: "Application developers, data analysts, database reviewers, and support engineers",
    yaml: "DevOps engineers, platform teams, developers, and reviewers of configuration files",
    markdown: "Technical writers, developers, documentation maintainers, and open-source contributors",
    graphql: "API developers, frontend engineers, QA testers, and GraphQL schema reviewers",
    encode: "Web developers, API testers, support engineers, and people debugging transported text",
    regex: "Developers, data analysts, QA engineers, and technical support teams",
    text: "Writers, editors, marketers, students, operations teams, and developers cleaning copied text",
    code: "Developers, QA engineers, code reviewers, and technical writers"
  };
  return audiences[family] ?? audiences.code;
}

function buildContent(slug) {
  const title = titleFor(slug);
  const family = familyFor(slug);
  const action = actionFor(slug);
  const subject = subjectFor(slug, family);
  const audience = audienceFor(family);
  const pair = exactExamples[slug] ?? examples[family] ?? examples.code;
  const relatedTools = relatedFor(slug);
  const isText = family === "text";
  const isRegex = family === "regex";
  const isEncode = family === "encode";

  return {
    slug,
    title,
    description: `${title} helps people ${action} ${subject} and review the result before using it in another system.`,
    intro: `${title} is for a concrete handoff: take ${subject} from a real task, produce the form the next editor, API, document, or workflow expects, and keep enough context to verify what changed.`,
    audience,
    input: isRegex
      ? `A pattern, flags, and sample text containing both expected matches and deliberate non-matches for ${title}.`
      : isText
        ? `The actual paragraph, list, title, or draft that needs ${title.toLowerCase()}, including the problem area.`
        : `A representative sample of ${subject} copied from the API, file, codebase, log, document, or request involved in the task.`,
    outcome: isEncode
      ? `A readable or transport-safe result whose character encoding, reserved characters, and padding have been checked.`
      : `A ${title.toLowerCase()} result that preserves the intended meaning and is ready to test in its destination.`,
    review: isRegex
      ? "Check positive and negative samples, groups, greediness, boundaries, Unicode, multiline behavior, and compatibility with the destination regex engine."
      : isText
        ? "Read the changed section in context and confirm intentional punctuation, spacing, capitalization, repetition, and paragraph boundaries remain correct."
        : `Check ${subject}, malformed input, escaped values, and destination-specific rules before relying on the result.`,
    bestFor: `Small and medium ${subject} samples used for debugging, documentation, migration preparation, review, and reproducible tests.`,
    steps: [
      `Paste a representative ${isText ? "text sample" : isRegex ? "pattern and test sample" : subject} from the task you are working on.`,
      `Run ${title} and compare the first meaningful change with the source.`,
      `Inspect ${isRegex ? "matches, groups, non-matches, and edge cases" : isText ? "words, punctuation, spacing, and intentional structure" : subject + " plus any destination-specific constraints"}.`,
      "Copy or download the result, then validate it in the editor, runtime, API, form, or publishing system where it will be used."
    ],
    useCases: [
      `${title} for a real ${family === "text" ? "editing or publishing" : "development or integration"} task rather than a synthetic keyword example.`,
      `Preparing ${title} input and output for a bug report, documentation page, test fixture, or technical handoff.`,
      isRegex ? `Using ${title} against failures and edge cases before adding the pattern to application code.` : `Using ${title} to compare the source and result before a migration, import, release, or review.`,
      isEncode ? `Using ${title} to diagnose escaped, encoded, or unreadable values in requests, URLs, logs, and configuration.` : `${title} helps catch structural or meaning-changing mistakes before the output reaches another system.`
    ],
    examples: [
      {
        title: `${title} with a representative sample`,
        description: `This ${title} example uses ${subject} that resembles a small production fixture, so the main change can be checked line by line.`,
        input: pair[0],
        output: pair[1]
      },
      {
        title: `${title} edge-case review`,
        description: `The second ${title} pass focuses on the part most likely to fail: ${isRegex ? "boundaries and non-matches" : isText ? "intentional spacing and punctuation" : "nested values, escaping, or destination rules"}.`,
        input: `${pair[0]}\n\nReview case: preserve empty, repeated, or non-ASCII values where applicable.`,
        output: `${pair[1]}\n\nReview note: confirm this result in the destination workflow.`
      }
    ],
    tips: [
      `Keep the original ${title} input beside the result until the destination check passes.`,
      `Use realistic ${subject} instead of a one-word sample when validating ${title}.`,
      isEncode ? `${title} does not provide encryption; never treat its encoded output as private or secure.` : `Do not assume the visual cleanup from ${title} proves that ${subject} is valid.`,
      `Run the normal project, API, schema, browser, or editorial validation after using ${title}.`
    ],
    faq: [
      {
        question: `Who uses ${title}?`,
        answer: `${audience} use ${title} when they need to ${action} ${subject} before continuing work in another editor, system, or document.`
      },
      {
        question: `What should I paste into ${title}?`,
        answer: `Paste a focused but representative sample of ${subject} into ${title}. Include the nesting, punctuation, characters, or edge cases that affect the real task.`
      },
      {
        question: `What does ${title} change?`,
        answer: `${title} changes the representation needed for this task. Compare the output with the source to confirm that values and intended meaning remain correct.`
      },
      {
        question: `What should I check after using ${title}?`,
        answer: isRegex
          ? `After ${title}, review matches, non-matches, groups, flags, greediness, boundaries, and the regex flavor used by the destination runtime.`
          : isText
            ? `After ${title}, review punctuation, spacing, capitalization, intentional repetition, paragraph boundaries, and any publishing length limit.`
            : `After ${title}, review ${subject}, escaped values, malformed input, and the rules enforced by the destination system.`
      },
      {
        question: `Can I use the ${title} output in production?`,
        answer: `Use the ${title} result as reviewed working output, then run the destination system's normal validation, tests, schema checks, or editorial review before production use.`
      },
      {
        question: `Does ${title} store my input?`,
        answer: `${title} has no account or saved-history feature. Even so, remove passwords, private keys, session cookies, personal data, and production secrets before using any online tool.`
      }
    ],
    relatedTools,
    keywords: [title.toLowerCase(), `${title.toLowerCase()} online`, `${action} ${subject.toLowerCase()}`, `${family} tool`, "browser based tool"]
  };
}

const outputDirectory = join(process.cwd(), "data", "tools");
mkdirSync(outputDirectory, { recursive: true });
const force = process.argv.includes("--force");
let created = 0;
let skipped = 0;

for (const slug of slugs) {
  const outputPath = join(outputDirectory, `${slug}.json`);
  if (!force && existsSync(outputPath)) {
    skipped += 1;
    continue;
  }
  const content = buildContent(slug);
  writeFileSync(outputPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  created += 1;
}

console.log(`Created ${created} tool content files; skipped ${skipped} existing files.`);
