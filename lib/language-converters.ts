import type { DirectoryTool } from "@/lib/home-tools";
import { LANGUAGES } from "@/lib/languages";

function languageSlug(language: string) {
  return language
    .toLowerCase()
    .replace(/c\+\+/g, "cpp")
    .replace(/c#/g, "csharp")
    .replace(/vb\.net/g, "vbnet")
    .replace(/objective-c/g, "objective-c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function languageConverterSlug(fromLanguage: string, toLanguage: string) {
  return `${languageSlug(fromLanguage)}-to-${languageSlug(toLanguage)}-converter`;
}

export function makeLanguageConverterTool(fromLanguage: string, toLanguage: string): DirectoryTool {
  return {
    name: `${fromLanguage} to ${toLanguage} Converter`,
    description: `Convert ${fromLanguage} code to ${toLanguage} code`,
    headerDescription: `${fromLanguage} to ${toLanguage} Converter helps you turn source code from ${fromLanguage} into ${toLanguage} with a clean two-panel editor, language-aware sample output, copy, download, and file upload support.`,
    category: "Code",
    href: `/${languageConverterSlug(fromLanguage, toLanguage)}`,
    iconName: "code",
    accent: "text-blue-700 bg-blue-50"
  };
}

export const languageConverterTools = LANGUAGES.flatMap((fromLanguage) =>
  LANGUAGES.filter((toLanguage) => toLanguage !== fromLanguage).map((toLanguage) =>
    makeLanguageConverterTool(fromLanguage, toLanguage)
  )
);

export const languageConverterBySlug = Object.fromEntries(
  languageConverterTools.map((tool) => [tool.href.slice(1), tool])
) as Record<string, DirectoryTool>;
