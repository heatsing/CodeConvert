import type { ToolConfig } from "@/lib/tools";

export type LocalToolRequest = {
  tool: ToolConfig;
  input: string;
  sourceLanguage: string;
  targetLanguage: string;
};

function stripCommonComments(input: string) {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/^\s*#.*$/gm, "")
    .replace(/^\s*--.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function identifierFromPrompt(prompt: string) {
  const words = prompt.toLowerCase().match(/[a-z0-9]+/g)?.slice(0, 5) ?? ["generated", "task"];
  const [first, ...rest] = words;
  return `${first}${rest.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("")}`.replace(/^\d/, "task");
}

function generateStarterCode(prompt: string, language: string) {
  const name = identifierFromPrompt(prompt);
  const summary = prompt.replace(/\s+/g, " ").trim();
  const normalized = language.toLowerCase();

  if (normalized.includes("python")) {
    return `def ${name}(value):\n    \"\"\"${summary}\"\"\"\n    if value is None:\n        raise ValueError(\"value is required\")\n    return value\n\n\nif __name__ == \"__main__\":\n    print(${name}(\"sample\"))`;
  }
  if (normalized.includes("typescript")) {
    return `/** ${summary} */\nexport function ${name}<T>(value: T): T {\n  if (value === null || value === undefined) {\n    throw new Error(\"value is required\");\n  }\n  return value;\n}\n\nconsole.log(${name}(\"sample\"));`;
  }
  if (normalized.includes("java")) {
    const className = name.charAt(0).toUpperCase() + name.slice(1);
    return `public final class ${className} {\n  private ${className}() {}\n\n  public static String run(String value) {\n    if (value == null) {\n      throw new IllegalArgumentException(\"value is required\");\n    }\n    return value;\n  }\n\n  public static void main(String[] args) {\n    System.out.println(run(\"sample\"));\n  }\n}`;
  }
  if (normalized === "go") {
    return `package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nfunc ${name}(value string) (string, error) {\n\tif value == \"\" {\n\t\treturn \"\", errors.New(\"value is required\")\n\t}\n\treturn value, nil\n}\n\nfunc main() {\n\tresult, err := ${name}(\"sample\")\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tfmt.Println(result)\n}`;
  }
  if (normalized === "sql") {
    return `-- ${summary}\nSELECT\n  value,\n  CASE WHEN value IS NULL THEN 'missing' ELSE 'valid' END AS status\nFROM source_data;`;
  }
  return `/** ${summary} */\nfunction ${name}(value) {\n  if (value === null || value === undefined) {\n    throw new Error(\"value is required\");\n  }\n  return value;\n}\n\nconsole.log(${name}(\"sample\"));`;
}

function explainCode(input: string, language: string) {
  const lines = input.split(/\r?\n/);
  const nonEmpty = lines.filter((line) => line.trim()).length;
  const functions = input.match(/\b(function|def|func|fn)\s+\w+|\w+\s*=\s*\([^)]*\)\s*=>/g)?.length ?? 0;
  const classes = input.match(/\b(class|interface|struct|enum)\s+\w+/g)?.length ?? 0;
  const imports = input.match(/^\s*(import|from|require|use|include)\b/gm)?.length ?? 0;
  const branches = input.match(/\b(if|else|switch|case|match)\b/g)?.length ?? 0;
  const loops = input.match(/\b(for|while|loop|foreach)\b/g)?.length ?? 0;
  const asyncOperations = input.match(/\b(async|await|Promise|yield)\b/g)?.length ?? 0;
  const notes = [
    `${lines.length} total lines and ${nonEmpty} non-empty lines`,
    `${functions} function-like declaration${functions === 1 ? "" : "s"} and ${classes} type declaration${classes === 1 ? "" : "s"}`,
    `${imports} import or dependency statement${imports === 1 ? "" : "s"}`,
    `${branches} conditional branch marker${branches === 1 ? "" : "s"} and ${loops} loop marker${loops === 1 ? "" : "s"}`
  ];
  if (asyncOperations) notes.push(`${asyncOperations} asynchronous operation marker${asyncOperations === 1 ? "" : "s"}`);

  return `Code structure analysis (${language})\n\nOverview\n${notes.map((note) => `- ${note}.`).join("\n")}\n\nLikely flow\n1. Dependencies and declarations are evaluated first.\n2. Functions or types define the reusable behavior.\n3. Conditions and loops control which statements run.\n4. Return values, logging, or mutations produce the observable result.\n\nReview notes\n- Confirm input types and empty-value behavior.\n- Trace each branch with a representative example.\n- Verify side effects and error handling in the target runtime.`;
}

function checkCode(input: string, language: string) {
  const issues: string[] = [];
  const lines = input.split(/\r?\n/);
  const addMatches = (pattern: RegExp, message: string) => {
    lines.forEach((line, index) => {
      pattern.lastIndex = 0;
      if (pattern.test(line)) issues.push(`Line ${index + 1}: ${message}`);
    });
  };

  addMatches(/\beval\s*\(/, "Avoid eval() with untrusted input.");
  addMatches(/\b(var)\s+\w+/, "Prefer block-scoped declarations where the language supports them.");
  addMatches(/(^|[^=])==([^=]|$)/, "Review loose equality; strict comparison may be safer.");
  addMatches(/\b(TODO|FIXME|HACK)\b/i, "Resolve the maintenance marker before release.");
  addMatches(/\b(password|secret|api[_-]?key)\s*[:=]\s*['\"][^'\"]+/i, "Possible hard-coded credential.");
  lines.forEach((line, index) => {
    if (line.length > 120) issues.push(`Line ${index + 1}: Line exceeds 120 characters and may be difficult to review.`);
  });

  const pairs: Array<[string, string]> = [["(", ")"], ["[", "]"], ["{", "}"]];
  for (const [open, close] of pairs) {
    const opens = input.split(open).length - 1;
    const closes = input.split(close).length - 1;
    if (opens !== closes) issues.push(`Structure: Unbalanced ${open}${close} delimiters (${opens} opening, ${closes} closing).`);
  }

  return `Code check report (${language})\n\n${issues.length ? `${issues.length} issue${issues.length === 1 ? "" : "s"} found:\n${issues.map((issue) => `- ${issue}`).join("\n")}` : "No issues matched the built-in syntax and maintainability rules."}\n\nChecks performed\n- Delimiter balance\n- Risky dynamic execution\n- Loose equality and declaration style\n- Hard-coded credential patterns\n- Maintenance markers and long lines\n\nThis rule-based review does not replace the compiler, tests, or a language-specific linter.`;
}

function conversionWorksheet(input: string, sourceLanguage: string, targetLanguage: string) {
  return `Conversion review: ${sourceLanguage} to ${targetLanguage}\n\nA reliable automatic conversion is not available for this language pair. Use the source below as a migration worksheet and verify types, standard-library calls, error handling, and runtime behavior in ${targetLanguage}.\n\nSource\n${input}\n\nMigration checklist\n- Map data types and null behavior.\n- Replace language-specific library calls.\n- Recreate exception and asynchronous control flow.\n- Add tests that compare both implementations.`;
}

export async function runLocalTool({ tool, input, sourceLanguage, targetLanguage }: LocalToolRequest) {
  await new Promise((resolve) => setTimeout(resolve, 180));
  const trimmed = input.trim();

  switch (tool.slug) {
    case "code-converter":
      return conversionWorksheet(trimmed, sourceLanguage, targetLanguage);
    case "code-generator":
      return generateStarterCode(trimmed, targetLanguage);
    case "code-explainer":
      return explainCode(trimmed, sourceLanguage);
    case "comment-remover":
      return stripCommonComments(trimmed) || "No comments or code were found in the input.";
    case "code-checker":
      return checkCode(trimmed, sourceLanguage);
    case "code-to-pdf":
      return `Code document\nLanguage: ${sourceLanguage}\n\n${trimmed}`;
    default:
      return trimmed;
  }
}
