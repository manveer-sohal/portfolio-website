import type { ReactNode } from "react";
import { projectBrandFontVariables } from "@/lib/fonts/project-brand";

/** Applies Almaari / JobLinx display font CSS variables for themed surfaces. */
export function ProjectBrandFonts({ children }: { children: ReactNode }) {
  return <div className={projectBrandFontVariables}>{children}</div>;
}
