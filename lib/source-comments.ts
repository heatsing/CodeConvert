/** Remove parsed comments without changing literals, token separation, or line numbers. */
export async function removeJavaScriptComments(input: string, language: string): Promise<string> {
  if (!["javascript", "typescript"].includes(language.toLowerCase())) {
    throw new Error("Safe comment removal currently supports JavaScript and TypeScript. Your input has been kept unchanged.");
  }
  // Load the parser only when this tool is used, instead of adding it to every page.
  const { parse } = await import("@babel/parser");
  const parsed = parse(input, {
    sourceType: "unambiguous",
    plugins: language.toLowerCase() === "typescript" ? ["typescript", "jsx"] : ["jsx"],
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    attachComment: false
  });
  let result = "";
  let cursor = 0;
  for (const comment of parsed.comments ?? []) {
    if (comment.start == null || comment.end == null) continue;
    result += input.slice(cursor, comment.start);
    result += input.slice(comment.start, comment.end).replace(/[^\r\n]/g, " ");
    cursor = comment.end;
  }
  return result + input.slice(cursor);
}
