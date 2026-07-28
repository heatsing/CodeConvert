import { directoryTools, directoryToolSlug, type DirectoryTool } from "@/lib/home-tools";
import { languageConverterTools } from "@/lib/language-converters";
import { onlineTools, type OnlineTool } from "@/lib/online-tools";
import { toolBySlug, type ToolConfig, type ToolSlug } from "@/lib/tools";

export type ToolRouteKind = "core" | "directory" | "language" | "online";

export type ToolRoute = {
  slug: string;
  href: string;
  kind: ToolRouteKind;
  name: string;
  category: string;
  coreTool?: ToolConfig;
  directoryTool?: DirectoryTool;
  onlineTool?: OnlineTool;
};

function normalizeSlug(value: string) {
  return value.replace(/^\/+|\/+$/g, "").toLowerCase();
}

function addRoute(routes: Map<string, ToolRoute>, route: ToolRoute) {
  if (!routes.has(route.slug)) routes.set(route.slug, route);
}

const routes = new Map<string, ToolRoute>();

for (const tool of Object.values(toolBySlug)) {
  const slug = normalizeSlug(tool.slug);
  addRoute(routes, {
    slug,
    href: `/${slug}`,
    kind: "core",
    name: tool.name,
    category: "Code",
    coreTool: tool
  });
}

for (const tool of directoryTools) {
  const slug = normalizeSlug(tool.href || directoryToolSlug(tool.name));
  addRoute(routes, {
    slug,
    href: `/${slug}`,
    kind: "directory",
    name: tool.name,
    category: tool.category,
    directoryTool: tool
  });
}

for (const tool of languageConverterTools) {
  const slug = normalizeSlug(tool.href);
  addRoute(routes, {
    slug,
    href: `/${slug}`,
    kind: "language",
    name: tool.name,
    category: tool.category,
    directoryTool: tool
  });
}

for (const tool of onlineTools) {
  const slug = normalizeSlug(tool.slug);
  addRoute(routes, {
    slug,
    href: `/${slug}`,
    kind: "online",
    name: tool.name,
    category: "Developer",
    onlineTool: tool
  });
}

export const toolRoutes = Array.from(routes.values());
export const toolRouteBySlug = Object.fromEntries(toolRoutes.map((route) => [route.slug, route])) as Record<string, ToolRoute>;

export function getToolRoute(slug: string) {
  return toolRouteBySlug[normalizeSlug(slug)];
}

export function isCoreToolSlug(slug: string): slug is ToolSlug {
  return Boolean(toolBySlug[normalizeSlug(slug) as ToolSlug]);
}
