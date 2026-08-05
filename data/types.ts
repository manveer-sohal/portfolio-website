export interface ProjectMetric {
  label: string;
  value: string;
  description?: string;
}

export type ProjectLinkType =
  | "live"
  | "github"
  | "case-study"
  | "devpost"
  | "website";

export interface ProjectLink {
  label: string;
  href: string;
  type: ProjectLinkType;
}

export interface ProjectGalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface TechnicalDecision {
  title: string;
  description: string;
}

export interface Tradeoff {
  title: string;
  description: string;
}

export interface ExpandablePreview {
  challenge: string;
  decision: string;
  outcomes: string[];
}

export type ProjectStatus =
  | "Live product"
  | "In active development"
  | "Private beta"
  | "Product in development"
  | "Archived demo"
  | "Hackathon project"
  | "Demo unavailable";

export interface Project {
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  problemSummary: string;
  status?: ProjectStatus;
  role: string;
  featured: boolean;
  technologies: string[];
  metrics: ProjectMetric[];
  links: ProjectLink[];
  coverImage?: string;
  gallery?: ProjectGalleryItem[];
  features?: string[];
  problem?: string[];
  solution?: string[];
  contributions?: string[];
  technicalDecisions?: TechnicalDecision[];
  tradeoffs?: Tradeoff[];
  architecture?: string[];
  expandable?: ExpandablePreview;
  relatedSlugs?: string[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  /** Year label on the left timeline rail (e.g. "2024–Present") */
  year: string;
  /** Short period under the year (e.g. "May – Dec") */
  period?: string;
  location?: string;
  summary: string;
  highlights: string[];
  technologies: string[];
  links?: ProjectLink[];
  achievement?: string;
  projectSlug?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}
