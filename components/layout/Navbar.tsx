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
        "site-nav sticky top-0 z-40 border-b bg-[color:var(--nav-surface)] backdrop-blur-md transition-[border-color,box-shadow] duration-200",
        scrolled
          ? "border-[color:var(--border-subtle)] shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
          : "border-transparent shadow-none",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="site-nav__brand">
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="site-nav__links hidden md:flex">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("site-nav__link", active && "is-active")}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-nav__actions hidden md:flex">
          <Link href="/overview" className="site-nav__action site-nav__action--accent">
            Simple View
          </Link>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="site-nav__action"
            aria-label={`${siteConfig.name} on GitHub`}
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="site-nav__action"
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
