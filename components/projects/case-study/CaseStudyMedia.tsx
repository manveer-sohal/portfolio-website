import Image from "next/image";

type CaseStudyMediaProps = {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export function CaseStudyMedia({
  src,
  alt,
  caption,
  priority = false,
  className,
  sizes = "(max-width: 1024px) 100vw, 64rem",
}: CaseStudyMediaProps) {
  return (
    <figure
      className={["case-study__media", className].filter(Boolean).join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1000}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="w-full"
        sizes={sizes}
      />
      {caption ? (
        <figcaption className="case-study__media-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
