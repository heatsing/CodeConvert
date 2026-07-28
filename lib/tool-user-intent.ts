export type ToolUserIntent = {
  audience: string;
  situation: string;
  input: string;
  outcome: string;
  review: string;
  steps: [string, string, string, string];
  useCases: [string, string, string, string];
  inputState: string;
  outputState: string;
  bestFor: string;
};

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

export function getToolUserIntent(title: string, category: string): ToolUserIntent {
  const name = title.toLowerCase();
  const categoryName = category.toLowerCase();
  const isPairConverter = /\bto\b.+\bconverter\b/.test(name);

  if (
    isPairConverter ||
    includesAny(name, ["json to ", "xml to ", "yaml to ", "csv to ", "html to markdown", "markdown to html"])
  ) {
    const match = title.match(/^(.+?) to (.+?)(?: Converter)?$/i);
    const source = match?.[1] ?? "source";
    const target = match?.[2] ?? "target";
    return {
      audience: "Developers, QA engineers, integration specialists, and technical writers",
      situation: `They have ${source} data or code that a ${target}-based system, test, or document needs to accept.`,
      input: `A focused ${source} sample copied from an API response, configuration file, codebase, export, or technical document.`,
      outcome: `Valid, readable ${target} output that preserves the important values and is ready for review or handoff.`,
      review: `Check nesting, data types, arrays, escaping, names, and any schema or runtime rules required by the destination.`,
      steps: [
        `Paste a representative ${source} sample, including the nested values you need to preserve.`,
        `Run the converter and compare the ${target} structure with the original input.`,
        "Check types, arrays, escaped characters, names, and edge cases before accepting the result.",
        `Copy the ${target} output into your test, document, or project and validate it in the destination system.`
      ],
      useCases: [
        "Preparing API request and response fixtures during integration work.",
        "Moving configuration or content between tools that expect different formats.",
        "Creating readable examples for documentation, tickets, and technical handoffs.",
        "Comparing source and target structures before a migration or implementation."
      ],
      inputState: `Existing ${source} copied from a real workflow, preferably with representative nested values.`,
      outputState: `${target} reorganized for the destination format while retaining the source meaning.`,
      bestFor: "Small and medium samples, integration planning, debugging, documentation, and migration preparation."
    };
  }

  if (includesAny(name, ["formatter", "beautifier", "minifier", "format code", "beautify code"])) {
    const isMinifier = name.includes("minif");
    return {
      audience: "Developers, reviewers, support engineers, and technical writers",
      situation: isMinifier
        ? "They need a compact copy of source or structured data for a payload, fixture, or quick size check."
        : "They received compact, inconsistent, or hard-to-read code and need to inspect its structure quickly.",
      input: "Code, markup, a query, or structured data copied from a response, log, file, build output, or teammate.",
      outcome: isMinifier
        ? "Compact output with unnecessary whitespace removed and meaningful content retained."
        : "Consistently indented output whose nesting, blocks, and values are easier to scan.",
      review: isMinifier
        ? "Confirm strings, significant whitespace, comments, and syntax still behave as expected."
        : "Confirm the input parsed correctly and no malformed section was hidden by the new indentation.",
      steps: [
        "Paste the complete snippet so braces, tags, quotes, and nesting can be interpreted together.",
        `Run the ${isMinifier ? "minifier" : "formatter"} and inspect the first place where the structure changes.`,
        "Check strings, comments, nesting, and syntax-sensitive whitespace for unexpected changes.",
        "Copy the result into your editor or test environment and run the normal project validation."
      ],
      useCases: [
        "Reading compact API responses, logs, generated files, or copied snippets.",
        "Preparing code for review, documentation, debugging, or a support ticket.",
        isMinifier ? "Creating a smaller test payload or distribution sample." : "Finding mismatched nesting and inconsistent indentation.",
        "Normalizing a sample before comparing it with another version."
      ],
      inputState: "Valid or nearly valid code/data whose layout makes it difficult to inspect.",
      outputState: isMinifier ? "A compact representation with less nonessential whitespace." : "The same content arranged with consistent indentation and line breaks.",
      bestFor: "Quick inspection and cleanup before editor-based linting, testing, or production validation."
    };
  }

  if (includesAny(name, ["encode", "decode", "base64", "binary code translator", "escape", "unescape", "unicode"])) {
    const decoding = includesAny(name, ["decode", "to text", "unescape"]);
    return {
      audience: "Web developers, API testers, support engineers, and people debugging copied payloads",
      situation: decoding
        ? "They found encoded or escaped content in a URL, token, log, request, or configuration and need to read it."
        : "They need to place text or developer data into a transport, URL, example, or field that requires an encoded representation.",
      input: decoding ? "An encoded string copied exactly as received, including padding and escape characters." : "The original text, URL, JSON, or short developer payload.",
      outcome: decoding ? "Readable decoded content that can be inspected without losing the original string." : "A correctly encoded string that can be copied into the intended workflow.",
      review: "Verify character encoding, padding, reserved characters, and whether the destination expects the same encoding variant.",
      steps: [
        `Paste the ${decoding ? "encoded value exactly as it appears in the source" : "original value you need to encode"}.`,
        `Run the ${decoding ? "decoder" : "encoder"} and keep the original input available for comparison.`,
        "Inspect non-ASCII characters, padding, spaces, and reserved symbols for unexpected changes.",
        "Copy the result into a test request or destination field before using it in a live workflow."
      ],
      useCases: [
        "Inspecting values copied from URLs, API requests, logs, tokens, or configuration.",
        "Preparing safe examples for documentation and test fixtures.",
        "Checking whether two systems use the same character or transport encoding.",
        "Troubleshooting unreadable text, escaped characters, or malformed payload values."
      ],
      inputState: decoding ? "An encoded value whose exact characters matter." : "Readable source content that must survive a transport or embedding step.",
      outputState: decoding ? "Readable content for inspection and debugging." : "An encoded representation for the target field or protocol.",
      bestFor: "Short text and developer payloads; binary files and sensitive secrets need purpose-built handling."
    };
  }

  if (categoryName.includes("text") || includesAny(name, ["word counter", "character counter", "line break", "whitespace", "duplicate", "text"])) {
    const isCounter = name.includes("counter") || name.includes("finder");
    return {
      audience: "Writers, editors, marketers, students, operations teams, and developers cleaning copied text",
      situation: isCounter
        ? "They need a reliable measurement or a quick way to find repetition before publishing or submitting text."
        : "They copied text from a PDF, document, spreadsheet, CMS, email, or generated export and need to clean a specific problem.",
      input: "The actual paragraph, list, draft, or dataset text that will be published, imported, or shared.",
      outcome: isCounter ? "Clear counts or findings that can guide the next editing decision." : "Clean text that fixes the requested issue while preserving the words that should remain.",
      review: "Read the changed area in context and confirm meaningful spacing, punctuation, capitalization, and intentional repetition were preserved.",
      steps: [
        "Paste the real text you plan to edit, publish, import, or submit.",
        "Choose the relevant option when the tool needs a character, phrase, separator, or replacement.",
        "Run the tool and compare the changed sections with the original text.",
        "Copy the result only after checking punctuation, spacing, intentional repeats, and paragraph boundaries."
      ],
      useCases: [
        "Cleaning text copied from PDFs, emails, web pages, spreadsheets, or document exports.",
        "Preparing titles, descriptions, form entries, product data, or CMS content.",
        "Checking length and repetition before publishing, submitting, or importing text.",
        "Normalizing text before search, comparison, deduplication, or developer processing."
      ],
      inputState: "Real working text with the formatting, repetition, or length issue still present.",
      outputState: isCounter ? "Actionable counts or matches without rewriting the source." : "A revised copy with the targeted issue removed or normalized.",
      bestFor: "Editing and cleanup where the user needs immediate, copy-ready text and a visible before-and-after check."
    };
  }

  if (categoryName.includes("regex") || name.includes("regex")) {
    return {
      audience: "Developers, data analysts, QA engineers, and technical support teams",
      situation: "They need to match, extract, validate, or replace a recurring text pattern before adding it to code or a data workflow.",
      input: "A regex pattern, flags, and representative sample text containing both expected matches and non-matches.",
      outcome: "Visible matches or replacements that demonstrate whether the pattern behaves as intended.",
      review: "Test empty values, multiline input, Unicode text, greedy matches, boundaries, and the regex flavor used by the destination runtime.",
      steps: [
        "Paste representative text with positive, negative, and edge-case examples.",
        "Enter the pattern and flags expected by your target language or runtime.",
        "Run the tool and inspect every match, group, or replacement in context.",
        "Retest the pattern in the destination runtime before applying it to production data."
      ],
      useCases: [
        "Validating identifiers, log lines, filenames, URLs, and form input.",
        "Extracting repeated values from reports, logs, or copied datasets.",
        "Testing replacements before a bulk cleanup or migration.",
        "Explaining and reviewing an unfamiliar pattern during code review."
      ],
      inputState: "A pattern plus realistic samples that include expected failures as well as matches.",
      outputState: "Matches, groups, explanations, or replacements that reveal the pattern's actual behavior.",
      bestFor: "Pattern design and review; final compatibility must be checked in the target regex engine."
    };
  }

  if (categoryName.includes("security") || categoryName.includes("network")) {
    return {
      audience: "Developers, site owners, support engineers, and administrators doing an initial technical check",
      situation: "They need to inspect a token, URL, header, domain, address, or security-related value before deciding what to investigate next.",
      input: "A non-secret value copied from a browser, request, response, configuration, DNS record, or diagnostic note.",
      outcome: "A readable breakdown or preliminary finding that narrows the next debugging or verification step.",
      review: "Do not paste passwords, private keys, session cookies, or production secrets. Confirm live infrastructure results with authoritative tools.",
      steps: [
        "Remove secrets and paste only the value needed for the check.",
        "Run the tool and identify the field, claim, record, or component relevant to the issue.",
        "Compare the result with the application, browser, DNS provider, or server configuration.",
        "Confirm any security-sensitive conclusion with an authoritative live check before making changes."
      ],
      useCases: [
        "Breaking down URLs, query strings, tokens, headers, and network values.",
        "Preparing readable evidence for a bug report or support handoff.",
        "Spotting malformed fields before deeper browser or command-line testing.",
        "Teaching or documenting the parts of a common web and security value."
      ],
      inputState: "A sanitized technical value from the system being investigated.",
      outputState: "A readable interpretation or preliminary check, not a guarantee about live infrastructure.",
      bestFor: "Triage, learning, and documentation before authoritative server-side or provider-side verification."
    };
  }

  if (categoryName.includes("font style")) {
    return {
      audience: "Social media users, community managers, creators, and people styling short profile text",
      situation: "They want a distinctive visual treatment for a short name, bio, caption, or label without creating an image.",
      input: "Short plain text whose readability can be checked character by character.",
      outcome: "Copyable Unicode-styled text that fits the intended profile, post, or message.",
      review: "Check screen-reader clarity, missing glyphs, searchability, moderation rules, and appearance on the target device.",
      steps: [
        "Enter a short name, label, bio, or caption in plain text.",
        "Generate the available Unicode style and inspect every character.",
        "Test the result on the target app and on a second device when possible.",
        "Keep important names and accessibility-critical text in plain characters."
      ],
      useCases: [
        "Styling short profile names, bios, captions, and community labels.",
        "Comparing Unicode text styles before posting.",
        "Creating decorative headings for casual messages.",
        "Testing whether a platform supports particular Unicode glyphs."
      ],
      inputState: "Short plain text that remains understandable without decoration.",
      outputState: "Unicode characters that resemble a font style and can be copied as text.",
      bestFor: "Decorative short-form text, not long passages, passwords, URLs, or accessibility-critical content."
    };
  }

  return {
    audience: "Developers, technical writers, QA engineers, and people handling structured text",
    situation: "They have a focused input and need a quick result they can inspect before continuing work elsewhere.",
    input: "A representative, non-sensitive sample copied from the real task.",
    outcome: "A clear result that can be reviewed, copied, downloaded, or used as the next step in a workflow.",
    review: "Compare the result with the source and validate it in the system where it will actually be used.",
    steps: [
      "Paste a representative, non-sensitive sample from the task you are working on.",
      "Review the available option and run the tool.",
      "Compare the output with the original input and inspect edge cases.",
      "Copy or download the result, then validate it in the destination workflow."
    ],
    useCases: [
      "Preparing examples for documentation, tickets, and team handoffs.",
      "Cleaning or inspecting a small input before deeper work.",
      "Creating a test fixture or reproducible troubleshooting sample.",
      "Saving a copy-ready result for another editor or developer tool."
    ],
    inputState: "A representative sample taken from the real task.",
    outputState: "A processed result that makes the next action clearer.",
    bestFor: "Focused browser-based work followed by validation in the destination system."
  };
}
