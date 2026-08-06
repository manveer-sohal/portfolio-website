import type { Project } from "@/data/types";
import { CaseStudyLayout } from "./case-study/CaseStudyLayout";

type ProjectDetailsProps = {
  project: Project;
};

/** Thin composer — case-study article shell lives in CaseStudyLayout. */
export function ProjectDetails({ project }: ProjectDetailsProps) {
  return <CaseStudyLayout project={project} />;
}
