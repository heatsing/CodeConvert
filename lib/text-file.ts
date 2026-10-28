export const maxTextFileSize = 5 * 1024 * 1024;

export async function readTextFile(file: Pick<File, "size" | "arrayBuffer">): Promise<string> {
  if (file.size > maxTextFileSize) throw new Error("Files must be 5 MB or smaller.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.byteLength > maxTextFileSize) throw new Error("Files must be 5 MB or smaller.");
  const encoding = bytes[0] === 0xff && bytes[1] === 0xfe
    ? "utf-16le"
    : bytes[0] === 0xfe && bytes[1] === 0xff ? "utf-16be" : "utf-8";
  let text: string;
  try {
    text = new TextDecoder(encoding, { fatal: true }).decode(bytes);
  } catch {
    throw new Error("This file is not valid UTF-8 or BOM-marked UTF-16 text. Save it as UTF-8 and try again.");
  }
  if (text.includes("\0")) throw new Error("This file contains binary data. Save a text version as UTF-8 and try again.");
  return text;
}
