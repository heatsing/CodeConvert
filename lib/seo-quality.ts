import { directoryToolSlug, type DirectoryTool } from "@/lib/home-tools";
import type { OnlineTool } from "@/lib/online-tools";
import type { ToolRoute } from "@/lib/tool-route-inventory";
import type { ToolConfig } from "@/lib/tools";
import { getToolCapability } from "./tool-capabilities.ts";

export type SeoGrade = "A" | "B" | "C";
export type SeoAssessment = { score: number; grade: SeoGrade; indexable: boolean; reasons: string[] };

export function assessToolRoute(route: Pick<ToolRoute, "slug" | "kind">): SeoAssessment {
  const capability = getToolCapability(route.slug);
  return {
    score: capability.indexable ? 90 : capability.discoverable ? 65 : 30,
    grade: capability.indexable ? "A" : "C",
    indexable: capability.indexable,
    reasons: [capability.reason, capability.indexable ? "Reviewed content and executable examples are available." : "This page is excluded from the search index and sitemap."]
  };
}
export function assessCoreTool(tool: ToolConfig) { return assessToolRoute({ slug: tool.slug, kind: "core" }); }
export function shouldIndexCoreTool(tool: ToolConfig) { return getToolCapability(tool.slug).indexable; }
export function getDirectoryToolIndexClass(tool: DirectoryTool): SeoGrade { return shouldIndexDirectoryTool(tool) ? "A" : "C"; }
export function shouldIndexDirectoryTool(tool: DirectoryTool) { return getToolCapability(tool.href || directoryToolSlug(tool.name)).indexable; }
export function getOnlineToolIndexClass(tool: OnlineTool): SeoGrade { return shouldIndexOnlineTool(tool) ? "A" : "C"; }
export function shouldIndexOnlineTool(tool: OnlineTool) { return getToolCapability(tool.slug).indexable; }
