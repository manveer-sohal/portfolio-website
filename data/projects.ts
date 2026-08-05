import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "almaari",
    name: "Almaari",
    shortDescription:
      "An AI-assisted digital wardrobe that helps users organize clothing, build outfits, and make better use of what they already own.",
    featuredHeadline:
      "Organize your wardrobe, build outfits, and rediscover what you already own.",
    featuredSupport:
      "Almaari is an AI-assisted digital wardrobe that combines clothing organization, outfit creation, and intelligent styling in one product.",
    fullDescription:
      "Almaari is a full-stack wardrobe product. Users upload clothing photos, get AI-assisted metadata, browse and filter their wardrobe, compose outfits, and ask an in-product assistant for styling tips. The system spans authentication, object storage, background image processing, caching, and a polished dashboard experience.",
    problemSummary:
      "People struggle to keep track of what they own, spend too long choosing outfits, and rebuy clothes they already have.",
    status: "Live product",
    role: "Creator and Full-Stack Developer",
    featured: true,
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "MongoDB",
      "Redis",
      "OpenAI",
      "React",
      "Express",
      "Auth0",
      "AWS S3",
      "Docker",
      "Python",
      "OpenCV",
    ],
    metrics: [
      {
        label: "API performance improvement",
        value: "~25%",
        description:
          "Approximately 25% improvement in MongoDB and Redis-backed API performance measured during development",
      },
      {
        label: "Less manual metadata entry",
        value: "~40%",
        description:
          "Roughly 40% less manual clothing metadata entry through AI-assisted analysis",
      },
      {
        label: "Product ownership",
        value: "End-to-end",
        description:
          "Built across frontend, backend, auth, data modelling, storage, image processing, AI, and deployment",
      },
    ],
    links: [
      {
        label: "Visit Live Product",
        href: "https://almaari.app/",
        type: "live",
      },
      {
        label: "View Source",
        href: "https://github.com/manveer-sohal/AlmaariOrganized",
        type: "github",
      },
      {
        label: "View Case Study",
        href: "/projects/almaari",
        type: "case-study",
      },
    ],
    coverImage: "/projects/almaari/dashboard.webp",
    featurePreviews: [
      {
        src: "/projects/almaari/dashboard.webp",
        alt: "Almaari wardrobe grid with clothing cards and filters",
        label: "Wardrobe",
      },
      {
        src: "/projects/almaari/add-clothes.webp",
        alt: "Almaari clothing upload and AI metadata flow",
        label: "AI Stylist",
      },
      {
        src: "/projects/almaari/clothes-picked.webp",
        alt: "Almaari outfit builder with selected garments",
        label: "Outfit Builder",
      },
    ],
    gallery: [
      {
        src: "/projects/almaari/dashboard.webp",
        alt: "Almaari wardrobe dashboard with clothing grid and filters",
        caption: "Wardrobe dashboard with filtering and search",
      },
      {
        src: "/projects/almaari/add-clothes.webp",
        alt: "Almaari clothing upload flow",
        caption: "Clothing upload with metadata and background removal",
      },
      {
        src: "/projects/almaari/clothes-picked.webp",
        alt: "Almaari outfit builder with selected garments",
        caption: "Outfit composition with layered clothing slots",
      },
      {
        src: "/projects/almaari/view-outfits.webp",
        alt: "Saved outfits gallery in Almaari",
        caption: "Saved outfits view",
      },
      {
        src: "/projects/almaari/s3-pipeline.webp",
        alt: "Diagram of Almaari AWS S3 upload pipeline",
        caption: "Presigned S3 upload pipeline",
      },
      {
        src: "/projects/almaari/database-design.webp",
        alt: "Almaari MongoDB relationship diagram",
        caption: "Data model for users, clothes, and outfits",
      },
      {
        src: "/projects/almaari/image-processing.webp",
        alt: "Almaari asynchronous image processing architecture diagram",
        caption: "Async image processing and background removal",
      },
    ],
    features: [
      "Clothing photo upload with background removal",
      "AI-assisted clothing metadata analysis",
      "Wardrobe filtering by type, colour, and style",
      "Slot-based outfit creation with layering",
      "In-product AI styling assistant",
      "Auth0 authentication and user-scoped data access",
    ],
    problem: [
      "Clothing collections are hard to organize digitally, especially when photos have busy backgrounds and incomplete labels.",
      "Outfit planning is slow when users cannot see their wardrobe clearly or reuse past combinations.",
      "Manual metadata entry creates friction that prevents people from keeping a useful digital wardrobe.",
    ],
    solution: [
      "A dashboard-first product where uploads, filtering, outfit building, and AI assistance live in one workflow.",
      "Presigned S3 uploads keep large images off the API server while MongoDB stores structured wardrobe data.",
      "A separate Python image-processing service handles CPU-heavy background removal asynchronously.",
      "Redis caching and React Query reduce repeated fetches so the wardrobe feels responsive.",
    ],
    contributions: [
      "Designed and implemented the product across frontend, backend, authentication, data modelling, image storage, image processing, AI analysis, outfit generation, and deployment",
      "Built an asynchronous image processing and background-removal workflow",
      "Improved perceived upload performance by separating metadata persistence from image processing",
      "Improved MongoDB and Redis-backed API performance by approximately 25% during development",
      "Reduced manual clothing metadata entry by roughly 40% through AI-assisted analysis",
    ],
    architecture: [
      "Next.js dashboard frontend with Auth0-protected flows",
      "Node.js and Express REST API with route → controller → model structure",
      "MongoDB collections for Users, Clothes, and Outfits with indexed queries",
      "Upstash Redis read-through caching with graceful fallback",
      "AWS S3 storage using presigned URLs",
      "Python microservice for OpenCV background removal",
    ],
    technicalDecisions: [
      {
        title: "Separate UI state from server state",
        description:
          "Zustand handles filters and overlays while React Query owns API caching, pagination, and revalidation. That separation kept wardrobe views fast when switching between screens.",
      },
      {
        title: "Offload image processing",
        description:
          "Background removal runs in a dedicated Python service so the Node API stays responsive under upload load.",
      },
      {
        title: "Presigned S3 uploads",
        description:
          "The frontend uploads directly to S3 after requesting a signed URL, avoiding large binary traffic through the API.",
      },
    ],
    tradeoffs: [
      {
        title: "MongoDB for operational flexibility",
        description:
          "Document storage fits frequent wardrobe writes and evolving clothing metadata. Complex analytics would benefit from a relational or hybrid approach later.",
      },
      {
        title: "Async processing vs. immediate polish",
        description:
          "Separating metadata save from image processing improves perceived speed, but requires clear loading and completion states while images finish processing.",
      },
    ],
    expandable: {
      challenge:
        "Uploads felt slow and manual clothing labels made digital wardrobes hard to maintain.",
      decision:
        "Split metadata persistence from async image processing, cache hot wardrobe reads in Redis, and draft attributes with AI instead of forcing fully manual entry.",
      outcomes: [
        "A live product spanning auth, S3 and CloudFront media delivery, async processing, AI analysis, and deployment — with roughly 40% less manual metadata work.",
      ],
    },
    relatedSlugs: ["joblinx", "supportpilot"],
  },
  {
    slug: "joblinx",
    name: "JobLinx",
    shortDescription:
      "An AI-assisted job search workspace for organizing applications, analyzing job postings, tailoring application materials, and preparing outreach.",
    fullDescription:
      "JobLinx is a production-oriented job search system rather than a simple text generator. It combines application tracking, resume and job parsing, resume matching, material generation, contact research, and outreach drafting in one authenticated workspace. It is in active development and is not presented as a public launch.",
    problemSummary:
      "Job searching scatters notes, resumes, outreach drafts, and requirements across too many tools — making it hard to stay organized and consistent.",
    status: "In active development",
    role: "Creator and Full-Stack Developer",
    featured: true,
    technologies: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Supabase",
      "TanStack Query",
      "OpenAI",
      "React",
      "Python",
      "PostgreSQL",
      "SQLAlchemy",
      "Docker",
    ],
    metrics: [
      {
        label: "Cached workflows",
        value: "10+",
        description:
          "More than 10 TanStack Query workflows across core job-search views",
      },
      {
        label: "Repeat DB traffic",
        value: "~60%",
        description:
          "Approximately 60% fewer repeated database requests through frontend caching",
      },
      {
        label: "Generation flow",
        value: "Multi-step",
        description:
          "Structured workflows for resumes, cover letters, and outreach",
      },
    ],
    links: [
      {
        label: "View Case Study",
        href: "/projects/joblinx",
        type: "case-study",
      },
    ],
    coverImage: "/projects/joblinx/detail.webp",
    gallery: [
      {
        src: "/projects/joblinx/dashboard.webp",
        alt: "JobLinx dashboard with application pipeline and recent roles",
        caption: "Job-search command centre with pipeline stages",
      },
      {
        src: "/projects/joblinx/applications.webp",
        alt: "JobLinx Kanban board of applications by stage",
        caption: "Board view for tracking applications from saved to closed",
      },
      {
        src: "/projects/joblinx/companies.webp",
        alt: "JobLinx companies page with discovered contacts",
        caption: "Company and contact research workspace",
      },
      {
        src: "/projects/joblinx/detail.webp",
        alt: "JobLinx landing page with product headline and get-started actions",
        caption: "Product landing page",
      },
    ],
    features: [
      "Resume upload and parsing",
      "Job-description parsing and requirement extraction",
      "Application tracking with board and table views",
      "Resume matching against role requirements",
      "Resume and cover-letter generation",
      "Contact research and outreach drafting",
      "Versioned editable application materials",
      "Supabase authentication with user-specific data protection",
    ],
    problem: [
      "Candidates lose track of where each application stands across documents, spreadsheets, and chat tools.",
      "Rewriting resumes and outreach from scratch for every role is slow and inconsistent.",
      "Useful company contacts and drafts are hard to keep tied to the right application.",
    ],
    solution: [
      "A single authenticated workspace for pipeline tracking, Resume Studio, companies, and analytics.",
      "Structured AI workflows that generate materials while preserving editable, versioned outputs.",
      "Backend-enforced user-specific data access with Supabase and FastAPI.",
      "Frontend caching with TanStack Query so common job-search views stay responsive.",
    ],
    contributions: [
      "Built more than 10 cached data workflows using TanStack Query",
      "Reduced repeated database requests by approximately 60% through frontend caching",
      "Designed a multi-step AI generation workflow for resumes, cover letters, and outreach",
      "Implemented authenticated user-specific application data using Supabase and FastAPI",
      "Built the product as a production-oriented job search system rather than a simple AI text generator",
    ],
    architecture: [
      "Next.js frontend for dashboard, applications board, Resume Studio, and company research",
      "FastAPI backend for parsing, matching, and generation workflows",
      "Supabase authentication and PostgreSQL for user-scoped application data",
      "TanStack Query caching across core job-search views",
      "Dockerized services for consistent local and deployment environments",
    ],
    technicalDecisions: [
      {
        title: "Cache the job-search workspace aggressively",
        description:
          "Application boards and dashboards are visited repeatedly. TanStack Query cut repeated database traffic by about 60% while keeping data fresh through invalidation.",
      },
      {
        title: "Treat generation as a workflow, not a prompt",
        description:
          "Resume, cover letter, and outreach generation run as multi-step structured flows with editable outputs instead of one-shot chat responses.",
      },
      {
        title: "Keep application data user-specific by default",
        description:
          "Supabase authentication and FastAPI validation protect each candidate’s pipeline, documents, and contacts.",
      },
    ],
    tradeoffs: [
      {
        title: "Depth over premature public launch",
        description:
          "JobLinx prioritizes a complete authenticated workflow. It is in active development rather than marketed as a fully public launch.",
      },
      {
        title: "AI assistance with human control",
        description:
          "Generated materials are starting points. Versioned editing remains required so candidates stay accountable for what they send.",
      },
    ],
    expandable: {
      challenge:
        "Job search tools either track applications or generate text — rarely both in a coherent, authenticated workspace.",
      decision:
        "Build JobLinx as a production system with caching, user-scoped data, and multi-step generation instead of a thin AI wrapper.",
      outcomes: [
        "10+ cached TanStack Query workflows",
        "About 60% fewer repeated database requests",
        "End-to-end flows for parsing, matching, generation, and outreach",
      ],
    },
    relatedSlugs: ["almaari", "supportpilot"],
  },
  {
    slug: "supportpilot",
    name: "SupportPilot",
    shortDescription:
      "A multi-tenant support copilot that finds relevant company documents, drafts grounded replies, and escalates when confidence is low.",
    fullDescription:
      "SupportPilot helps teams answer support questions using retrieval-augmented generation (RAG): it searches company documents first, then drafts a reply from that retrieved context instead of inventing facts. Each workspace owns its knowledge base. Documents are chunked and embedded with OpenAI text-embedding-3-small (1,536 dimensions) into pgvector with HNSW cosine retrieval. Uncertain cases can be escalated for human review. The product is in development and is not presented as a commercial customer-support platform with live client teams.",
    problemSummary:
      "Support teams need faster answers without inventing facts — especially when knowledge is scattered across documents and multiple companies share the same platform.",
    status: "Product in development",
    role: "Full-Stack and AI Developer",
    featured: true,
    technologies: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "pgvector",
      "OpenAI",
      "Supabase",
      "Python",
      "PostgreSQL",
      "Retrieval-Augmented Generation",
      "Docker",
      "text-embedding-3-small",
    ],
    metrics: [
      {
        label: "Precision@5",
        value: "+~28%",
        description:
          "Retrieval quality improved by approximately 28% during development evaluation",
      },
      {
        label: "Embeddings",
        value: "1,536-d",
        description: "text-embedding-3-small with pgvector HNSW cosine search",
      },
      {
        label: "Safety principle",
        value: "Backend rules",
        description: "The LLM suggests; the backend enforces",
      },
    ],
    links: [
      {
        label: "View Case Study",
        href: "/projects/supportpilot",
        type: "case-study",
      },
    ],
    coverImage: "/projects/supportpilot/featured/cover-postersp.webp",
    gallery: [
      {
        src: "/projects/supportpilot/workspace.webp",
        alt: "SupportPilot workspace creation screen",
        caption: "Multi-tenant workspace setup",
      },
      {
        src: "/projects/supportpilot/documents.webp",
        alt: "SupportPilot documents table with upload and RAG status",
        caption: "Document upload, chunking, and embedding status",
      },
      {
        src: "/projects/supportpilot/tickets.webp",
        alt: "SupportPilot tickets interface",
        caption: "Support tickets and drafting workflow",
      },
      {
        src: "/projects/supportpilot/playground.webp",
        alt: "SupportPilot retrieval and response playground",
        caption: "Retrieval and drafting playground",
      },
      {
        src: "/projects/supportpilot/overview.webp",
        alt: "SupportPilot overview dashboard",
        caption: "Workspace overview",
      },
    ],
    features: [
      "Multi-tenant knowledge bases",
      "Document chunking and embeddings",
      "Semantic retrieval with pgvector",
      "RAG response generation",
      "Confidence and escalation workflows",
      "Feedback and review tools",
      "Tenant-aware authorization",
      "Auditable AI outputs",
    ],
    problem: [
      "Generic chatbots invent answers when company knowledge is incomplete or poorly retrieved.",
      "Multi-tenant support products must isolate each company’s documents and tickets.",
      "Teams need a clear path to escalate when the model is unsure.",
    ],
    solution: [
      "Tenant workspaces with isolated document processing and authorization.",
      "Chunking and embedding pipelines that prepare knowledge for semantic retrieval.",
      "A planner and drafting workflow where backend rules enforce escalation and access control.",
      "Review tools so humans can inspect and improve AI-assisted replies.",
    ],
    contributions: [
      "Improved Precision@5 by approximately 28% during retrieval evaluation",
      "Used OpenAI text-embedding-3-small with 1,536-dimensional embeddings and pgvector HNSW cosine search",
      "Built tenant-aware authorization using Supabase JWTs and backend validation",
      "Used a planner and drafting workflow while enforcing important rules in backend code",
      "Designed the system around a clear principle: the LLM suggests; the backend enforces",
    ],
    architecture: [
      "Next.js multi-tenant UI for documents, tickets, playground, and settings",
      "FastAPI services for chunking, embedding, retrieval, and drafting",
      "PostgreSQL with pgvector for tenant-scoped semantic search",
      "OpenAI text-embedding-3-small embeddings stored as 1,536-dimensional vectors",
      "Supabase JWTs validated on the backend for authorization",
      "Audit-friendly storage of retrieved context and generated drafts",
    ],
    technicalDecisions: [
      {
        title: "Ground answers in retrieved company knowledge",
        description:
          "Responses are drafted from retrieved chunks rather than free-form model memory, which improves trust for support use cases.",
      },
      {
        title: "Backend enforcement over prompt-only policy",
        description:
          "Tenant boundaries, escalation rules, and authorization live in backend validation — not only in prompt instructions.",
      },
      {
        title: "Measure retrieval, not vibes",
        description:
          "Precision@5 guided retrieval improvements so the system could be evaluated beyond anecdotal demos.",
      },
    ],
    tradeoffs: [
      {
        title: "Grounding vs. fluency",
        description:
          "Strict retrieval can make answers more cautious. That is preferable to confident hallucinations for support workflows.",
      },
      {
        title: "Multi-tenant complexity",
        description:
          "Workspace isolation adds authorization and data-model overhead, but is required for a credible B2B support product.",
      },
    ],
    expandable: {
      challenge:
        "Support copilots fail when they invent answers or leak knowledge across tenants.",
      decision:
        "Combine pgvector retrieval with backend-enforced tenant rules and escalation instead of relying on prompts alone.",
      outcomes: [
        "About 28% better Precision@5",
        "1,536-d embeddings with HNSW cosine search",
        "Clear separation between model suggestions and backend enforcement",
      ],
    },
    relatedSlugs: ["almaari", "joblinx"],
  },
  {
    slug: "creator-control-room",
    name: "Creator Control Room",
    shortDescription:
      "A realtime analytics dashboard for tracking Twitch creator events such as gifts, followers, and subscriptions.",
    fullDescription:
      "Creator Control Room helps teams monitor live Twitch activity across signed-on creators. The frontend receives realtime events while the backend fans updates out to tenant rooms with PostgreSQL as the operational store.",
    problemSummary:
      "Creator teams need a live view of gifts, follows, and subscriptions without stitching together multiple dashboards.",
    status: "Demo unavailable",
    role: "Full-Stack Developer",
    featured: false,
    technologies: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "Socket.io",
      "PostgreSQL",
      "Redis",
      "Docker",
      "AWS S3",
    ],
    metrics: [],
    links: [
      {
        label: "View Source",
        href: "https://github.com/manveer-sohal/Creator-Control-Room",
        type: "github",
      },
      {
        label: "View Case Study",
        href: "/projects/creator-control-room",
        type: "case-study",
      },
    ],
    coverImage: "/projects/creator-control-room/cover.webp",
    gallery: [
      {
        src: "/projects/creator-control-room/dashboard.webp",
        alt: "Creator Control Room live events dashboard",
        caption: "Realtime creator events dashboard",
      },
      {
        src: "/projects/creator-control-room/sign-on.webp",
        alt: "Twitch QR sign-on flow for Creator Control Room",
        caption: "Twitch sign-on via QR flow",
      },
    ],
    features: [
      "Realtime event feed for gifts, followers, and subscriptions",
      "Creator filtering and interactive dashboard views",
      "Twitch authentication sign-on",
      "Tenant-aware event fan-out with Socket.io rooms",
    ],
    problem: [
      "Live creator operations data is hard to monitor across multiple channels in one place.",
    ],
    solution: [
      "A Socket.io-backed dashboard with Express APIs, Redis adapter support for scale-out, and PostgreSQL event storage.",
    ],
    contributions: [
      "Built a Next.js frontend with Socket.io client updates",
      "Implemented Express and Socket.io backend patterns for creator rooms",
      "Modeled company, creator, member, and event relationships in PostgreSQL",
    ],
    architecture: [
      "Next.js frontend with Socket.io client",
      "Node.js Express REST API and Socket.io server",
      "Redis adapter for multi-instance event broadcast",
      "PostgreSQL operational store with tenant isolation considerations",
      "Object storage for brand assets",
    ],
    technicalDecisions: [
      {
        title: "Room-based realtime fan-out",
        description:
          "Events are scoped to creator or tenant rooms so each company only receives its own traffic.",
      },
    ],
    tradeoffs: [
      {
        title: "Demo currently unavailable",
        description:
          "The hosted backend is disabled for cost reasons. Source and architecture details remain available.",
      },
    ],
    relatedSlugs: ["clash-royale-hub", "codegories"],
  },
  {
    slug: "clash-royale-hub",
    name: "Clash Royale Hub",
    shortDescription:
      "A Clash Royale stats hub for player profiles, battle logs, clan views, war logs, and a searchable card browser.",
    fullDescription:
      "Clash Royale Hub pulls data from the Clash Royale API into a polished React interface for exploring personal and clan performance.",
    problemSummary:
      "Players want a clearer way to review stats, battles, and clan activity beyond the in-game screens.",
    status: "Live product",
    role: "Full-Stack Developer",
    featured: false,
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Redis",
      "Tailwind CSS",
      "Clash Royale API",
    ],
    metrics: [],
    links: [
      {
        label: "Visit Live Product",
        href: "https://clash-royal-hub.vercel.app/",
        type: "live",
      },
      {
        label: "View Case Study",
        href: "/projects/clash-royale-hub",
        type: "case-study",
      },
    ],
    coverImage: "/projects/clash-royale-hub/cover.webp",
    gallery: [
      {
        src: "/projects/clash-royale-hub/player-screen.webp",
        alt: "Clash Royale Hub player profile screen",
        caption: "Player profile view",
      },
      {
        src: "/projects/clash-royale-hub/battle-log.webp",
        alt: "Clash Royale Hub battle log",
        caption: "Recent battle history",
      },
      {
        src: "/projects/clash-royale-hub/clan-view.webp",
        alt: "Clash Royale Hub clan roster view",
        caption: "Clan roster",
      },
      {
        src: "/projects/clash-royale-hub/cards.webp",
        alt: "Clash Royale Hub card browser",
        caption: "Searchable card browser",
      },
    ],
    features: [
      "Player profile and battle log views",
      "Clan roster and war log exploration",
      "Searchable card browser",
      "API-backed stats with caching considerations via Redis",
    ],
    contributions: [
      "Built a responsive React frontend for multiple Clash Royale data views",
      "Integrated Clash Royale API data into player, clan, and card experiences",
    ],
    relatedSlugs: ["creator-control-room", "nba-dashboard"],
  },
  {
    slug: "odin-analytica",
    name: "Odin Analytica",
    shortDescription:
      "Backend services, versioned REST APIs, and ETL pipelines for real-time data ingestion, validation, and client integrations.",
    fullDescription:
      "Odin Analytica is an early-stage traffic analytics venture where I focused on modular backend services, data pipelines, and versioned APIs—building reliable ingestion, SQL persistence, and integrations for client-facing applications.",
    problemSummary:
      "Production systems needed reliable real-time ingestion, validation, and APIs that could handle noisy data while remaining maintainable and scalable.",
    status: "Hackathon project",
    role: "Founding Software Engineer",
    featured: false,
    technologies: [
      "Python",
      "REST APIs",
      "SQL",
      "ETL",
      "Publish-subscribe",
      "FastAPI",
    ],
    metrics: [
      {
        label: "Latency",
        value: "~20%",
        description:
          "End-to-end latency reduction via publish-subscribe redesign",
      },
    ],
    links: [
      {
        label: "View Case Study",
        href: "/projects/odin-analytica",
        type: "case-study",
      },
    ],
    contributions: [
      "Developed modular, testable backend services and versioned REST APIs for real-time data ingestion, validation, SQL persistence, and integration with client-facing applications.",
      "Monitored and debugged production services, redesigning data ingestion with a publish-subscribe architecture to reduce end-to-end latency by 20% while improving reliability and scalability.",
      "Collaborated with engineers and project stakeholders in an Agile environment, contributing to design reviews, API integrations, and technical documentation while translating product requirements into tested backend features.",
      "Built modular, testable Python services, ETL pipelines, and versioned RESTful APIs, automating structured data ingestion and improving the reliability, maintainability, and scalability of production systems.",
      "Improved backend performance by analyzing application logs, profiling data flows, and redesigning ingestion workflows using a publish-subscribe architecture, reducing end-to-end latency by 20% while improving production reliability and scalability.",
      "Collaborated with software engineers, product managers, and non-technical stakeholders in an Agile environment, communicating technical tradeoffs, participating in design discussions, and translating business requirements into backend features, API integrations, and technical documentation.",
      "Developed backend services and versioned REST APIs for real-time ingestion and system integrations, implementing API contracts and validation to handle noisy data and improve system reliability.",
      "Optimized end-to-end pipeline through profiling, load testing, and bottleneck isolation, reducing latency by 20% while maintaining throughput under real-time streaming constraints.",
      "Defined API contracts, schemas (JSON), and validation layers significantly reducing integration errors and debugging time.",
    ],
    relatedSlugs: ["supportpilot", "nba-dashboard"],
  },
  {
    slug: "nba-dashboard",
    name: "NBA Shooting Dashboard",
    shortDescription:
      "An interactive dashboard for analyzing NBA player shooting and season statistics.",
    fullDescription:
      "A Python analytics dashboard built with Dash, Pandas, Matplotlib, and Seaborn for exploring current-season NBA shooting stats.",
    problemSummary:
      "Season shooting trends are easier to understand with interactive charts than static tables.",
    status: "Live product",
    role: "Developer",
    featured: false,
    technologies: ["Python", "Pandas", "Matplotlib", "Seaborn", "Dash"],
    metrics: [],
    links: [
      {
        label: "Visit Live Product",
        href: "https://nba-dashboard-nloi.onrender.com/",
        type: "live",
      },
      {
        label: "View Case Study",
        href: "/projects/nba-dashboard",
        type: "case-study",
      },
    ],
    coverImage: "/projects/nba-dashboard/cover.webp",
    gallery: [
      {
        src: "/projects/nba-dashboard/cover.webp",
        alt: "NBA shooting dashboard with statistical visualizations",
      },
    ],
    features: [
      "Interactive season statistics exploration",
      "Python visualization stack with Dash",
    ],
    relatedSlugs: ["odin-analytica", "moodify"],
  },
  {
    slug: "codegories",
    name: "Codegories",
    shortDescription:
      "A realtime multiplayer Scattergories-style game with server-rendered rooms and Socket.io updates.",
    fullDescription:
      "Codegories lets players join rooms and compete in realtime category rounds. Socket.io handles live updates while the Next.js and Node stack manage rooms and game events.",
    problemSummary:
      "Casual multiplayer word games need low-friction rooms and reliable realtime state.",
    status: "Live product",
    role: "Full-Stack Developer",
    featured: false,
    technologies: ["TypeScript", "Next.js", "Node.js", "Socket.io", "React"],
    metrics: [],
    links: [
      {
        label: "Visit Live Product",
        href: "https://codegories.vercel.app/",
        type: "live",
      },
      {
        label: "View Case Study",
        href: "/projects/codegories",
        type: "case-study",
      },
    ],
    coverImage: "/projects/codegories/cover.webp",
    gallery: [
      {
        src: "/projects/codegories/cover.webp",
        alt: "Codegories multiplayer game interface",
      },
    ],
    features: [
      "Realtime multiplayer rooms",
      "Socket.io-driven game updates",
      "Scattergories-style category gameplay",
    ],
    relatedSlugs: ["clash-royale-hub", "creator-control-room"],
  },
  {
    slug: "studysync",
    name: "StudySync",
    shortDescription:
      "A Hack the North study companion that transcribes speech and video, summarizes content, and generates quizzes.",
    fullDescription:
      "StudySync helps students turn spoken or recorded study material into summaries and quizzes. Built at Hack the North with OpenAI and Auth0.",
    problemSummary:
      "Students need a faster way to turn lectures and recordings into reviewable study material.",
    status: "Hackathon project",
    role: "Developer",
    featured: false,
    technologies: ["OpenAI", "Auth0"],
    metrics: [
      {
        label: "Award",
        value: "Best use of Auth0",
        description: "Hack the North recognition",
      },
    ],
    links: [
      {
        label: "Devpost",
        href: "https://devpost.com/software/studying-with-hack-the-north",
        type: "devpost",
      },
      {
        label: "View Case Study",
        href: "/projects/studysync",
        type: "case-study",
      },
    ],
    coverImage: "/projects/studysync/cover.webp",
    gallery: [
      {
        src: "/projects/studysync/cover.webp",
        alt: "StudySync study companion interface",
      },
    ],
    features: [
      "Speech-to-text and video-to-text transcription",
      "Summarization and quiz generation",
      "Auth0-backed authentication",
    ],
    relatedSlugs: ["supportpilot", "moodify"],
  },
  {
    slug: "moodify",
    name: "Moodify",
    shortDescription:
      "Predicts emotional state from recent Spotify listening using K-Nearest Neighbors on audio features.",
    fullDescription:
      "Moodify extracts feature vectors from recently played Spotify tracks and applies a KNN model to estimate the listener’s emotional state.",
    problemSummary:
      "Listening history contains emotional signal that is hard to interpret without feature modeling.",
    status: "Archived demo",
    role: "Developer",
    featured: false,
    technologies: ["Python", "Pandas", "scikit-learn", "Spotify API"],
    metrics: [],
    links: [
      {
        label: "View Case Study",
        href: "/projects/moodify",
        type: "case-study",
      },
    ],
    coverImage: "/projects/moodify/cover.webp",
    gallery: [
      {
        src: "/projects/moodify/cover.webp",
        alt: "Moodify Spotify emotion model visualization",
      },
    ],
    features: [
      "Spotify recent-track feature extraction",
      "KNN-based emotional state prediction",
    ],
    relatedSlugs: ["nba-dashboard", "studysync"],
  },
];

export function getFeaturedProjects(): Project[] {
  const order = ["almaari", "joblinx", "supportpilot"] as const;
  const featured = projects.filter((project) => project.featured);
  return [...featured].sort((a, b) => {
    const ai = order.indexOf(a.slug as (typeof order)[number]);
    const bi = order.indexOf(b.slug as (typeof order)[number]);
    const aRank = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
    const bRank = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
    return aRank - bRank;
  });
}

export function getOtherProjects(): Project[] {
  return projects.filter(
    (project) => !project.featured && project.slug !== "odin-analytica",
  );
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}
