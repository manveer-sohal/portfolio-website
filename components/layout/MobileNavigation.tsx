"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  return (
    <div className="md:hidden" ref={rootRef}>
      <button
        type="button"
        className="rounded-[8px] border border-border px-3 py-2 text-sm text-foreground"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>

      {open ? (
        <div
          id={panelId}
          className="fixed inset-x-0 top-16 z-50 border-b border-border-subtle bg-background px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav aria-label="Mobile" className="mx-auto flex max-w-md flex-col gap-2">
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
                    "rounded-[10px] border px-4 py-3 text-base",
                    active
                      ? "border-border bg-surface-elevated text-foreground"
                      : "border-border-subtle bg-surface text-muted-strong hover:border-border hover:text-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/overview"
              className="rounded-[10px] border border-border-subtle px-4 py-3 text-base font-medium text-muted-strong hover:border-border hover:text-foreground"
            >
              Simple View
            </Link>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[10px] border border-border-subtle px-4 py-3 text-base font-medium text-muted-strong hover:border-border hover:text-foreground"
              aria-label={`${siteConfig.name} on GitHub`}
            >
              GitHub
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[10px] border border-border-subtle px-4 py-3 text-base font-medium text-muted-strong hover:border-border hover:text-foreground"
              aria-label={`${siteConfig.name} on LinkedIn`}
            >
              LinkedIn
            </a>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
