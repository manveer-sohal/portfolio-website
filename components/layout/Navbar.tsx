"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import { MobileNavigation } from "./MobileNavigation";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        // Always opaque — homepage contact reveal sits fixed underneath and
        // would otherwise show through a transparent sticky nav.
        "sticky top-0 z-40 border-b bg-[color:var(--nav-surface)] backdrop-blur-md transition-colors",
        scrolled
          ? "border-[color:var(--border-subtle)]"
          : "border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground md:text-lg"
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-[8px] px-3 py-2 text-base font-medium transition-colors",
                  active
                    ? "bg-surface-elevated text-foreground ring-1 ring-border"
                    : "text-muted-strong hover:bg-surface hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-muted-strong transition-colors hover:text-foreground"
            aria-label={`${siteConfig.name} on GitHub`}
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-muted-strong transition-colors hover:text-foreground"
            aria-label={`${siteConfig.name} on LinkedIn`}
          >
            LinkedIn
          </a>
        </div>

        <MobileNavigation />
      </div>
    </header>
  );
}
