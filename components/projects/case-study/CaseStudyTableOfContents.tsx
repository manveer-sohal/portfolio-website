"use client";

import { useEffect, useState, type ReactNode } from "react";

export type TocItem = {
  id: string;
  label: string;
};

type CaseStudyTableOfContentsProps = {
  items: TocItem[];
  children: ReactNode;
};

function TocLinks({
  items,
  activeId,
}: {
  items: TocItem[];
  activeId: string;
}) {
  return (
    <ul className="case-study__toc-list">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={
              activeId === item.id
                ? "case-study__toc-link is-active"
                : "case-study__toc-link"
            }
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function CaseStudyTableOfContents({
  items,
  children,
}: CaseStudyTableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
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
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [items, showToc]);

  return (
    <>
      {showToc ? (
        <div className="case-study__toc-mobile">
          <details className="case-study__toc-details">
            <summary>On this page</summary>
            <TocLinks items={items} activeId={activeId} />
          </details>
        </div>
      ) : null}

      <div
        className={
          showToc
            ? "case-study__layout case-study__layout--with-toc"
            : "case-study__layout"
        }
      >
        {showToc ? (
          <nav className="case-study__toc-desktop" aria-label="On this page">
            <p className="case-study__toc-label">On this page</p>
            <TocLinks items={items} activeId={activeId} />
          </nav>
        ) : null}
        {children}
      </div>
    </>
  );
}
