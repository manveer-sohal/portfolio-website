"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";

/**
 * Homepage owns Contact + Footer inside the reveal layer.
 * Other routes keep the standard layout footer.
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Footer />;
}
