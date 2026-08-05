import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "sm";

const variants: Record<ButtonVariant, string> = {
  primary:
    "min-h-11 bg-accent text-[#04110e] hover:bg-accent-hover border border-transparent",
  secondary:
    "min-h-11 bg-transparent text-foreground border border-border-strong hover:border-border-strong hover:bg-surface-hover",
  ghost:
    "min-h-11 bg-transparent text-muted-strong hover:text-foreground hover:bg-surface-hover border border-transparent",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-base",
  sm: "px-3.5 py-2 text-sm",
};

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  external?: boolean;
  "aria-label"?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-colors",
    variants[variant],
    sizes[size],
    className,
  );

  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
