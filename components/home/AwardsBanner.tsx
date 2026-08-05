import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { awards, type Award } from "@/data/awards";
import { cn } from "@/lib/utils";

const AwardsWaveLine = dynamic(
  () =>
    import("@/components/home/AwardsWaveLine").then((mod) => mod.AwardsWaveLine),
  {
    loading: () => (
      <div className="awards-wave" style={{ minHeight: 48 }} aria-hidden="true" />
    ),
  },
);

function AwardCard({ award }: { award: Award }) {
  const inner = (
    <>
      <div
        className={cn(
          "award-card__media",
          award.imageFit === "contain" && "award-card__media--contain",
        )}
      >
        {award.image ? (
          <Image
            src={award.image}
            alt=""
            fill
            sizes="120px"
            className={
              award.imageFit === "contain"
                ? "object-contain p-2"
                : "object-cover object-center"
            }
            aria-hidden="true"
          />
        ) : (
          <div className="award-card__fallback" aria-hidden="true">
            <span>◆</span>
          </div>
        )}
      </div>
      <div className="award-card__body">
        <h3 className="award-card__title">{award.title}</h3>
        <p className="award-card__copy">
          <span className="award-card__year">{award.year}</span>
          {" — "}
          {award.description}
        </p>
        <p className="award-card__event">{award.event}</p>
      </div>
    </>
  );

  if (award.href) {
    const external = /^https?:\/\//i.test(award.href);
    if (external) {
      return (
        <a
          href={award.href}
          className="award-card"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${award.title}: ${award.event}`}
        >
          {inner}
        </a>
      );
    }

    return (
      <Link
        href={award.href}
        className="award-card"
        aria-label={`${award.title}: ${award.event}`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <article className="award-card" aria-label={`${award.title}: ${award.event}`}>
      {inner}
    </article>
  );
}

function AwardTrack({ suffix }: { suffix: string }) {
  return (
    <>
      {awards.map((award) => (
        <li key={`${suffix}-${award.id}`} className="awards-marquee__item">
          <AwardCard award={award} />
        </li>
      ))}
    </>
  );
}

export function AwardsBanner() {
  return (
    <section
      id="awards"
      className="awards-section section-space"
      aria-labelledby="awards-heading"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="awards-heading"
            title="Recognition & Milestones"
            description="Wins and presentations from hackathons and communities over the past few years."
            className="mb-7"
          />
        </Reveal>
      </div>

      <ul className="sr-only">
        {awards.map((award) => (
          <li key={award.id}>
            {award.title} — {award.event}: {award.description}
          </li>
        ))}
      </ul>

      <div className="awards-marquee" aria-hidden="true">
        <div className="awards-marquee__fade awards-marquee__fade--left" />
        <div className="awards-marquee__fade awards-marquee__fade--right" />
        <ul className="awards-marquee__track">
          <AwardTrack suffix="a" />
          <AwardTrack suffix="b" />
          <AwardTrack suffix="c" />
          <AwardTrack suffix="d" />
        </ul>
      </div>

      <AwardsWaveLine />
    </section>
  );
}
