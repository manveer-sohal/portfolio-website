import { isExternalHref } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
};

export function ExternalLink({
  href,
  children,
  className,
  "aria-label": ariaLabel,
}: ExternalLinkProps) {
  const external = isExternalHref(href);

  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 text-base font-medium text-accent transition-colors hover:text-accent-hover",
        className,
      )}
      aria-label={ariaLabel}
      target={external && !href.startsWith("mailto:") ? "_blank" : undefined}
      rel={external && !href.startsWith("mailto:") ? "noopener noreferrer" : undefined}
    >
      {children}
      {external && !href.startsWith("mailto:") ? (
        <span aria-hidden="true" className="text-xs">
          ↗
        </span>
      ) : null}
    </a>
  );
}
