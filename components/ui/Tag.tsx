import { cn } from "@/lib/utils";

type TagProps = {
  children: React.ReactNode;
  className?: string;
};

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[6px] border border-border bg-surface-elevated px-2.5 py-1 text-sm font-medium text-muted-strong",
        className,
      )}
    >
      {children}
    </span>
  );
}
