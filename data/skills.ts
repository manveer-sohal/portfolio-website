import type { SkillCategory } from "./types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    skills: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "TanStack Query",
    ],
  },
  {
    name: "Backend",
    skills: [
      "Python",
      "FastAPI",
      "Node.js",
      "Express",
      "REST APIs",
      "SQLAlchemy",
    ],
  },
  {
    name: "Data & infrastructure",
    skills: [
      "PostgreSQL",
      "Supabase",
      "MongoDB",
      "Redis",
      "Docker",
      "AWS",
      "S3",
      "CloudFront",
      "CI/CD",
    ],
  },
  {
    name: "AI & machine learning",
    skills: [
      "OpenAI APIs",
      "Retrieval-Augmented Generation",
      "Embeddings",
      "pgvector",
      "Computer vision",
      "OpenCV",
      "YOLO",
      "Prompt & structured-output design",
    ],
  },
];
