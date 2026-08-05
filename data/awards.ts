export type Award = {
  id: string;
  title: string;
  event: string;
  year: string;
  description: string;
  image?: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
  href?: string;
};

export const awards: Award[] = [
  {
    id: "geesehacks",
    title: "odinAnalytica",
    event: "GeeseHacks Winner",
    year: "2024",
    description:
      "Best Data Hack — crash detection on live traffic feeds with computer vision.",
    image: "/awards/odin-analytica.webp",
    imageAlt: "odinAnalytica GeeseHacks winner card",
    href: "https://devpost.com/software/odinanalytica",
  },
  {
    id: "hackthenorth",
    title: "StudySync",
    event: "Hack the North Winner",
    year: "2024",
    description:
      "Study companion that turns speech and video into summaries and quizzes.",
    image: "/awards/studysync.webp",
    imageAlt: "StudySync Hack the North winner card",
    href: "/projects/studysync",
  },
  {
    id: "ethglobal",
    title: "FairHold",
    event: "ETHGlobal New York Winner",
    year: "2025",
    description:
      "Tap-to-pay vendor deposits with milestone escrow, fewer disputes, and optional yield.",
    image: "/awards/ethglobal.webp",
    imageAlt: "Team on stage at ETHGlobal New York",
    href: "https://ethglobal.com/showcase/fairhold-s66gc",
  },
  {
    id: "ageai",
    title: "Age:AI",
    event: "Presented at Age:AI",
    year: "2025",
    description:
      "Presented product and AI work at Age:AI in Waterloo.",
    image: "/awards/age-ai.webp",
    imageAlt: "Age:AI wordmark",
    imageFit: "contain",
    href: "https://ageai.io/",
  },
];
