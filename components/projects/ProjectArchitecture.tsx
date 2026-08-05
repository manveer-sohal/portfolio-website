type ProjectArchitectureProps = {
  items: string[];
};

export function ProjectArchitecture({ items }: ProjectArchitectureProps) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="architecture-heading" className="mt-12">
      <h2 id="architecture-heading" className="text-xl font-semibold tracking-tight">
        Architecture
      </h2>
      <p className="mt-2 text-sm text-muted-strong">
        High-level system pieces involved in the product.
      </p>
      <ol className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={item}
            className="rounded-[12px] border border-border bg-surface p-4"
          >
            <p className="font-mono text-xs font-medium text-muted">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-strong">{item}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
