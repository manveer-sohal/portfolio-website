import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";

/** Non-homepage visual routes get the standard footer. */
export default function VisualSiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
