export type CurrentProjectMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CurrentProject = {
  slug: string;
  name: string;
  status: string;
  summary: string;
  highlights: string[];
  technologies: string[];
  accent: string;
  media?: CurrentProjectMedia[];
  href?: string;
  ctaLabel?: string;
};

/** Active work that is intentionally separate from completed portfolio projects. */
export const currentProjects: CurrentProject[] = [
  {
    slug: "setlookup",
    name: "SetLookup",
    status: "In development",
    summary:
      "A mobile-first collector app that helps users identify Hot Wheels cars, check whether they already own them, and manage their collection using camera, barcode, and catalog search workflows.",
    highlights: [
      "Camera-first lookup",
      "OCR and barcode matching",
      "Offline catalog search",
      "Collection tracking",
    ],
    technologies: ["React Native / Expo", "FastAPI", "Supabase", "PostgreSQL"],
    // Kept local to the project data so its brand can evolve independently.
    accent: "#a3e635",
    media: [
      {
        src: "/projects/setlookup/featured/collection.webp",
        alt: "SetLookup collection screen showing Hot Wheels cars organized in a personal collection",
        width: 748,
        height: 1558,
      },
      {
        src: "/projects/setlookup/featured/scan.webp",
        alt: "SetLookup scan screen framing a wall of Hot Wheels cars for camera-based lookup",
        width: 742,
        height: 1536,
      },
      {
        src: "/projects/setlookup/featured/profile.webp",
        alt: "SetLookup profile screen showing a collector's Hot Wheels collection grid",
        width: 754,
        height: 1542,
      },
    ],
  },
];
