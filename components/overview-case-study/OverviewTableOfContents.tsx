"use client";

import { useEffect, useState, type ReactNode } from "react";

export type OverviewTocItem = {
  id: string;
  label: string;
};

type OverviewTableOfContentsProps = {
  items: OverviewTocItem[];
  children: ReactNode;
};

function TocLinks({
  items,
  activeId,
  onNavigate,
}: {
  items: OverviewTocItem[];
  activeId: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="overview-case__toc-list">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={
              activeId === item.id
                ? "overview-case__toc-link is-active"
                : "overview-case__toc-link"
            }
            onClick={onNavigate}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function OverviewTableOfContents({
  items,
  children,
}: OverviewTableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const showToc = items.length >= 5;

  useEffect(() => {
    if (!showToc) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [items, showToc]);

  return (
    <>
      {showToc ? (
        <div className="overview-case__toc-mobile">
          <details
            className="overview-case__toc-details"
            open={open}
            onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
          >
            <summary
              aria-expanded={open}
              aria-controls="overview-toc-panel"
            >
              On this page
            </summary>
            <div id="overview-toc-panel">
              <TocLinks
                items={items}
                activeId={activeId}
                onNavigate={() => setOpen(false)}
              />
            </div>
          </details>
        </div>
      ) : null}

      <div
        className={
          showToc
            ? "overview-case__layout overview-case__layout--with-toc"
            : "overview-case__layout"
        }
      >
        {showToc ? (
          <nav
            className="overview-case__toc-desktop"
            aria-label="On this page"
          >
            <p className="overview-case__toc-label">On this page</p>
            <TocLinks items={items} activeId={activeId} />
          </nav>
        ) : null}
        {children}
      </div>
    </>
  );
}
