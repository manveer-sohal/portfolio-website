"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

/** Overview routes use their own white header — hide the main nav. */
export function ConditionalNavbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/overview")) return null;
  return <Navbar />;
}
