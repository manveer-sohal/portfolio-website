import Image from "next/image";
import type { ProjectGalleryItem } from "@/data/types";

type ProjectGalleryProps = {
  items: ProjectGalleryItem[];
};

export function ProjectGallery({ items }: ProjectGalleryProps) {
  if (!items.length) return null;

  return (
    <section aria-labelledby="gallery-heading" className="mt-12">
      <h2 id="gallery-heading" className="text-xl font-semibold tracking-tight">
        Additional screenshots
      </h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <figure
            key={item.src}
            className="overflow-hidden rounded-[12px] border border-border bg-surface-elevated p-1.5"
          >
            <div className="overflow-hidden rounded-[10px]">
              <Image
                src={item.src}
                alt={item.alt}
                width={1200}
                height={800}
                className="w-full object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {item.caption ? (
              <figcaption className="px-3 py-3 text-sm text-muted">
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
