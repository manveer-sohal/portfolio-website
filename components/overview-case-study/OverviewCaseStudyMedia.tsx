import Image from "next/image";

type OverviewCaseStudyMediaProps = {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  sizes?: string;
};

export function OverviewCaseStudyMedia({
  src,
  alt,
  caption,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 42rem",
}: OverviewCaseStudyMediaProps) {
  return (
    <figure className="overview-case__media">
      <Image
        src={src}
        alt={alt}
        width={1400}
        height={900}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={sizes}
      />
      {caption ? (
        <figcaption className="overview-case__caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
