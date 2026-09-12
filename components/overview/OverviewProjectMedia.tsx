import Image from "next/image";
import type { Project } from "@/data/types";
import { getProjectTheme, resolveProjectCover } from "@/lib/project-themes";
import { cn } from "@/lib/utils";
import { OverviewProjectVideo } from "./OverviewProjectVideo";

type OverviewProjectMediaProps = {
  project: Project;
  compact?: boolean;
};

export function OverviewProjectMedia({
  project,
  compact = false,
}: OverviewProjectMediaProps) {
  const theme = getProjectTheme(project.slug);
  const video = theme?.media.featuredVideo;
  const image = resolveProjectCover(project);

  if (!video && !image) return null;

  return (
    <div
      className={cn(
        "overview-project-media",
        compact && "overview-project-media--compact",
      )}
    >
      {video ? (
        <OverviewProjectVideo
          webm={video.webm}
          mp4={video.mp4}
          poster={video.poster}
        />
      ) : (
        <Image
          className="overview-project-media__asset"
          src={image}
          alt={`${project.name} project preview`}
          width={compact ? 320 : 960}
          height={compact ? 200 : 540}
          sizes={
            compact
              ? "(max-width: 767px) 18rem, 8rem"
              : "(max-width: 767px) calc(100vw - 2.5rem), 42rem"
          }
        />
      )}
    </div>
  );
}
