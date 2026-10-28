import type { OnlineTool } from "./online-tools.ts";
import { parseRegexLiteral, runSafeRegex } from "./safe-regex.ts";
import { assertToolOutput, formatJson } from "./tool-processors.ts";

export function canRunOnlineTool(tool: Pick<OnlineTool, "mode">): boolean {
  return ["json", "regex", "ascii"].includes(tool.mode);
}

export async function runOnlineTool(tool: OnlineTool, input: string, sampleText: string): Promise<string> {
  if (!canRunOnlineTool(tool)) throw new Error("Execution is not available for this workspace. No code, request, or database command has been executed.");
  if (input.length > 100_000) throw new Error("Input must be 100,000 characters or fewer.");
  const source = input.trim();
  if (!source) throw new Error("Enter input before running this tool.");

  if (tool.mode === "json") return assertToolOutput(await formatJson(source));

  if (tool.mode === "regex") {
    const { pattern, flags } = parseRegexLiteral(source);
    const { result, regex } = await runSafeRegex({ pattern, flags, text: sampleText });
    const matches = result as string[];
    return matches.length
      ? `Pattern: ${regex}\nMatches (${matches.length})\n${matches.map((match, index) => `${index + 1}. ${match}`).join("\n")}`
      : `Pattern: ${regex}\nNo matches found in the test text.`;
  }

  const parts = source.split("->").map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts.map((part) => `[ ${part} ]`).join(" ---> ") : `[ ${source} ]`;
}
