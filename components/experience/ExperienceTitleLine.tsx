type ExperienceTitleLineProps = {
  organization: string;
  technologies: string[];
  className?: string;
};

/**
 * Resume-style project title + skills: Almaari | Next.js, TypeScript, …
 */
export function ExperienceTitleLine({
  organization,
  technologies,
  className,
}: ExperienceTitleLineProps) {
  return (
    <p className={className}>
      <span className="experience-card__org">{organization}</span>
      {technologies.length > 0 ? (
        <>
          <span className="experience-card__pipe" aria-hidden="true">
            {" "}
            |{" "}
          </span>
          <span className="experience-card__skills">
            {technologies.join(", ")}
          </span>
        </>
      ) : null}
    </p>
  );
}
