import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { awards } from "@/data/awards";

function AwardItems({ suffix }: { suffix: string }) {
  return (
    <>
      {awards.map((award) => (
        <li key={`${suffix}-${award}`} className="awards-marquee__item">
          <span className="awards-marquee__text">{award}</span>
          <span className="awards-marquee__sep" aria-hidden="true">
            ◆
          </span>
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
            eyebrow="Recognition"
            title="Awards"
            className="mb-8"
          />
        </Reveal>
      </div>

      {/* Static list for assistive tech; marquee is decorative motion */}
      <ul className="sr-only">
        {awards.map((award) => (
          <li key={award}>{award}</li>
        ))}
      </ul>

      <div className="awards-marquee" aria-hidden="true">
        <div className="awards-marquee__fade awards-marquee__fade--left" />
        <div className="awards-marquee__fade awards-marquee__fade--right" />
        <ul className="awards-marquee__track">
          <AwardItems suffix="a" />
          <AwardItems suffix="b" />
          <AwardItems suffix="c" />
          <AwardItems suffix="d" />
        </ul>
      </div>
    </section>
  );
}
