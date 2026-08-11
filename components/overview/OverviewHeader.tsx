"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/overview" },
  { label: "Projects", href: "/overview#projects" },
  { label: "Experience", href: "/overview#experience" },
] as const;

export function OverviewHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="overview-header">
      <div className="overview-header__inner">
        <Link href="/overview" className="overview-header__brand">
          {siteConfig.name}
        </Link>

        <nav className="overview-header__nav" aria-label="Overview">
          {NAV.map((item) => {
            const active =
              item.href === "/overview"
                ? pathname === "/overview"
                : pathname.startsWith("/overview") &&
                  item.href.includes("#") === false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "overview-header__link",
                  item.href === "/overview" &&
                    pathname === "/overview" &&
                    "is-active",
                )}
                aria-current={active && item.href === "/overview" ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="overview-header__actions">
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="overview-header__social"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="overview-header__social"
          >
            GitHub
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="overview-header__social"
          >
            Email
          </a>
          <Link href="/" className="overview-header__return">
            Visual Portfolio
          </Link>
          <button
            type="button"
            className="overview-header__menu-btn"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="overview-header__menu" id={panelId}>
          <nav aria-label="Overview mobile">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={`mailto:${siteConfig.email}`}>Email</a>
            <Link href="/" onClick={() => setOpen(false)}>
              Visual Portfolio
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
