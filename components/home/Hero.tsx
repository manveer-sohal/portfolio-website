import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { siteConfig } from "@/data/site";

export function Hero() {
  return (
    <section className="border-b border-border-subtle py-14 md:py-20">
      <div className="container-page grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-12">
        <div>
          <p className="mb-3 font-mono text-sm font-medium uppercase tracking-[0.16em] text-muted">
            Full-Stack Developer · AI-Powered Products
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-5xl md:leading-[1.12]">
            I build useful software from idea to production.
          </h1>
          <p className="prose-narrow mt-5 text-lg leading-relaxed text-muted-strong md:text-xl">
            I’m {siteConfig.name}, a full-stack developer focused on AI-assisted
            products, backend systems, and polished web experiences. I created
            Almaari and JobLinx and have worked across generative AI, data
            systems, and computer vision.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button href="/projects">View Projects</Button>
            <Button href="/contact" variant="secondary">
              Contact Me
            </Button>
            <ExternalLink
              href={siteConfig.links.linkedin}
              aria-label={`${siteConfig.name} on LinkedIn`}
              className="ml-1 text-base"
            >
              LinkedIn
            </ExternalLink>
          </div>
          <p className="mt-5 text-base text-muted">
            Based in {siteConfig.location} · {siteConfig.openTo}
          </p>
        </div>

        <div className="mx-auto w-full max-w-[280px] sm:max-w-xs md:mx-0 md:max-w-[320px] md:justify-self-end">
          <div className="overflow-hidden rounded-[12px] border border-border bg-surface-elevated p-1.5 shadow-[0_1px_0_rgba(255,255,255,0.04)]">
            <div className="overflow-hidden rounded-[10px]">
              <Image
                src="/images/profile.png"
                alt={`Portrait of ${siteConfig.name}`}
                width={640}
                height={800}
                priority
                className="aspect-[4/5] h-auto w-full object-cover"
                sizes="(max-width: 768px) 280px, 320px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
