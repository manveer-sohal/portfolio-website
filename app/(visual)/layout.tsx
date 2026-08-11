import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ProjectBrandFonts } from "@/components/theme/ProjectBrandFonts";

/**
 * Visual portfolio chrome (main dark site).
 * Product brand fonts scoped here so `/overview` does not load them.
 * Homepage omits the site footer (ContactRevealShell owns it).
 */
export default function VisualLayout({ children }: { children: ReactNode }) {
  return (
    <ProjectBrandFonts>
      <Navbar />
      {children}
    </ProjectBrandFonts>
  );
}
