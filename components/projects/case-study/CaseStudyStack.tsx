type StackGroup = {
  label: string;
  items: string[];
};

type CaseStudyStackProps = {
  technologies: string[];
};

const FRONTEND = new Set([
  "react",
  "next.js",
  "typescript",
  "javascript",
  "html",
  "css",
  "tailwind",
  "tailwind css",
  "vite",
  "vue",
  "svelte",
]);

const BACKEND = new Set([
  "node.js",
  "express",
  "python",
  "fastapi",
  "flask",
  "django",
  "go",
  "java",
  "spring",
  "auth0",
  "jwt",
  "rest",
  "graphql",
  "docker",
  "aws",
  "aws s3",
  "s3",
  "vercel",
  "railway",
]);

const DATA = new Set([
  "mongodb",
  "postgresql",
  "postgres",
  "mysql",
  "redis",
  "upstash",
  "sql",
  "prisma",
  "supabase",
  "firebase",
]);

const AI = new Set([
  "openai",
  "langchain",
  "llms",
  "llm",
  "opencv",
  "computer vision",
  "ai",
  "machine learning",
  "ml",
  "whisper",
  "embeddings",
]);

const ORDER = ["Frontend", "Backend", "Data", "AI", "Other"] as const;

function categorize(tech: string): (typeof ORDER)[number] {
  const key = tech.trim().toLowerCase();
  if (FRONTEND.has(key)) return "Frontend";
  if (BACKEND.has(key)) return "Backend";
  if (DATA.has(key)) return "Data";
  if (AI.has(key)) return "AI";
  return "Other";
}

export function groupTechnologies(technologies: string[]): StackGroup[] {
  const buckets: Record<(typeof ORDER)[number], string[]> = {
    Frontend: [],
    Backend: [],
    Data: [],
    AI: [],
    Other: [],
  };

  for (const tech of technologies) {
    buckets[categorize(tech)].push(tech);
  }

  return ORDER.filter((label) => buckets[label].length > 0).map((label) => ({
    label,
    items: buckets[label],
  }));
}

export function CaseStudyStack({ technologies }: CaseStudyStackProps) {
  const groups = groupTechnologies(technologies);
  if (!groups.length) return null;

  return (
    <dl className="case-study__stack">
      {groups.map((group) => (
        <div key={group.label}>
          <dt>{group.label}</dt>
          <dd>{group.items.join(" · ")}</dd>
        </div>
      ))}
    </dl>
  );
}
