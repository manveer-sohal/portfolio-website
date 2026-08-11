import type { Award } from "@/data/awards";

type OverviewRecognitionProps = {
  awards: Award[];
};

export function OverviewRecognition({ awards }: OverviewRecognitionProps) {
  return (
    <div className="overview-recognition">
      {awards.map((award) => {
        const heading = award.description || award.title;
        const isExternal = award.href?.startsWith("http");

        return (
          <div key={award.id} className="overview-recognition__row">
            <p className="overview-recognition__year">{award.year}</p>
            <div>
              <p className="overview-recognition__title">
                {award.href ? (
                  <a
                    href={award.href}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {heading}
                  </a>
                ) : (
                  heading
                )}
              </p>
              <p className="overview-recognition__event">
                {award.event}
                {award.title && award.description
                  ? ` · ${award.title}`
                  : ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
