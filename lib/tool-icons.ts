import { Bug, Code2, Eraser, FileText, MessageSquareCode, WandSparkles } from "lucide-react";
import type { ToolConfig } from "@/lib/tools";

export const toolIcons: Record<ToolConfig["iconName"], typeof Code2> = {
  code: Code2,
  wand: WandSparkles,
  message: MessageSquareCode,
  eraser: Eraser,
  bug: Bug,
  fileText: FileText
};
