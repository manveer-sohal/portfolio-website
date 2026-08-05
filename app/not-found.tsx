import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="section-space">
      <div className="container-page max-w-xl text-center">
        <p className="font-mono text-sm font-medium uppercase tracking-[0.14em] text-muted">
          404
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-strong">
          That route doesn’t exist. Head back to the homepage or browse projects.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/">Home</Button>
          <Button href="/projects" variant="secondary">
            Projects
          </Button>
        </div>
        <p className="mt-6 text-base text-muted">
          Looking for an old static page? See{" "}
          <Link href="/projects" className="text-accent hover:text-accent-hover">
            /projects
          </Link>{" "}
          for the migrated case studies.
        </p>
      </div>
    </div>
  );
}
