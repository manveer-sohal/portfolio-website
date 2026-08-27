export type CaseStudyStatus = "current" | "in-progress" | "proposed";

export type EvidenceStatus =
  | "current"
  | "in-progress"
  | "proposed"
  | "design-target"
  | "measured";

export type AlmaariCaseStudy = {
  slug: string;
  title: string;
  summary: string;
  status: CaseStudyStatus;
  themes: string[];
  updatedAt: string;
  href: string;
};

export const almaariCaseStudies: AlmaariCaseStudy[] = [
  {
    slug: "garment-ingestion",
    title: "AI Garment Ingestion Redesign",
    summary:
      "Redesigning image processing and AI enrichment around durable workflow state, safe retries, and asynchronous orchestration.",
    status: "in-progress",
    themes: ["System Design", "Reliability", "AI", "Cloud Infrastructure"],
    updatedAt: "2026",
    href: "/projects/almaari/case-studies/garment-ingestion",
  },
  {
    slug: "product-engineering",
    title: "Building Almaari's AI-Assisted Digital Wardrobe",
    summary:
      "An end-to-end product engineering case study spanning wardrobe UX, presigned uploads, background image processing, caching, and AI-assisted metadata.",
    status: "current",
    themes: ["Product Engineering", "Full Stack", "AI", "Cloud Storage"],
    updatedAt: "2026",
    href: "/projects/almaari",
  },
];

export type ArchitectureNode = {
  id: string;
  label: string;
  shortLabel: string;
  status: EvidenceStatus;
  what: string;
  why: string;
  alternative: string;
  tradeoff: string;
  failure: string;
};

export const architectureNodes: ArchitectureNode[] = [
  {
    id: "client",
    label: "User / Browser",
    shortLabel: "Browser",
    status: "current",
    what: "Selects a garment image, uploads it directly to S3, observes processing state through the API, and reviews the result.",
    why: "Keeps image bytes off the product API while preserving upload progress and a clear review step.",
    alternative: "Proxy the image upload through Express.",
    tradeoff:
      "The frontend must coordinate presigned upload completion with the API.",
    failure:
      "A refresh refetches persisted Clothes state rather than creating a second workflow.",
  },
  {
    id: "frontend",
    label: "Next.js 16 / Vercel",
    shortLabel: "Next.js 16",
    status: "in-progress",
    what: "Handles image selection, upload progress, processing state, metadata review, and final submission.",
    why: "Keeps the experience to upload, wait briefly, review, and submit.",
    alternative: "Perform more image and AI orchestration in the browser.",
    tradeoff: "A thinner frontend requires reliable backend workflow state.",
    failure:
      "Refreshes recover by refetching Clothes state instead of restarting work.",
  },
  {
    id: "api",
    label: "Express API / Cloud Run",
    shortLabel: "Express API",
    status: "in-progress",
    what: "Authenticates, creates pending Clothes, issues presigned S3 URLs, and schedules processing.",
    why: "Separates user-facing HTTP work from expensive ingestion.",
    alternative: "Crop and analyze synchronously inside the request.",
    tradeoff:
      "Async orchestration adds a boundary but simplifies the request lifecycle.",
    failure:
      "Request retries use request-level idempotency plus Clothes identity.",
  },
  {
    id: "mongodb",
    label: "MongoDB Atlas",
    shortLabel: "MongoDB",
    status: "current",
    what: "Stores Clothes state, metadata, checkpoints, errors, and final state.",
    why: "The Clothes record becomes the workflow source of truth.",
    alternative: "Introduce a separate GarmentDraft entity.",
    tradeoff:
      "The lifecycle is simpler, but Clothes carries temporary workflow state.",
    failure: "Workers resume from persisted processing stages.",
  },
  {
    id: "s3",
    label: "Amazon S3",
    shortLabel: "Amazon S3",
    status: "current",
    what: "Stores original and processed garment images.",
    why: "The browser can upload directly with a presigned URL.",
    alternative: "Base64 in MongoDB or a backend-proxied upload.",
    tradeoff: "Object lifecycle management remains an operational concern.",
    failure: "Processing begins only after upload completion is verified.",
  },
  {
    id: "tasks",
    label: "Google Cloud Tasks",
    shortLabel: "Cloud Tasks",
    status: "proposed",
    what: "Durably delivers garment-processing work and retries transient failures.",
    why: "Image processing and inference should not depend on the upload request lifecycle.",
    alternative: "MongoDB queue, in-process work, or synchronous processing.",
    tradeoff: "A managed service is added, and delivery is at least once.",
    failure: "Redelivery is expected, so worker processing is idempotent.",
  },
  {
    id: "worker",
    label: "Dedicated Ingestion Worker / Cloud Run",
    shortLabel: "Ingestion Worker",
    status: "proposed",
    what: "Orchestrates crop, checkpoint persistence, AI analysis, and READY_FOR_REVIEW.",
    why: "Separates long-running processing from public API traffic.",
    alternative: "Use an internal route on the main Express Cloud Run service.",
    tradeoff: "One additional deployable service.",
    failure: "Retries resume from the last persisted checkpoint.",
  },
  {
    id: "crop",
    label: "Railway Crop Service",
    shortLabel: "Crop / rembg",
    status: "current",
    what: "Runs background removal and crop with rembg.",
    why: "Provides a cleaner garment-focused image before analysis.",
    alternative: "Move to Cloud Run or perform client-only processing.",
    tradeoff: "Avoids migration but retains a second cloud provider.",
    failure:
      "Retry first; after exhaustion, use the original and schedule delayed reprocessing.",
  },
  {
    id: "vision",
    label: "Railway Vision Service / GPT-4o-mini",
    shortLabel: "Vision / GPT-4o-mini",
    status: "current",
    what: "Runs vision analysis and returns structured garment metadata.",
    why: "Automatic analysis removes the separate Analyze action.",
    alternative: "Keep manual Analyze or call OpenAI directly from Express.",
    tradeoff: "The UX is simpler, but every upload has inference cost.",
    failure:
      "Retry from the crop checkpoint; manual metadata entry remains a fallback.",
  },
  {
    id: "jobs",
    label: "MongoDB Background Jobs",
    shortLabel: "MongoDB Jobs",
    status: "current",
    what: "Stores EnrichmentJob and ImageProcessingJob work for the current background-processing mechanisms.",
    why: "Uses the existing database to persist work beyond a single browser request.",
    alternative: "Use a managed durable task queue.",
    tradeoff:
      "The application owns claiming, startup reclaim, and delivery behavior.",
    failure:
      "Startup reclaim and internal processing endpoints recover abandoned work.",
  },
  {
    id: "processor",
    label: "Current Background Processing",
    shortLabel: "Background Processor",
    status: "current",
    what: "Runs setImmediate processing and internal process endpoints for current image and enrichment work.",
    why: "Keeps expensive work outside the immediate user response using the existing service footprint.",
    alternative: "Deploy a dedicated ingestion worker.",
    tradeoff:
      "Work remains coupled to the main process lifecycle and reclaim logic.",
    failure:
      "MongoDB jobs and startup reclaim are used to resume interrupted processing.",
  },
];

export type ArchitectureMode =
  | "proposed"
  | "current"
  | "happy-path"
  | "failure-retry";

export type ArchitectureView = {
  id: ArchitectureMode;
  label: string;
  status: EvidenceStatus;
  description: string;
  steps: Array<{
    label: string;
    nodeId?: string;
    tone?: "normal" | "checkpoint" | "failure" | "fallback";
  }>;
};

export const architectureViews: ArchitectureView[] = [
  {
    id: "proposed",
    label: "Proposed",
    status: "proposed",
    description:
      "The proposed workflow makes persisted Clothes state—not a browser or process—the orchestration boundary.",
    steps: [
      { label: "Next.js / Vercel", nodeId: "frontend" },
      { label: "Express API / Cloud Run", nodeId: "api" },
      { label: "MongoDB + S3", nodeId: "mongodb", tone: "checkpoint" },
      { label: "Google Cloud Tasks", nodeId: "tasks" },
      { label: "Dedicated Worker", nodeId: "worker" },
      { label: "Crop → Vision", nodeId: "crop" },
      { label: "READY_FOR_REVIEW", nodeId: "mongodb", tone: "checkpoint" },
      { label: "User edits → ACTIVE", nodeId: "frontend" },
    ],
  },
  {
    id: "current",
    label: "Current",
    status: "current",
    description:
      "Current production uses several reliability mechanisms. Cloud Tasks and a dedicated ingestion worker are not shown because they are not deployed.",
    steps: [
      { label: "Upload + Crop", nodeId: "crop" },
      { label: "Manual AI Analyze", nodeId: "vision" },
      { label: "Credit reserve / refund", tone: "checkpoint" },
      { label: "Edit + Save", nodeId: "frontend" },
      { label: "MongoDB EnrichmentJob", nodeId: "mongodb" },
      { label: "MongoDB ImageProcessingJob", nodeId: "mongodb" },
      { label: "setImmediate processing" },
      { label: "Startup reclaim" },
      { label: "Internal process endpoints", nodeId: "api" },
    ],
  },
  {
    id: "happy-path",
    label: "Happy Path",
    status: "proposed",
    description:
      "Only the successful proposed garment lifecycle is highlighted.",
    steps: [
      { label: "Create pending Clothes", nodeId: "api" },
      { label: "S3 upload", nodeId: "s3" },
      { label: "Cloud Task", nodeId: "tasks" },
      { label: "Worker", nodeId: "worker" },
      { label: "Crop", nodeId: "crop" },
      { label: "CROPPED", nodeId: "mongodb", tone: "checkpoint" },
      { label: "Vision analysis", nodeId: "vision" },
      { label: "READY_FOR_REVIEW", nodeId: "mongodb", tone: "checkpoint" },
      { label: "User edits", nodeId: "frontend" },
      { label: "ACTIVE", nodeId: "mongodb", tone: "checkpoint" },
    ],
  },
  {
    id: "failure-retry",
    label: "Failure & Retry",
    status: "proposed",
    description:
      "Retries are normal control flow: delivery may repeat, while checkpoints keep completed work from repeating.",
    steps: [
      { label: "Cloud Task redelivery", nodeId: "tasks", tone: "failure" },
      { label: "Read checkpoint", nodeId: "mongodb", tone: "checkpoint" },
      { label: "Crop retry", nodeId: "crop", tone: "failure" },
      { label: "AI retry", nodeId: "vision", tone: "failure" },
      { label: "Checkpoint recovery", nodeId: "worker", tone: "checkpoint" },
      {
        label: "Manual metadata fallback",
        nodeId: "frontend",
        tone: "fallback",
      },
      { label: "Delayed recrop", nodeId: "crop", tone: "fallback" },
      { label: "Idempotent finalize", nodeId: "mongodb", tone: "checkpoint" },
    ],
  },
];

export const productionizationSteps = [
  { label: "S3 production image path", status: "complete" },
  { label: "Clothes shell creation", status: "complete" },
  { label: "Railway crop service", status: "complete" },
  { label: "Railway vision service", status: "complete" },
  { label: "New processing state machine", status: "in-progress" },
  { label: "Cloud Tasks integration", status: "in-progress" },
  { label: "Dedicated Cloud Run ingestion worker", status: "planned" },
  { label: "Automatic free analysis UX", status: "in-progress" },
  { label: "Checkpointed retry", status: "planned" },
  { label: "Latency benchmarking", status: "planned" },
] as const;

export const architectureDecisions = [
  {
    id: "ADR-01",
    title: "Google Cloud Tasks",
    decision: "Use Cloud Tasks for durable async delivery.",
    why: "Managed delivery and retries fit the current scale.",
    alternatives: "MongoDB job queue, in-process work, synchronous processing.",
    tradeoff: "At-least-once delivery still requires idempotency.",
  },
  {
    id: "ADR-02",
    title: "Dedicated Cloud Run Worker",
    decision: "Separate ingestion from the public Express service.",
    why: "Independent scaling, resource isolation, and a cleaner failure boundary.",
    alternatives: "Run processing on the existing Express service.",
    tradeoff: "Adds one deployable service.",
  },
  {
    id: "ADR-03",
    title: "Reuse Clothes",
    decision: "Do not introduce a separate GarmentDraft.",
    why: "The S3 flow already creates an owned Clothes shell.",
    alternatives: "Create a short-lived GarmentDraft model.",
    tradeoff: "Clothes carries temporary processing state.",
  },
  {
    id: "ADR-04",
    title: "Single Checkpointed Task",
    decision: "PROCESS_CLOTHING handles crop and AI.",
    why: "Current scale does not justify a task per stage.",
    alternatives: "Separate crop and analysis tasks.",
    tradeoff: "The worker owns stage orchestration.",
  },
  {
    id: "ADR-05",
    title: "Keep Railway",
    decision: "Keep crop and AI services on Railway for now.",
    why: "Migration does not directly solve the reliability boundary.",
    alternatives: "Move both services to GCP immediately.",
    tradeoff:
      "Revisit if latency, reliability, observability, or overhead becomes measurable.",
  },
  {
    id: "ADR-06",
    title: "Automatic Free Analysis",
    decision: "Standard garment analysis no longer consumes credits.",
    why: "Removes billing logic from normal ingestion and simplifies retries.",
    alternatives: "Keep credit reservation and refund behavior.",
    tradeoff: "Each upload now has a model inference cost.",
  },
  {
    id: "ADR-07",
    title: "Sequential Crop → Analyze",
    decision: "Crop first, then analyze.",
    why: "AI receives a cleaner image and the pipeline stays easy to reason about.",
    alternatives: "Analyze the original and crop in parallel.",
    tradeoff: "Potentially higher latency than parallel analysis.",
  },
] as const;
