import type { ExperienceItem } from "./types";

export const experience: ExperienceItem[] = [
  {
    id: "almaari",
    title: "Creator and Full-Stack Developer",
    organization: "Almaari",
    year: "2024–Present",
    period: "Present",
    summary:
      "Designed and shipped an AI-assisted wardrobe platform end to end — from product flows to deployment.",
    highlights: [
      "Designed and developed a responsive full-stack application using **React, Next.js, TypeScript, Node.js, and FastAPI**, implementing reusable components, authenticated user workflows, and **RESTful API integrations**.",
      "Improved application scalability and responsiveness by implementing **Redis caching**, database indexing, **AWS S3** image storage, and **CloudFront** content delivery, reducing query latency by **50%**.",
      "Developed **asynchronous FastAPI** services for AI-powered image analysis and metadata generation, automating onboarding workflows and reducing manual form completion by **40%**.",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Redis",
      "AWS",
      "Python",
      "OpenAI",
      "Auth0",
      "Docker",
    ],
    links: [
      {
        label: "Visit Live Product",
        href: "https://almaari.app/",
        type: "live",
      },
      {
        label: "View Case Study",
        href: "/projects/almaari",
        type: "case-study",
      },
    ],
    projectSlug: "almaari",
  },
  {
    id: "odin-analytica",
    title: "Founding Software Engineer",
    organization: "Odin Analytica",
    year: "2025",
    period: "Geese Hacks",
    summary:
      "Early-stage traffic analytics venture that began as a Geese Hacks project and grew into a computer-vision product.",
    highlights: [
      "Built a real-time traffic analytics system using computer vision and web dashboards",
      "Developed Python and FastAPI services for camera ingestion, validation, and ML inference",
      "Designed an asynchronous publish-subscribe architecture for dashboards and analytics processing",
      "Reduced processing latency by approximately 20%",
      "Worked with potential users to understand municipal and traffic-data use cases",
      "Considered privacy requirements and avoided facial recognition or personally identifiable information",
    ],
    technologies: ["YOLOv8", "Python", "FastAPI", "Mapbox", "Computer vision"],
    achievement: "Best Data Hack — Geese Hacks",
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/odinanalytica",
        type: "devpost",
      },
      {
        label: "View Case Study",
        href: "/projects/odin-analytica",
        type: "case-study",
      },
    ],
    projectSlug: "odin-analytica",
  },
  {
    id: "almaari-decor",
    title: "Front-End Web Developer",
    organization: "Almaari Decor",
    year: "2023",
    period: "May – Dec",
    location: "Brampton, ON",
    summary:
      "Built and shipped responsive React and Tailwind interfaces for a local business, connecting stakeholder requirements to polished web workflows.",
    highlights: [
      "Built and shipped maintainable React and Tailwind CSS user interfaces using reusable components and a mobile-first approach, delivering responsive experiences across mobile, tablet, and desktop devices.",
      "Collaborated with stakeholders to translate business requirements and user feedback into intuitive web workflows, improving usability and increasing average session duration to 2.8 minutes.",
      "Developed end-to-end contact and inquiry workflows by integrating frontend forms with backend services and business processes, increasing consultations by 35% and reducing response times by 50%.",
    ],
    technologies: ["React", "Tailwind CSS"],
  },
];
