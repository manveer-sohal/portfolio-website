import type { Project } from "@/data/types";

export type FeaturedThemeId = "almaari" | "joblinx" | "supportpilot";

export type ProjectVisualTheme = {
  id: FeaturedThemeId;
  mode: "warm-editorial" | "cool-productivity" | "technical-slate";
  colors: {
    primary: string;
    primaryHover: string;
    primaryMuted: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceStrong: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    /** Project name / wordmark colour on featured surfaces */
    name: string;
  };
  typography: {
    headingClassName: string;
    bodyClassName: string;
    wordmarkClassName?: string;
  };
  shape: {
    cardRadius: string;
    buttonRadius: string;
    imageRadius: string;
    tagRadius: string;
  };
  effects: {
    shadow: string;
  };
  media: {
    treatment: "cream-editorial" | "cool-app-window" | "slate-technical";
    logoSrc?: string;
    logoAlt?: string;
    wordmark?: string;
    preferredCover?: string;
    /** Looping demo video for the featured card (replaces static cover when set). */
    featuredVideo?: {
      webm: string;
      mp4: string;
      poster: string;
    };
    /** Desktop media column: content stays first in the DOM for accessibility. */
    mediaPosition: "left" | "right";
  };
};

export const projectThemes: Record<FeaturedThemeId, ProjectVisualTheme> = {
  almaari: {
    id: "almaari",
    mode: "warm-editorial",
    colors: {
      primary: "#4f5d9a",
      primaryHover: "#3d4a7c",
      primaryMuted: "#e8ebf5",
      secondary: "#3d4a7c",
      background: "#f4f1ec",
      surface: "#fbf9f5",
      surfaceStrong: "#ffffff",
      border: "#d8d4cc",
      textPrimary: "#273157",
      textSecondary: "#5c6478",
      name: "#273157",
    },
    typography: {
      headingClassName: "font-[family-name:var(--font-fraunces)]",
      bodyClassName: "font-[family-name:var(--font-source-sans)]",
    },
    shape: {
      cardRadius: "24px",
      buttonRadius: "16px",
      imageRadius: "16px",
      tagRadius: "12px",
    },
    effects: {
      shadow: "0 2px 12px rgba(39, 49, 87, 0.06)",
    },
    media: {
      treatment: "cream-editorial",
      logoSrc: "/projects/almaari/brand/logo.png",
      logoAlt: "Almaari wardrobe logo",
      preferredCover: "/projects/almaari/dashboard.png",
      featuredVideo: {
        webm: "/projects/almaari/featured/cover.webm",
        mp4: "/projects/almaari/featured/cover.mp4",
        poster: "/projects/almaari/featured/cover-poster.webp",
      },
      mediaPosition: "right",
    },
  },
  joblinx: {
    id: "joblinx",
    mode: "cool-productivity",
    colors: {
      primary: "#2563eb",
      primaryHover: "#1d4ed8",
      primaryMuted: "#eff6ff",
      secondary: "#60a5fa",
      background: "#e8eef8",
      surface: "#f7f9fc",
      surfaceStrong: "#fafbfd",
      border: "#d5deea",
      textPrimary: "#111827",
      textSecondary: "#64748b",
      name: "#2563eb",
    },
    typography: {
      headingClassName: "font-[family-name:var(--font-plus-jakarta)]",
      bodyClassName: "font-[family-name:var(--font-plus-jakarta)]",
    },
    shape: {
      cardRadius: "12px",
      buttonRadius: "8px",
      imageRadius: "12px",
      tagRadius: "8px",
    },
    effects: {
      shadow: "0 2px 10px rgba(37, 99, 235, 0.08)",
    },
    media: {
      treatment: "cool-app-window",
      logoSrc: "/projects/joblinx/brand/logo-256.png",
      logoAlt: "JobLinx lynx logo",
      preferredCover: "/projects/joblinx/detail.png",
      mediaPosition: "left",
    },
  },
  supportpilot: {
    id: "supportpilot",
    mode: "technical-slate",
    colors: {
      primary: "#3B82F6",
      primaryHover: "#2563eb",
      primaryMuted: "rgba(59, 130, 246, 0.12)",
      secondary: "#60A5FA",
      background: "#0F172A",
      surface: "#1E293B",
      surfaceStrong: "#1E293B",
      border: "#334155",
      textPrimary: "#F8FAFC",
      textSecondary: "#cbd5e1",
      name: "#b33d52",
    },
    typography: {
      headingClassName: "font-sans",
      bodyClassName: "font-sans",
      wordmarkClassName:
        "font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--project-name)]",
    },
    shape: {
      cardRadius: "12px",
      buttonRadius: "8px",
      imageRadius: "12px",
      tagRadius: "8px",
    },
    effects: {
      shadow: "0 1px 0 rgba(148, 163, 184, 0.08)",
    },
    media: {
      treatment: "slate-technical",
      wordmark: "SUPPORTPILOT",
      preferredCover: "/projects/supportpilot/overview.png",
      mediaPosition: "right",
    },
  },
};

export function getProjectTheme(slug: string): ProjectVisualTheme | null {
  if (slug in projectThemes) {
    return projectThemes[slug as FeaturedThemeId];
  }
  return null;
}

export function isFeaturedThemeId(slug: string): slug is FeaturedThemeId {
  return slug in projectThemes;
}

export function themeCssVars(
  theme: ProjectVisualTheme,
): Record<`--${string}`, string> {
  return {
    "--project-primary": theme.colors.primary,
    "--project-primary-hover": theme.colors.primaryHover,
    "--project-primary-muted": theme.colors.primaryMuted,
    "--project-secondary": theme.colors.secondary,
    "--project-bg": theme.colors.background,
    "--project-surface": theme.colors.surface,
    "--project-surface-strong": theme.colors.surfaceStrong,
    "--project-border": theme.colors.border,
    "--project-text": theme.colors.textPrimary,
    "--project-text-secondary": theme.colors.textSecondary,
    "--project-name": theme.colors.name,
    "--project-card-radius": theme.shape.cardRadius,
    "--project-button-radius": theme.shape.buttonRadius,
    "--project-image-radius": theme.shape.imageRadius,
    "--project-tag-radius": theme.shape.tagRadius,
    "--project-shadow": theme.effects.shadow,
  };
}

/** Prefer brand-guide cover when present; fall back to project data. */
export function resolveProjectCover(project: Project): string {
  const theme = getProjectTheme(project.slug);
  return theme?.media.preferredCover ?? project.coverImage ?? "";
}
